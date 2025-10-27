import { Check, CheckCheck } from "lucide-react";
import { cn } from "./ui/utils";

interface ChatBubbleProps {
  message: string;
  time: string;
  isMine: boolean;
  isRead?: boolean;
}

export function ChatBubble({ message, time, isMine, isRead }: ChatBubbleProps) {
  return (
    <div className={cn("flex mb-4 animate-in fade-in-0 slide-in-from-bottom-2", isMine ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[70%] rounded-2xl px-4 py-2",
          isMine ? "bg-primary text-white rounded-br-sm" : "bg-secondary text-foreground rounded-bl-sm"
        )}
      >
        <p className="break-words">{message}</p>
        <div className={cn("flex items-center gap-1 justify-end mt-1", isMine ? "text-white/70" : "text-muted-foreground")}>
          <span className="text-xs">{time}</span>
          {isMine && (
            <span>
              {isRead ? (
                <CheckCheck className="w-3 h-3" />
              ) : (
                <Check className="w-3 h-3" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
