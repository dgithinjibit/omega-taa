#!/bin/sh
set -eu

project_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
omega_root=${OMEGA_ROOT:-"$project_root/../Omega"}
omega_image=${OMEGA_TAA_OMEGA_IMAGE:-omega-taa-classroom:local}

: "${GROQ_API_KEY:?Set GROQ_API_KEY in the environment.}"
: "${OMEGA_CHANNEL_TOKEN:?Set one shared random OMEGA_CHANNEL_TOKEN for the API and Omega.}"

if [ ! -x "$omega_root/scripts/omega" ]; then
  echo "Omega launcher not found at $omega_root/scripts/omega; set OMEGA_ROOT." >&2
  exit 1
fi

export OPENAIAPI_API_KEY=$GROQ_API_KEY
export WS_URL=${WS_URL:-ws://host.docker.internal:8000/api/omega}
export WS_TOKEN=$OMEGA_CHANNEL_TOKEN

exec "$omega_root/scripts/omega" start \
  -d "$omega_image" \
  -t websocket \
  -p OpenAIAPI \
  -u https://api.groq.com/openai/v1/ \
  -m "${OMEGA_MODEL:-openai/gpt-oss-20b}"
