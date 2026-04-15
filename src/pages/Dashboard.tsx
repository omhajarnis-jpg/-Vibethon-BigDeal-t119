import { LayoutDashboard, BookOpen, HelpCircle, Trophy, Star, Gamepad2, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import shizukaImg from "@/assets/shizuka.png";

const badges = [
  { label: "First Lesson", icon: BookOpen, earned: true },
  { label: "Quiz Master", icon: HelpCircle, earned: true },
  { label: "Game Player", icon: Gamepad2, earned: true },
  { label: "Bug Fixer", icon: AlertTriangle, earned: false },
  { label: "AI Champion", icon: Trophy, earned: false },
];

const stats = [
  { label: "Modules Completed", value: "3 / 4", pct: 75 },
  { label: "Quiz Score", value: "4 / 5", pct: 80 },
  { label: "Games Played", value: "2", pct: 60 },
  { label: "Labs Completed", value: "0 / 1", pct: 0 },
];

const Dashboard = () => (
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
          Great progress! Keep learning at a balanced pace. You're doing amazing! 🌸
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
                animate={{ width: "54%" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
          <span className="font-black text-xl text-primary">54%</span>
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
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${s.pct}%` }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Badges */}
      <motion.div
        className="bg-card rounded-2xl border border-border p-6 shadow-sm"
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
              className={`flex flex-col items-center gap-1.5 w-20 text-center ${!b.earned ? "opacity-30 grayscale" : ""}`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${b.earned ? "bg-doraemon-yellow" : "bg-muted"}`}>
                <b.icon size={24} className={b.earned ? "text-secondary-foreground" : "text-muted-foreground"} />
              </div>
              <span className="text-xs font-bold">{b.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </div>
);

export default Dashboard;
