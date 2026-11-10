"""
MeTTa AtomSpace package — the symbolic reasoning core.

This package simulates a Hyperon/MeTTa AtomSpace using in-memory Python structures.
In production, this would use the hyperon-py Python bindings to a real Hyperon
AtomSpace. For the prototype, we load MeTTa source files and evaluate them
with a lightweight MeTTa-like interpreter.

Modules:
  - atomizer:  Converts natural language utterances into schema-valid MeTTa atoms
  - reasoner:  Runs PLN-style pattern matching and misconception detection rules
  - audit:     Immutable audit log for every AI action
"""
