"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Flame,
  HeartPulse,
  Lock,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Stethoscope,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  completeScenario,
  defaultProgress,
  loadProgress,
  saveProgress,
  type StoredProgress
} from "@/features/training/progress";
import { dailyDiagnosis } from "@/features/training/diagnosis-cards";
import { dailyScenario, scenarios } from "@/features/training/scenarios";
import type {
  AnswerRecord,
  DiagnosisCard,
  DiagnosisOption,
  ScenarioCategory,
  ScenarioOption,
  TrainingScenario
} from "@/features/training/types";
import { cn } from "@/lib/utils";

const categories: Array<ScenarioCategory | "All"> = [
  "All",
  "Scene Safety",
  "Trauma",
  "Heat Illness",
  "Smoke",
  "Evacuation"
];

export function TrainingApp() {
  const [view, setView] = useState<"home" | "play" | "diagnosis" | "library" | "result">("home");
  const [activeScenario, setActiveScenario] = useState<TrainingScenario>(dailyScenario);
  const [activeDiagnosis, setActiveDiagnosis] = useState<DiagnosisCard>(dailyDiagnosis);
  const [stepId, setStepId] = useState(dailyScenario.steps[0].id);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [selectedOption, setSelectedOption] = useState<ScenarioOption | null>(null);
  const [diagnosisStage, setDiagnosisStage] = useState<"problem" | "action">("problem");
  const [selectedDiagnosisOption, setSelectedDiagnosisOption] =
    useState<DiagnosisOption | null>(null);
  const [diagnosisScore, setDiagnosisScore] = useState(0);
  const [progress, setProgress] = useState<StoredProgress>(defaultProgress);
  const [category, setCategory] = useState<ScenarioCategory | "All">("All");
  const [lastResult, setLastResult] = useState<{
    title: string;
    mode: "Scenario" | "Daily Dx";
    correct: number;
    total: number;
    xp: number;
  } | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const activeStep = activeScenario.steps.find((step) => step.id === stepId);
  const score = answers.filter((answer) => answer.correct).length;
  const progressPercent = Math.min(
    100,
    Math.round((answers.length / activeScenario.expectedSteps) * 100)
  );
  const filteredScenarios = useMemo(
    () =>
      category === "All"
        ? scenarios
        : scenarios.filter((scenario) => scenario.category === category),
    [category]
  );

  function startScenario(scenario: TrainingScenario) {
    setActiveScenario(scenario);
    setStepId(scenario.steps[0].id);
    setAnswers([]);
    setSelectedOption(null);
    setView("play");
  }

  function startDiagnosis(card: DiagnosisCard) {
    setActiveDiagnosis(card);
    setDiagnosisStage("problem");
    setSelectedDiagnosisOption(null);
    setDiagnosisScore(0);
    setView("diagnosis");
  }

  function chooseOption(option: ScenarioOption) {
    if (!activeStep || selectedOption) {
      return;
    }

    setSelectedOption(option);
    setAnswers((current) => [
      ...current,
      {
        stepId: activeStep.id,
        optionId: option.id,
        correct: option.correct
      }
    ]);
  }

  function continueScenario() {
    if (!selectedOption) {
      return;
    }

    const nextStepId = selectedOption.nextStepId;
    if (!nextStepId) {
      const correct = answers.filter((answer) => answer.correct).length;
      const earnedXp = Math.max(10, correct * 10);
      const updated = completeScenario(progress, activeScenario.id, earnedXp);
      setProgress(updated);
      saveProgress(updated);
      setLastResult({
        title: activeScenario.title,
        mode: "Scenario",
        correct,
        total: answers.length,
        xp: earnedXp
      });
      setView("result");
      setSelectedOption(null);
      return;
    }

    setStepId(nextStepId);
    setSelectedOption(null);
  }

  function chooseDiagnosisOption(option: DiagnosisOption) {
    if (selectedDiagnosisOption) {
      return;
    }

    setSelectedDiagnosisOption(option);
    if (option.correct) {
      setDiagnosisScore((current) => current + 1);
    }
  }

  function continueDiagnosis() {
    if (!selectedDiagnosisOption) {
      return;
    }

    if (diagnosisStage === "problem") {
      setDiagnosisStage("action");
      setSelectedDiagnosisOption(null);
      return;
    }

    const finalScore = diagnosisScore;
    const earnedXp = Math.max(10, finalScore * 10);
    const updated = completeScenario(progress, activeDiagnosis.id, earnedXp);
    setProgress(updated);
    saveProgress(updated);
    setLastResult({
      title: activeDiagnosis.title,
      mode: "Daily Dx",
      correct: finalScore,
      total: 2,
      xp: earnedXp
    });
    setSelectedDiagnosisOption(null);
    setView("result");
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
          <button
            className="flex items-center gap-3 text-left"
            onClick={() => setView("home")}
            aria-label="Go home"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Flame className="h-6 w-6" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm font-black uppercase">Fireline Aid</span>
              <span className="block text-xs font-bold text-muted-foreground">
                Daily scenarios
              </span>
            </span>
          </button>

          <div className="flex items-center gap-2">
            <StatPill icon={Flame} label={`${progress.streak}`} tone="orange" />
            <StatPill icon={Star} label={`${progress.xp}`} tone="green" />
          </div>
        </div>
      </header>

      {view === "home" ? (
        <HomeView
          progress={progress}
          onStartDaily={() => startScenario(dailyScenario)}
          onStartDiagnosis={() => startDiagnosis(dailyDiagnosis)}
          onOpenLibrary={() => setView("library")}
        />
      ) : null}

      {view === "play" && activeStep ? (
        <PlayView
          scenario={activeScenario}
          stepNumber={Math.min(
            activeScenario.expectedSteps,
            answers.length + (selectedOption ? 0 : 1)
          )}
          stepCount={activeScenario.expectedSteps}
          progressPercent={progressPercent}
          activeStep={activeStep}
          selectedOption={selectedOption}
          onChoose={chooseOption}
          onContinue={continueScenario}
          onExit={() => setView("home")}
          onRestart={() => startScenario(activeScenario)}
        />
      ) : null}

      {view === "diagnosis" ? (
        <DiagnosisView
          card={activeDiagnosis}
          stage={diagnosisStage}
          selectedOption={selectedDiagnosisOption}
          onChoose={chooseDiagnosisOption}
          onContinue={continueDiagnosis}
          onExit={() => setView("home")}
          onRestart={() => startDiagnosis(activeDiagnosis)}
        />
      ) : null}

      {view === "library" ? (
        <LibraryView
          progress={progress}
          category={category}
          filteredScenarios={filteredScenarios}
          onCategoryChange={setCategory}
          onStart={startScenario}
          onBack={() => setView("home")}
        />
      ) : null}

      {view === "result" && lastResult ? (
        <ResultView
          result={lastResult}
          streak={progress.streak}
          onDaily={() => startScenario(dailyScenario)}
          onDiagnosis={() => startDiagnosis(dailyDiagnosis)}
          onLibrary={() => setView("library")}
          onHome={() => setView("home")}
        />
      ) : null}
    </main>
  );
}

