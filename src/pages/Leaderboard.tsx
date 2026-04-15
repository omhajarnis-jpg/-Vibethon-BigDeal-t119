import { useState, useEffect } from "react";
import { Trophy, Medal, Star, Crown, Award, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import doraemonImg from "@/assets/doraemon.png";
import dekisugiImg from "@/assets/dekisugi.png";
import shizukaImg from "@/assets/shizuka.png";
import nobitaImg from "@/assets/nobita.png";
import gianImg from "@/assets/gian.png";
import suneoImg from "@/assets/suneo.png";
import { useAuth } from "@/hooks/use-auth";
import { useProgress } from "@/hooks/use-progress";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  score: number;
  badge: string;
  isCurrentUser?: boolean;
}

const badgeInfo: Record<string, { label: string; icon: typeof Trophy; color: string }> = {
  "Quiz Master": { label: "Quiz Master", icon: Award, color: "text-yellow-500" },
  "Game Champion": { label: "Game Champion", icon: Trophy, color: "text-blue-500" },
  "AI Fixer": { label: "AI Fixer", icon: Star, color: "text-purple-500" },
  "Fast Learner": { label: "Fast Learner", icon: Medal, color: "text-green-500" },
  "AI Champion": { label: "AI Champion", icon: Trophy, color: "text-doraemon-yellow" },
};

const DEFAULT_NPCS: LeaderboardEntry[] = [
  { rank: 0, name: "Dekisugi", avatar: dekisugiImg, score: 320, badge: "AI Champion" },
  { rank: 0, name: "Shizuka", avatar: shizukaImg, score: 260, badge: "Quiz Master" },
  { rank: 0, name: "Doraemon", avatar: doraemonImg, score: 210, badge: "Game Champion" },
  { rank: 0, name: "Suneo", avatar: suneoImg, score: 150, badge: "Fast Learner" },
  { rank: 0, name: "Gian", avatar: gianImg, score: 90, badge: "Learner" },
  { rank: 0, name: "Nobita", avatar: nobitaImg, score: 40, badge: "Learner" },
];

