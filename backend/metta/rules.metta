; ============================================================
; Syncsenta — Pedagogical Reasoning Rules (MeTTa source)
; ============================================================
; These rules fire when the AtomSpace contains matching atom patterns.
; Every rule produces an Inferred atom that carries :because, :rule,
; and :confidence — no orphan conclusions.
;
; Rule autonomy levels:
;   Level 1 — Observe Only (auto, no intervention)
;   Level 2 — Suggest (auto, teacher approves)
;   Level 3 — Direct Nudge (teacher-initiated or pre-approved)
; ============================================================

; --- Rule: Denominator confusion detection ---
; If a student believes 1/4 > 1/2, but curriculum says 1/4 < 1/2,
; infer denominator confusion with confidence 0.78.
;
; Pattern:
;   (Believes S (Greater 1/4 1/2)) + (CurriculumTruth (Less 1/4 1/2))
;   => (Inferred (Confused S Denominators) :confidence 0.78)
;
; Autonomy: Level 2 (suggest visual demo to teacher)

(: rule_denominator_confusion_v1
  (rule
    :match (Believes $S (Greater 1/4 1/2))
    :contradicts (CurriculumTruth (Less 1/4 1/2))
    :infer (Inferred (Confused $S Denominators)
      :because [ (Believes $S (Greater 1/4 1/2)) ]
      :rule rule_denominator_confusion_v1
      :confidence 0.78)
    :action (Suggest Teacher VisualModel :target $S :level 2)
    :autonomy 2))

; --- Rule: Disengagement risk ---
; If silence > 90s and previous confusion exists, flag disengagement.
;
; Pattern:
;   (Silence $S :duration >90) + (Confused $S $T)
;   => (Risk Disengaged $S 0.71)
;
; Autonomy: Level 1 (observe only, update dashboard)

(: rule_disengagement_v1
  (rule
    :match (Silence $S :duration $D)
    :condition (> $D 90)
    :requires (Confused $S $T)
    :infer (Inferred (Risk Disengaged $S 0.71)
      :because [ (Silence $S :duration $D) (Confused $S $T) ]
      :rule rule_disengagement_v1
      :confidence 0.71)
    :action (UpdateDashboard $S DisengagementRisk)
    :autonomy 1))

; --- Rule: Class-level misconception aggregation ---
; If > 40% of students share the same misconception, fire class-level alert.
;
; Pattern:
;   (Count (Confused $S $T)) / (Count (Enrolled $S $C)) > 0.40
;   => (ClassMisconception $C $T $ratio)
;
; Autonomy: Level 2 (suggest class-wide intervention)

(: rule_class_misconception_v1
  (rule
    :match (Confused $S $T)
    :condition (> (Ratio (Count (Confused $S $T)) (Count (Enrolled $S $C))) 0.40)
    :infer (Inferred (ClassMisconception $C $T $ratio)
      :because [ (Confused $S $T) ... ]
      :rule rule_class_misconception_v1
      :confidence 0.65)
    :action (Suggest Teacher ClassWideReview :target $C :level 2)
    :autonomy 2))

; --- Rule: Mastery delta calculation ---
; After a quiz, compute mastery delta and merge into student AtomSpace.
; Only atoms with confidence > 0.7 and not contradicted are promoted.
;
; Autonomy: Level 1 (automatic, post-class)

(: rule_mastery_delta_v1
  (rule
    :match (Answered $S $quiz $result)
    :infer (Inferred (MasteryDelta $S $topic $delta)
      :because [ (Answered $S $quiz $result) ]
      :rule rule_mastery_delta_v1
      :confidence 0.90)
    :action (MergeToStudentAtomSpace $S)
    :autonomy 1))

; --- Rule: Visual example effectiveness (discovered by PLN) ---
; This is a rule candidate discovered by overnight PLN correlation.
; It is proposed to a human curriculum reviewer, not auto-deployed.
;
; Autonomy: Level 2 (pending human review)

(: rule_visual_effectiveness_candidate_v1
  (rule
    :match (LearningStyle $S Visual) + (Intervention Teacher VisualModel :result $R)
    :infer (Inferred (EffectiveRatio VisualExample 2.3)
      :because [ (Intervention Teacher VisualModel :result Improved) ... ]
      :rule rule_visual_effectiveness_candidate_v1
      :confidence 0.62)
    :status proposed
    :autonomy 2))
