"""
Atomizer — converts a natural language utterance into schema-valid MeTTa atoms.

This is a constrained atomizer: it does NOT generate free text. It pattern-matches
known linguistic structures and outputs only atoms from the approved schema.
In production, this would use a quantized local LLM (e.g. Qwen 7B Q4) constrained
by a JSON schema + rule checker. For the prototype, we use deterministic pattern matching.
"""
import re
from typing import List

# Schema-valid atom types that the atomizer is allowed to produce
ALLOWED_ATOM_TYPES = {
    "Believes", "Reasoning", "Said", "Knows", "Misconception", "Mastery",
}

# Pattern library: maps utterance patterns to MeTTa atoms
# Each pattern is (regex, atom_generator)
PATTERNS = [
    # "X is bigger/greater than Y" → Believes (Greater X Y)
    (
        re.compile(r"(\d+/\d+)\s+is\s+(?:bigger|greater|larger)\s+than\s+(\d+/\d+)", re.I),
        lambda m, sid: [
            f'(Believes {sid} (Greater {m.group(1)} {m.group(2)}) :confidence 0.85)',
        ],
    ),
    # "because N is bigger than M" → Reasoning BiggerNumber
    (
        re.compile(r"because\s+(\d+)\s+is\s+bigger\s+than\s+(\d+)", re.I),
        lambda m, sid: [
            f'(Reasoning {sid} BiggerDenominator)',
        ],
    ),
    # "I don't get" / "I don't understand" → expresses confusion
    (
        re.compile(r"i don'?t (?:get|understand)", re.I),
        lambda m, sid: [
            f'(Confused {sid} UnknownTopic :confidence 0.6)',
        ],
    ),
    # "I know X" → Knows
    (
        re.compile(r"i know\s+(.+)", re.I),
        lambda m, sid: [
            f'(Knows {sid} {m.group(1).strip()} 0.7)',
        ],
    ),
]


def atomize_utterance(utterance: str, student_id: str = "stu_002") -> List[str]:
    """
    Convert a natural language utterance into schema-valid MeTTa atoms.

    The atomizer is constrained: it can ONLY output atoms from ALLOWED_ATOM_TYPES.
    Any utterance that doesn't match a known pattern produces no atoms —
    no hallucination, no free text.

    Args:
        utterance: The transcribed student speech
        student_id: The student identifier (e.g. "stu_002")

    Returns:
        A list of MeTTa atom strings
    """
    atoms = []
    for pattern, generator in PATTERNS:
        match = pattern.search(utterance)
        if match:
            new_atoms = generator(match, student_id)
            # Validate: every atom must start with an allowed type
            for atom in new_atoms:
                atom_type = atom.strip().lstrip("(").split()[0]
                if atom_type in ALLOWED_ATOM_TYPES:
                    atoms.append(atom)

    if not atoms:
        # No pattern matched — record as raw Said atom only, no inference
        atoms.append(f'(Said {student_id} "{utterance}" :unmatched true)')

    return atoms
