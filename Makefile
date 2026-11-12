PYTHON ?= .venv/bin/python

OMEGA_IMAGE ?= singularitynet/omega:v0.1.21

.PHONY: test test-metta frontend-build omega-image groq-tool-check omega-live-check ci

test:
	$(PYTHON) -m pytest -q

test-metta:
	sh ./tests/run_metta_co_tutor.sh

frontend-build:
	npm run build

omega-image:
	docker build --build-arg OMEGA_IMAGE=$(OMEGA_IMAGE) -f Dockerfile.omega -t omega-taa-classroom:local .

groq-tool-check:
	$(PYTHON) scripts/verify_groq_tool_call.py

omega-live-check:
	$(PYTHON) scripts/verify_omega_live.py

ci: test frontend-build
