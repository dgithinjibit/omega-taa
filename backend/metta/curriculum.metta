; ============================================================
; Syncsenta — Curriculum AtomSpace (MeTTa source)
; ============================================================
; This file defines the curriculum atoms that ground all reasoning.
; The agent cannot invent curriculum — all reasoning is anchored
; to these teacher-approved atoms.
; ============================================================

; --- Topic hierarchy ---
(Topic Fractions)
(Subtopic Fractions Denominators)
(Subtopic Fractions Addition)
(Subtopic Fractions Division)

; --- Prerequisite graph ---
(Prerequisite Fractions Addition)
(Prerequisite Fractions Multiplication)
(Requires Fractions (Division ByTwo))

; --- Curriculum truths (ground truth for misconception detection) ---
(CurriculumTruth (Less 1/4 1/2) :confidence 1.0)
(CurriculumTruth (Less 1/3 1/2) :confidence 1.0)
(CurriculumTruth (Greater 3/4 1/2) :confidence 1.0)
(CurriculumTruth (Equal 2/4 1/2) :confidence 1.0)

; --- Learning style atoms ---
(LearningStyle Visual)
(LearningStyle Auditory)
(LearningStyle Kinesthetic)

; --- Effective interventions ---
(EffectiveFor Visual VisualExample :confidence 0.82)
(EffectiveFor Auditory VerbalExplanation :confidence 0.75)
(EffectiveFor Kinesthetic HandsOnActivity :confidence 0.88)

; --- Mastery thresholds ---
(MasteryThreshold Fractions 0.70)
(MasteryThreshold Denominators 0.75)
