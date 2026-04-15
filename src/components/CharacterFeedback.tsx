import { motion } from "framer-motion";
import doraemonImg from "@/assets/doraemon.png";
import nobitaImg from "@/assets/nobita.png";
import dekisugiImg from "@/assets/dekisugi.png";
import shizukaImg from "@/assets/shizuka.png";
import suneoImg from "@/assets/suneo.png";
import gianImg from "@/assets/gian.png";

type CharacterType = "doraemon" | "nobita" | "dekisugi" | "shizuka" | "suneo" | "gian";

const charImages: Record<CharacterType, string> = {
  doraemon: doraemonImg,
  nobita: nobitaImg,
  dekisugi: dekisugiImg,
  shizuka: shizukaImg,
  suneo: suneoImg,
  gian: gianImg,
};

interface CharacterFeedbackProps {
  character?: CharacterType;
  message: string;
  className?: string;
}

export default function CharacterFeedback({ character = "doraemon", message, className = "" }: CharacterFeedbackProps) {
  const isFailed = character === "nobita";
  const isSuccess = character === "dekisugi";
  
  let borderColor = "border-primary/30";
  let bgColor = "bg-doraemon-light-blue";

  if (isFailed) {
    borderColor = "border-destructive/30";
    bgColor = "bg-destructive/10";
  } else if (isSuccess) {
    borderColor = "border-success/30";
    bgColor = "bg-success/10";
  }

  return (
    <div className={`flex items-end gap-3 ${className}`}>
      <img
        src={charImages[character]}
        alt={character}
        className="w-16 h-16 object-contain animate-bounce-gentle"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, x: -10 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        className={`${bgColor} border ${borderColor} rounded-2xl rounded-bl-none px-4 py-3 text-sm font-semibold shadow-sm max-w-[280px] sm:max-w-md text-foreground`}
      >
        {message}
      </motion.div>
    </div>
  );
}
