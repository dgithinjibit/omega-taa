"""Verify Groq returns a structured tool call for the configured model."""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from dotenv import load_dotenv

PROJECT_ROOT = Path(__file__).resolve().parents[1]
load_dotenv(PROJECT_ROOT / ".env", override=False)


def main() -> int:
    api_key = os.getenv("GROQ_API_KEY", "").strip()
    if not api_key or api_key == "replace_with_your_groq_api_key":
        raise RuntimeError("Set a valid GROQ_API_KEY in .env or the environment.")

    model = os.getenv("OMEGA_MODEL", "openai/gpt-oss-20b")
    payload = {
        "model": model,
        "messages": [
            {
                "role": "system",
                "content": (
                    "Call the provided co_tutor_respond tool with a concise "
                    "AI-literacy explanation."
                ),
            },
            {
                "role": "user",
                "content": "Explain in one sentence why a prediction is not permission to act.",
            },
        ],
        "tools": [
            {
                "type": "function",
                "function": {
                    "name": "co_tutor_respond",
                    "description": "Send the co-tutor response to the learner.",
                    "parameters": {
                        "type": "object",
                        "properties": {"message": {"type": "string"}},
                        "required": ["message"],
                        "additionalProperties": False,
                    },
                    "strict": True,
                },
            }
        ],
        "tool_choice": "required",
    }
    request = Request(
        "https://api.groq.com/openai/v1/chat/completions",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urlopen(request, timeout=90) as response:
            result = json.loads(response.read())
    except HTTPError as error:
        detail = error.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Groq returned HTTP {error.code}: {detail}") from error
    except (TimeoutError, URLError) as error:
        raise RuntimeError(f"Could not reach Groq: {error}") from error

    choices = result.get("choices") if isinstance(result, dict) else None
    message = choices[0].get("message") if isinstance(choices, list) and choices else None
    tool_calls = message.get("tool_calls") if isinstance(message, dict) else None
    if not isinstance(tool_calls, list) or not tool_calls:
        raise RuntimeError("Groq returned no tool call despite tool_choice='required'.")

    tool_call = tool_calls[0]
    function = tool_call.get("function") if isinstance(tool_call, dict) else None
    if not isinstance(function, dict) or function.get("name") != "co_tutor_respond":
        raise RuntimeError("Groq returned an unexpected tool name.")
    arguments = function.get("arguments")
    try:
        parsed_arguments = json.loads(arguments) if isinstance(arguments, str) else None
    except json.JSONDecodeError as error:
        raise RuntimeError("Groq returned malformed tool arguments.") from error
    if (
        not isinstance(parsed_arguments, dict)
        or not isinstance(parsed_arguments.get("message"), str)
        or not parsed_arguments["message"].strip()
    ):
        raise RuntimeError("Groq tool call did not satisfy the required message schema.")

    print(f"PASS: Groq model {model} returned a schema-valid co_tutor_respond call.")
    print(f"Tool response: {parsed_arguments['message']}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except RuntimeError as error:
        print(f"FAIL: {error}", file=sys.stderr)
        raise SystemExit(1) from error
