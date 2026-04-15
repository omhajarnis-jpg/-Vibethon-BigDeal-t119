import { useState } from "react";
import { Gamepad2, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import doraemonImg from "@/assets/doraemon.png";
import MentorBubble from "@/components/MentorBubble";

interface TreeNode {
  question: string;
  hint: string;
  yes: TreeNode | string;
  no: TreeNode | string;
}

const tree: TreeNode = {
  question: "Is the fruit red?",
  hint: "Think about the color of the fruit you're classifying!",
  yes: {
    question: "Is it sweet?",
    hint: "Sweetness is an important feature for classification!",
    yes: "🍎 It's an Apple!",
    no: "🍒 It's a Cherry!",
  },
  no: {
    question: "Is it yellow?",
    hint: "Color helps narrow down the prediction.",
    yes: "🍌 It's a Banana!",
    no: "🫐 It's a Blueberry!",
  },
};

const MiniGame = () => {
  const [node, setNode] = useState<TreeNode | string>(tree);
  const [path, setPath] = useState<string[]>([]);

  const isResult = typeof node === "string";
  const current = node as TreeNode;

  const handleChoice = (choice: "yes" | "no") => {
    const next = choice === "yes" ? current.yes : current.no;
    setPath((p) => [...p, `${current.question} → ${choice.toUpperCase()}`]);
    setNode(next);
  };

  const reset = () => {
    setNode(tree);
    setPath([]);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <h1 className="font-heading text-3xl font-black text-center mb-2">
          <Gamepad2 className="inline mr-2 text-primary" size={28} />
          Decision Tree Game
        </h1>
        <p className="text-center text-muted-foreground mb-8 font-semibold">
          See how AI makes decisions step by step!
        </p>

        <MentorBubble
          message={isResult ? "Great job! You followed the decision tree! 🎉" : (current as TreeNode).hint}
          className="mb-6"
        />

        {/* Path */}
        {path.length > 0 && (
          <div className="bg-doraemon-light-blue rounded-xl px-4 py-3 mb-5 text-xs font-mono space-y-1">
            {path.map((p, i) => (
              <div key={i} className="text-primary font-semibold">Step {i + 1}: {p}</div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {isResult ? (
            <motion.div
              key="result"
              className="bg-card rounded-2xl border border-border p-8 text-center shadow-sm"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-6xl mb-4">{(node as string).split(" ")[0]}</div>
              <h2 className="font-heading text-2xl font-bold mb-2">{node as string}</h2>
              <p className="text-muted-foreground text-sm mb-6">The decision tree predicted the fruit based on your answers!</p>
              <button onClick={reset} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold hover:shadow-lg transition-all">
                <RotateCcw size={16} /> Play Again
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={current.question}
              className="bg-card rounded-2xl border border-border p-8 text-center shadow-sm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <img src={doraemonImg} alt="Doraemon" className="w-20 h-20 mx-auto object-contain mb-4 animate-bounce-gentle" />
              <h2 className="font-heading text-xl font-bold mb-6">{current.question}</h2>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => handleChoice("yes")}
                  className="bg-success text-success-foreground px-8 py-3 rounded-xl font-bold text-lg hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  Yes
                </button>
                <button
                  onClick={() => handleChoice("no")}
                  className="bg-accent text-accent-foreground px-8 py-3 rounded-xl font-bold text-lg hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  No
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MiniGame;
