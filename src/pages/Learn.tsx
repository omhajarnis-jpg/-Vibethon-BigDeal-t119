import { useState } from "react";
import { BookOpen, ChevronRight, Brain, GitBranch, TrendingUp, Layers, CheckCircle2, Lock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import CharacterFeedback from "@/components/CharacterFeedback";
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
  Beginner: "text-green-500 bg-green-500/10 border-green-500/30 shadow-green-500/20",
  Intermediate: "text-doraemon-yellow bg-doraemon-yellow/10 border-doraemon-yellow/30 shadow-doraemon-yellow/20",
  Advanced: "text-purple-500 bg-purple-500/10 border-purple-500/30 shadow-purple-500/20",
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
    // User progress stores array of IDs of completed modules.
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
    <div className="min-h-screen py-10 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-white/40 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-40 right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 relative z-10">
        <h1 className="font-heading text-4xl md:text-5xl font-black text-center mb-3 text-primary drop-shadow-sm">
          <BookOpen className="inline mr-3 -translate-y-1" size={40} />
          Learning Modules
        </h1>
        <p className="text-center text-primary/70 mb-4 font-bold text-lg">Master AI concepts step by step with Doraemon!</p>
        
        {/* Playful Progress Indication */}
        <div className="max-w-xs mx-auto bg-white rounded-full p-1 border-2 border-primary/20 shadow-sm flex items-center mb-8 relative overflow-hidden">
          <div 
            className="absolute left-0 top-0 bottom-0 bg-secondary rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${(completedCount / modules.length) * 100}%` }}
          />
          <div className="relative z-10 flex-1 text-center font-black text-sm text-foreground py-1">
            {completedCount} / {modules.length} Completed
          </div>
        </div>

        {/* Level selector */}
        <div className="flex justify-center gap-3 mb-8 flex-wrap">
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
                className={`relative px-6 py-3.5 rounded-2xl border-4 font-black text-sm transition-all shadow-md transform hover:-translate-y-1 ${
                  selectedLevel === level && unlocked
                    ? levelColors[level]
                    : !unlocked
                      ? "border-primary/10 bg-white/50 text-muted-foreground opacity-70 cursor-not-allowed hover:translate-y-0"
                      : "border-primary/20 bg-white hover:border-primary/40 text-primary/70"
                }`}
              >
                <div className="flex items-center gap-2">
                  {!unlocked && <Lock size={16} className="text-muted-foreground" />}
                  {level}
                  <span className="text-xs bg-white/50 px-2 py-0.5 rounded-full border border-current/10 ml-1">
                    {lp.completed}/{lp.total}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {!currentLevelUnlocked ? (
          <div className="text-center py-20 bg-white rounded-3xl border-4 border-primary/10 shadow-xl max-w-2xl mx-auto">
            <Lock className="mx-auto text-primary/30 mb-6" size={64} />
            <h2 className="font-heading text-2xl font-black mb-3 text-primary">Level Locked!</h2>
            <p className="text-primary/70 font-bold max-w-sm mx-auto">You need to master all the modules in the previous level to unlock this one.</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto">
            {/* Sidebar Modules List */}
            <div className="lg:w-72 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 px-1">
              {filteredModules.map((m) => {
                const idx = modules.indexOf(m);
                const done = progress.modulesCompleted.includes(m.id);
                return (
                  <button
                    key={m.id}
                    onClick={() => setActive(idx)}
                    className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-black whitespace-nowrap transition-all border-2 shadow-sm ${
                      active === idx
                        ? "bg-primary border-primary text-white scale-[1.02] shadow-md"
                        : "bg-white border-primary/10 text-primary/70 hover:border-primary/30 hover:shadow-md"
                    }`}
                  >
                    <div className={`p-1.5 rounded-full ${active === idx ? "bg-white/20" : "bg-primary/5"}`}>
                      {done ? <CheckCircle2 size={16} className={active === idx ? "text-white" : "text-green-500"} /> : <m.icon size={16} />}
                    </div>
                    {m.title}
                  </button>
                );
              })}
            </div>

            {/* Content Area */}
            <motion.div
              key={active}
              className="flex-1 bg-white rounded-3xl border-4 border-primary/10 p-6 md:p-10 shadow-xl relative"
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <h2 className="font-heading text-3xl font-black flex items-center gap-3 text-foreground">
                  <div className={`p-2.5 rounded-2xl ${levelColors[mod.level].split(" ")[1]}`}>
                    <mod.icon className={active ? "text-current" : "text-primary"} size={28} />
                  </div>
                  {mod.title}
                </h2>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-black px-3 py-1.5 rounded-xl border-2 ${levelColors[mod.level].split(" ").slice(0, 3).join(" ")}`}>
                    {mod.level}
                  </span>
                  {isModuleCompleted && (
                    <span className="flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-1.5 rounded-xl border-2 border-green-200 text-sm font-black">
                      <CheckCircle2 size={16} /> Completed
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-[#E6F7FF] rounded-2xl p-6 border-2 border-primary/20 relative">
                  <div className="absolute -top-3 left-6 bg-primary text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    Concept
                  </div>
                  <p className="text-foreground leading-relaxed font-semibold text-lg">{mod.concept}</p>
                </div>
                
                <div className="bg-[#FFF9E6] rounded-2xl p-6 border-2 border-secondary/30 relative">
                  <div className="absolute -top-3 left-6 bg-secondary text-secondary-foreground font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    Real-World Example
                  </div>
                  <p className="text-foreground leading-relaxed font-semibold text-lg">{mod.example}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-black text-success uppercase tracking-widest pl-2 mb-2">Visual Diagram</h3>
                  <div className="bg-green-50 rounded-2xl px-6 py-5 border-2 border-green-200 font-mono text-sm text-green-700 font-bold flex items-center gap-3 flex-wrap">
                    {mod.diagram.split("→").map((part, i, arr) => (
                      <span key={i} className="flex items-center gap-2">
                        <span className="bg-white rounded-xl px-4 py-2 border-2 border-green-300 shadow-sm">{part.trim()}</span>
                        {i < arr.length - 1 && <ChevronRight size={20} className="text-success" />}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-10 flex flex-wrap gap-4 pt-6 border-t-2 border-primary/10">
                {!isModuleCompleted && (
                  <button
                    onClick={handleMarkComplete}
                    className="flex-1 sm:flex-none inline-flex justify-center items-center gap-2 bg-success text-white px-6 py-3.5 rounded-2xl font-black text-lg hover:shadow-lg hover:-translate-y-0.5 transition-all outline outline-2 outline-offset-2 outline-transparent hover:outline-success/50"
                  >
                    <CheckCircle2 size={20} /> Mark as Complete
                  </button>
                )}
                {filteredModules.indexOf(mod) < filteredModules.length - 1 && (
                  <button
                    onClick={handleNextTopic}
                    className="flex-1 sm:flex-none inline-flex justify-center items-center gap-2 bg-primary text-white px-6 py-3.5 rounded-2xl font-black text-lg hover:shadow-lg hover:-translate-y-0.5 transition-all outline outline-2 outline-offset-2 outline-transparent hover:outline-primary/50"
                  >
                    Next Topic <ChevronRight size={20} />
                  </button>
                )}
              </div>

              {/* Doraemon Feedback Area */}
              <div className="mt-8">
                <CharacterFeedback 
                  character="doraemon"
                  message={isModuleCompleted
                    ? `Great job! You've successfully completed ${mod.title}! Move to the next one! 🎉`
                    : `Pay attention! Understanding ${mod.title} is a critical step in your AI journey! 💡`}
                />
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Learn;
