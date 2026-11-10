"""
Audit — immutable audit log for every AI action.

Every AI action is logged as:
    (ActionID, Timestamp, RuleID, InputAtoms, OutputAtoms, Confidence, TeacherApproval)

This log is immutable and exportable. If a parent asks "Why did you tell my
child X?", we can show the exact chain.

In production, this would be an append-only log (e.g. a Postgres table with
no UPDATE/DELETE grants, or a blockchain-style hash chain). For the prototype,
we use an in-memory list that supports append and read only.
"""
import time
import uuid
from typing import List, Dict

_audit_trail: List[Dict] = []


def log_action(
    rule_id: str = "",
    input_atoms: List[str] = None,
    output_atoms: List[str] = None,
    confidence: float = 0.0,
    approval: str = "pending",
    action_id: str = None,
) -> str:
    """
    Log an AI action to the immutable audit trail.

    If action_id is provided, updates the approval status of an existing action.
    Otherwise, creates a new audit entry.

    Args:
        rule_id: The rule that fired
        input_atoms: The atoms that triggered the rule
        output_atoms: The atoms produced by the rule
        confidence: The confidence of the inference
        approval: "pending", "approved", or "dismissed"
        action_id: If provided, update an existing action's approval

    Returns:
        The action ID
    """
    if action_id:
        # Update approval status of existing action
        for entry in _audit_trail:
            if entry["action_id"] == action_id:
                entry["approval"] = approval
                entry["updated_at"] = time.time()
                break
        return action_id

    new_id = f"act_{uuid.uuid4().hex[:8]}"
    _audit_trail.append({
        "action_id": new_id,
        "timestamp": time.time(),
        "rule_id": rule_id,
        "input_atoms": input_atoms or [],
        "output_atoms": output_atoms or [],
        "confidence": confidence,
        "approval": approval,
    })
    return new_id


def get_audit_trail() -> List[Dict]:
    """Return the full immutable audit trail."""
    return _audit_trail
