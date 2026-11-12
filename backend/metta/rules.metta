; ============================================================
; OMEGA TAA — AI Literacy Pedagogical Rules (MeTTa source)
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

; --- Rule: Prediction treated as permission to act ---
; If a student believes a model prediction authorizes an action and explains
; that the prediction is sufficient, compare this with the approved lesson fact.
;
; Pattern:
;   (Believes S PredictionAuthorizesAction)
;   + (Reasoning S PredictionIsPermission)
;   + (CurriculumTruth PredictionIsNotPermissionToAct)
;   => (Inferred (Confused S PredictionAndAuthorization) :confidence 0.78)
;
; Autonomy: Level 2 (suggest a teacher-led review of prediction vs action)

(: rule_prediction_action_confusion_v1
  (rule
    :match (Believes $S PredictionAuthorizesAction)
    :requires (Reasoning $S PredictionIsPermission)
    :contradicts (CurriculumTruth PredictionIsNotPermissionToAct)
    :infer (Inferred (Confused $S PredictionAndAuthorization)
      :because [ (Believes $S PredictionAuthorizesAction)
                 (Reasoning $S PredictionIsPermission)
                 (CurriculumTruth PredictionIsNotPermissionToAct) ]
      :rule rule_prediction_action_confusion_v1
      :confidence 0.78)
    :action (Suggest Teacher ReviewPredictionAndAction :target $S :level 2)
    :autonomy 2))

; --- Rule: AI output treated as guaranteed truth ---
; A learner's explicit belief that an AI output is always correct conflicts
; with the approved AI-literacy principle that output needs checking.
;
; Pattern:
;   (Believes S ModelOutputAlwaysCorrect)
;   + (CurriculumTruth MachineOutputIsNotAutomaticallyTrueFairOrIntelligent)
;   => (Inferred (OvertrustsAIOutput S) ...)
;
; Autonomy: Level 2 (suggest a source-checking discussion)

(: rule_ai_output_overtrust_v1
  (rule
    :match (Believes $S ModelOutputAlwaysCorrect)
    :contradicts
      (CurriculumTruth MachineOutputIsNotAutomaticallyTrueFairOrIntelligent)
    :infer (Inferred (OvertrustsAIOutput $S)
      :because [ (Believes $S ModelOutputAlwaysCorrect)
                 (CurriculumTruth MachineOutputIsNotAutomaticallyTrueFairOrIntelligent) ]
      :rule rule_ai_output_overtrust_v1
      :confidence 0.72)
    :action (Suggest Teacher CheckAIOutput :target $S :level 2)
    :autonomy 2))

; --- Rule: Class-level AI concept misconception aggregation ---
; If more than 40% of enrolled learners show the same supported AI-literacy
; misconception, suggest a class review. Every contributing learner inference
; must remain available as evidence.
;
; Pattern:
;   (Count (OvertrustsAIOutput $S)) / (Count (Enrolled $S $C)) > 0.40
;   => (ClassMisconception $C AIOutputReliability $ratio)
;
; Autonomy: Level 2 (suggest a class-wide AI output checking activity)

(: rule_class_ai_misconception_v1
  (rule
    :match (OvertrustsAIOutput $S)
    :condition
      (> (Ratio (Count (OvertrustsAIOutput $S)) (Count (Enrolled $S $C))) 0.40)
    :infer (Inferred (ClassMisconception $C AIOutputReliability $ratio)
      :because [ (OvertrustsAIOutput $S) ... ]
      :rule rule_class_ai_misconception_v1
      :confidence 0.65)
    :action (Suggest Teacher AIOutputCheck :target $C :level 2)
    :autonomy 2))

; --- Rule: AI literacy mastery delta ---
; After an AI-literacy quiz, compute a topic mastery delta from a checked answer.
; Only teacher-validated evidence above the confidence threshold is eligible
; for a later student-model promotion.
;
; Autonomy: Level 1 (observe and queue for post-lesson review)

(: rule_ai_literacy_mastery_delta_v1
  (rule
    :match (Answered $S $quiz $result)
    :requires (QuizTopic $quiz AIFoundations)
    :infer (Inferred (MasteryEvidence $S AIFoundations $result)
      :because [ (Answered $S $quiz $result)
                 (QuizTopic $quiz AIFoundations) ]
      :rule rule_ai_literacy_mastery_delta_v1
      :confidence 0.90)
    :action (QueueTeacherReview $S AIFoundations)
    :autonomy 1))

; --- Rule: AI concept teaching activity effectiveness candidate ---
; This is a candidate correlation, not an established fact. A human curriculum
; reviewer must validate it before it can become an enabled lesson rule.
;
; Autonomy: Level 2 (propose for human review; never auto-deploy)

(: rule_ai_activity_effectiveness_candidate_v1
  (rule
    :match (Intervention Teacher RulePredictionActionDiagram :result $R)
    :requires (AssessmentTopic $assessment AIFoundations)
    :infer (Inferred (CandidateEffectiveness RulePredictionActionDiagram $R)
      :because [ (Intervention Teacher RulePredictionActionDiagram :result $R)
                 (AssessmentTopic $assessment AIFoundations) ... ]
      :rule rule_ai_activity_effectiveness_candidate_v1
      :confidence 0.62)
    :status proposed
    :autonomy 2))
