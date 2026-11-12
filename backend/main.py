"""HTTP adapter for the Omega/PeTTa classroom co-tutor."""

from __future__ import annotations

import os
import secrets
from pathlib import Path

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, Header, HTTPException, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.trustedhost import TrustedHostMiddleware

from backend.omega_gateway import (
    Event,
    LessonConfig,
    OmegaGateway,
    OmegaNotConnected,
    OmegaPaused,
    OmegaProtocolError,
    OmegaReplyTimeout,
    PauseRequest,
    UnknownStudent,
)

load_dotenv(Path(__file__).resolve().parents[1] / ".env", override=False)

async def require_api_token(
    request: Request,
    authorization: str | None = Header(default=None),
) -> None:
    expected_token: str = request.app.state.api_token
    if not expected_token:
        raise HTTPException(
            status_code=503,
            detail="OMEGA_API_TOKEN is not configured.",
        )
    scheme, separator, supplied_token = (authorization or "").partition(" ")
    if (
        not separator
        or scheme.lower() != "bearer"
        or not secrets.compare_digest(supplied_token, expected_token)
    ):
        raise HTTPException(
            status_code=401,
            detail="A valid bearer token is required.",
            headers={"WWW-Authenticate": "Bearer"},
        )


def create_app(
    *,
    channel_token: str | None = None,
    api_token: str | None = None,
    reply_timeout_seconds: float | None = None,
    cors_origins: tuple[str, ...] | None = None,
    allowed_hosts: tuple[str, ...] | None = None,
) -> FastAPI:
    application = FastAPI(
        title="OMEGA Classroom Co-Tutor",
        version="0.3.0",
        description="Classroom transport to the Omega/PeTTa agent runtime.",
        docs_url=None,
        redoc_url=None,
        openapi_url=None,
    )
    configured_api_token = (
        api_token if api_token is not None else os.getenv("OMEGA_API_TOKEN", "")
    ).strip()
    origins = cors_origins or tuple(
        origin.strip()
        for origin in os.getenv(
            "OMEGA_CORS_ORIGINS",
            "http://localhost:5173,http://127.0.0.1:5173",
        ).split(",")
        if origin.strip()
    )
    hosts = allowed_hosts or tuple(
        host.strip()
        for host in os.getenv(
            "OMEGA_ALLOWED_HOSTS",
            "localhost,127.0.0.1,host.docker.internal,testserver",
        ).split(",")
        if host.strip()
    )
    if "*" in origins:
        raise ValueError("OMEGA_CORS_ORIGINS must not contain a wildcard.")
    if not hosts:
        raise ValueError("OMEGA_ALLOWED_HOSTS must contain at least one host.")

    application.state.omega = OmegaGateway(
        channel_token=channel_token
        if channel_token is not None
        else os.getenv("OMEGA_CHANNEL_TOKEN", ""),
        reply_timeout_seconds=reply_timeout_seconds,
    )
    application.state.api_token = configured_api_token

    application.add_middleware(
        CORSMiddleware,
        allow_origins=list(origins),
        allow_methods=["GET", "POST"],
        allow_headers=["Authorization", "Content-Type"],
        allow_credentials=False,
    )
    application.add_middleware(TrustedHostMiddleware, allowed_hosts=list(hosts))

    @application.get("/api/health")
    async def health(
        _: None = Depends(require_api_token),
    ) -> dict[str, str | bool | None]:
        omega: OmegaGateway = application.state.omega
        return {
            "status": "ok" if omega.connected else "degraded",
            "service": "omega-classroom-co-tutor",
            "runtime": "Omega/PeTTa",
            "omega_connected": omega.connected,
            "lesson_active": omega.lesson is not None,
        }

    @application.post("/api/lesson", response_model=LessonConfig)
    async def start_lesson(
        config: LessonConfig,
        _: None = Depends(require_api_token),
    ) -> LessonConfig:
        omega: OmegaGateway = application.state.omega
        omega.start_lesson(config)
        return config

    @application.post("/api/events")
    async def tutor(
        event: Event,
        _: None = Depends(require_api_token),
    ) -> dict[str, str]:
        omega: OmegaGateway = application.state.omega
        if omega.lesson is None:
            raise HTTPException(
                status_code=409,
                detail="Start a lesson with POST /api/lesson before sending an event.",
            )
        try:
            turn = await omega.tutor(event)
        except UnknownStudent as error:
            raise HTTPException(status_code=422, detail=str(error)) from error
        except OmegaPaused as error:
            raise HTTPException(status_code=409, detail=str(error)) from error
        except OmegaNotConnected as error:
            raise HTTPException(status_code=503, detail=str(error)) from error
        except OmegaReplyTimeout as error:
            raise HTTPException(status_code=504, detail=str(error)) from error
        except OmegaProtocolError as error:
            raise HTTPException(status_code=502, detail=str(error)) from error
        return turn.model_dump(mode="json")

    @application.get("/api/feed")
    async def feed(
        _: None = Depends(require_api_token),
    ) -> list[dict[str, str]]:
        omega: OmegaGateway = application.state.omega
        return [turn.model_dump(mode="json") for turn in omega.feed]

    @application.post("/api/pause")
    async def set_pause(
        request: PauseRequest,
        _: None = Depends(require_api_token),
    ) -> dict[str, bool]:
        omega: OmegaGateway = application.state.omega
        omega.set_paused(request.paused)
        return {"paused": omega.paused}

    @application.websocket("/api/omega")
    async def omega_channel(websocket: WebSocket) -> None:
        omega: OmegaGateway = application.state.omega
        try:
            await omega.serve_channel(websocket)
        except WebSocketDisconnect:
            pass

    return application


app = create_app()