function HomeView({
  progress,
  onStartDaily,
  onStartDiagnosis,
  onOpenLibrary
}: {
  progress: StoredProgress;
  onStartDaily: () => void;
  onStartDiagnosis: () => void;
  onOpenLibrary: () => void;
}) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-5">
      <div className="rounded-2xl border bg-primary p-5 text-primary-foreground shadow-field">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase text-primary-foreground/75">
              Today&apos;s drill
            </p>
            <h1 className="mt-2 text-3xl font-black leading-tight">
              {dailyScenario.title}
            </h1>
            <p className="mt-3 text-sm font-semibold leading-6 text-primary-foreground/82">
              {dailyScenario.objective}
            </p>
          </div>
          <span className="rounded-xl bg-accent px-3 py-2 text-sm font-black text-accent-foreground">
            {dailyScenario.minutes} min
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-primary-foreground/15 bg-primary-foreground/10 p-3">
            <p className="text-xs font-black uppercase text-primary-foreground/68">Streak</p>
            <p className="mt-1 text-2xl font-black">{progress.streak} days</p>
          </div>
          <div className="rounded-xl border border-primary-foreground/15 bg-primary-foreground/10 p-3">
            <p className="text-xs font-black uppercase text-primary-foreground/68">Training XP</p>
            <p className="mt-1 text-2xl font-black">{progress.xp}</p>
          </div>
        </div>

        <Button variant="accent" className="mt-5 w-full" onClick={onStartDaily}>
          <HeartPulse className="h-5 w-5" aria-hidden="true" />
          Start daily scenario
        </Button>
      </div>

      <div className="mt-4 rounded-2xl border bg-card p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <Stethoscope className="h-6 w-6" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-black uppercase text-accent">Daily Dx</p>
            <h2 className="mt-1 text-2xl font-black">{dailyDiagnosis.title}</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-muted-foreground">
              Identify the problem from field signs, then choose the best first response.
            </p>
          </div>
          <span className="rounded-xl border bg-background px-3 py-2 text-sm font-black">
            {dailyDiagnosis.minutes} min
          </span>
        </div>
        <Button variant="quiet" className="mt-4 w-full" onClick={onStartDiagnosis}>
          Start Daily Dx
        </Button>
      </div>

      <div className="mt-4 grid gap-3">
        <QuickCard
          icon={ShieldCheck}
          title="Decision reps"
          body="Short multiple-choice steps that reinforce assessment order and priorities."
        />
        <QuickCard
          icon={BookOpen}
          title="OFA-grounded"
          body="Scenario answers are written to align with OFA/Advanced First Aid principles."
        />
      </div>

      <Button variant="quiet" className="mt-4 w-full" onClick={onOpenLibrary}>
        <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
        Browse scenario library
      </Button>
    </section>
  );
}

