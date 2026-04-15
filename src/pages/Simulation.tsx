import { useState } from "react";
import { FlaskConical, TrendingUp, Database, Trash2, CheckCircle2, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MentorBubble from "@/components/MentorBubble";
import { useProgress } from "@/hooks/use-progress";

const Simulation = () => {
  const [accuracy, setAccuracy] = useState(62);
  const [actions, setActions] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [completed, setCompleted] = useState(false);
  const { update, progress } = useProgress();

  const handleAction = (action: string) => {
    if (actions.includes(action)) return;

    const newActions = [...actions, action];
    setActions(newActions);

    if (action === "add-data") {
      setAccuracy((a) => Math.min(a + 18, 95));
      setMessage("✅ Adding more labeled data improved the model! Accuracy increased.");
      setMessageType("success");
    } else if (action === "normalize") {
      setAccuracy((a) => Math.min(a + 5, 95));
      setMessage("📊 Normalizing data improved consistency slightly.");
      setMessageType("success");
    } else if (action === "remove-features") {
      setAccuracy((a) => Math.max(a - 8, 40));
      setMessage("⚠️ Removing features reduced available information. Accuracy dropped.");
      setMessageType("error");
    }

    // Check if "add more data" has been selected (the correct main action)
    if (action === "add-data" && !completed) {
      setCompleted(true);
      update({ simulationCompleted: true });
    }
  };

  const reset = () => {
    setAccuracy(62);
    setActions([]);
    setMessage("");
    setMessageType("");
    setCompleted(false);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <h1 className="font-heading text-3xl font-black text-center mb-2">
          <FlaskConical className="inline mr-2 text-primary" size={28} />
          Real-World Simulation
        </h1>
        <p className="text-center text-muted-foreground mb-6 font-semibold">
          Improve a Spam Detection Model
        </p>

        <MentorBubble
          message={completed
            ? "Great work! Adding more data is usually the best first step to improve accuracy! 🎉"
            : "Your spam detection model has low accuracy. Choose actions to improve it!"
          }
          className="mb-6"
        />

        {/* Problem description */}
        <motion.div
          className="bg-card rounded-2xl border border-border p-6 shadow-sm mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="font-heading text-lg font-bold mb-3">📧 Spam Detection Problem</h2>
          <div className="space-y-3 text-sm">
            <div className="bg-muted rounded-xl p-4">
              <h3 className="font-bold text-primary mb-1">Dataset</h3>
              <p className="text-muted-foreground">500 emails labeled as "spam" or "not spam". Features include: sender, subject keywords, body length, link count, and time sent.</p>
            </div>
            <div className="bg-muted rounded-xl p-4">
              <h3 className="font-bold text-primary mb-1">Problem</h3>
              <p className="text-muted-foreground">The current model misclassifies many legitimate emails as spam, and some spam emails pass through. The accuracy is below acceptable levels.</p>
            </div>
          </div>
        </motion.div>

        {/* Accuracy meter */}
        <motion.div
          className="bg-card rounded-2xl border border-border p-6 shadow-sm mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading text-lg font-bold">Model Accuracy</h2>
            <span className={`text-2xl font-black ${accuracy >= 80 ? "text-green-500" : accuracy >= 65 ? "text-yellow-500" : "text-accent"}`}>
              {accuracy}%
            </span>
          </div>
          <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full transition-colors ${accuracy >= 80 ? "bg-green-500" : accuracy >= 65 ? "bg-yellow-500" : "bg-accent"}`}
              animate={{ width: `${accuracy}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1 font-semibold">
            <span>Poor (40%)</span>
            <span>Good (80%)</span>
            <span>Excellent (95%)</span>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          className="bg-card rounded-2xl border border-border p-6 shadow-sm mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-heading text-lg font-bold mb-4">Choose Actions to Improve</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            <button
              onClick={() => handleAction("add-data")}
              disabled={actions.includes("add-data")}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 font-bold text-sm transition-all ${
                actions.includes("add-data")
                  ? "border-green-500 bg-green-500/10 opacity-70"
                  : "border-border bg-muted hover:border-primary hover:bg-doraemon-light-blue hover:-translate-y-0.5"
              }`}
            >
              <Database size={24} className={actions.includes("add-data") ? "text-green-500" : "text-primary"} />
              <span>Add More Data</span>
              {actions.includes("add-data") && <CheckCircle2 size={14} className="text-green-500" />}
            </button>
            <button
              onClick={() => handleAction("normalize")}
              disabled={actions.includes("normalize")}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 font-bold text-sm transition-all ${
                actions.includes("normalize")
                  ? "border-yellow-500 bg-yellow-500/10 opacity-70"
                  : "border-border bg-muted hover:border-primary hover:bg-doraemon-light-blue hover:-translate-y-0.5"
              }`}
            >
              <TrendingUp size={24} className={actions.includes("normalize") ? "text-yellow-500" : "text-primary"} />
              <span>Normalize Data</span>
              {actions.includes("normalize") && <CheckCircle2 size={14} className="text-yellow-500" />}
            </button>
            <button
              onClick={() => handleAction("remove-features")}
              disabled={actions.includes("remove-features")}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 font-bold text-sm transition-all ${
                actions.includes("remove-features")
                  ? "border-accent bg-accent/10 opacity-70"
                  : "border-border bg-muted hover:border-primary hover:bg-doraemon-light-blue hover:-translate-y-0.5"
              }`}
            >
              <Trash2 size={24} className={actions.includes("remove-features") ? "text-accent" : "text-primary"} />
              <span>Remove Features</span>
              {actions.includes("remove-features") && <CheckCircle2 size={14} className="text-accent" />}
            </button>
          </div>
        </motion.div>

        {/* Feedback message */}
        <AnimatePresence>
          {message && (
            <motion.div
              className={`mb-6 p-4 rounded-xl border-2 text-sm font-bold ${
                messageType === "success"
                  ? "bg-green-500/10 border-green-500/30 text-green-600"
                  : "bg-accent/10 border-accent/30 text-accent"
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action log */}
        {actions.length > 0 && (
          <div className="bg-doraemon-light-blue rounded-xl px-4 py-3 mb-6 text-xs font-mono space-y-1">
            {actions.map((a, i) => (
              <div key={i} className="text-primary font-semibold">
                Step {i + 1}: {a === "add-data" ? "Added more labeled data" : a === "normalize" ? "Normalized features" : "Removed features"}
              </div>
            ))}
          </div>
        )}

        {/* Completed */}
        {completed && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className="text-green-500 font-bold text-sm mb-3">✅ Simulation completed! Progress saved to Dashboard.</p>
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary font-semibold transition-colors"
            >
              <RotateCcw size={14} /> Try Again
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Simulation;
