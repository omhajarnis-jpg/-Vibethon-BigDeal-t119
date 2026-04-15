import { useState } from "react";
import { FlaskConical, TrendingUp, Database, Trash2, CheckCircle2, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CharacterFeedback from "@/components/CharacterFeedback";
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
    <div className="min-h-screen py-10 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-white/50 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <h1 className="font-heading text-4xl font-black text-center mb-3 text-primary drop-shadow-sm">
          <FlaskConical className="inline mr-3 -translate-y-1" size={40} />
          Real-World Simulation
        </h1>
        <p className="text-center text-primary/70 mb-10 font-bold text-lg">
          Improve a Spam Detection Model in the Lab!
        </p>

        <div className="mb-10 flex justify-center">
          <CharacterFeedback
            character={completed ? "dekisugi" : "doraemon"}
            message={completed
              ? "Great work! Adding more data is usually the best first step to improve accuracy! 🎉"
              : "Your spam detection model has low accuracy. Choose actions to improve it like a true scientist!"
            }
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Problem description & Accuracy */}
          <div className="space-y-8">
            <motion.div
              className="bg-white rounded-3xl border-4 border-primary/10 p-8 shadow-xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="font-heading text-2xl font-black mb-6 text-foreground">📧 The Problem</h2>
              <div className="space-y-4 text-sm">
                <div className="bg-[#E6F7FF] rounded-2xl p-5 border-2 border-primary/20">
                  <h3 className="font-black text-primary mb-2 uppercase tracking-wider text-xs">Dataset</h3>
                  <p className="text-foreground font-semibold leading-relaxed">500 emails labeled as "spam" or "not spam". Features include: sender, subject keywords, body length, link count, and time sent.</p>
                </div>
                <div className="bg-destructive/10 rounded-2xl p-5 border-2 border-destructive/20">
                  <h3 className="font-black text-destructive mb-2 uppercase tracking-wider text-xs">Issue</h3>
                  <p className="text-foreground font-semibold leading-relaxed">The current model misclassifies many legitimate emails as spam, and some spam emails pass through. The accuracy is below acceptable levels.</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-3xl border-4 border-primary/10 p-8 shadow-xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-2xl font-black">Model Accuracy</h2>
                <span className={`text-4xl font-black ${accuracy >= 80 ? "text-success" : accuracy >= 65 ? "text-secondary" : "text-destructive"}`}>
                  {accuracy}%
                </span>
              </div>
              <div className="w-full h-6 bg-muted rounded-full overflow-hidden border-2 border-primary/10 shadow-inner mb-2">
                <motion.div
                  className={`h-full rounded-full transition-colors ${accuracy >= 80 ? "bg-success" : accuracy >= 65 ? "bg-secondary" : "bg-destructive"}`}
                  animate={{ width: `${accuracy}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground font-black uppercase tracking-widest px-1">
                <span>Poor</span>
                <span>Good</span>
                <span>Excellent</span>
              </div>
            </motion.div>
          </div>

          {/* Action buttons */}
          <div className="space-y-8">
            <motion.div
              className="bg-white rounded-3xl border-4 border-primary/10 p-8 shadow-xl h-full flex flex-col"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="font-heading text-2xl font-black mb-6">Choose Actions</h2>
              <div className="space-y-4 flex-1">
                {/* Add Data */}
                <button
                  onClick={() => handleAction("add-data")}
                  disabled={actions.includes("add-data")}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border-4 font-bold text-base transition-all ${
                    actions.includes("add-data")
                      ? "border-success bg-success/10 text-success-foreground opacity-70"
                      : "border-primary/20 bg-white hover:border-success hover:bg-success/5 hover:-translate-y-1 hover:shadow-md text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Database size={24} className={actions.includes("add-data") ? "text-success" : "text-primary"} />
                    Add More Data
                  </span>
                  {actions.includes("add-data") && <CheckCircle2 size={20} className="text-success" />}
                </button>
                {/* Normalize */}
                <button
                  onClick={() => handleAction("normalize")}
                  disabled={actions.includes("normalize")}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border-4 font-bold text-base transition-all ${
                    actions.includes("normalize")
                      ? "border-secondary bg-[#FFF9E6] text-secondary-foreground opacity-70"
                      : "border-primary/20 bg-white hover:border-secondary hover:bg-[#FFF9E6] hover:-translate-y-1 hover:shadow-md text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <TrendingUp size={24} className={actions.includes("normalize") ? "text-secondary" : "text-primary"} />
                    Normalize Data
                  </span>
                  {actions.includes("normalize") && <CheckCircle2 size={20} className="text-secondary" />}
                </button>
                {/* Remove Features */}
                <button
                  onClick={() => handleAction("remove-features")}
                  disabled={actions.includes("remove-features")}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border-4 font-bold text-base transition-all ${
                    actions.includes("remove-features")
                      ? "border-destructive bg-destructive/10 text-destructive-foreground opacity-70"
                      : "border-primary/20 bg-white hover:border-destructive hover:bg-destructive/5 hover:-translate-y-1 hover:shadow-md text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Trash2 size={24} className={actions.includes("remove-features") ? "text-destructive" : "text-primary"} />
                    Remove Features
                  </span>
                  {actions.includes("remove-features") && <CheckCircle2 size={20} className="text-destructive" />}
                </button>
              </div>

              {/* Feedback messages */}
              <AnimatePresence>
                {message && (
                  <motion.div
                    className={`mt-6 p-5 rounded-2xl border-2 text-sm font-bold ${
                      messageType === "success"
                        ? "bg-success/10 border-success/30 text-success"
                        : "bg-destructive/10 border-destructive/30 text-destructive"
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {message}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Reset inside actions panel bottom */}
              {completed && (
                 <motion.div className="mt-8 text-center pt-6 border-t-2 border-primary/10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                     <p className="text-success font-black text-sm mb-4">✅ Simulation completed! Progress saved.</p>
                     <button onClick={reset} className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-black hover:shadow-lg transition-all outline outline-2 outline-offset-2 outline-transparent hover:outline-primary/50">
                       <RotateCcw size={16} /> Run Again
                     </button>
                 </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulation;
