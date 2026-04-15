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
import CharacterFeedback from "@/components/CharacterFeedback";

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  score: number;
  badge: string;
  isCurrentUser?: boolean;
}

const badgeInfo: Record<string, { label: string; icon: typeof Trophy; color: string; bg: string }> = {
  "Quiz Master": { label: "Quiz Master", icon: Award, color: "text-blue-500", bg: "bg-blue-100" },
  "Game Champion": { label: "Game Champion", icon: Trophy, color: "text-green-500", bg: "bg-green-100" },
  "AI Fixer": { label: "AI Fixer", icon: Star, color: "text-purple-500", bg: "bg-purple-100" },
  "Fast Learner": { label: "Fast Learner", icon: Medal, color: "text-secondary", bg: "bg-[#FFF9E6]" },
  "AI Champion": { label: "AI Champion", icon: Trophy, color: "text-secondary", bg: "bg-[#FFF9E6]" },
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
              avatar: "", 
              score: item.score,
              badge: item.badge,
              isCurrentUser: item.username === (currentUser?.name || currentUser?.email?.split('@')[0])
            }));
          }
        } catch (err) {
          console.error("Leaderboard fetch error:", err);
        }
      }

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
      }

      allEntries.sort((a, b) => b.score - a.score);
      allEntries.forEach((e, i) => (e.rank = i + 1));

      setEntries(allEntries);
      setLoading(false);
    };

    fetchLeaderboard();
  }, [progress, currentUser]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown size={24} className="text-[#FFD700]" />;
    if (rank === 2) return <Medal size={22} className="text-[#C0C0C0]" />;
    if (rank === 3) return <Medal size={22} className="text-[#CD7F32]" />;
    return <span className="text-sm font-black text-muted-foreground w-6 h-6 flex justify-center items-center bg-muted rounded-full">{rank}</span>;
  };

  return (
    <div className="min-h-screen py-10 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-white/50 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <h1 className="font-heading text-4xl font-black text-center mb-3 text-primary drop-shadow-sm">
          <Trophy className="inline mr-3 -translate-y-1 text-secondary fill-secondary" size={40} />
          Leaderboard
        </h1>
        <p className="text-center text-primary/70 mb-10 font-bold text-lg">Compete with Gian, Suneo, and other learners!</p>

        <div className="mb-10 flex justify-center">
          <CharacterFeedback character="suneo" message="I'm definitely going to be number one! Can you beat my score?" />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20 bg-white rounded-3xl border-4 border-primary/10 shadow-xl">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        ) : (
          <>
            {/* Podium Top 3 */}
            {entries.length >= 3 && (
              <div className="flex items-end justify-center gap-3 md:gap-6 mb-12">
                {/* 2nd place */}
                <motion.div
                  className={`flex flex-col items-center bg-white rounded-t-3xl border-4 border-b-0 border-[#C0C0C0] p-4 w-28 md:w-36 pt-8 relative overflow-hidden shadow-lg ${entries[1]?.isCurrentUser ? "ring-4 ring-primary ring-offset-4" : ""}`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="absolute top-0 w-full h-8 bg-gradient-to-b from-[#C0C0C0]/20 to-transparent" />
                  <Medal size={28} className="text-[#C0C0C0] mb-2 drop-shadow-sm" />
                  <img src={entries[1]?.avatar || doraemonImg} alt={entries[1]?.name} className="w-16 h-16 object-contain mb-2 drop-shadow-md z-10" />
                  <span className="text-sm font-black truncate w-full text-center z-10">{entries[1]?.name}</span>
                  <span className="text-lg font-black text-primary z-10">{entries[1]?.score}</span>
                </motion.div>
                
                {/* 1st place */}
                <motion.div
                  className={`flex flex-col items-center bg-white rounded-t-3xl border-4 border-b-0 border-[#FFD700] p-5 w-32 md:w-44 pt-10 -mb-4 relative overflow-hidden shadow-xl z-20 ${entries[0]?.isCurrentUser ? "ring-4 ring-primary ring-offset-4" : ""}`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="absolute top-0 w-full h-10 bg-gradient-to-b from-[#FFD700]/30 to-transparent" />
                  <Crown size={36} className="text-[#FFD700] mb-2 drop-shadow-sm" />
                  <img src={entries[0]?.avatar || doraemonImg} alt={entries[0]?.name} className="w-20 h-20 object-contain mb-2 drop-shadow-md z-10 transform scale-110" />
                  <span className="text-base font-black truncate w-full text-center z-10">{entries[0]?.name}</span>
                  <span className="text-2xl font-black text-primary z-10">{entries[0]?.score}</span>
                </motion.div>

                {/* 3rd place */}
                <motion.div
                  className={`flex flex-col items-center bg-white rounded-t-3xl border-4 border-b-0 border-[#CD7F32] p-4 w-28 md:w-36 pt-6 relative overflow-hidden shadow-lg ${entries[2]?.isCurrentUser ? "ring-4 ring-primary ring-offset-4" : ""}`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="absolute top-0 w-full h-6 bg-gradient-to-b from-[#CD7F32]/20 to-transparent" />
                  <Medal size={24} className="text-[#CD7F32] mb-2 drop-shadow-sm" />
                  <img src={entries[2]?.avatar || doraemonImg} alt={entries[2]?.name} className="w-14 h-14 object-contain mb-2 drop-shadow-md z-10" />
                  <span className="text-xs font-black truncate w-full text-center z-10">{entries[2]?.name}</span>
                  <span className="text-md font-black text-primary z-10">{entries[2]?.score}</span>
                </motion.div>
              </div>
            )}

            {/* Full ranking table */}
            <motion.div
              className="bg-white rounded-3xl border-4 border-primary/10 shadow-xl overflow-hidden mb-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="px-6 py-4 bg-[#E6F7FF] border-b-2 border-primary/10 flex justify-between items-center">
                <span className="font-heading font-black text-lg text-primary uppercase tracking-wider">All Rankings</span>
                <span className="text-xs font-bold text-primary/60">Top 20 Players</span>
              </div>
              <div className="divide-y-2 divide-primary/5 p-2">
                {entries.map((entry, i) => (
                  <motion.div
                    key={entry.name + i}
                    className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${
                      entry.isCurrentUser ? "bg-primary/10 ring-2 ring-primary shadow-sm" : "hover:bg-primary/5"
                    }`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                  >
                    <div className="w-10 flex justify-center">{getRankIcon(entry.rank)}</div>
                    <img
                      src={entry.avatar || doraemonImg}
                      alt={entry.name}
                      className="w-12 h-12 object-contain rounded-full bg-white border-2 border-primary/10 p-0.5 shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-black text-base truncate text-foreground">
                          {entry.name} {entry.isCurrentUser && <span className="text-primary text-sm ml-1">(You)</span>}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {entry.badge && badgeInfo[entry.badge] ? (
                          <span className={`text-[10px] font-bold ${badgeInfo[entry.badge].color} ${badgeInfo[entry.badge].bg} px-2 py-0.5 rounded-lg border border-current/20 flex items-center gap-1`}>
                            {badgeInfo[entry.badge].label}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-lg border border-gray-200">
                            Learner
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Score</span>
                      <span className="font-black text-primary text-2xl leading-none">{entry.score}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}

        {/* Score breakdown */}
        <motion.div
          className="bg-[#FFF9E6] rounded-3xl border-4 border-secondary/30 p-8 shadow-xl relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="absolute -top-10 -right-10 bg-secondary/20 w-40 h-40 rounded-full blur-3xl mix-blend-multiply" />
          <h3 className="font-heading text-xl font-black text-secondary-foreground mb-6 flex items-center gap-2">
            💡 How Points Are Earned
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white rounded-2xl p-4 border-2 border-secondary/20 shadow-sm transition-transform hover:-translate-y-1">
              <div className="text-primary font-black text-3xl mb-1">+25</div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Per Module</div>
            </div>
            <div className="bg-white rounded-2xl p-4 border-2 border-secondary/20 shadow-sm transition-transform hover:-translate-y-1">
              <div className="text-primary font-black text-3xl mb-1">+20</div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Per Quiz Correct</div>
            </div>
            <div className="bg-white rounded-2xl p-4 border-2 border-secondary/20 shadow-sm transition-transform hover:-translate-y-1">
              <div className="text-primary font-black text-3xl mb-1">+50</div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Game Complete</div>
            </div>
            <div className="bg-white rounded-2xl p-4 border-2 border-secondary/20 shadow-sm transition-transform hover:-translate-y-1">
              <div className="text-primary font-black text-3xl mb-1">+50</div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Simulation</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;
