"""Request-correlated WebSocket channel for the Omega TAA HTTP gateway."""

from __future__ import annotations

import json
import logging
import queue
import threading
import time
from typing import Any

import channels
from config import config_get_by_key
from websockets.exceptions import ConnectionClosed
from websockets.sync.client import connect

logger = logging.getLogger(__name__)


class OmegaTaaChannel(channels.CommChannel):
    def __init__(self) -> None:
        self._running = threading.Event()
        self._requests: queue.Queue[tuple[str, str] | None] = queue.Queue()
        self._socket_lock = threading.Lock()
        self._send_lock = threading.Lock()
        self._socket: Any = None
        self._request_id: str | None = None
        self._thread: threading.Thread | None = None
        self._url = ""
        self._token = ""

    def start(self) -> None:
        self._url = str(config_get_by_key("WS_URL", "")).strip()
        self._token = str(config_get_by_key("WS_TOKEN", "")).strip()
        if not self._url.startswith(("ws://", "wss://")):
            raise ValueError("WS_URL must use ws:// or wss://.")
        if not self._token:
            raise ValueError("WS_TOKEN is required for the Omega TAA channel.")

        self._running.set()
        self._thread = threading.Thread(
            target=self._connection_loop,
            name="omega-taa-channel",
            daemon=True,
        )
        self._thread.start()

    def stop(self) -> None:
        self._running.clear()
        with self._socket_lock:
            active_socket = self._socket
        if active_socket is not None:
            active_socket.close()
        self._requests.put(None)
        if self._thread is not None:
            self._thread.join(timeout=3)

    def receive(self) -> str:
        try:
            request = self._requests.get(timeout=1)
        except queue.Empty:
            return ""
        if request is None:
            return ""
        self._request_id, message = request
        return message

    def send(self, message: str) -> None:
        request_id = self._request_id
        if request_id is None:
            raise RuntimeError("Cannot send a tutor response without an active request.")
        with self._socket_lock:
            active_socket = self._socket
        if active_socket is None:
            raise RuntimeError("Omega TAA WebSocket is disconnected.")

        frame = {
            "type": "response",
            "request_id": request_id,
            "text": str(message),
        }
        with self._send_lock:
            active_socket.send(json.dumps(frame))

    def _connection_loop(self) -> None:
        backoff_seconds = 1.0
        headers = {"Authorization": f"Bearer {self._token}"}
        while self._running.is_set():
            active_socket = None
            try:
                with connect(
                    self._url,
                    additional_headers=headers,
                    open_timeout=10,
                    close_timeout=5,
                    ping_interval=20,
                    ping_timeout=20,
                    max_size=64 * 1024,
                ) as websocket:
                    active_socket = websocket
                    with self._socket_lock:
                        self._socket = websocket
                    logger.info("Connected to the Omega TAA classroom gateway.")
                    backoff_seconds = 1.0
                    while self._running.is_set():
                        raw_frame = websocket.recv()
                        if raw_frame is None:
                            raise ConnectionError("Omega TAA gateway closed the channel.")
                        self._accept_request(raw_frame)
            except (ConnectionClosed, ConnectionError, OSError, TimeoutError) as error:
                if self._running.is_set():
                    logger.warning(
                        "Omega TAA channel disconnected (%s); retrying.",
                        type(error).__name__,
                    )
                    time.sleep(backoff_seconds)
                    backoff_seconds = min(backoff_seconds * 2, 30)
            finally:
                with self._socket_lock:
                    if self._socket is active_socket:
                        self._socket = None

    def _accept_request(self, raw_frame: str | bytes) -> None:
        if isinstance(raw_frame, bytes):
            raw_frame = raw_frame.decode("utf-8")
        try:
            frame = json.loads(raw_frame)
        except json.JSONDecodeError:
            logger.warning("Ignoring malformed frame from Omega TAA gateway.")
            return
        if not isinstance(frame, dict) or frame.get("type") != "request":
            logger.warning("Ignoring unsupported frame from Omega TAA gateway.")
            return

        request_id = frame.get("request_id")
        message = frame.get("text")
        if not isinstance(request_id, str) or not isinstance(message, str):
            logger.warning("Ignoring malformed request from Omega TAA gateway.")
            return
        self._requests.put((request_id, message))


def loadOmegaPlugin() -> None:
    channels.registerCommChannel("websocket", OmegaTaaChannel())