function DiagnosisView({
  card,
  stage,
  selectedOption,
  onChoose,
  onContinue,
  onExit,
  onRestart
}: {
  card: DiagnosisCard;
  stage: "problem" | "action";
  selectedOption: DiagnosisOption | null;
  onChoose: (option: DiagnosisOption) => void;
  onContinue: () => void;
  onExit: () => void;
  onRestart: () => void;
}) {
  const options = stage === "problem" ? card.conditionOptions : card.actionOptions;
  const prompt =
    stage === "problem"
      ? "What problem pattern are you seeing?"
      : "What is the best first response?";

  return (
    <section className="mx-auto max-w-3xl px-4 py-5">
      <div className="mb-4 flex items-center gap-3">
        <button
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border bg-card"
          onClick={onExit}
          aria-label="Exit diagnosis card"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: stage === "problem" ? "50%" : "100%" }}
          />
        </div>
        <button
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border bg-card"
          onClick={onRestart}
          aria-label="Restart diagnosis card"
        >
          <RotateCcw className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-primary text-primary-foreground">
          <p className="text-xs font-black uppercase text-primary-foreground/70">
            Daily Dx · {card.category}
          </p>
          <CardTitle className="mt-2 text-2xl text-primary-foreground">
            {card.title}
          </CardTitle>
          <p className="mt-2 text-sm font-semibold leading-6 text-primary-foreground/78">
            {card.setting}
          </p>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="rounded-xl border bg-background p-4">
            <p className="text-xs font-black uppercase text-accent">Patient card</p>
            <p className="mt-2 text-base font-bold leading-7">{card.patient}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {card.symptoms.map((symptom) => (
                <span
                  key={symptom}
                  className="rounded-lg border bg-card px-3 py-2 text-xs font-black uppercase text-muted-foreground"
                >
                  {symptom}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-lg font-black">{prompt}</p>
            <div className="mt-3 grid gap-3">
              {options.map((option) => {
                const picked = selectedOption?.id === option.id;
                const reveal = Boolean(selectedOption);

                return (
                  <button
                    key={option.id}
                    disabled={reveal}
                    onClick={() => onChoose(option)}
                    className={cn(
                      "flex min-h-20 items-center gap-3 rounded-xl border bg-card p-4 text-left text-base font-black shadow-sm transition-colors",
                      !reveal && "hover:bg-muted",
                      picked && option.correct && "border-primary bg-primary/10",
                      picked && !option.correct && "border-danger bg-danger/10"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-background",
                        picked && option.correct && "border-primary bg-primary text-primary-foreground",
                        picked && !option.correct && "border-danger bg-danger text-danger-foreground"
                      )}
                    >
                      {picked && option.correct ? <CheckCircle2 className="h-5 w-5" /> : null}
                      {picked && !option.correct ? <XCircle className="h-5 w-5" /> : null}
                      {!picked ? <Lock className="h-4 w-4 text-muted-foreground" /> : null}
                    </span>
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedOption ? (
            <div
              className={cn(
                "rounded-xl border p-4",
                selectedOption.correct
                  ? "border-primary bg-primary/10"
                  : "border-danger bg-danger/10"
              )}
            >
              <p className="text-sm font-black uppercase">
                {selectedOption.correct ? "Pattern recognized" : "Not the best match"}
              </p>
              <p className="mt-2 text-sm font-semibold leading-6 text-muted-foreground">
                {selectedOption.explanation}
              </p>
              <p className="mt-3 text-xs font-black uppercase text-accent">
                {stage === "problem" ? card.recognitionNote : card.ofaGrounding}
              </p>
              <Button className="mt-4 w-full" onClick={onContinue}>
                Continue
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </section>
  );
}

function PlayView({
  scenario,
  stepNumber,
  stepCount,
  progressPercent,
  activeStep,
  selectedOption,
  onChoose,
  onContinue,
  onExit,
  onRestart
}: {
  scenario: TrainingScenario;
  stepNumber: number;
  stepCount: number;
  progressPercent: number;
  activeStep: TrainingScenario["steps"][number];
  selectedOption: ScenarioOption | null;
  onChoose: (option: ScenarioOption) => void;
  onContinue: () => void;
  onExit: () => void;
  onRestart: () => void;
}) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-5">
      <div className="mb-4 flex items-center gap-3">
        <button
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border bg-card"
          onClick={onExit}
          aria-label="Exit scenario"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <button
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border bg-card"
          onClick={onRestart}
          aria-label="Restart scenario"
        >
          <RotateCcw className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-primary text-primary-foreground">
          <p className="text-xs font-black uppercase text-primary-foreground/70">
            Step {stepNumber} of {stepCount} · {scenario.category}
          </p>
          <CardTitle className="mt-2 text-2xl text-primary-foreground">
            {activeStep.prompt}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="rounded-xl border bg-background p-4">
            <p className="text-xs font-black uppercase text-accent">Field context</p>
            <p className="mt-2 text-base font-bold leading-7">{activeStep.fieldContext}</p>
          </div>

          <div className="grid gap-3">
            {activeStep.options.map((option) => {
              const picked = selectedOption?.id === option.id;
              const reveal = Boolean(selectedOption);

              return (
                <button
                  key={option.id}
                  disabled={reveal}
                  onClick={() => onChoose(option)}
                  className={cn(
                    "flex min-h-20 items-center gap-3 rounded-xl border bg-card p-4 text-left text-base font-black shadow-sm transition-colors",
                    !reveal && "hover:bg-muted",
                    picked && option.correct && "border-primary bg-primary/10",
                    picked && !option.correct && "border-danger bg-danger/10"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-background",
                      picked && option.correct && "border-primary bg-primary text-primary-foreground",
                      picked && !option.correct && "border-danger bg-danger text-danger-foreground"
                    )}
                  >
                    {picked && option.correct ? <CheckCircle2 className="h-5 w-5" /> : null}
                    {picked && !option.correct ? <XCircle className="h-5 w-5" /> : null}
                    {!picked ? <Lock className="h-4 w-4 text-muted-foreground" /> : null}
                  </span>
                  {option.label}
                </button>
              );
            })}
          </div>

          {selectedOption ? (
            <div
              className={cn(
                "rounded-xl border p-4",
                selectedOption.correct
                  ? "border-primary bg-primary/10"
                  : "border-danger bg-danger/10"
              )}
            >
              <p className="text-sm font-black uppercase">
                {selectedOption.correct ? "Good decision" : "Review this priority"}
              </p>
              <p className="mt-2 text-sm font-semibold leading-6 text-muted-foreground">
                {selectedOption.explanation}
              </p>
              <p className="mt-3 text-xs font-black uppercase text-accent">
                Priority: {activeStep.priority}
              </p>
              <Button className="mt-4 w-full" onClick={onContinue}>
                Continue
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </section>
  );
}

function LibraryView({
  progress,
  category,
  filteredScenarios,
  onCategoryChange,
  onStart,
  onBack
}: {
  progress: StoredProgress;
  category: ScenarioCategory | "All";
  filteredScenarios: TrainingScenario[];
  onCategoryChange: (category: ScenarioCategory | "All") => void;
  onStart: (scenario: TrainingScenario) => void;
  onBack: () => void;
}) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-5">
      <div className="mb-4 flex items-center gap-3">
        <button
          className="flex h-11 w-11 items-center justify-center rounded-xl border bg-card"
          onClick={onBack}
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <div>
          <p className="text-sm font-black uppercase text-accent">Scenario library</p>
          <h1 className="text-2xl font-black">Choose a drill</h1>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3">
        {categories.map((item) => (
          <button
            key={item}
            onClick={() => onCategoryChange(item)}
            className={cn(
              "min-h-11 shrink-0 rounded-xl border px-4 text-sm font-black",
              category === item ? "bg-primary text-primary-foreground" : "bg-card"
            )}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {filteredScenarios.map((scenario) => {
          const completed = progress.completedScenarioIds.includes(scenario.id);

          return (
            <button
              key={scenario.id}
              className="rounded-2xl border bg-card p-4 text-left shadow-sm"
              onClick={() => onStart(scenario)}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase text-accent">
                    {scenario.category} · {scenario.minutes} min
                  </p>
                  <h2 className="mt-1 text-xl font-black">{scenario.title}</h2>
                </div>
                <span
                  className={cn(
                    "rounded-xl px-3 py-1 text-xs font-black uppercase",
                    completed
                      ? "bg-primary text-primary-foreground"
                      : "border bg-background text-muted-foreground"
                  )}
                >
                  {completed ? "Done" : scenario.difficulty}
                </span>
              </div>
              <p className="mt-3 text-sm font-semibold leading-6 text-muted-foreground">
                {scenario.objective}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function ResultView({
  result,
  streak,
  onDaily,
  onDiagnosis,
  onLibrary,
  onHome
}: {
  result: { title: string; mode: "Scenario" | "Daily Dx"; correct: number; total: number; xp: number };
  streak: number;
  onDaily: () => void;
  onDiagnosis: () => void;
  onLibrary: () => void;
  onHome: () => void;
}) {
  const percent = Math.round((result.correct / result.total) * 100);

  return (
    <section className="mx-auto max-w-3xl px-4 py-5">
      <div className="rounded-2xl border bg-card p-5 text-center shadow-field">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
          <Star className="h-10 w-10" aria-hidden="true" />
        </div>
        <p className="mt-5 text-sm font-black uppercase text-accent">{result.mode} complete</p>
        <h1 className="mt-2 text-3xl font-black">{result.title}</h1>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <ScoreTile label="Score" value={`${percent}%`} />
          <ScoreTile label="XP" value={`+${result.xp}`} />
          <ScoreTile label="Streak" value={`${streak}`} />
        </div>

        <p className="mt-5 text-sm font-semibold leading-6 text-muted-foreground">
          {result.correct} of {result.total} decisions matched the scenario priority.
          Keep repeating short drills until the order feels automatic.
        </p>

        <div className="mt-5 grid gap-3">
          <Button variant="accent" onClick={onDaily}>
            Repeat daily scenario
          </Button>
          <Button variant="quiet" onClick={onDiagnosis}>
            Try Daily Dx
          </Button>
          <Button variant="quiet" onClick={onLibrary}>
            Browse library
          </Button>
          <Button variant="ghost" onClick={onHome}>
            Back to home
          </Button>
        </div>
      </div>
    </section>
  );
}

function ScoreTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-background p-3">
      <p className="text-xs font-black uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-black">{value}</p>
    </div>
  );
}

function StatPill({
  icon: Icon,
  label,
  tone
}: {
  icon: typeof Flame;
  label: string;
  tone: "green" | "orange";
}) {
  return (
    <span
      className={cn(
        "flex min-h-10 items-center gap-1.5 rounded-xl border px-3 text-sm font-black",
        tone === "orange" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"
      )}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {label}
    </span>
  );
}

function QuickCard({
  icon: Icon,
  title,
  body
}: {
  icon: typeof Flame;
  title: string;
  body: string;
}) {
  return (
    <div className="flex gap-3 rounded-2xl border bg-card p-4 shadow-sm">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span>
        <span className="block text-base font-black">{title}</span>
        <span className="mt-1 block text-sm font-semibold leading-6 text-muted-foreground">
          {body}
        </span>
      </span>
    </div>
  );
}
