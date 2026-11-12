; Small PeTTa-compatible harness for the classroom skill plugin.
; Omega supplies these registration and channel functions at runtime.

(= (add-skill $function $description $arguments)
   (add-atom &self
     (dynamic-skill $function ($function $description $arguments))))

(= (remove-skill $function)
   (progn
     (collapse
       (match &self
         (dynamic-skill $function $info)
         (remove-atom &self (dynamic-skill $function $info))))
     True))

(= (add-prompt-extension $key $text)
   (add-atom &self (test-prompt-extension $key $text)))

(= (send $message)
   (sent $message))

(= (assert-equal $actual $expected)
   (if (== $actual $expected) TEST-PASS TEST-FAIL))

!(add-skill shell "Execute a shell command." (cmd))
!(add-skill metta "Evaluate arbitrary MeTTa." (sexpression))
!(add-skill send "Send a message." (content))
!(add-skill remember "Store long-term memories." (content))
!(add-skill read-file "Read a file." (filename))
!(add-skill websearch "Search the web." (query))
!(add-skill workflow-load-instructions "Load workflows." (name))
!(add-skill delegate-task-to-openclaw-agent "Delegate externally." (task))

; @@INSERT_CO_TUTOR_SKILLS@@

!(loadOmegaPlugin)

!(assert-equal
  (== () (collapse (match &self (dynamic-skill shell $_) FOUND)))
  True)
!(assert-equal
  (== () (collapse (match &self (dynamic-skill metta $_) FOUND)))
  True)
!(assert-equal
  (== () (collapse (match &self (dynamic-skill send $_) FOUND)))
  True)
!(assert-equal
  (== () (collapse (match &self (dynamic-skill remember $_) FOUND)))
  True)
!(assert-equal
  (== () (collapse (match &self (dynamic-skill read-file $_) FOUND)))
  True)
!(assert-equal
  (== () (collapse (match &self (dynamic-skill websearch $_) FOUND)))
  True)
!(assert-equal
  (== () (collapse (match &self (dynamic-skill workflow-load-instructions $_) FOUND)))
  True)
!(assert-equal
  (== () (collapse (match &self (dynamic-skill delegate-task-to-openclaw-agent $_) FOUND)))
  True)

!(assert-equal
  (== () (collapse (match &self (dynamic-skill co-tutor-explain $_) FOUND)))
  False)
!(assert-equal
  (== () (collapse (match &self (dynamic-skill co-tutor-hint $_) FOUND)))
  False)
!(assert-equal
  (== () (collapse (match &self (dynamic-skill co-tutor-check-label $_) FOUND)))
  False)
!(assert-equal
  (== () (collapse (match &self (dynamic-skill co-tutor-check-understanding $_) FOUND)))
  False)
!(assert-equal
  (== () (collapse (match &self (dynamic-skill co-tutor-respond $_) FOUND)))
  False)
!(assert-equal
  (== () (collapse (match &self (dynamic-skill co-tutor-next-question $_) FOUND)))
  False)

!(assert-equal
  (co-tutor-explain "fixed_rule")
  "A fixed rule follows instructions written by a person.")
!(assert-equal
  (co-tutor-explain "learned_prediction")
  "A learned model estimates a pattern from examples. Its prediction is an estimate, not a guarantee.")
!(assert-equal
  (co-tutor-explain "prediction_not_permission")
  "A prediction is not permission to act. A person should review the evidence and the proposed action.")
!(assert-equal
  (co-tutor-explain "unapproved_topic")
  "I can explain fixed_rule, learned_prediction, proposed_action, human_review, or prediction_not_permission.")
!(assert-equal
  (co-tutor-hint-text "proposed_action")
  "Hint: Would this step change what the system or a person does, or is it only an estimate?")
!(assert-equal
  (co-tutor-valid-label "unclear")
  True)
!(assert-equal
  (co-tutor-valid-label "mastered")
  False)
!(assert-equal
  (co-tutor-check-text "fixed_rule" "rule")
  "That label matches this practice example. This checks only this response; it does not establish mastery.")
!(assert-equal
  (co-tutor-check-text "delivery_prediction" "action")
  "Not quite. Ask whether it follows written instructions, estimates a pattern, or proposes a change. Try again.")
!(assert-equal
  (co-tutor-check-text "unknown-example" "prediction")
  "That example is not in this teacher-approved practice set. Ask your teacher for help.")
!(assert-equal
  (co-tutor-check-text "fixed_rule" "something else")
  "Please answer with one label: rule, prediction, action, or unclear.")
!(assert-equal
  (co-tutor-check-understanding "prediction_authorizes_action")
  "Curriculum check: a prediction estimates what may happen; it is not permission or authorization to act. A person should review the evidence and proposed action.")
!(assert-equal
  (co-tutor-check-understanding "outside_curriculum")
  "This claim is outside the approved lesson checks. Ask the teacher to verify it.")
!(assert-equal
  (co-tutor-next-question)
  "A fictional delivery assistant predicts a late trip and proposes rerouting. Which part predicts, which part acts, and what should a person check?")
!(assert-equal
  (co-tutor-check-label "reroute_proposal" "action")
  "That label matches this practice example. This checks only this response; it does not establish mastery.")
!(assert-equal
  (co-tutor-respond "A prediction is an estimate, not permission to act.")
  (sent "A prediction is an estimate, not permission to act."))
!(assert-equal
  (== () (collapse (match &self (test-prompt-extension classroom-co-tutor-policy $_) FOUND)))
  False)
