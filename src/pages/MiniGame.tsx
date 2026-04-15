import { useState } from "react";
import { Gamepad2, RotateCcw, TreePine, Grid3X3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import doraemonImg from "@/assets/doraemon.png";
import MentorBubble from "@/components/MentorBubble";
import { useProgress } from "@/hooks/use-progress";

// === GAME SELECTOR ===

type GameId = "decision-tree" | "dt-split" | "classify-sort";

const games = [
  { id: "decision-tree" as GameId, label: "🌳 Fruit Classifier", desc: "Follow the decision tree" },
  { id: "dt-split" as GameId, label: "✂️ Feature Split", desc: "Pick the best feature" },
  { id: "classify-sort" as GameId, label: "📦 Sort & Classify", desc: "Categorize items" },
];

// === GAME 1: Decision Tree (existing) ===
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

function DecisionTreeGame({ onComplete }: { onComplete: () => void }) {
  const [node, setNode] = useState<TreeNode | string>(tree);
  const [path, setPath] = useState<string[]>([]);
  const isResult = typeof node === "string";
  const current = node as TreeNode;

  const handleChoice = (choice: "yes" | "no") => {
    const next = choice === "yes" ? current.yes : current.no;
    setPath((p) => [...p, `${current.question} → ${choice.toUpperCase()}`]);
    setNode(next);
    if (typeof next === "string") onComplete();
  };

  const reset = () => { setNode(tree); setPath([]); };

  return (
    <>
      <MentorBubble message={isResult ? "Great! You followed the decision tree! 🎉" : current.hint} className="mb-6" />
      {path.length > 0 && (
        <div className="bg-doraemon-light-blue rounded-xl px-4 py-3 mb-5 text-xs font-mono space-y-1">
          {path.map((p, i) => <div key={i} className="text-primary font-semibold">Step {i + 1}: {p}</div>)}
        </div>
      )}
      <AnimatePresence mode="wait">
        {isResult ? (
          <motion.div key="result" className="bg-card rounded-2xl border border-border p-8 text-center shadow-sm" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="text-6xl mb-4">{(node as string).split(" ")[0]}</div>
            <h2 className="font-heading text-2xl font-bold mb-2">{node as string}</h2>
            <p className="text-xs text-green-500 font-semibold mb-4">✅ Game progress saved!</p>
            <button onClick={reset} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold hover:shadow-lg transition-all">
              <RotateCcw size={16} /> Play Again
            </button>
          </motion.div>
        ) : (
          <motion.div key={current.question} className="bg-card rounded-2xl border border-border p-8 text-center shadow-sm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <img src={doraemonImg} alt="Doraemon" className="w-20 h-20 mx-auto object-contain mb-4 animate-bounce-gentle" />
            <h2 className="font-heading text-xl font-bold mb-6">{current.question}</h2>
            <div className="flex justify-center gap-4">
              <button onClick={() => handleChoice("yes")} className="bg-success text-success-foreground px-8 py-3 rounded-xl font-bold text-lg hover:shadow-lg hover:-translate-y-0.5 transition-all">Yes</button>
              <button onClick={() => handleChoice("no")} className="bg-accent text-accent-foreground px-8 py-3 rounded-xl font-bold text-lg hover:shadow-lg hover:-translate-y-0.5 transition-all">No</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// === GAME 2: Decision Tree Split ===
interface SplitRound {
  scenario: string;
  data: string;
  options: string[];
  correct: number;
  explanation: string;
}

const splitRounds: SplitRound[] = [
  {
    scenario: "You're building a model to predict if a student passes an exam.",
    data: "Features: Study Hours, Sleep Hours, Shoe Size, Number of Pets",
    options: ["Shoe Size", "Study Hours", "Number of Pets"],
    correct: 1,
    explanation: "Study Hours directly correlates with exam performance — it's the most relevant feature!",
  },
  {
    scenario: "Predicting if an email is spam or not.",
    data: "Features: Sender Name Length, Contains 'FREE', Email Font Color, Has Attachments",
    options: ["Email Font Color", "Sender Name Length", "Contains 'FREE'"],
    correct: 2,
    explanation: "The word 'FREE' is a strong indicator of spam — spam filters commonly use keyword features!",
  },
  {
    scenario: "Classifying animals as cats or dogs from photos.",
    data: "Features: Ear Shape, Pixel #42 Value, Nose Shape, Photo File Size",
    options: ["Photo File Size", "Pixel #42 Value", "Ear Shape"],
    correct: 2,
    explanation: "Ear Shape is a meaningful visual feature that distinguishes cats from dogs!",
  },
];

function DTSplitGame({ onComplete }: { onComplete: () => void }) {
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = splitRounds[round];

  const handleSubmit = () => {
    if (selected === null) return;
    setAnswered(true);
    if (selected === current.correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (round + 1 >= splitRounds.length) {
      setFinished(true);
      onComplete();
    } else {
      setRound((r) => r + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const reset = () => { setRound(0); setSelected(null); setAnswered(false); setScore(0); setFinished(false); };

  if (finished) {
    return (
      <motion.div className="bg-card rounded-2xl border border-border p-8 text-center shadow-sm" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <TreePine className="mx-auto text-primary mb-3" size={48} />
        <h2 className="font-heading text-2xl font-bold mb-2">Feature Split Complete!</h2>
        <p className="text-3xl font-black text-primary mb-2">{score}/{splitRounds.length}</p>
        <p className="text-xs text-green-500 font-semibold mb-4">✅ Game progress saved!</p>
        <button onClick={reset} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold hover:shadow-lg transition-all">
          <RotateCcw size={16} /> Play Again
        </button>
      </motion.div>
    );
  }

  return (
    <>
      <MentorBubble message="Pick the best feature to split the data on! 🌳" className="mb-6" />
      <motion.div key={round} className="bg-card rounded-2xl border border-border p-6 shadow-sm" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs font-bold text-muted-foreground mb-1">Round {round + 1} of {splitRounds.length}</p>
        <h2 className="font-heading text-lg font-bold mb-3">{current.scenario}</h2>
        <div className="bg-doraemon-light-blue rounded-xl px-4 py-3 mb-4 font-mono text-xs text-primary font-semibold">{current.data}</div>
        <p className="text-sm font-bold mb-3">Which feature gives the best split?</p>
        <div className="space-y-2">
          {current.options.map((opt, i) => {
            let cls = "border-border bg-muted hover:bg-doraemon-light-blue";
            if (answered) {
              if (i === current.correct) cls = "border-green-500 bg-green-500/10";
              else if (i === selected) cls = "border-accent bg-accent/10";
              else cls = "border-border bg-muted opacity-50";
            } else if (i === selected) cls = "border-primary bg-primary/10";
            return (
              <button key={i} disabled={answered} onClick={() => setSelected(i)} className={`w-full text-left px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${cls}`}>
                {opt}
              </button>
            );
          })}
        </div>
        {answered && (
          <motion.p className="mt-4 text-sm font-semibold text-primary bg-doraemon-light-blue rounded-xl px-4 py-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            💡 {current.explanation}
          </motion.p>
        )}
        <div className="mt-4 flex justify-end">
          {!answered ? (
            <button onClick={handleSubmit} disabled={selected === null} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold disabled:opacity-40 hover:shadow-lg transition-all">Submit</button>
          ) : (
            <button onClick={handleNext} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold hover:shadow-lg transition-all">
              {round + 1 >= splitRounds.length ? "See Results" : "Next Round"}
            </button>
          )}
        </div>
      </motion.div>
    </>
  );
}

// === GAME 3: Classification Sorting ===
interface SortItem {
  label: string;
  emoji: string;
  category: string;
}

const sortItems: SortItem[] = [
  { label: "Dog", emoji: "🐕", category: "Animal" },
  { label: "Cat", emoji: "🐱", category: "Animal" },
  { label: "Car", emoji: "🚗", category: "Vehicle" },
  { label: "Bicycle", emoji: "🚲", category: "Vehicle" },
  { label: "Rose", emoji: "🌹", category: "Plant" },
  { label: "Tulip", emoji: "🌷", category: "Plant" },
  { label: "Truck", emoji: "🚚", category: "Vehicle" },
  { label: "Horse", emoji: "🐴", category: "Animal" },
  { label: "Cactus", emoji: "🌵", category: "Plant" },
];

const categories = ["Animal", "Vehicle", "Plant"];

function ClassifySortGame({ onComplete }: { onComplete: () => void }) {
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handlePlace = (itemLabel: string, category: string) => {
    if (submitted) return;
    setPlacements((p) => ({ ...p, [itemLabel]: category }));
  };

  const handleSubmit = () => {
    let correct = 0;
    sortItems.forEach((item) => {
      if (placements[item.label] === item.category) correct++;
    });
    setScore(correct);
    setSubmitted(true);
    onComplete();
  };

  const reset = () => { setPlacements({}); setSubmitted(false); setScore(0); };
  const allPlaced = Object.keys(placements).length === sortItems.length;

  return (
    <>
      <MentorBubble message="Drag each item into its correct category! Classification is about sorting! 📦" className="mb-6" />

      {/* Unplaced items */}
      <div className="bg-card rounded-2xl border border-border p-4 shadow-sm mb-4">
        <p className="text-xs font-bold text-muted-foreground mb-3">Items to classify:</p>
        <div className="flex flex-wrap gap-2">
          {sortItems.filter((item) => !placements[item.label]).map((item) => (
            <span key={item.label} className="bg-muted border border-border rounded-xl px-3 py-2 text-sm font-bold cursor-pointer hover:bg-doraemon-light-blue transition-all">
              {item.emoji} {item.label}
            </span>
          ))}
          {sortItems.every((item) => !!placements[item.label]) && (
            <span className="text-sm text-green-500 font-bold">All items placed! ✅</span>
          )}
        </div>
      </div>

      {/* Category bins */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {categories.map((cat) => {
          const catItems = sortItems.filter((item) => placements[item.label] === cat);
          return (
            <div key={cat} className="bg-card rounded-2xl border-2 border-dashed border-border p-4 min-h-[140px]">
              <h3 className="font-bold text-sm text-primary mb-3 text-center">{cat}</h3>
              <div className="space-y-1.5">
                {catItems.map((item) => {
                  const correct = submitted && item.category === cat;
                  const wrong = submitted && item.category !== cat;
                  return (
                    <div key={item.label} className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-sm font-semibold ${correct ? "bg-green-500/10 text-green-600" : wrong ? "bg-accent/10 text-accent" : "bg-muted"}`}>
                      <span>{item.emoji} {item.label}</span>
                      {!submitted && (
                        <button onClick={() => setPlacements((p) => { const n = { ...p }; delete n[item.label]; return n; })} className="text-muted-foreground hover:text-accent text-xs">✕</button>
                      )}
                      {correct && <span className="text-xs">✅</span>}
                      {wrong && <span className="text-xs">❌</span>}
                    </div>
                  );
                })}
              </div>
              {/* Drop buttons for unplaced items */}
              {!submitted && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {sortItems.filter((item) => !placements[item.label]).map((item) => (
                    <button key={item.label} onClick={() => handlePlace(item.label, cat)} className="text-[10px] font-bold bg-muted hover:bg-primary hover:text-primary-foreground px-2 py-1 rounded-md transition-all" title={`Place ${item.label} here`}>
                      +{item.emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {submitted && (
        <motion.div className="bg-card rounded-2xl border border-border p-6 text-center shadow-sm mb-4" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <Grid3X3 className="mx-auto text-primary mb-2" size={32} />
          <h2 className="font-heading text-xl font-bold mb-1">Sorting Complete!</h2>
          <p className="text-2xl font-black text-primary mb-1">{score}/{sortItems.length} correct</p>
          <p className="text-xs text-green-500 font-semibold mb-4">✅ Game progress saved!</p>
          <button onClick={reset} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold hover:shadow-lg transition-all">
            <RotateCcw size={16} /> Play Again
          </button>
        </motion.div>
      )}

      {!submitted && (
        <div className="text-center">
          <button onClick={handleSubmit} disabled={!allPlaced} className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold disabled:opacity-40 hover:shadow-lg transition-all">
            Check Answers
          </button>
        </div>
      )}
    </>
  );
}

// === MAIN COMPONENT ===
const MiniGame = () => {
  const [activeGame, setActiveGame] = useState<GameId>("decision-tree");
  const { completeGame } = useProgress();

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <h1 className="font-heading text-3xl font-black text-center mb-2">
          <Gamepad2 className="inline mr-2 text-primary" size={28} />
          Mini Games
        </h1>
        <p className="text-center text-muted-foreground mb-6 font-semibold">Learn AI concepts through interactive games!</p>

        {/* Game selector */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {games.map((g) => (
            <button
              key={g.id}
              onClick={() => setActiveGame(g.id)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border border-border ${
                activeGame === g.id ? "bg-primary text-primary-foreground shadow-md" : "bg-card hover:bg-doraemon-light-blue text-muted-foreground"
              }`}
            >
              <div>{g.label}</div>
              <div className="text-[10px] opacity-70">{g.desc}</div>
            </button>
          ))}
        </div>

        {activeGame === "decision-tree" && <DecisionTreeGame onComplete={completeGame} />}
        {activeGame === "dt-split" && <DTSplitGame onComplete={completeGame} />}
        {activeGame === "classify-sort" && <ClassifySortGame onComplete={completeGame} />}
      </div>
    </div>
  );
};

export default MiniGame;
