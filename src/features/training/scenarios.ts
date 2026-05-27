import type { TrainingScenario } from "./types";

export const scenarios: TrainingScenario[] = [
  {
    id: "daily-chainsaw-bleed",
    title: "Chainsaw Cut on Sidehill",
    category: "Trauma",
    difficulty: "Standard",
    minutes: 4,
    setting: "Steep timber, 29 C, moderate smoke, 45 minutes from road access.",
    patient: "Sawyer is awake, pale, anxious, and bleeding heavily through saw pants.",
    objective: "Prioritize scene safety, severe bleeding control, and early evacuation.",
    ofaGrounding:
      "Structured around scene safety, primary assessment, severe bleeding control, reassessment, and transport urgency principles from OFA/Advanced First Aid training.",
    expectedSteps: 4,
    steps: [
      {
        id: "scene",
        prompt: "You arrive with two crew members. What comes first?",
        fieldContext: "The saw is off but other cutting is still happening nearby.",
        priority: "Scene safety before treatment.",
        options: [
          {
            id: "stop-work",
            label: "Stop nearby saw work, control slope hazards, assign roles.",
            correct: true,
            explanation:
              "Correct. You need a safe scene and clear roles before committing the attendant and crew to patient care.",
            nextStepId: "bleeding"
          },
          {
            id: "run-in",
            label: "Run straight to the patient and expose the wound.",
            correct: false,
            explanation:
              "Treatment matters, but rushing into an uncontrolled worksite can create more patients.",
            nextStepId: "scene-complication"
          },
          {
            id: "move-first",
            label: "Move the patient uphill before assessment.",
            correct: false,
            explanation:
              "Moving before controlling hazards and life threats can worsen the situation unless the location is immediately unsafe.",
            nextStepId: "scene-complication"
          }
        ]
      },
      {
        id: "scene-complication",
        prompt: "A second sawyer steps into the work area while you are focused on the wound. What fixes the incident?",
        fieldContext:
          "You now have treatment underway, but the slope, saws, and crew movement are not controlled.",
        priority: "Recover scene control immediately.",
        options: [
          {
            id: "recover-control",
            label: "Stop work, pull back non-essential crew, assign lookout and radio roles.",
            correct: true,
            explanation:
              "Correct. You can recover, but the missed scene-control step cost time and increased risk.",
            nextStepId: "bleeding"
          },
          {
            id: "keep-treating",
            label: "Keep treating and assume the crew will manage themselves.",
            correct: false,
            explanation:
              "Unassigned crew in a hazardous worksite can create secondary injuries.",
            nextStepId: "bleeding"
          },
          {
            id: "move-fast",
            label: "Drag the patient uphill before assigning roles.",
            correct: false,
            explanation:
              "Movement without a plan can worsen patient care and crew safety.",
            nextStepId: "bleeding"
          }
        ]
      },
      {
        id: "bleeding",
        prompt: "The lower leg is bleeding heavily. What is the priority?",
        fieldContext: "Patient is pale, breathing fast, and says they feel dizzy.",
        priority: "Control life-threatening bleeding.",
        options: [
          {
            id: "direct-control",
            label: "Control severe bleeding immediately and reassess.",
            correct: true,
            explanation:
              "Correct. Severe bleeding is an immediate life threat. Control it and keep checking the patient trend.",
            nextStepId: "evac"
          },
          {
            id: "full-vitals",
            label: "Complete a full set of vitals before touching the wound.",
            correct: false,
            explanation:
              "Vitals are useful, but delaying severe bleeding control is the wrong priority.",
            nextStepId: "bleeding-worse"
          },
          {
            id: "water",
            label: "Give water and ask the patient to stay calm.",
            correct: false,
            explanation:
              "Reassurance helps, but it does not address the immediate threat.",
            nextStepId: "bleeding-worse"
          }
        ]
      },
      {
        id: "bleeding-worse",
        prompt: "Two minutes pass. The patient is paler and less talkative. What do you do now?",
        fieldContext:
          "Bleeding has continued through clothing. The crew is getting anxious and asking about evacuation.",
        priority: "Correct the missed life threat and reassess.",
        options: [
          {
            id: "control-now",
            label: "Control severe bleeding now, then reassess airway, breathing, circulation, and trend.",
            correct: true,
            explanation:
              "Correct. The delay worsened the situation, but severe bleeding still has to be controlled immediately.",
            nextStepId: "evac"
          },
          {
            id: "radio-before-control",
            label: "Pause care and make the radio call before controlling bleeding.",
            correct: false,
            explanation:
              "Evacuation matters, but uncontrolled severe bleeding remains the immediate life threat.",
            nextStepId: "evac"
          },
          {
            id: "walk-to-road",
            label: "Try to walk the patient toward road access while they can still respond.",
            correct: false,
            explanation:
              "A deteriorating trauma patient should not be walked out over steep terrain.",
            nextStepId: "evac"
          }
        ]
      },
      {
        id: "evac",
        prompt: "Bleeding is controlled for now. What should happen next?",
        fieldContext: "Radio signal is weak unless someone moves upslope.",
        priority: "Start evacuation planning early.",
        options: [
          {
            id: "radio-evac",
            label: "Send a radio relay and request urgent evacuation with access details.",
            correct: true,
            explanation:
              "Correct. Remote wildfire incidents lose time quickly. Communicate mechanism, status, location, terrain, and extraction constraints.",
            nextStepId: "monitor"
          },
          {
            id: "wait",
            label: "Wait 20 minutes to see if the patient improves.",
            correct: false,
            explanation:
              "Waiting burns evacuation time. Serious mechanism and heavy bleeding justify early transport planning.",
            nextStepId: "monitor"
          },
          {
            id: "walk-out",
            label: "Have the patient walk toward the road if bleeding is controlled.",
            correct: false,
            explanation:
              "Walking a shock-risk trauma patient down steep terrain can worsen their condition and complicate rescue.",
            nextStepId: "monitor"
          }
        ]
      },
      {
        id: "monitor",
        prompt: "While waiting for extraction, what is your best next habit?",
        fieldContext: "The patient is quieter now and the crew is preparing a carry route.",
        priority: "Repeat assessment and watch for deterioration.",
        options: [
          {
            id: "reassess",
            label: "Reassess bleeding, airway, breathing, circulation, and patient trend.",
            correct: true,
            explanation:
              "Correct. Repetition catches deterioration and confirms whether your interventions are holding."
          },
          {
            id: "pack-gear",
            label: "Leave the patient with the crew and pack up medical gear.",
            correct: false,
            explanation:
              "The incident is not over. Continue monitoring until care is transferred."
          },
          {
            id: "focus-route",
            label: "Focus only on the carry route now that bleeding is controlled.",
            correct: false,
            explanation:
              "Evacuation matters, but patient reassessment must continue in parallel."
          }
        ]
      }
    ]
  },
  {
    id: "heat-line-construction",
    title: "Heat Collapse on Guard",
    category: "Heat Illness",
    difficulty: "Quick",
    minutes: 3,
    setting: "Mid-afternoon line construction, 34 C, limited shade, crew is low on water.",
    patient: "Firefighter is confused, very hot, weak, and no longer keeping pace.",
    objective: "Recognize serious heat illness and prioritize rapid cooling and evacuation.",
    ofaGrounding:
      "Uses OFA-style priority setting: scene safety, assessment, rapid intervention for serious condition, and transport decision-making.",
    expectedSteps: 3,
    steps: [
      {
        id: "recognize",
        prompt: "What makes this high priority?",
        fieldContext: "The patient is confused and very hot.",
        priority: "Mental status change with heat exposure is serious.",
        options: [
          {
            id: "heat-stroke-risk",
            label: "Confusion in heat suggests a serious heat illness emergency.",
            correct: true,
            explanation:
              "Correct. Altered mental status in heat is a red flag. Treat as urgent.",
            nextStepId: "cool"
          },
          {
            id: "tired",
            label: "They are probably tired and need a short rest.",
            correct: false,
            explanation:
              "Fatigue is common, but confusion and extreme heat exposure require urgent action.",
            nextStepId: "cool"
          },
          {
            id: "finish-task",
            label: "Have them finish the task slowly with a partner.",
            correct: false,
            explanation:
              "Continuing work increases risk. Remove from heat and begin care.",
            nextStepId: "cool"
          }
        ]
      },
      {
        id: "cool",
        prompt: "What is the best immediate action?",
        fieldContext: "Shade is 30 metres away. Water and wet towels are available.",
        priority: "Cool fast and activate help.",
        options: [
          {
            id: "cool-evac",
            label: "Move to shade, start active cooling, and request urgent evacuation.",
            correct: true,
            explanation:
              "Correct. Rapid cooling and early evacuation planning are the priorities.",
            nextStepId: "monitor"
          },
          {
            id: "sip-water",
            label: "Have them sip water and return when they feel better.",
            correct: false,
            explanation:
              "Fluids alone are not enough for a confused, overheated patient.",
            nextStepId: "monitor"
          },
          {
            id: "gear-on",
            label: "Keep all PPE on to avoid smoke exposure.",
            correct: false,
            explanation:
              "Balance scene hazards, but reducing heat load is urgent when safe to do so.",
            nextStepId: "monitor"
          }
        ]
      },
      {
        id: "monitor",
        prompt: "What should the crew track while waiting?",
        fieldContext: "Patient is still confused but cooling has started.",
        priority: "Trend the patient and protect the plan.",
        options: [
          {
            id: "trend",
            label: "Mental status, breathing, pulse, temperature signs, and evac timing.",
            correct: true,
            explanation:
              "Correct. Repeat checks show whether cooling is helping and support transport decisions."
          },
          {
            id: "only-temp",
            label: "Only whether they say they feel cooler.",
            correct: false,
            explanation:
              "Subjective improvement is not enough. Track repeated patient signs."
          },
          {
            id: "crew-output",
            label: "How much line the crew can finish before evacuation.",
            correct: false,
            explanation:
              "Patient care and crew safety take priority over production."
          }
        ]
      }
    ]
  },
  {
    id: "smoke-inhalation-mop-up",
    title: "Smoke Exposure During Mop-up",
    category: "Smoke",
    difficulty: "Quick",
    minutes: 3,
    setting: "Interior mop-up in heavy ash pockets, poor visibility, intermittent coughing.",
    patient: "Crew member has persistent cough, headache, dizziness, and shortness of breath.",
    objective: "Prioritize removal from exposure, airway/breathing assessment, and evacuation decision.",
    ofaGrounding:
      "Built around scene safety, airway and breathing priorities, monitoring, and transport urgency.",
    expectedSteps: 2,
    steps: [
      {
        id: "remove",
        prompt: "What is the first priority?",
        fieldContext: "Smoke is still pooling in the draw.",
        priority: "Stop exposure and assess breathing.",
        options: [
          {
            id: "clean-air",
            label: "Move to clean air if safe, assess airway and breathing.",
            correct: true,
            explanation:
              "Correct. Remove the patient from exposure and check breathing early.",
            nextStepId: "decision"
          },
          {
            id: "keep-working",
            label: "Have them slow down and keep mopping up.",
            correct: false,
            explanation:
              "Continuing exposure can worsen respiratory symptoms.",
            nextStepId: "decision"
          },
          {
            id: "drive-self",
            label: "Send them to the truck alone to rest.",
            correct: false,
            explanation:
              "A dizzy patient should not be sent alone. Maintain monitoring.",
            nextStepId: "decision"
          }
        ]
      },
      {
        id: "decision",
        prompt: "Symptoms continue after moving to cleaner air. What now?",
        fieldContext: "The patient is still short of breath and light-headed.",
        priority: "Escalate when symptoms persist.",
        options: [
          {
            id: "evac-monitor",
            label: "Request medical support or evacuation and keep reassessing breathing.",
            correct: true,
            explanation:
              "Correct. Persistent breathing symptoms in a remote setting need escalation and monitoring."
          },
          {
            id: "back-later",
            label: "Let them return to work once the headache improves.",
            correct: false,
            explanation:
              "Persistent shortness of breath is not a return-to-work situation."
          },
          {
            id: "ignore",
            label: "Document it later if symptoms get worse.",
            correct: false,
            explanation:
              "Do not delay action when breathing symptoms continue."
          }
        ]
      }
    ]
  },
  {
    id: "spot-fire-access",
    title: "Spot Fire Blocks Access",
    category: "Scene Safety",
    difficulty: "Quick",
    minutes: 2,
    setting: "Small crew working below a ridge. A spot fire starts between the crew and the planned pickup point.",
    patient: "Crew member has a twisted ankle but is alert and breathing normally.",
    objective: "Choose scene safety and crew movement priorities before treatment details.",
    ofaGrounding:
      "Uses the OFA principle that rescuers must consider scene safety before patient contact and continue reassessing hazards.",
    expectedSteps: 2,
    steps: [
      {
        id: "hazard",
        prompt: "The patient is calling from 20 metres away. What is the priority?",
        fieldContext: "Flame is moving upslope and the planned exit route may be cut off.",
        priority: "Rescuer and crew safety comes before non-urgent treatment.",
        options: [
          {
            id: "move-safe",
            label: "Reposition the crew to a safe area and reassess access to the patient.",
            correct: true,
            explanation:
              "Correct. Do not turn a minor injury into a crew entrapment. Control the scene and route first.",
            nextStepId: "contact"
          },
          {
            id: "splint-now",
            label: "Enter immediately and splint the ankle where the patient sits.",
            correct: false,
            explanation:
              "An ankle injury does not justify entering a worsening fire environment without controlling access.",
            nextStepId: "contact"
          },
          {
            id: "send-one",
            label: "Send one firefighter alone to pull the patient out.",
            correct: false,
            explanation:
              "A solo rescue into a changing fire environment adds risk and weakens crew accountability.",
            nextStepId: "contact"
          }
        ]
      },
      {
        id: "contact",
        prompt: "The crew reaches a safe anchor point. What comes next?",
        fieldContext: "The patient can crawl a short distance with help.",
        priority: "Make a simple plan and keep reassessing hazards.",
        options: [
          {
            id: "plan-assess",
            label: "Assign roles, move the patient safely, then assess the ankle and overall condition.",
            correct: true,
            explanation:
              "Correct. Once access is safe, manage movement and begin structured assessment."
          },
          {
            id: "ignore-fire",
            label: "Focus only on the ankle now that you reached the patient.",
            correct: false,
            explanation:
              "Scene safety is not a one-time checkbox. Fire behavior and escape routes still matter."
          },
          {
            id: "radio-only",
            label: "Wait for instructions before moving the patient at all.",
            correct: false,
            explanation:
              "Use command and comms, but do not wait in a hazardous area when a safer move is available."
          }
        ]
      }
    ]
  },
  {
    id: "delayed-evac-burn",
    title: "Burn With Long Extraction",
    category: "Evacuation",
    difficulty: "Standard",
    minutes: 3,
    setting: "Mop-up operation, vehicle access delayed by a blocked spur road.",
    patient: "Firefighter has a painful forearm burn and increasing anxiety about the extraction delay.",
    objective: "Balance ongoing care, reassessment, packaging, communication, and transport planning.",
    ofaGrounding:
      "Structured around reassessment, protection from environment, records/communication, and evacuation planning principles.",
    expectedSteps: 2,
    steps: [
      {
        id: "transport",
        prompt: "Access is delayed at least 60 minutes. What is your best next move?",
        fieldContext: "The patient is stable but pain is increasing and the crew is unsure where to meet transport.",
        priority: "Care and evacuation planning run together.",
        options: [
          {
            id: "parallel",
            label: "Continue care, reassess, and assign someone to confirm route and pickup details.",
            correct: true,
            explanation:
              "Correct. Delayed extraction needs parallel work: patient care, monitoring, and logistics.",
            nextStepId: "handoff"
          },
          {
            id: "wait-road",
            label: "Pause patient care until the road problem is solved.",
            correct: false,
            explanation:
              "Delays are exactly when reassessment and comfort measures matter.",
            nextStepId: "handoff"
          },
          {
            id: "walk",
            label: "Have the patient walk out alone to save crew time.",
            correct: false,
            explanation:
              "A patient with an injury and rising distress should not be sent out alone.",
            nextStepId: "handoff"
          }
        ]
      },
      {
        id: "handoff",
        prompt: "Transport arrives. What information matters most?",
        fieldContext: "The receiving crew asks for a quick report.",
        priority: "Give a clear patient and incident handoff.",
        options: [
          {
            id: "report",
            label: "Mechanism, findings, care given, changes over time, and extraction constraints.",
            correct: true,
            explanation:
              "Correct. A concise trend-based handoff helps the next provider understand risk and care already given."
          },
          {
            id: "only-name",
            label: "Patient name and the road number.",
            correct: false,
            explanation:
              "Location matters, but the handoff also needs mechanism, assessment findings, care, and trends."
          },
          {
            id: "story",
            label: "A long narrative of everything the crew did that shift.",
            correct: false,
            explanation:
              "Keep it relevant and structured so transport can act quickly."
          }
        ]
      }
    ]
  }
];

export const dailyScenario = scenarios[0];
