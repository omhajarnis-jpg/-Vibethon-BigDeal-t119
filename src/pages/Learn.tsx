import { useState } from "react";
import { BookOpen, ChevronRight, Brain, GitBranch, TrendingUp, Layers, CheckCircle2, Lock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import doraemonImg from "@/assets/doraemon.png";
import MentorBubble from "@/components/MentorBubble";
import { useProgress } from "@/hooks/use-progress";

interface Module {
  id: number;
  title: string;
  icon: typeof Brain;
  concept: string;
  example: string;
  diagram: string;
  level: "Beginner" | "Intermediate" | "Advanced";
}

const modules: Module[] = [
  {
    id: 1, title: "What is Machine Learning?", icon: Brain, level: "Beginner",
    concept: "Machine Learning is a subset of AI that enables computers to learn from data without being explicitly programmed. Instead of writing rules, we feed data to algorithms that find patterns.",
    example: "Email spam filters learn from millions of emails labeled as 'spam' or 'not spam' to automatically classify new emails.",
    diagram: "Data → Algorithm → Model → Prediction",
  },
  {
    id: 2, title: "Classification", icon: Layers, level: "Beginner",
    concept: "Classification is a supervised learning technique where the model learns to assign input data into predefined categories or classes based on labeled training examples.",
    example: "A doctor's AI assistant classifies X-ray images as 'healthy' or 'pneumonia' based on thousands of previously diagnosed images.",
    diagram: "Input Features → Classifier → Class Label (Cat / Dog)",
  },
  {
    id: 3, title: "Regression", icon: TrendingUp, level: "Intermediate",
    concept: "Regression predicts a continuous numerical value. Unlike classification which outputs categories, regression outputs numbers like price, temperature, or score.",
    example: "Predicting house prices based on features like area, number of rooms, and location.",
    diagram: "Features (size, rooms) → Model → Price ($250,000)",
  },
  {
    id: 4, title: "Decision Trees", icon: GitBranch, level: "Intermediate",
    concept: "A Decision Tree splits data into branches based on feature values, creating a tree-like structure of decisions. Each internal node tests a feature, each branch is an outcome, and each leaf is a prediction.",
    example: "Should I play tennis today? Check: Is it sunny? → Is humidity high? → No, don't play.",
    diagram: "Root → Branch (Yes/No) → Branch → Leaf (Decision)",
  },
  {
    id: 5, title: "Neural Networks", icon: Brain, level: "Advanced",
    concept: "Neural networks are computing systems inspired by the human brain. They consist of layers of interconnected nodes (neurons) that process information and learn complex patterns from data.",
    example: "Image recognition systems like Google Photos use deep neural networks to identify faces, objects, and scenes in your photos.",
    diagram: "Input Layer → Hidden Layers → Output Layer → Prediction",
  },
  {
    id: 6, title: "Model Evaluation", icon: Sparkles, level: "Advanced",
    concept: "Model evaluation measures how well a trained model performs. Key metrics include accuracy, precision, recall, and F1-score. Techniques like cross-validation help ensure the model generalizes well.",
    example: "A medical AI model with 95% accuracy but low recall might miss critical cancer diagnoses — recall matters more here.",
    diagram: "Predictions → Confusion Matrix → Accuracy / Precision / Recall",
  },
];

const levels = ["Beginner", "Intermediate", "Advanced"] as const;
const levelColors: Record<string, string> = {
  Beginner: "text-green-500 bg-green-500/10 border-green-500/30",
  Intermediate: "text-yellow-500 bg-yellow-500/10 border-yellow-500/30",
  Advanced: "text-purple-500 bg-purple-500/10 border-purple-500/30",
};

const Learn = () => {
  const [active, setActive] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState<typeof levels[number]>("Beginner");
  const { progress, completeModule } = useProgress();
  const mod = modules[active];

  const getModulesForLevel = (level: string) => modules.filter((m) => m.level === level);

  const isLevelUnlocked = (level: typeof levels[number]) => {
    const idx = levels.indexOf(level);
    if (idx === 0) return true;
    const prevLevel = levels[idx - 1];
    const prevModules = getModulesForLevel(prevLevel);
    return prevModules.every((m) => progress.modulesCompleted.includes(m.id));
  };

  const getLevelProgress = (level: string) => {
    const lvlModules = getModulesForLevel(level);
    const completed = lvlModules.filter((m) => progress.modulesCompleted.includes(m.id)).length;
    return { completed, total: lvlModules.length, pct: Math.round((completed / lvlModules.length) * 100) };
  };

  const handleMarkComplete = () => {
    completeModule(mod.id);
  };

  const handleNextTopic = () => {
    completeModule(mod.id);
    const currentLevelModules = modules.filter((m) => m.level === selectedLevel);
    const currentIdx = currentLevelModules.findIndex((m) => m.id === mod.id);
    if (currentIdx < currentLevelModules.length - 1) {
      const nextMod = currentLevelModules[currentIdx + 1];
      setActive(modules.indexOf(nextMod));
    }
  };

  const isModuleCompleted = progress.modulesCompleted.includes(mod.id);
  const completedCount = progress.modulesCompleted.length;
  const filteredModules = modules.filter((m) => m.level === selectedLevel);
  const currentLevelUnlocked = isLevelUnlocked(selectedLevel);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-10">
        <h1 className="font-heading text-3xl md:text-4xl font-black text-center mb-2">
          <BookOpen className="inline mr-2 text-primary" size={28} />
          Learning Modules
        </h1>
        <p className="text-center text-muted-foreground mb-2 font-semibold">Master AI concepts step by step</p>
        <p className="text-center text-sm text-primary font-bold mb-6">
          {completedCount} / {modules.length} modules completed
        </p>

        {/* Level selector */}
        <div className="flex justify-center gap-3 mb-6 flex-wrap">
          {levels.map((level) => {
            const unlocked = isLevelUnlocked(level);
            const lp = getLevelProgress(level);
            return (
              <button
                key={level}
                onClick={() => {
                  if (unlocked) {
                    setSelectedLevel(level);
                    const first = modules.find((m) => m.level === level);
                    if (first) setActive(modules.indexOf(first));
                  }
                }}
                disabled={!unlocked}
                className={`relative px-5 py-3 rounded-xl border-2 font-bold text-sm transition-all ${
                  selectedLevel === level && unlocked
                    ? levelColors[level] + " shadow-md"
                    : !unlocked
                      ? "border-border bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
                      : "border-border bg-card hover:bg-muted text-muted-foreground"
                }`}
              >
                <div className="flex items-center gap-2">
                  {!unlocked && <Lock size={14} />}
                  {level}
                  <span className="text-xs opacity-70">({lp.completed}/{lp.total})</span>
                </div>
                {unlocked && lp.pct > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted rounded-b-xl overflow-hidden">
                    <div
                      className={`h-full rounded-b-xl ${level === "Beginner" ? "bg-green-500" : level === "Intermediate" ? "bg-yellow-500" : "bg-purple-500"}`}
                      style={{ width: `${lp.pct}%` }}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {!currentLevelUnlocked ? (
          <div className="text-center py-16">
            <Lock className="mx-auto text-muted-foreground mb-4" size={48} />
            <h2 className="font-heading text-xl font-bold mb-2">Level Locked</h2>
            <p className="text-muted-foreground text-sm">Complete all modules in the previous level to unlock this one.</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <div className="lg:w-64 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {filteredModules.map((m) => {
                const idx = modules.indexOf(m);
                const done = progress.modulesCompleted.includes(m.id);
                return (
                  <button
                    key={m.id}
                    onClick={() => setActive(idx)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                      active === idx
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-card border border-border text-muted-foreground hover:bg-doraemon-light-blue"
                    }`}
                  >
                    {done ? <CheckCircle2 size={16} className={active === idx ? "text-primary-foreground" : "text-green-500"} /> : <m.icon size={16} />}
                    {m.title}
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <motion.div
              key={active}
              className="flex-1 bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h2 className="font-heading text-2xl font-bold flex items-center gap-2">
                  <mod.icon className="text-primary" size={24} />
                  {mod.title}
                </h2>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg border ${levelColors[mod.level]}`}>{mod.level}</span>
                  {isModuleCompleted && (
                    <span className="flex items-center gap-1 text-green-500 text-sm font-bold">
                      <CheckCircle2 size={16} /> Done
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-primary uppercase tracking-wide mb-1">Concept</h3>
                  <p className="text-foreground leading-relaxed">{mod.concept}</p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-doraemon-yellow uppercase tracking-wide mb-1">Real-World Example</h3>
                  <p className="text-foreground leading-relaxed">{mod.example}</p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-success uppercase tracking-wide mb-1">Visual Diagram</h3>
                  <div className="bg-doraemon-light-blue rounded-xl px-5 py-4 font-mono text-sm text-primary font-bold flex items-center gap-2 flex-wrap">
                    {mod.diagram.split("→").map((part, i, arr) => (
                      <span key={i} className="flex items-center gap-2">
                        <span className="bg-card rounded-lg px-3 py-1.5 border border-primary/20">{part.trim()}</span>
                        {i < arr.length - 1 && <ChevronRight size={16} className="text-primary" />}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                {!isModuleCompleted && (
                  <button
                    onClick={handleMarkComplete}
                    className="inline-flex items-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-green-600 hover:shadow-lg transition-all"
                  >
                    <CheckCircle2 size={16} /> Mark as Complete
                  </button>
                )}
                {filteredModules.indexOf(mod) < filteredModules.length - 1 && (
                  <button
                    onClick={handleNextTopic}
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold hover:shadow-lg transition-all"
                  >
                    Next Topic <ChevronRight size={16} />
                  </button>
                )}
              </div>

              {/* Mentor */}
              <div className="mt-6 flex items-end gap-3">
                <img src={doraemonImg} alt="Mentor" className="w-14 h-14 object-contain animate-bounce-gentle" />
                <div className="bg-doraemon-light-blue rounded-2xl rounded-bl-none px-4 py-2 text-sm font-semibold border border-primary/20">
                  {isModuleCompleted
                    ? `Great! You've completed ${mod.title.toLowerCase()}! Move to the next one! 🎉`
                    : `Great topic! Understanding ${mod.title.toLowerCase()} is key to your AI journey! 💡`}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Learn;
