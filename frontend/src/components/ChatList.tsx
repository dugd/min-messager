import { Link, useParams } from "react-router-dom";
import { CustomAvatar } from './CustomAvatar';
import { cn } from "./ui/utils";

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread?: number;
}

const mockChats: Chat[] = [
  {
    id: "1",
    name: "Олена Коваленко",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=olena",
    lastMessage: "Привіт! Як справи?",
    time: "12:45",
    unread: 2,
  },
  {
    id: "2",
    name: "Андрій Шевченко",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=andriy",
    lastMessage: "Дякую за допомогу!",
    time: "11:30",
  },
  {
    id: "3",
    name: "Project Team",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=projectteam",
    lastMessage: "Alice: Зустріч о 15:00",
    time: "10:20",
  },
  {
    id: "4",
    name: "Марія Петренко",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria",
    lastMessage: "До зустрічі завтра 👋",
    time: "Вчора",
  },
  {
    id: "5",
    name: "Дизайн команда",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=design",
    lastMessage: "Новий макет готовий",
    time: "Вчора",
  },
  {
    id: "6",
    name: "Іван Мельник",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ivan",
    lastMessage: "Відправив файли",
    time: "Пт",
  },
];

export function ChatList() {
  const { id } = useParams();

  if (mockChats.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground p-8 text-center">
        <p>Немає чатів. Створіть новий або групу.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {mockChats.map((chat) => (
        <Link
          key={chat.id}
          to={`/chats/${chat.id}`}
          className={cn(
            "flex items-center gap-3 p-4 hover:bg-secondary transition-colors cursor-pointer border-b border-border/50",
            id === chat.id && "bg-secondary"
          )}
        >
          <CustomAvatar avatarUrl={chat.avatar} name={chat.name} size="lg"/>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="truncate">{chat.name}</h3>
              <span className="text-xs text-muted-foreground">{chat.time}</span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
              {chat.unread && (
                <span className="ml-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                  {chat.unread}
                </span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
