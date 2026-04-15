import { useState } from "react";
import { HelpCircle, CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import nobitaImg from "@/assets/nobita.png";
import dekisugiImg from "@/assets/dekisugi.png";
import MentorBubble from "@/components/MentorBubble";

const questions = [
  {
    q: "What is Machine Learning?",
    options: [
      "A type of hardware",
      "A subset of AI that learns from data",
      "A programming language",
      "A database system",
    ],
    correct: 1,
  },
  {
    q: "Which technique predicts a continuous value?",
    options: ["Classification", "Clustering", "Regression", "Association"],
    correct: 2,
  },
  {
    q: "What does a Decision Tree use to make decisions?",
    options: ["Random guessing", "Feature-based splits", "Neural layers", "SQL queries"],
    correct: 1,
  },
  {
    q: "What is overfitting?",
    options: [
      "Model performs well on all data",
      "Model memorizes training data but fails on new data",
      "Model is too simple",
      "Model has no parameters",
    ],
    correct: 1,
  },
  {
    q: "Which is an example of classification?",
    options: [
      "Predicting house price",
      "Spam vs Not Spam email detection",
      "Forecasting temperature",
      "Estimating delivery time",
    ],
    correct: 1,
  },
];

const Quiz = () => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);

  const handleSubmit = () => {
    if (selected === null) return;
    setAnswered(true);
    if (selected === questions[current].correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const isCorrect = selected === questions[current]?.correct;

  if (finished) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          className="bg-card rounded-2xl border border-border p-8 text-center max-w-md shadow-lg"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <img src={score >= 3 ? dekisugiImg : nobitaImg} alt="Result" className="w-28 h-28 mx-auto object-contain mb-4" />
          <h2 className="font-heading text-2xl font-bold mb-2">
            {score >= 3 ? "Excellent Work! 🎉" : "Keep Practicing! 💪"}
          </h2>
          <p className="text-3xl font-black text-primary mb-2">{score}/{questions.length}</p>
          <p className="text-muted-foreground text-sm mb-6">
            {score >= 3 ? "You're mastering AI concepts!" : "Review the Learn section and try again."}
          </p>
          <button
            onClick={() => { setCurrent(0); setSelected(null); setAnswered(false); setScore(0); setFinished(false); }}
            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold hover:shadow-lg transition-all"
          >
            Retry Quiz
          </button>
        </motion.div>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <h1 className="font-heading text-3xl font-black text-center mb-2">
          <HelpCircle className="inline mr-2 text-primary" size={28} />
          AI Quiz
        </h1>
        <p className="text-center text-muted-foreground mb-8 font-semibold">
          Question {current + 1} of {questions.length} • Score: {score}
        </p>

        <MentorBubble message="Choose wisely! Think about what you learned." className="mb-6" />

        <motion.div
          key={current}
          className="bg-card rounded-2xl border border-border p-6 shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="font-heading text-xl font-bold mb-5">{q.q}</h2>
          <div className="space-y-3">
            {q.options.map((opt, i) => {
              let classes = "border-border bg-muted hover:bg-doraemon-light-blue";
              if (answered) {
                if (i === q.correct) classes = "border-success bg-success/10";
                else if (i === selected) classes = "border-accent bg-accent/10";
                else classes = "border-border bg-muted opacity-50";
              } else if (i === selected) {
                classes = "border-primary bg-primary/10";
              }
              return (
                <button
                  key={i}
                  disabled={answered}
                  onClick={() => setSelected(i)}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${classes}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {answered && (
              <motion.div
                className="mt-5 flex items-center gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <img
                  src={isCorrect ? dekisugiImg : nobitaImg}
                  alt={isCorrect ? "Correct" : "Wrong"}
                  className="w-16 h-16 object-contain"
                />
                <div className={`flex items-center gap-2 text-sm font-bold ${isCorrect ? "text-success" : "text-accent"}`}>
                  {isCorrect ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                  {isCorrect ? "Great job! That's correct!" : "Oops! That's not right. Keep learning!"}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 flex justify-end gap-3">
            {!answered ? (
              <button
                onClick={handleSubmit}
                disabled={selected === null}
                className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold disabled:opacity-40 hover:shadow-lg transition-all"
              >
                Submit
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold hover:shadow-lg transition-all"
              >
                {current + 1 >= questions.length ? "See Results" : "Next Question"}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Quiz;
