import { LayoutDashboard, BookOpen, HelpCircle, Trophy, Star, Gamepad2, AlertTriangle, RotateCcw, FlaskConical, Code2 } from "lucide-react";
import { motion } from "framer-motion";
import CharacterFeedback from "@/components/CharacterFeedback";
import { useProgress } from "@/hooks/use-progress";
import { useAuth } from "@/hooks/use-auth";

const TOTAL_MODULES = 6;

const Dashboard = () => {
  const { progress, resetProgress } = useProgress();
  const { currentUser } = useAuth();

  const modulesCompleted = progress.modulesCompleted.length;
  const modulesPct = Math.round((modulesCompleted / TOTAL_MODULES) * 100);
  const quizPct = progress.quizCompleted ? Math.round((progress.quizScore / progress.quizTotal) * 100) : 0;
  const gamePct = progress.gameCompleted ? 100 : 0;
  const simPct = progress.simulationCompleted ? 100 : 0;

  const overallPct = Math.round((modulesPct + quizPct + gamePct + simPct) / 4);

  const stats = [
    { label: "Modules Completed", value: `${modulesCompleted} / ${TOTAL_MODULES}`, pct: modulesPct, icon: BookOpen, color: "text-primary" },
    { label: "Quiz Score", value: progress.quizCompleted ? `${progress.quizScore} / ${progress.quizTotal}` : "Not attempted", pct: quizPct, icon: HelpCircle, color: "text-secondary" },
    { label: "Games Played", value: progress.gameCompleted ? `${progress.gamesPlayed} games` : "Not played", pct: gamePct, icon: Gamepad2, color: "text-green-500" },
    { label: "Simulation", value: progress.simulationCompleted ? "Completed" : "Not started", pct: simPct, icon: FlaskConical, color: "text-purple-500" },
  ];

  const badges = [
    { label: "First Lesson", icon: BookOpen, earned: modulesCompleted >= 1, color: "bg-primary text-white" },
    { label: "Quiz Master", icon: HelpCircle, earned: progress.quizCompleted && progress.quizScore >= 3, color: "bg-secondary text-primary" },
    { label: "Game Champion", icon: Gamepad2, earned: progress.gameCompleted, color: "bg-green-500 text-white" },
    { label: "AI Fixer", icon: AlertTriangle, earned: progress.simulationCompleted, color: "bg-purple-500 text-white" },
    { label: "Code Runner", icon: Code2, earned: modulesCompleted >= 2, color: "bg-orange-500 text-white" },
    { label: "AI Champion", icon: Trophy, earned: modulesCompleted >= TOTAL_MODULES && progress.quizCompleted && progress.gameCompleted && progress.simulationCompleted, color: "bg-gradient-to-tr from-secondary to-orange-400 text-white" },
  ];

  const getMessage = () => {
    if (overallPct === 0) return "Welcome! Start your AI learning journey by visiting the Learn section. 🚀";
    if (overallPct < 30) return "You've started! Keep going through the modules and quiz. 📚";
    if (overallPct < 60) return "Great progress! Keep learning at a balanced pace. You're doing amazing! 🌸";
    if (overallPct < 90) return "Almost there! Complete all sections to become an AI Champion! 💪";
    return "Incredible! You've mastered the AI Learning Lab! 🎉🏆";
  };

  return (
    <div className="min-h-screen py-10 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/60 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <h1 className="font-heading text-4xl mb-3 font-black text-center text-primary drop-shadow-sm">
          <LayoutDashboard className="inline mr-3 -translate-y-1" size={40} />
          Progress Dashboard
        </h1>
        <p className="text-center text-primary/70 mb-10 font-bold text-lg">
          {currentUser ? `Welcome back, ${currentUser.name}!` : "Track your AI learning journey"}
        </p>

        {/* Shizuka message */}
        <div className="mb-10 flex justify-center">
          <CharacterFeedback 
            character="shizuka" 
            message={getMessage()} 
            className="transform scale-110"
          />
        </div>

        {/* Overall progress */}
        <motion.div
          className="bg-white rounded-3xl border-4 border-primary/10 p-8 shadow-xl mb-8 relative overflow-hidden"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-secondary/20 rounded-full blur-2xl" />
          <h2 className="font-heading text-2xl font-black mb-6 flex items-center justify-between">
            <span>Overall Progress</span>
            <span className="text-secondary drop-shadow-sm font-black text-3xl">{overallPct}%</span>
          </h2>
          <div className="w-full h-6 bg-muted rounded-full overflow-hidden border-2 border-primary/10 shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${overallPct}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Stats grid */}
        <div className="grid sm:grid-cols-2 gap-5 mb-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="bg-white rounded-3xl border-4 border-primary/10 p-6 shadow-md hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <div className="flex justify-between items-center mb-4">
                <span className={`text-sm font-black uppercase tracking-wider flex items-center gap-2 ${s.color}`}>
                  <s.icon size={18} /> {s.label}
                </span>
                <span className="font-black text-xl text-foreground bg-gray-50 px-3 py-1 rounded-xl border border-border">{s.value}</span>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden border border-border shadow-inner">
                <motion.div
                  className={`h-full rounded-full ${s.pct === 100 ? 'bg-success' : 'bg-primary'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${s.pct}%` }}
                  transition={{ duration: 0.8, delay: 0.2 + (0.1 * i), ease: "easeOut" }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Badges */}
        <motion.div
          className="bg-white rounded-3xl border-4 border-primary/10 p-8 shadow-xl mb-10 text-center sm:text-left"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="font-heading text-2xl font-black mb-6 flex items-center justify-center sm:justify-start gap-3">
            <Star className="text-secondary fill-secondary" size={28} /> 
            Achievement Badges
          </h2>
          <div className="flex flex-wrap justify-center sm:justify-start gap-4">
            {badges.map((b) => (
              <div
                key={b.label}
                className={`flex flex-col items-center gap-2 w-[5.5rem] transition-all transform hover:scale-105 ${!b.earned ? "opacity-40 grayscale hover:grayscale-0" : ""}`}
              >
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-sm border-2 ${b.earned ? `${b.color} border-transparent` : "bg-muted border-border text-muted-foreground"}`}>
                  <b.icon size={28} />
                </div>
                <span className="text-xs font-black text-center leading-tight">{b.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Reset button */}
        <div className="text-center">
          <button
            onClick={resetProgress}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold bg-white text-destructive border-2 border-destructive/20 hover:bg-destructive hover:text-white rounded-2xl transition-all shadow-sm"
          >
            <RotateCcw size={16} /> Reset All Progress
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
