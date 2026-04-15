import { Link } from "react-router-dom";
import { BookOpen, HelpCircle, Gamepad2, AlertTriangle, BarChart3, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import doraemonImg from "@/assets/doraemon.png";
import MentorBubble from "@/components/MentorBubble";

const features = [
  { icon: BookOpen, title: "Learn Concepts", desc: "Structured AI & ML modules with real-world examples", color: "bg-primary" },
  { icon: HelpCircle, title: "Take Quizzes", desc: "Test your knowledge with interactive quizzes", color: "bg-doraemon-yellow" },
  { icon: Gamepad2, title: "Play Mini Games", desc: "Learn decision trees through fun gameplay", color: "bg-success" },
  { icon: AlertTriangle, title: "Fix AI Failures", desc: "Debug real AI models in the Failure Lab", color: "bg-accent" },
  { icon: BarChart3, title: "Track Progress", desc: "Dashboard with badges and achievements", color: "bg-primary" },
];

const Index = () => (
  <div className="min-h-screen">
    {/* Hero */}
    <section className="relative overflow-hidden bg-gradient-to-br from-doraemon-light-blue via-background to-background">
      <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center gap-8">
        <motion.div
          className="flex-1 text-center md:text-left"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-xs font-bold mb-4">
            <Sparkles size={14} /> Hackathon Prototype
          </div>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight">
            Doraemon AI<br />
            <span className="text-primary">Learning Lab</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-lg font-semibold">
            Learn AI by Fixing Real Problems — an interactive, gamified platform guided by your favorite characters.
          </p>
          <Link
            to="/learn"
            className="mt-6 inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-bold text-base shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
          >
            <BookOpen size={18} />
            Start Learning
          </Link>
        </motion.div>
        <motion.div
          className="flex-shrink-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <img src={doraemonImg} alt="Doraemon Mentor" className="w-52 md:w-72 animate-float drop-shadow-2xl" />
        </motion.div>
      </div>
    </section>

    {/* Mentor message */}
    <section className="container mx-auto px-4 -mt-4 mb-10">
      <MentorBubble message="Hi! I am your AI mentor. Let's start learning AI together. 🚀" />
    </section>

    {/* Feature cards */}
    <section className="container mx-auto px-4 pb-20">
      <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-10">What You'll Do</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * i }}
          >
            <div className={`${f.color} w-11 h-11 rounded-xl flex items-center justify-center mb-4`}>
              <f.icon size={20} className="text-primary-foreground" />
            </div>
            <h3 className="font-heading font-bold text-lg">{f.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  </div>
);

export default Index;
