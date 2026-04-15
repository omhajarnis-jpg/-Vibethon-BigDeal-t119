import { LayoutDashboard, BookOpen, HelpCircle, Trophy, Star, Gamepad2, AlertTriangle, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import shizukaImg from "@/assets/shizuka.png";
import { useProgress } from "@/hooks/use-progress";

const TOTAL_MODULES = 4;

const Dashboard = () => {
  const { progress, resetProgress } = useProgress();

  const modulesCompleted = progress.modulesCompleted.length;
  const modulesPct = Math.round((modulesCompleted / TOTAL_MODULES) * 100);
  const quizPct = progress.quizCompleted ? Math.round((progress.quizScore / progress.quizTotal) * 100) : 0;
  const gamePct = progress.gameCompleted ? 100 : 0;
  const labPct = 0; // Failure lab not tracked yet

  const overallPct = Math.round((modulesPct + quizPct + gamePct + labPct) / 4);

  const stats = [
    { label: "Modules Completed", value: `${modulesCompleted} / ${TOTAL_MODULES}`, pct: modulesPct },
    { label: "Quiz Score", value: progress.quizCompleted ? `${progress.quizScore} / ${progress.quizTotal}` : "Not attempted", pct: quizPct },
    { label: "Games Played", value: progress.gameCompleted ? `${progress.gamesPlayed}` : "Not played", pct: gamePct },
    { label: "Labs Completed", value: "0 / 1", pct: labPct },
  ];

  const badges = [
    { label: "First Lesson", icon: BookOpen, earned: modulesCompleted >= 1 },
    { label: "Quiz Master", icon: HelpCircle, earned: progress.quizCompleted && progress.quizScore >= 3 },
    { label: "Game Player", icon: Gamepad2, earned: progress.gameCompleted },
    { label: "Bug Fixer", icon: AlertTriangle, earned: false },
    { label: "AI Champion", icon: Trophy, earned: modulesCompleted >= TOTAL_MODULES && progress.quizCompleted && progress.gameCompleted },
  ];

  const getMessage = () => {
    if (overallPct === 0) return "Welcome! Start your AI learning journey by visiting the Learn section. 🚀";
    if (overallPct < 30) return "You've started! Keep going through the modules and quiz. 📚";
    if (overallPct < 60) return "Great progress! Keep learning at a balanced pace. You're doing amazing! 🌸";
    if (overallPct < 90) return "Almost there! Complete all sections to become an AI Champion! 💪";
    return "Incredible! You've mastered the AI Learning Lab! 🎉🏆";
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <h1 className="font-heading text-3xl font-black text-center mb-2">
          <LayoutDashboard className="inline mr-2 text-primary" size={28} />
          Progress Dashboard
        </h1>
        <p className="text-center text-muted-foreground mb-8 font-semibold">Track your AI learning journey</p>

        {/* Shizuka message */}
        <div className="flex items-start gap-3 mb-8">
          <img src={shizukaImg} alt="Shizuka" className="w-16 h-16 object-contain animate-bounce-gentle flex-shrink-0" />
          <div className="bg-doraemon-light-blue border border-primary/20 rounded-2xl rounded-bl-none px-4 py-3 text-sm font-semibold max-w-md">
            {getMessage()}
          </div>
        </div>

        {/* Overall progress */}
        <motion.div
          className="bg-card rounded-2xl border border-border p-6 shadow-sm mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="font-heading text-lg font-bold mb-3">Overall Progress</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="w-full h-5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-doraemon-yellow rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${overallPct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
            <span className="font-black text-xl text-primary">{overallPct}%</span>
          </div>
        </motion.div>

        {/* Stats grid */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="bg-card rounded-2xl border border-border p-5 shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-muted-foreground">{s.label}</span>
                <span className="font-bold text-foreground">{s.value}</span>
              </div>
              <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${s.pct}%` }}
                  transition={{ duration: 0.6, delay: 0.1 * i, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Badges */}
        <motion.div
          className="bg-card rounded-2xl border border-border p-6 shadow-sm mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-heading text-lg font-bold mb-4 flex items-center gap-2">
            <Star className="text-doraemon-yellow" size={20} /> Badges
          </h2>
          <div className="flex flex-wrap gap-4">
            {badges.map((b) => (
              <div
                key={b.label}
                className={`flex flex-col items-center gap-1.5 w-20 text-center transition-all ${!b.earned ? "opacity-30 grayscale" : ""}`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${b.earned ? "bg-doraemon-yellow" : "bg-muted"}`}>
                  <b.icon size={24} className={b.earned ? "text-secondary-foreground" : "text-muted-foreground"} />
                </div>
                <span className="text-xs font-bold">{b.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Reset button */}
        <div className="text-center">
          <button
            onClick={resetProgress}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent font-semibold transition-colors"
          >
            <RotateCcw size={14} /> Reset All Progress
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
