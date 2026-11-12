import pytest
from fastapi.testclient import TestClient

from backend.main import create_app

API_TOKEN = "test-api-secret"
AUTH_HEADERS = {"Authorization": f"Bearer {API_TOKEN}"}


def test_health_reports_missing_omega_without_fallback() -> None:
    client = TestClient(
        create_app(channel_token="test-secret", api_token=API_TOKEN)
    )

    response = client.get("/api/health", headers=AUTH_HEADERS)

    assert response.status_code == 200
    assert response.json()["runtime"] == "Omega/PeTTa"
    assert response.json()["omega_connected"] is False
    assert response.json()["status"] == "degraded"


def test_events_require_active_lesson_and_live_omega() -> None:
    client = TestClient(
        create_app(channel_token="test-secret", api_token=API_TOKEN)
    )
    event = {
        "student_id": "stu_001",
        "timestamp": "2026-11-12T10:00:00Z",
        "text": "What is a learned prediction?",
        "source": "chat",
    }

    no_lesson = client.post("/api/events", json=event, headers=AUTH_HEADERS)
    assert no_lesson.status_code == 409

    lesson = client.post(
        "/api/lesson",
        json={
            "lesson_id": "lesson_api",
            "student_ids": ["stu_001"],
            "learning_objectives": ["Distinguish a prediction from an action."],
        },
        headers=AUTH_HEADERS,
    )
    assert lesson.status_code == 200

    no_runtime = client.post("/api/events", json=event, headers=AUTH_HEADERS)
    assert no_runtime.status_code == 503
    assert "no Python or offline tutor fallback" in no_runtime.json()["detail"]


def test_pause_endpoint_blocks_request_dispatch() -> None:
    client = TestClient(
        create_app(channel_token="test-secret", api_token=API_TOKEN)
    )
    client.post(
        "/api/lesson",
        json={"lesson_id": "lesson_api", "student_ids": ["stu_001"]},
        headers=AUTH_HEADERS,
    )

    assert client.post(
        "/api/pause",
        json={"paused": True},
        headers=AUTH_HEADERS,
    ).json() == {
        "paused": True
    }
    response = client.post(
        "/api/events",
        json={
            "student_id": "stu_001",
            "timestamp": "2026-11-12T10:00:00Z",
            "text": "Explain a model prediction.",
            "source": "chat",
        },
        headers=AUTH_HEADERS,
    )
    assert response.status_code == 409


def test_http_api_requires_bearer_token_on_all_routes() -> None:
    client = TestClient(
        create_app(channel_token="test-secret", api_token=API_TOKEN)
    )
    event = {
        "student_id": "stu_001",
        "timestamp": "2026-11-12T10:00:00Z",
        "text": "What is a learned prediction?",
        "source": "chat",
    }

    responses = (
        client.get("/api/health"),
        client.get("/api/feed"),
        client.post("/api/lesson", json={"lesson_id": "lesson", "student_ids": ["stu_001"]}),
        client.post("/api/events", json=event),
        client.post("/api/pause", json={"paused": True}),
    )

    assert all(response.status_code == 401 for response in responses)
    assert client.get(
        "/api/health",
        headers={"Authorization": "Bearer wrong-token"},
    ).status_code == 401


def test_http_api_fails_closed_when_api_token_is_not_configured() -> None:
    client = TestClient(create_app(channel_token="test-secret", api_token=""))

    response = client.get("/api/health")

    assert response.status_code == 503
    assert response.json()["detail"] == "OMEGA_API_TOKEN is not configured."


def test_cors_preflight_allows_bearer_auth_from_configured_demo_origin() -> None:
    client = TestClient(
        create_app(
            channel_token="test-secret",
            api_token=API_TOKEN,
            cors_origins=("http://localhost:5173",),
        )
    )

    response = client.options(
        "/api/health",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "authorization",
        },
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://localhost:5173"
    assert "authorization" in response.headers["access-control-allow-headers"].lower()


def test_http_api_rejects_untrusted_host_header() -> None:
    client = TestClient(
        create_app(
            channel_token="test-secret",
            api_token=API_TOKEN,
            allowed_hosts=("localhost",),
        )
    )

    response = client.get(
        "/api/health",
        headers={**AUTH_HEADERS, "Host": "untrusted.example"},
    )

    assert response.status_code == 400


def test_http_api_rejects_wildcard_cors_configuration() -> None:
    with pytest.raises(ValueError, match="must not contain a wildcard"):
        create_app(
            channel_token="test-secret",
            api_token=API_TOKEN,
            cors_origins=("*",),
        )
