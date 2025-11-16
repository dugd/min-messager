import { Check, CheckCheck } from "lucide-react";
import type { Conversation } from "../types/conversation";
import type { Message } from "../types/message";
import { formatMessageTime, isDeletedMessage, isEditedMessage, isMyMessage } from "../utils/message";
import { CustomAvatar } from "./CustomAvatar";
import { cn } from "./ui/utils";

interface ChatBubbleProps {
  message: Message;
  currentUserId: number;
  conversation: Conversation;
  isRead?: boolean;
}

export function ChatBubble({ message, currentUserId, conversation, isRead }: ChatBubbleProps) {
  const isMine = isMyMessage(message, currentUserId);
  const isEdited = isEditedMessage(message);
  const isDeleted = isDeletedMessage(message);
  const time = formatMessageTime(message.created_at);
  const isGroupChat = conversation.type === 'group';

  const sender = conversation.participants.find(p => p.id === message.sender_id);
  const senderName = sender?.name || 'Unknown';
  const senderAvatar = sender?.avatar_url;

  return (
    <div className={cn("flex gap-2 mb-4 animate-in fade-in-0 slide-in-from-bottom-2", isMine ? "justify-end" : "justify-start")}>
      {!isMine && (
        <CustomAvatar
          avatarUrl={senderAvatar}
          name={senderName}
          size="sm"
          className="mt-1"
        />
      )}

      <div className={cn("flex flex-col", isMine ? "items-end" : "items-start")}>
        {!isMine && isGroupChat && (
          <span className="text-xs font-medium text-muted-foreground mb-1 px-1">
            {senderName}
          </span>
        )}

        <div
          className={cn(
            "max-w-[70%] min-w-30 rounded-2xl px-4 py-2",
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

      {isMine && (
        <CustomAvatar
          avatarUrl={senderAvatar}
          name={senderName}
          size="sm"
          className="mt-1"
        />
      )}
    </div>
  );
}
