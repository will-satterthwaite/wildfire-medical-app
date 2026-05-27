export type ScenarioCategory =
  | "Scene Safety"
  | "Trauma"
  | "Heat Illness"
  | "Smoke"
  | "Evacuation";

export type ScenarioOption = {
  id: string;
  label: string;
  correct: boolean;
  explanation: string;
  nextStepId?: string;
};

export type ScenarioStep = {
  id: string;
  prompt: string;
  fieldContext: string;
  priority: string;
  options: ScenarioOption[];
};

export type TrainingScenario = {
  id: string;
  title: string;
  category: ScenarioCategory;
  difficulty: "Quick" | "Standard" | "Advanced";
  minutes: number;
  setting: string;
  patient: string;
  objective: string;
  ofaGrounding: string;
  expectedSteps: number;
  steps: ScenarioStep[];
};

export type AnswerRecord = {
  stepId: string;
  optionId: string;
  correct: boolean;
};

export type DiagnosisOption = {
  id: string;
  label: string;
  correct: boolean;
  explanation: string;
};

export type DiagnosisCard = {
  id: string;
  title: string;
  category: ScenarioCategory;
  minutes: number;
  setting: string;
  patient: string;
  symptoms: string[];
  correctProblem: string;
  recognitionNote: string;
  conditionOptions: DiagnosisOption[];
  actionOptions: DiagnosisOption[];
  ofaGrounding: string;
};
