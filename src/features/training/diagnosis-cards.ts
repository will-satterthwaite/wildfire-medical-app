import type { DiagnosisCard } from "./types";

export const diagnosisCards: DiagnosisCard[] = [
  {
    id: "dx-heat-stroke-line",
    title: "Hot Saw Team Member",
    category: "Heat Illness",
    minutes: 2,
    setting: "Initial attack crew cutting line at 34 C with limited shade.",
    patient: "Firefighter has stopped working, is confused, very hot, and unsteady.",
    symptoms: [
      "Confusion and poor coordination",
      "Hot skin after heavy exertion",
      "Headache and nausea",
      "Rapid pulse",
      "Crew reports they were pushing hard for two hours"
    ],
    correctProblem: "Serious heat illness / possible heat stroke",
    recognitionNote:
      "In wildfire work, altered mental status in heat is the pattern to treat as urgent. This is not just fatigue.",
    conditionOptions: [
      {
        id: "heat-stroke",
        label: "Serious heat illness / possible heat stroke",
        correct: true,
        explanation:
          "Correct. Confusion plus heat exposure is a high-risk pattern that needs rapid action."
      },
      {
        id: "simple-fatigue",
        label: "Normal fatigue from hard work",
        correct: false,
        explanation:
          "Hard work causes fatigue, but confusion and poor coordination make this urgent."
      },
      {
        id: "minor-dehydration",
        label: "Mild dehydration only",
        correct: false,
        explanation:
          "Dehydration may be involved, but mental status change points to a more serious heat illness."
      }
    ],
    actionOptions: [
      {
        id: "cool-evac",
        label: "Move to shade, start rapid cooling, reassess, and request urgent evacuation.",
        correct: true,
        explanation:
          "Correct. Cooling and evacuation planning should start immediately while monitoring the patient."
      },
      {
        id: "rest-return",
        label: "Have them rest for five minutes, drink water, then return to light duty.",
        correct: false,
        explanation:
          "Return to work is not appropriate when confusion is present."
      },
      {
        id: "watch",
        label: "Keep observing from the line and call only if they collapse.",
        correct: false,
        explanation:
          "Waiting for collapse loses critical time. Act on the red flags now."
      }
    ],
    ofaGrounding:
      "Grounded in OFA-style priority recognition: altered responsiveness, urgent care, reassessment, and transport decision-making."
  },
  {
    id: "dx-smoke-respiratory",
    title: "Coughing in Heavy Mop-up",
    category: "Smoke",
    minutes: 2,
    setting: "Mop-up in a draw with poor ventilation and ash pockets.",
    patient: "Crew member is coughing, dizzy, short of breath, and says their chest feels tight.",
    symptoms: [
      "Shortness of breath",
      "Persistent cough",
      "Headache and dizziness",
      "Smoke exposure in a low draw",
      "Symptoms continue after stopping work"
    ],
    correctProblem: "Respiratory distress after smoke exposure",
    recognitionNote:
      "The pattern is breathing difficulty after smoke exposure. Remove from exposure and escalate if symptoms persist.",
    conditionOptions: [
      {
        id: "resp-distress",
        label: "Respiratory distress after smoke exposure",
        correct: true,
        explanation:
          "Correct. Breathing difficulty after smoke exposure needs clean air, assessment, and escalation."
      },
      {
        id: "panic-only",
        label: "Anxiety only",
        correct: false,
        explanation:
          "Anxiety may be present, but persistent cough and shortness of breath after smoke exposure are medical red flags."
      },
      {
        id: "minor-irritation",
        label: "Minor throat irritation",
        correct: false,
        explanation:
          "Minor irritation should improve with clean air. Ongoing shortness of breath is more serious."
      }
    ],
    actionOptions: [
      {
        id: "clean-air",
        label: "Move to clean air, assess airway/breathing, keep at rest, and request support.",
        correct: true,
        explanation:
          "Correct. Stop exposure, assess breathing, and plan transport if symptoms continue."
      },
      {
        id: "mask-return",
        label: "Give a mask and send them back if they can talk.",
        correct: false,
        explanation:
          "Talking does not clear the risk. Persistent breathing symptoms need monitoring and escalation."
      },
      {
        id: "alone-truck",
        label: "Send them alone to the truck to recover.",
        correct: false,
        explanation:
          "A dizzy, short-of-breath patient should not be left alone."
      }
    ],
    ofaGrounding:
      "Grounded in scene safety, airway/breathing assessment, monitoring, and transport urgency."
  }
];

export const dailyDiagnosis = diagnosisCards[0];
