; ============================================================
; OMEGA TAA — AI Literacy Curriculum AtomSpace (MeTTa source)
; ============================================================
; This file defines the curriculum atoms that ground all reasoning.
; The agent cannot invent curriculum — all reasoning is anchored
; to these teacher-approved atoms.
; ============================================================

; --- Topic hierarchy: CodeYetu AI Foundations, Day 01 ---
(Topic AIFoundations)
(Subtopic AIFoundations RulesPredictionsAndActions)
(Subtopic AIFoundations ResponsibleAIUse)
(Subtopic AIFoundations NeuralSymbolicSystems)

; --- Prerequisite graph ---
(Prerequisite RulesPredictionsAndActions AIFoundations)
(Prerequisite ResponsibleAIUse AIFoundations)
(Requires AgentActions HumanReview)

; --- Teacher-approved curriculum truths ---
; A fixed rule follows instructions written by a person.
(CurriculumTruth (FixedRule FollowsHumanWrittenInstructions) :confidence 1.0)
; A learned model estimates patterns from examples.
(CurriculumTruth (LearnedModel EstimatesPatternsFromExamples) :confidence 1.0)
; A prediction is not authorization for a system to act.
(CurriculumTruth PredictionIsNotPermissionToAct :confidence 1.0)
; Machine output is not automatically true, fair, or intelligent.
(CurriculumTruth MachineOutputIsNotAutomaticallyTrueFairOrIntelligent :confidence 1.0)
; An agent may connect a model output to a proposed action; these are distinct steps.
(CurriculumTruth (AgentCanProposeActionFrom ModelOutput) :confidence 1.0)
; The initial test lesson follows the CodeYetu Day 01 learning outcome:
; distinguish a fixed rule, a learned prediction, and a proposed agent action.
(LearningOutcome DistinguishFixedRuleLearnedPredictionAndProposedAgentAction)

; --- Learning style atoms ---
(LearningStyle Visual)
(LearningStyle Auditory)
(LearningStyle Kinesthetic)

; --- Effective interventions ---
(EffectiveFor Visual VisualExample :confidence 0.82)
(EffectiveFor Auditory VerbalExplanation :confidence 0.75)
(EffectiveFor Kinesthetic HandsOnActivity :confidence 0.88)

; --- Mastery thresholds ---
(MasteryThreshold AIFoundations 0.70)
(MasteryThreshold ResponsibleAIUse 0.75)
