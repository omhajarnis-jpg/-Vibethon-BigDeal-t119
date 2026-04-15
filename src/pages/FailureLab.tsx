import { useState } from "react";
import { AlertTriangle, Wrench, RotateCcw, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import nobitaImg from "@/assets/nobita.png";
import dekisugiImg from "@/assets/dekisugi.png";
import MentorBubble from "@/components/MentorBubble";

const actions = [
  { label: "Add more spam data", effect: 25, correct: true, feedback: "Balancing the dataset improved model performance significantly!" },
  { label: "Normalize data", effect: 8, correct: false, feedback: "Normalizing helps, but doesn't solve the core imbalance issue." },
  { label: "Remove features", effect: -5, correct: false, feedback: "Removing features without analysis can hurt performance." },
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
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <h1 className="font-heading text-3xl font-black text-center mb-2">
          <AlertTriangle className="inline mr-2 text-accent" size={28} />
          Failure Lab
        </h1>
        <p className="text-center text-muted-foreground mb-8 font-semibold">Fix a failing AI model!</p>

        <MentorBubble
          message={isFixed ? "Amazing! You fixed the model! You're a real AI engineer! 🎉" : "Your model is failing. Let's fix it together."}
          className="mb-6"
        />

        <div className="grid md:grid-cols-2 gap-6">
          {/* Model info */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <h2 className="font-heading text-lg font-bold mb-4">Model Status</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-muted-foreground">Model Name</span>
                <span>Spam Detection Model</span>
              </div>
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-muted-foreground">Problem</span>
                <span className="text-accent">Dataset Imbalance</span>
              </div>
              <div>
                <div className="flex justify-between text-sm font-semibold mb-1">
                  <span className="text-muted-foreground">Accuracy</span>
                  <span className={isFixed ? "text-success" : "text-accent"}>{accuracy}%</span>
                </div>
                <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${isFixed ? "bg-success" : accuracy > 65 ? "bg-doraemon-yellow" : "bg-accent"}`}
                    initial={{ width: "52%" }}
                    animate={{ width: `${accuracy}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>

            {/* Character feedback */}
            <div className="mt-5 flex items-center gap-3">
              <img
                src={isFixed ? dekisugiImg : nobitaImg}
                alt={isFixed ? "Success" : "Failing"}
                className="w-16 h-16 object-contain"
              />
              <span className={`text-sm font-bold ${isFixed ? "text-success" : "text-accent"}`}>
                {isFixed ? "Model is performing great!" : "Model needs help!"}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <h2 className="font-heading text-lg font-bold mb-4 flex items-center gap-2">
              <Wrench size={18} className="text-primary" /> Fix Actions
            </h2>
            <div className="space-y-3">
              {actions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleAction(i)}
                  disabled={appliedActions.includes(i)}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                    appliedActions.includes(i)
                      ? "border-border bg-muted opacity-50 cursor-not-allowed"
                      : "border-primary/30 bg-doraemon-light-blue hover:border-primary hover:shadow-sm"
                  }`}
                >
                  <TrendingUp size={14} className="inline mr-2" />
                  {action.label}
                  {appliedActions.includes(i) && <span className="ml-2 text-xs">✓ Applied</span>}
                </button>
              ))}
            </div>

            {lastFeedback && (
              <motion.p
                className="mt-4 text-sm text-muted-foreground bg-muted rounded-xl px-4 py-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                💡 {lastFeedback}
              </motion.p>
            )}

            <button
              onClick={reset}
              className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
            >
              <RotateCcw size={14} /> Reset Simulation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FailureLab;
