import { useState } from "react";
import { HelpCircle, ChevronRight, CheckCircle2, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CharacterFeedback from "@/components/CharacterFeedback";
import { useProgress } from "@/hooks/use-progress";

const questions = [
  {
    id: 1,
    question: "If you want an AI to distinguish between apples and oranges, which approach should you use?",
    options: ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning"],
    correct: 0,
    explanation: "Supervised learning uses labeled data (like telling the AI 'this is an apple' and 'this is an orange') to train the model.",
  },
  {
    id: 2,
    question: "Which of these is an example of Regression?",
    options: ["Identifying spam emails", "Predicting tomorrow's temperature", "Grouping customers by shopping habits"],
    correct: 1,
    explanation: "Regression is used to predict continuous numbers, like temperature or price.",
  },
  {
    id: 3,
    question: "What is a Decision Tree?",
    options: ["A biological neural network", "A tree that predicts weather", "A flowchart-like structure used to make decisions based on data"],
    correct: 2,
    explanation: "A Decision Tree splits data based on questions (features) until it reaches a final prediction (leaf node).",
  },
  {
    id: 4,
    question: "What happens if a model has High Accuracy but Low Recall in a medical diagnosis?",
    options: ["It correctly identifies healthy patients but misses many sick ones", "It identifies too many sick patients", "It randomly guesses outcomes"],
    correct: 0,
    explanation: "Low recall means it fails to find all the positive cases (it misses the sick patients), even if overall accuracy looks high because most people are healthy.",
  },
  {
    id: 5,
    question: "Neural networks are inspired by:",
    options: ["Plant biology", "The human brain", "Computer hardware architecture"],
    correct: 1,
    explanation: "Neural networks consist of artificial 'neurons' connected in layers, mimicking how the human brain processes information.",
  },
];

const Quiz = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  
  const { setQuizScore } = useProgress();

  const handleSelect = (idx: number) => {
    if (!answered) setSelected(idx);
  };

  const handleCheck = () => {
    if (selected === null) return;
    setAnswered(true);
    if (selected === questions[currentQ].correct) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQ + 1 >= questions.length) {
      setFinished(true);
      const finalScore = score + (selected === questions[currentQ].correct ? 1 : 0);
      setQuizScore(finalScore, questions.length);
    } else {
      setCurrentQ(c => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQ(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);
  };

  const q = questions[currentQ];

  return (
    <div className="min-h-screen py-10 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/50 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-primary/20 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        <h1 className="font-heading text-4xl font-black text-center mb-3 text-primary drop-shadow-sm">
          <HelpCircle className="inline mr-3 -translate-y-1" size={40} />
          Knowledge Quiz
        </h1>
        <p className="text-center text-primary/70 mb-10 font-bold text-lg">Test your AI knowledge to earn badges!</p>

        <AnimatePresence mode="wait">
          {finished ? (
            <motion.div
              key="results"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl border-4 border-primary/10 p-10 text-center shadow-xl relative mt-16"
            >
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white rounded-full p-4 border-4 border-primary/10 shadow-sm">
                <CheckCircle2 className="w-16 h-16 text-success" />
              </div>
              
              <h2 className="font-heading text-3xl font-black mb-4 mt-8">Quiz Completed!</h2>
              <div className="text-[5rem] font-black leading-none mb-6 text-primary">
                {score}<span className="text-4xl text-primary/40">/{questions.length}</span>
              </div>
              
              <CharacterFeedback 
                character={score >= 3 ? "dekisugi" : "nobita"}
                message={score >= 4 
                  ? "Perfect! You're a true genius!" 
                  : score >= 3 
                    ? "Great score! You pass the test!" 
                    : "Oh no... you need more practice. Let's study again!"}
                className="justify-center mb-10"
              />

              <button
                onClick={resetQuiz}
                className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-black text-lg hover:shadow-lg hover:-translate-y-1 transition-all outline outline-2 outline-offset-2 outline-transparent hover:outline-primary/50"
              >
                <RotateCcw size={20} /> Try Again
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white rounded-3xl border-4 border-primary/10 shadow-xl overflow-hidden"
            >
              <div className="bg-[#E6F7FF] px-8 py-5 flex items-center justify-between border-b-2 border-primary/10">
                <span className="font-black text-sm text-primary uppercase tracking-wider">Question {currentQ + 1} of {questions.length}</span>
                <div className="flex gap-1.5">
                  {questions.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-2.5 w-8 rounded-full ${i === currentQ ? 'bg-primary' : i < currentQ ? 'bg-success' : 'bg-primary/20'}`} 
                    />
                  ))}
                </div>
              </div>

              <div className="p-8 md:p-10">
                <h2 className="text-2xl font-bold mb-8 leading-snug">{q.question}</h2>

                <div className="space-y-4 mb-10">
                  {q.options.map((opt, i) => {
                    let btnClass = "border-2 border-primary/10 bg-white hover:border-primary/40 text-foreground";
                    
                    if (answered) {
                      if (i === q.correct) btnClass = "border-2 border-success bg-success/10 text-success-foreground font-black shadow-sm ring-1 ring-success";
                      else if (i === selected) btnClass = "border-2 border-destructive bg-destructive/10 text-destructive-foreground font-black";
                      else btnClass = "border-2 border-primary/5 opacity-50 bg-gray-50";
                    } else if (i === selected) {
                      btnClass = "border-2 border-secondary bg-[#FFF9E6] shadow-sm transform -translate-y-0.5 ring-1 ring-secondary";
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => handleSelect(i)}
                        disabled={answered}
                        className={`w-full text-left px-6 py-4 rounded-2xl font-semibold transition-all ${btnClass}`}
                      >
                        <div className="flex items-center gap-4">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0 ${
                            answered && i === q.correct ? "bg-success text-white" :
                            answered && i === selected ? "bg-destructive text-white" :
                            i === selected ? "bg-secondary text-primary font-black" : "bg-primary/10 text-primary"
                          }`}>
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span className="text-lg">{opt}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {answered && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                  >
                    <CharacterFeedback 
                      character={selected === q.correct ? "dekisugi" : "nobita"}
                      message={selected === q.correct 
                        ? `Correct! ${q.explanation}` 
                        : `Oops! ${q.explanation}`}
                    />
                  </motion.div>
                )}

                <div className="flex justify-end pt-6 border-t-2 border-primary/5">
                  {!answered ? (
                    <button
                      onClick={handleCheck}
                      disabled={selected === null}
                      className="bg-primary text-white px-8 py-3.5 rounded-2xl font-black disabled:opacity-50 disabled:hover:translate-y-0 hover:shadow-lg hover:-translate-y-0.5 transition-all text-lg"
                    >
                      Check Answer
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="bg-primary text-white px-8 py-3.5 rounded-2xl font-black flex items-center gap-2 hover:shadow-lg hover:-translate-y-0.5 transition-all text-lg"
                    >
                      {currentQ + 1 >= questions.length ? "View Results" : "Next Question"} <ChevronRight size={20} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Quiz;
