import doraemonImg from "@/assets/doraemon.png";

interface MentorBubbleProps {
  message: string;
  className?: string;
}

const MentorBubble = ({ message, className = "" }: MentorBubbleProps) => (
  <div className={`flex items-start gap-3 ${className}`}>
    <img src={doraemonImg} alt="AI Mentor" className="w-16 h-16 object-contain animate-bounce-gentle flex-shrink-0" />
    <div className="bg-doraemon-light-blue border border-primary/20 rounded-2xl rounded-bl-none px-4 py-3 text-sm font-semibold text-foreground shadow-sm max-w-md">
      {message}
    </div>
  </div>
);

export default MentorBubble;
