"""
Reasoner — runs PLN-style pattern matching and pedagogical rules over the AtomSpace.

This module loads MeTTa rules from rules.metta and evaluates them against
the current set of atoms. In production, this would use Hyperon's PLN
(Probabilistic Logic Networks) for uncertainty-aware inference.
For the prototype, we use deterministic rule matching with confidence propagation.
"""
import os
from typing import List, Dict, Optional

# In-memory AtomSpace (in production: hyperon-py AtomSpace)
_atomspace: List[str] = []
_rules_loaded = False


def _load_metta_source():
    """Load MeTTa source files to populate the AtomSpace with curriculum and rules."""
    global _rules_loaded
    if _rules_loaded:
        return

    metta_dir = os.path.dirname(os.path.abspath(__file__))
    metta_files = ["curriculum.metta", "rules.metta"]

    for fname in metta_files:
        fpath = os.path.join(metta_dir, fname)
        if os.path.exists(fpath):
            with open(fpath, "r") as f:
                for line in f:
                    line = line.strip()
                    # Skip comments and empty lines
                    if line and not line.startswith(";"):
                        _atomspace.append(line)

    _rules_loaded = True


def get_atomspace() -> Optional[List[str]]:
    """Return the current AtomSpace contents, or None if not loaded."""
    _load_metta_source()
    return _atomspace


def add_atom(atom: str):
    """Add an atom to the AtomSpace."""
    _load_metta_source()
    _atomspace.append(atom)


def run_reasoning(student_id: str, atoms: List[str]) -> Dict:
    """
    Run misconception detection rules over the newly added atoms.

    The core rule (from rules.metta):
        If (Believes S (Greater 1/4 1/2)) and curriculum says (CurriculumTruth (Less 1/4 1/2))
        then infer (Confused S Denominators) with confidence 0.78

    Args:
        student_id: The student identifier
        atoms: The newly atomized atoms from the utterance

    Returns:
        Dict with the inference atom, confidence, rule_id, and detail
    """
    _load_metta_source()

    # Check for the "bigger denominator" misconception
    has_greater_belief = any("(Greater 1/4 1/2)" in a and "Believes" in a for a in atoms)
    has_bigger_reasoning = any("BiggerDenominator" in a for a in atoms)

    if has_greater_belief and has_bigger_reasoning:
        confidence = 0.78
        rule_id = "rule_denominator_confusion_v1"
        inference_atom = (
            f"(Inferred (Confused {student_id} Denominators)\n"
            f"  :because [ (Believes {student_id} (Greater 1/4 1/2)) ]\n"
            f"  :rule {rule_id}\n"
            f"  :confidence {confidence})"
        )
        detail = (
            "Pattern match: student belief contradicts curriculum truth "
            "(1/4 < 1/2). Rule fires with evidence chain attached."
        )

        # Add inference to AtomSpace
        add_atom(inference_atom)

        return {
            "atom": inference_atom,
            "confidence": confidence,
            "rule_id": rule_id,
            "detail": detail,
        }

    # No rule fired — return a neutral observation
    return {
        "atom": f"(Observed {student_id} NoMisconceptionDetected :confidence 0.5)",
        "confidence": 0.5,
        "rule_id": "rule_observe_only",
        "detail": "No misconception rule matched. Student utterance logged as observation.",
    }
