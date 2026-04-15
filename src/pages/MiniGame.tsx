import { useState } from "react";
import { Gamepad2, RotateCcw, TreePine, Grid3X3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CharacterFeedback from "@/components/CharacterFeedback";
import { useProgress } from "@/hooks/use-progress";

// === GAME SELECTOR ===

type GameId = "decision-tree" | "dt-split" | "classify-sort";

const games = [
  { id: "decision-tree" as GameId, label: "🌳 Fruit Classifier", desc: "Follow the decision tree" },
  { id: "dt-split" as GameId, label: "✂️ Feature Split", desc: "Pick the best feature" },
  { id: "classify-sort" as GameId, label: "📦 Sort & Classify", desc: "Categorize items" },
];

// === GAME 1: Decision Tree ===
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
      <div className="mb-8 flex justify-center">
        <CharacterFeedback 
          character={isResult ? "dekisugi" : "doraemon"} 
          message={isResult ? "Great! You followed the decision tree to the leaf! 🎉" : current.hint} 
        />
      </div>

      {path.length > 0 && (
        <div className="bg-[#E6F7FF] rounded-2xl px-6 py-4 mb-6 text-sm font-mono space-y-2 border-2 border-primary/20 shadow-sm mx-auto max-w-lg">
          {path.map((p, i) => <div key={i} className="text-primary font-black">Step {i + 1}: {p}</div>)}
        </div>
      )}
      
      <AnimatePresence mode="wait">
        {isResult ? (
          <motion.div 
            key="result" 
            className="bg-white rounded-3xl border-4 border-primary/10 p-10 text-center shadow-xl max-w-lg mx-auto" 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
            <div className="text-[6rem] mb-6 drop-shadow-md">{(node as string).split(" ")[0]}</div>
            <h2 className="font-heading text-3xl font-black mb-4 text-foreground">{node as string}</h2>
            <p className="inline-flex items-center gap-1.5 text-sm bg-success/10 text-success px-4 py-2 rounded-xl font-bold mb-8 items-center border border-success/30">
              <span>✅</span> Game progress saved!
            </p>
            <br />
            <button onClick={reset} className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-3.5 rounded-2xl font-black text-lg hover:shadow-lg hover:-translate-y-1 transition-all outline outline-2 outline-offset-2 outline-transparent hover:outline-primary/50">
              <RotateCcw size={20} /> Play Again
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key={current.question} 
            className="bg-white rounded-3xl border-4 border-primary/10 p-10 text-center shadow-xl max-w-lg mx-auto" 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="font-heading text-3xl font-black mb-8 leading-snug">{current.question}</h2>
            <div className="flex justify-center gap-6">
              <button onClick={() => handleChoice("yes")} className="flex-1 bg-success text-white px-8 py-4 rounded-3xl font-black text-2xl hover:shadow-xl hover:-translate-y-1 transition-all outline outline-2 outline-offset-2 outline-transparent hover:outline-success/50">
                Yes
              </button>
              <button onClick={() => handleChoice("no")} className="flex-1 bg-destructive text-white px-8 py-4 rounded-3xl font-black text-2xl hover:shadow-xl hover:-translate-y-1 transition-all outline outline-2 outline-offset-2 outline-transparent hover:outline-destructive/50">
                No
              </button>
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
      <motion.div className="bg-white rounded-3xl border-4 border-primary/10 p-10 text-center shadow-xl max-w-lg mx-auto" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <div className="bg-success/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-success/30">
          <TreePine className="text-secondary" size={48} />
        </div>
        <h2 className="font-heading text-3xl font-black mb-4">Feature Split Complete!</h2>
        <p className="text-[4rem] font-black leading-none text-primary mb-6">{score}<span className="text-3xl text-primary/40">/{splitRounds.length}</span></p>
        <p className="inline-flex items-center gap-1.5 text-sm bg-success/10 text-success px-4 py-2 rounded-xl font-bold mb-8 items-center border border-success/30">
          <span>✅</span> Game progress saved!
        </p>
        <br />
        <button onClick={reset} className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-3.5 rounded-2xl font-black text-lg hover:shadow-lg hover:-translate-y-1 transition-all outline outline-2 outline-offset-2 outline-transparent hover:outline-primary/50">
          <RotateCcw size={20} /> Play Again
        </button>
      </motion.div>
    );
  }

  return (
    <>
      <div className="mb-8 flex justify-center">
        <CharacterFeedback 
          character={answered ? (selected === current.correct ? "dekisugi" : "nobita") : "doraemon"} 
          message={answered 
            ? (selected === current.correct ? "Spot on! That's the best feature." : "Not quite. Think about which feature gives the most useful information.")
            : "Pick the most relevant feature to split the data on! 🌳"}
        />
      </div>

      <motion.div key={round} className="bg-white rounded-3xl border-4 border-primary/10 p-8 shadow-xl max-w-2xl mx-auto" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-heading text-xl font-black">{current.scenario}</h2>
          <span className="text-xs font-black bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20 shrink-0">Round {round + 1}/{splitRounds.length}</span>
        </div>
        
        <div className="bg-[#E6F7FF] rounded-2xl px-5 py-4 mb-8 font-mono text-sm text-primary font-bold border-2 border-primary/20 shadow-inner">
          {current.data}
        </div>
        
        <p className="text-sm font-black text-muted-foreground uppercase tracking-wider mb-3 ml-2">Which feature gives the best split?</p>
        
        <div className="space-y-3 mb-8">
          {current.options.map((opt, i) => {
            let cls = "border-2 border-primary/10 bg-white hover:border-primary/40 text-foreground";
            if (answered) {
              if (i === current.correct) cls = "border-2 border-success bg-success/10 text-success-foreground shadow-sm ring-1 ring-success font-black";
              else if (i === selected) cls = "border-2 border-destructive bg-destructive/10 text-destructive-foreground font-black";
              else cls = "border-2 border-primary/5 bg-gray-50 opacity-50";
            } else if (i === selected) {
              cls = "border-2 border-secondary bg-[#FFF9E6] shadow-sm transform -translate-y-0.5 ring-1 ring-secondary";
            }
            return (
              <button key={i} disabled={answered} onClick={() => setSelected(i)} className={`w-full text-left px-6 py-4 rounded-2xl font-bold text-lg transition-all ${cls}`}>
                {opt}
              </button>
            );
          })}
        </div>

        {answered && (
          <motion.div 
            className="mb-8 p-5 rounded-2xl bg-doraemon-light-blue border-2 border-primary/20 flex gap-3 items-start" 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-2xl mt-0.5">💡</span>
            <p className="text-sm font-bold text-primary leading-relaxed">{current.explanation}</p>
          </motion.div>
        )}

        <div className="flex justify-end pt-5 border-t-2 border-primary/5">
          {!answered ? (
             <button onClick={handleSubmit} disabled={selected === null} className="bg-primary text-white px-8 py-3.5 rounded-2xl font-black text-lg disabled:opacity-50 disabled:hover:translate-y-0 hover:shadow-lg hover:-translate-y-0.5 transition-all">
               Check Guess
             </button>
          ) : (
            <button onClick={handleNext} className="bg-primary text-white px-8 py-3.5 rounded-2xl font-black text-lg hover:shadow-lg hover:-translate-y-0.5 transition-all outline outline-2 outline-offset-2 outline-transparent hover:outline-primary/50">
              {round + 1 >= splitRounds.length ? "See Final Score" : "Next Scenario"}
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
  { label: "Bike", emoji: "🚲", category: "Vehicle" },
  { label: "Rose", emoji: "🌹", category: "Plant" },
  { label: "Tree", emoji: "🌲", category: "Plant" },
  { label: "Truck", emoji: "🚚", category: "Vehicle" },
  { label: "Bird", emoji: "🐦", category: "Animal" },
  { label: "Grass", emoji: "🌿", category: "Plant" },
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
      <div className="mb-8 flex justify-center">
        <CharacterFeedback 
          character={submitted ? (score === sortItems.length ? "dekisugi" : "nobita") : "doraemon"} 
          message={submitted 
            ? (score === sortItems.length ? "Perfect classification! You're a sorting master!" : "Some items ended up in the wrong category. Review the mistakes!")
            : "Classification algorithms are all about categorizing data accurately. Sort the items!"} 
        />
      </div>

      <div className="bg-white rounded-3xl border-4 border-primary/10 p-6 md:p-8 shadow-xl max-w-4xl mx-auto">
        {/* Unplaced items */}
        <div className="bg-[#E6F7FF] rounded-2xl border-2 border-primary/20 p-5 shadow-sm mb-8">
          <p className="text-xs font-black text-primary uppercase tracking-wider mb-4 ml-1">Items to Categorize:</p>
          <div className="flex flex-wrap gap-2.5">
            {sortItems.filter((item) => !placements[item.label]).map((item) => (
              <span key={item.label} className="bg-white border-2 border-primary/10 rounded-2xl px-4 py-2 text-sm font-bold cursor-pointer hover:bg-secondary hover:border-secondary hover:text-black transition-all shadow-sm">
                <span className="text-lg mr-1.5">{item.emoji}</span> {item.label}
              </span>
            ))}
            {sortItems.every((item) => !!placements[item.label]) && (
              <span className="text-sm text-green-600 bg-green-50 px-4 py-2 rounded-2xl font-black border-2 border-green-200">All items placed! ✅</span>
            )}
          </div>
        </div>

        {/* Category bins */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {categories.map((cat) => {
            const catItems = sortItems.filter((item) => placements[item.label] === cat);
            return (
              <div key={cat} className="bg-gray-50 rounded-3xl border-4 border-dashed border-primary/20 p-5 min-h-[200px] flex flex-col relative transition-colors hover:border-primary/40 hover:bg-[#E6F7FF]/50">
                <h3 className="font-heading font-black text-xl text-primary mb-4 text-center pb-3 border-b-2 border-primary/10">{cat} Class</h3>
                
                <div className="space-y-2.5 flex-1">
                  {catItems.map((item) => {
                    const correct = submitted && item.category === cat;
                    const wrong = submitted && item.category !== cat;
                    return (
                      <div key={item.label} className={`flex items-center justify-between px-4 py-2 rounded-xl text-sm font-bold shadow-sm border-2 ${correct ? "bg-success/10 border-success text-success-foreground" : wrong ? "bg-destructive/10 border-destructive text-destructive-foreground" : "bg-white border-primary/10"}`}>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{item.emoji}</span>
                          <span>{item.label}</span>
                        </div>
                        {!submitted && (
                          <button onClick={() => setPlacements((p) => { const n = { ...p }; delete n[item.label]; return n; })} className="text-muted-foreground w-6 h-6 rounded-full hover:bg-destructive/10 hover:text-destructive flex items-center justify-center transition-colors">✕</button>
                        )}
                        {correct && <span>✅</span>}
                        {wrong && <span>❌</span>}
                      </div>
                    );
                  })}
                </div>
                
                {/* Drop buttons for unplaced items */}
                {!submitted && (
                  <div className="mt-4 flex flex-wrap gap-1.5 pt-4 border-t-2 border-primary/10">
                    {sortItems.filter((item) => !placements[item.label]).map((item) => (
                      <button key={item.label} onClick={() => handlePlace(item.label, cat)} className="text-xs font-black bg-white border border-primary/20 hover:bg-secondary hover:border-secondary hover:text-black px-2 py-1.5 rounded-lg transition-all shadow-sm" title={`Place ${item.label} here`}>
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
          <motion.div className="bg-white rounded-3xl border-4 border-primary/10 p-8 text-center shadow-lg mb-8 max-w-sm mx-auto" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
              <Grid3X3 className="text-primary" size={32} />
            </div>
            <h2 className="font-heading text-2xl font-black mb-2">Sorting Complete!</h2>
            <p className="text-3xl font-black text-primary mb-4">{score}/{sortItems.length} correct</p>
            <p className="inline-flex items-center gap-1.5 text-xs bg-success/10 text-success px-3 py-1.5 rounded-lg font-bold mb-6 items-center border border-success/30">
              <span>✅</span> Progress saved!
            </p>
            <br />
            <button onClick={reset} className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-black hover:shadow-lg transition-all outline outline-2 outline-offset-2 outline-transparent hover:outline-primary/50">
              <RotateCcw size={16} /> Play Again
            </button>
          </motion.div>
        )}

        {!submitted && (
          <div className="text-center pt-6 border-t-2 border-primary/10">
            <button onClick={handleSubmit} disabled={!allPlaced} className="bg-primary text-white px-10 py-4 rounded-3xl font-black text-xl disabled:opacity-50 disabled:hover:-translate-y-0 hover:shadow-lg hover:-translate-y-1 transition-all outline outline-2 outline-offset-2 outline-transparent hover:outline-primary/50">
              Check Classifications
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// === MAIN COMPONENT ===
const MiniGame = () => {
  const [activeGame, setActiveGame] = useState<GameId>("decision-tree");
  const { completeGame } = useProgress();

  return (
    <div className="min-h-screen py-10 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 right-10 w-48 h-48 bg-secondary/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-40 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4">
        <h1 className="font-heading text-4xl font-black text-center mb-3 text-primary drop-shadow-sm">
          <Gamepad2 className="inline mr-3 -translate-y-1" size={40} />
          Mini Games
        </h1>
        <p className="text-center text-primary/70 mb-10 font-bold text-lg">Learn AI concepts interactively!</p>

        {/* Game selector */}
        <div className="flex justify-center gap-3 mb-10 flex-wrap max-w-4xl mx-auto">
          {games.map((g) => (
            <button
              key={g.id}
              onClick={() => setActiveGame(g.id)}
              className={`relative px-5 py-3 rounded-2xl border-4 font-black transition-all shadow-sm transform hover:-translate-y-1 text-sm ${
                activeGame === g.id 
                  ? "bg-secondary border-secondary text-secondary-foreground shadow-md -translate-y-1 ring-2 ring-offset-2 ring-secondary/50" 
                  : "bg-white border-primary/10 text-primary/70 hover:border-primary/30"
              }`}
            >
              <div className="text-base mb-0.5">{g.label}</div>
              <div className="text-[10px] font-bold opacity-80 uppercase tracking-widest">{g.desc}</div>
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
