# Syncsenta Backend — Python + MeTTa

## Overview

The backend implements the OMEGA cognitive core: a glass-box reasoning pipeline
that processes student utterances through perception → atomization → reasoning →
action → audit. Every step produces MeTTa atoms with traceable inference chains.

## Stack

- **Python** with **FastAPI** as the web framework
- **MeTTa** (Hyperon's meta-type talk language) for atom definitions and reasoning rules
- In-memory AtomSpace (prototype) — in production, this would use `hyperon-py`
  bindings to a real Hyperon AtomSpace

## Running

```bash
pip install fastapi uvicorn
python -m uvicorn main:app --reload --port 8000
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Check if OMEGA core and MeTTa AtomSpace are loaded |
| POST | `/api/trace/run` | Run the full inference pipeline on a student utterance |
| POST | `/api/teacher/approve` | Teacher approves a pending action |
| POST | `/api/teacher/dismiss` | Teacher dismisses a suggestion (negative feedback) |
| GET | `/api/audit` | Get the full immutable audit trail |
| GET | `/api/atomspace` | Dump the current MeTTa AtomSpace contents |

## Structure

```
backend/
├── main.py            # FastAPI app — serves the cognitive pipeline
├── requirements.txt   # Python dependencies
├── metta/
│   ├── __init__.py    # Package doc
│   ├── atomizer.py    # Constrained utterance → MeTTa atom converter
│   ├── reasoner.py    # PLN-style pattern matching + misconception rules
│   ├── audit.py       # Immutable audit log for every AI action
│   ├── curriculum.metta  # Curriculum atoms (topics, truths, prerequisites)
│   └── rules.metta       # Pedagogical reasoning rules with autonomy levels
```

## Glass-Box Contract

Every AI action is logged with:
- `ActionID` — unique identifier
- `RuleID` — which rule fired
- `InputAtoms` — the atoms that triggered the rule
- `OutputAtoms` — the atoms produced
- `Confidence` — the inference confidence
- `TeacherApproval` — pending / approved / dismissed

This log is immutable and exportable. If a parent asks "Why did you tell my
child X?", we can show the exact inference chain.
