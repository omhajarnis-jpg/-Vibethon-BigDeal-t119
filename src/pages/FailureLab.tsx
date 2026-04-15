import { useState } from "react";
import { AlertTriangle, Wrench, RotateCcw, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import CharacterFeedback from "@/components/CharacterFeedback";
import nobitaImg from "@/assets/nobita.png";
import dekisugiImg from "@/assets/dekisugi.png";

const actions = [
  { label: "Add more spam data", effect: 25, correct: true, feedback: "Balancing the dataset improved model performance significantly! The model can finally tell them apart." },
  { label: "Normalize data", effect: 8, correct: false, feedback: "Normalizing helps, but doesn't solve the core imbalance issue. Keep looking!" },
  { label: "Remove features", effect: -5, correct: false, feedback: "Removing features without analysis hurt performance. We lost valuable signals!" },
];

const FailureLab = () => {
  const [accuracy, setAccuracy] = useState(52);
  const [appliedActions, setAppliedActions] = useState<number[]>([]);
  const [lastFeedback, setLastFeedback] = useState("");

  const isFixed = accuracy >= 85;

  const handleAction = (index: number) => {
    if (appliedActions.includes(index)) return;
    const action = actions[index];
    setAccuracy((a) => Math.min(100, a + action.effect));
    setAppliedActions((prev) => [...prev, index]);
    setLastFeedback(action.feedback);
  };

  const reset = () => {
    setAccuracy(52);
    setAppliedActions([]);
    setLastFeedback("");
  };

  return (
    <div className="min-h-screen py-10 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-destructive/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <h1 className="font-heading text-4xl mb-3 font-black text-center text-primary drop-shadow-sm">
          <AlertTriangle className="inline mr-3 -translate-y-1 text-destructive" size={40} />
          Failure Lab
        </h1>
        <p className="text-center text-primary/70 mb-10 font-bold text-lg">Fix a failing AI model and save the day!</p>

        <div className="flex justify-center mb-10">
          <CharacterFeedback 
            character={isFixed ? "dekisugi" : "nobita"}
            message={isFixed 
              ? "Amazing! You fixed the model! You're a real AI engineer! 🎉" 
              : "Oh no! The model is failing its tests. We need to apply fixes to improve its accuracy!"
            }
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Model info */}
          <motion.div 
            className="bg-white rounded-3xl border-4 border-primary/10 p-8 shadow-xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="font-heading text-2xl font-black mb-6 text-foreground flex items-center gap-2">
              📊 Model Status
            </h2>
            <div className="space-y-4">
              <div className="bg-[#E6F7FF] p-4 rounded-2xl border-2 border-primary/20 flex justify-between items-center text-sm font-bold">
                <span className="text-muted-foreground uppercase tracking-wider text-xs">Model Name</span>
                <span className="text-primary font-black">Spam Detection Model</span>
              </div>
              
              <div className="bg-destructive/10 p-4 rounded-2xl border-2 border-destructive/20 flex justify-between items-center text-sm font-bold">
                <span className="text-destructive/70 uppercase tracking-wider text-xs">Core Problem</span>
                <span className="text-destructive font-black flex items-center gap-1.5"><AlertTriangle size={16} /> Dataset Imbalance</span>
              </div>
              
              <div className="bg-gray-50 p-5 rounded-2xl border-2 border-primary/10 mt-6">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-muted-foreground uppercase tracking-wider text-xs font-bold">Accuracy</span>
                  <span className={`text-3xl font-black ${isFixed ? "text-success" : "text-destructive"}`}>{accuracy}%</span>
                </div>
                <div className="w-full h-6 bg-white rounded-full overflow-hidden border-2 border-primary/10 shadow-inner">
                  <motion.div
                    className={`h-full rounded-full ${isFixed ? "bg-success" : accuracy > 65 ? "bg-secondary" : "bg-destructive"}`}
                    initial={{ width: "52%" }}
                    animate={{ width: `${accuracy}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>

            {/* Character feedback specific to accuracy */}
            <div className="mt-6 flex items-center gap-4 bg-[#FFF9E6] p-4 rounded-2xl border-2 border-secondary/30">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-2xl bg-white border-2 ${isFixed ? "border-success shadow-[0_0_15px_rgba(76,175,80,0.5)]" : "border-destructive animate-pulse"}`}>
                {isFixed ? "✨" : "⚠️"}
              </div>
              <span className={`text-base font-black ${isFixed ? "text-success" : "text-destructive"}`}>
                {isFixed ? "Model is performing great and ready for production!" : "Model needs critical help before deployment!"}
              </span>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div 
            className="bg-white rounded-3xl border-4 border-primary/10 p-8 shadow-xl flex flex-col"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="font-heading text-2xl font-black mb-6 flex items-center gap-2 text-foreground">
              <Wrench size={24} className="text-primary" /> Fix Actions
            </h2>
            <div className="space-y-4 flex-1">
              {actions.map((action, i) => {
                const applied = appliedActions.includes(i);
                return (
                  <button
                    key={i}
                    onClick={() => handleAction(i)}
                    disabled={applied || isFixed}
                    className={`w-full text-left px-6 py-4 rounded-2xl border-4 font-bold text-base transition-all flex items-center justify-between ${
                      applied
                        ? "border-primary/20 bg-primary/5 text-primary/50 cursor-not-allowed"
                        : isFixed 
                          ? "border-border bg-gray-50 opacity-50 cursor-not-allowed"
                          : "border-primary/20 bg-white hover:border-primary/60 hover:-translate-y-1 hover:shadow-md text-primary"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${applied ? 'bg-primary/10' : 'bg-[#E6F7FF]'}`}>
                        {applied ? <Wrench size={18} /> : <TrendingUp size={18} className="text-primary" />}
                      </div>
                      {action.label}
                    </span>
                    {applied && <span className="text-xs font-black bg-primary/10 px-3 py-1 rounded-full">Applied</span>}
                  </button>
                );
              })}
            </div>

            {lastFeedback && (
              <motion.div
                className="mt-6 p-5 rounded-2xl bg-[#E6F7FF] border-2 border-primary/20 flex gap-3 items-start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="text-xl mt-1">💡</span>
                <p className="text-sm font-bold text-primary leading-relaxed">{lastFeedback}</p>
              </motion.div>
            )}

            <div className="mt-8 pt-6 border-t-2 border-primary/10 text-center">
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white transition-all shadow-sm outline outline-2 outline-offset-2 outline-transparent hover:outline-primary/50"
              >
                <RotateCcw size={16} /> Reset Simulation Environment
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FailureLab;