const Leaderboard = () => {
  const { currentUser } = useAuth();
  const { progress } = useProgress();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      
      let allEntries: LeaderboardEntry[] = [];

      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase
            .from("leaderboard")
            .select("*")
            .order("score", { ascending: false })
            .limit(20);

          if (!error && data) {
            allEntries = data.map((item: any) => ({
              rank: 0,
              name: item.username,
              avatar: "", // Supabase doesn't have avatars in this table yet
              score: item.score,
              badge: item.badge,
              isCurrentUser: item.username === (currentUser?.name || currentUser?.email?.split('@')[0])
            }));
          }
        } catch (err) {
          console.error("Leaderboard fetch error:", err);
        }
      }

      // If no data from Supabase or not configured, use NPCs + local user
      if (allEntries.length === 0) {
        const userScore =
          progress.modulesCompleted.length * 25 +
          progress.quizScore * 20 +
          (progress.gameCompleted ? 50 : 0) +
          (progress.simulationCompleted ? 50 : 0);

        const userName = currentUser?.name || "You";
        
        let userBadge = "Learner";
        if (progress.modulesCompleted.length >= 6) userBadge = "AI Champion";
        else if (progress.quizCompleted) userBadge = "Quiz Master";

        allEntries = [
          ...DEFAULT_NPCS,
          { rank: 0, name: userName, avatar: "", score: userScore, badge: userBadge, isCurrentUser: true }
        ];
      } else {
        // Merge with NPCs if requested, or just show top users
        // For a hackathon, showing top real users is better. 
        // We'll just show the fetched data.
      }

      // Sort by score descending and assign ranks
      allEntries.sort((a, b) => b.score - a.score);
      allEntries.forEach((e, i) => (e.rank = i + 1));

      setEntries(allEntries);
      setLoading(false);
    };

    fetchLeaderboard();
  }, [progress, currentUser]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown size={20} className="text-yellow-500" />;
    if (rank === 2) return <Medal size={20} className="text-gray-400" />;
    if (rank === 3) return <Medal size={20} className="text-amber-700" />;
    return <span className="text-sm font-black text-muted-foreground w-5 text-center">{rank}</span>;
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <h1 className="font-heading text-3xl font-black text-center mb-2">
          <Trophy className="inline mr-2 text-doraemon-yellow" size={28} />
          Leaderboard
        </h1>
        <p className="text-center text-muted-foreground mb-8 font-semibold">Compete with other learners!</p>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : (
          <>
            {/* Podium Top 3 */}
            {entries.length >= 3 && (
              <div className="flex items-end justify-center gap-3 mb-8">
                {/* 2nd place */}
                <motion.div
                  className={`flex flex-col items-center bg-card rounded-2xl border border-border p-4 w-28 ${entries[1]?.isCurrentUser ? "ring-2 ring-primary" : ""}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Medal size={20} className="text-gray-400 mb-1" />
                  <img src={entries[1]?.avatar || doraemonImg} alt={entries[1]?.name} className="w-12 h-12 object-contain mb-1" />
                  <span className="text-xs font-bold truncate w-full text-center">{entries[1]?.name}</span>
                  <span className="text-sm font-black text-primary">{entries[1]?.score}</span>
                </motion.div>
                {/* 1st place */}
                <motion.div
                  className={`flex flex-col items-center bg-card rounded-2xl border-2 border-yellow-500 p-5 w-32 -mb-2 shadow-lg ${entries[0]?.isCurrentUser ? "ring-2 ring-primary" : ""}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Crown size={24} className="text-yellow-500 mb-1" />
                  <img src={entries[0]?.avatar || doraemonImg} alt={entries[0]?.name} className="w-14 h-14 object-contain mb-1" />
                  <span className="text-sm font-bold truncate w-full text-center">{entries[0]?.name}</span>
                  <span className="text-lg font-black text-primary">{entries[0]?.score}</span>
                </motion.div>
                {/* 3rd place */}
                <motion.div
                  className={`flex flex-col items-center bg-card rounded-2xl border border-border p-4 w-28 ${entries[2]?.isCurrentUser ? "ring-2 ring-primary" : ""}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Medal size={20} className="text-amber-700 mb-1" />
                  <img src={entries[2]?.avatar || doraemonImg} alt={entries[2]?.name} className="w-12 h-12 object-contain mb-1" />
                  <span className="text-xs font-bold truncate w-full text-center">{entries[2]?.name}</span>
                  <span className="text-sm font-black text-primary">{entries[2]?.score}</span>
                </motion.div>
              </div>
            )}

            {/* Full ranking table */}
            <motion.div
              className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="px-5 py-3 bg-muted border-b border-border">
                <span className="text-sm font-bold text-muted-foreground">All Rankings</span>
              </div>
              <div className="divide-y divide-border">
                {entries.map((entry, i) => (
                  <motion.div
                    key={entry.name + i}
                    className={`flex items-center gap-3 px-5 py-3 transition-colors ${
                      entry.isCurrentUser ? "bg-primary/5 border-l-4 border-l-primary" : "hover:bg-muted/50"
                    }`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                  >
                    <div className="w-8 flex justify-center">{getRankIcon(entry.rank)}</div>
                    <img
                      src={entry.avatar || doraemonImg}
                      alt={entry.name}
                      className="w-9 h-9 object-contain rounded-full bg-muted"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm truncate">
                          {entry.name} {entry.isCurrentUser && <span className="text-primary">(You)</span>}
                        </span>
                      </div>
                      <div className="flex gap-1 mt-0.5">
                        {entry.badge && badgeInfo[entry.badge] ? (
                          <span className={`text-[10px] font-bold ${badgeInfo[entry.badge].color} bg-muted px-1.5 py-0.5 rounded-md`}>
                            {badgeInfo[entry.badge].label}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">
                            Learner
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="font-black text-primary text-lg">{entry.score}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}

        {/* Score breakdown */}
        <motion.div
          className="bg-card rounded-2xl border border-border p-5 shadow-sm mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-sm font-bold text-muted-foreground mb-3">How Points Are Earned</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs font-bold">
            <div className="bg-muted rounded-xl p-3">
              <div className="text-primary text-lg">+25</div>
              <div className="text-muted-foreground">Per Module</div>
            </div>
            <div className="bg-muted rounded-xl p-3">
              <div className="text-primary text-lg">+20</div>
              <div className="text-muted-foreground">Per Quiz Correct</div>
            </div>
            <div className="bg-muted rounded-xl p-3">
              <div className="text-primary text-lg">+50</div>
              <div className="text-muted-foreground">Game Complete</div>
            </div>
            <div className="bg-muted rounded-xl p-3">
              <div className="text-primary text-lg">+50</div>
              <div className="text-muted-foreground">Simulation</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;
