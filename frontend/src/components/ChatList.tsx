import { Link, useParams } from "react-router-dom";
import { CustomAvatar } from './CustomAvatar';
import { cn } from "./ui/utils";
import { useConversations } from '../hooks/api/useConversation';
import { useMe } from '../hooks/api/useUser';
import { getConversationTitle, getConversationAvatar, formatMessageTime } from '../utils/conversation';

export function ChatList() {
  const { id } = useParams();
  const { data: conversations = [], isLoading } = useConversations();
  const { data: currentUser } = useMe();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <p>Loading...</p>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground p-8 text-center">
        <p>Немає чатів. Створіть новий або групу.</p>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conversation) => {
        const title = getConversationTitle(conversation, currentUser.id);
        const avatar = getConversationAvatar(conversation, currentUser.id);
        const lastMessageTime = conversation.last_message
          ? formatMessageTime(conversation.last_message.created_at)
          : '';
        const lastMessageBody = conversation.last_message?.body || '';

        return (
          <Link
            key={conversation.id}
            to={`/chats/${conversation.id}`}
            className={cn(
              "flex items-center gap-3 p-4 hover:bg-secondary transition-colors cursor-pointer border-b border-border/50",
              id === String(conversation.id) && "bg-secondary"
            )}
          >
            <CustomAvatar avatarUrl={avatar} name={title} size="lg"/>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="truncate">{title}</h3>
                <span className="text-xs text-muted-foreground">{lastMessageTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground truncate">{lastMessageBody}</p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
