import { useState } from "react";
import { BookOpen, ChevronRight, Brain, GitBranch, TrendingUp, Layers } from "lucide-react";
import { motion } from "framer-motion";
import doraemonImg from "@/assets/doraemon.png";
import MentorBubble from "@/components/MentorBubble";

const modules = [
  {
    id: 1,
    title: "What is Machine Learning?",
    icon: Brain,
    concept: "Machine Learning is a subset of AI that enables computers to learn from data without being explicitly programmed. Instead of writing rules, we feed data to algorithms that find patterns.",
    example: "Email spam filters learn from millions of emails labeled as 'spam' or 'not spam' to automatically classify new emails.",
    diagram: "Data → Algorithm → Model → Prediction",
  },
  {
    id: 2,
    title: "Classification",
    icon: Layers,
    concept: "Classification is a supervised learning technique where the model learns to assign input data into predefined categories or classes based on labeled training examples.",
    example: "A doctor's AI assistant classifies X-ray images as 'healthy' or 'pneumonia' based on thousands of previously diagnosed images.",
    diagram: "Input Features → Classifier → Class Label (Cat / Dog)",
  },
  {
    id: 3,
    title: "Regression",
    icon: TrendingUp,
    concept: "Regression predicts a continuous numerical value. Unlike classification which outputs categories, regression outputs numbers like price, temperature, or score.",
    example: "Predicting house prices based on features like area, number of rooms, and location.",
    diagram: "Features (size, rooms) → Model → Price ($250,000)",
  },
  {
    id: 4,
    title: "Decision Trees",
    icon: GitBranch,
    concept: "A Decision Tree splits data into branches based on feature values, creating a tree-like structure of decisions. Each internal node tests a feature, each branch is an outcome, and each leaf is a prediction.",
    example: "Should I play tennis today? Check: Is it sunny? → Is humidity high? → No, don't play.",
    diagram: "Root → Branch (Yes/No) → Branch → Leaf (Decision)",
  },
];

const Learn = () => {
  const [active, setActive] = useState(0);
  const mod = modules[active];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-10">
        <h1 className="font-heading text-3xl md:text-4xl font-black text-center mb-2">
          <BookOpen className="inline mr-2 text-primary" size={28} />
          Learning Modules
        </h1>
        <p className="text-center text-muted-foreground mb-8 font-semibold">Master AI concepts step by step</p>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {modules.map((m, i) => (
              <button
                key={m.id}
                onClick={() => setActive(i)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                  active === i
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-card border border-border text-muted-foreground hover:bg-doraemon-light-blue"
                }`}
              >
                <m.icon size={16} />
                {m.title}
              </button>
            ))}
          </div>

          {/* Content */}
          <motion.div
            key={active}
            className="flex-1 bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="font-heading text-2xl font-bold mb-4 flex items-center gap-2">
              <mod.icon className="text-primary" size={24} />
              {mod.title}
            </h2>

            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-primary uppercase tracking-wide mb-1">Concept</h3>
                <p className="text-foreground leading-relaxed">{mod.concept}</p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-doraemon-yellow uppercase tracking-wide mb-1">Real-World Example</h3>
                <p className="text-foreground leading-relaxed">{mod.example}</p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-success uppercase tracking-wide mb-1">Visual Diagram</h3>
                <div className="bg-doraemon-light-blue rounded-xl px-5 py-4 font-mono text-sm text-primary font-bold flex items-center gap-2 flex-wrap">
                  {mod.diagram.split("→").map((part, i, arr) => (
                    <span key={i} className="flex items-center gap-2">
                      <span className="bg-card rounded-lg px-3 py-1.5 border border-primary/20">{part.trim()}</span>
                      {i < arr.length - 1 && <ChevronRight size={16} className="text-primary" />}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Mentor */}
            <div className="mt-6 flex items-end gap-3">
              <img src={doraemonImg} alt="Mentor" className="w-14 h-14 object-contain animate-bounce-gentle" />
              <div className="bg-doraemon-light-blue rounded-2xl rounded-bl-none px-4 py-2 text-sm font-semibold border border-primary/20">
                Great topic! Understanding {mod.title.toLowerCase()} is key to your AI journey! 💡
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Learn;
