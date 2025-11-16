import { Check, CheckCheck } from "lucide-react";
import { cn } from "./ui/utils";
import type { Message } from "../types/message";
import { formatMessageTime, isMyMessage, isEditedMessage, isDeletedMessage } from "../utils/message";

interface ChatBubbleProps {
  message: Message;
  currentUserId: number;
  isRead?: boolean;
}

export function ChatBubble({ message, currentUserId, isRead }: ChatBubbleProps) {
  const isMine = isMyMessage(message, currentUserId);
  const isEdited = isEditedMessage(message);
  const isDeleted = isDeletedMessage(message);
  const time = formatMessageTime(message.created_at);

  return (
    <div className={cn("flex mb-4 animate-in fade-in-0 slide-in-from-bottom-2", isMine ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[70%] rounded-2xl px-4 py-2",
          isMine ? "bg-primary text-white rounded-br-sm" : "bg-secondary text-foreground rounded-bl-sm"
        )}
      >
        <p className="break-words">
          {isDeleted ? (
            <span className="italic opacity-70">This message was deleted</span>
          ) : (
            message.body
          )}
        </p>
        <div className={cn("flex items-center gap-1 justify-end mt-1", isMine ? "text-white/70" : "text-muted-foreground")}>
          <span className="text-xs">
            {time}
            {isEdited && !isDeleted && ' (edited)'}
          </span>
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
