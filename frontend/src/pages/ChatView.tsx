import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";
import { Sidebar } from "../components/Sidebar";
import { ChatBubble } from "../components/ChatBubble";
import { MessageInput } from "../components/MessageInput";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { MoreVertical, Phone, Video } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

interface Message {
  id: string;
  message: string;
  time: string;
  isMine: boolean;
  isRead?: boolean;
}

const mockMessages: Record<string, Message[]> = {
  "1": [
    { id: "1", message: "Привіт! Як справи?", time: "12:30", isMine: false },
    { id: "2", message: "Вітаю! Все добре, дякую!", time: "12:32", isMine: true, isRead: true },
    { id: "3", message: "А у тебе як?", time: "12:32", isMine: true, isRead: true },
    { id: "4", message: "Теж непогано! Працюю над новим проєктом", time: "12:35", isMine: false },
    { id: "5", message: "Цікаво! Розкажеш детальніше?", time: "12:40", isMine: true, isRead: false },
  ],
  "2": [
    { id: "1", message: "Дякую за допомогу!", time: "11:30", isMine: false },
    { id: "2", message: "Будь ласка! Звертайся, якщо ще щось потрібно", time: "11:31", isMine: true, isRead: true },
  ],
  "3": [
    { id: "1", message: "Зустріч о 15:00, так?", time: "10:15", isMine: false },
    { id: "2", message: "Так, підтверджую!", time: "10:16", isMine: true, isRead: true },
    { id: "3", message: "Чудово! До зустрічі", time: "10:20", isMine: false },
  ],
  "4": [
    { id: "1", message: "До зустрічі завтра 👋", time: "16:20", isMine: false },
    { id: "2", message: "До побачення! До завтра 😊", time: "16:22", isMine: true, isRead: true },
  ],
};

const chatInfo: Record<string, { name: string; avatar: string }> = {
  "1": { name: "Олена Коваленко", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=olena" },
  "2": { name: "Андрій Шевченко", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=andriy" },
  "3": { name: "Project Team", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=projectteam" },
  "4": { name: "Марія Петренко", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria" },
  "5": { name: "Дизайн команда", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=design" },
  "6": { name: "Іван Мельник", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ivan" },
};

export default function ChatView() {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>(mockMessages[id || "1"] || []);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setMessages(mockMessages[id || "1"] || []);
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (message: string) => {
    const newMessage: Message = {
      id: String(messages.length + 1),
      message,
      time: new Date().toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" }),
      isMine: true,
      isRead: false,
    };
    setMessages([...messages, newMessage]);
  };

  const chat = chatInfo[id || "1"];

  return (
    <div className="h-screen flex flex-col bg-background">
      <AppHeader />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 flex flex-col bg-background">
          {/* Chat Header */}
          <div className="h-16 bg-card border-b border-border flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={chat?.avatar} />
                <AvatarFallback>{chat?.name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3>{chat?.name || "Невідомий"}</h3>
                <p className="text-sm text-muted-foreground">онлайн</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="hover:bg-secondary">
                <Phone className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-secondary">
                <Video className="w-5 h-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-secondary">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card border-border">
                  <DropdownMenuItem>Переглянути профіль</DropdownMenuItem>
                  <DropdownMenuItem>Очистити історію</DropdownMenuItem>
                  <DropdownMenuItem>Вимкнути сповіщення</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Видалити чат</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                message={msg.message}
                time={msg.time}
                isMine={msg.isMine}
                isRead={msg.isRead}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <MessageInput onSend={handleSendMessage} />
        </main>
      </div>
    </div>
  );
}
