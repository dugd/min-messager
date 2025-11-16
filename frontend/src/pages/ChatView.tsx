import { MoreVertical, Phone, Video } from "lucide-react";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { AppHeader } from "../components/AppHeader";
import { ChatBubble } from "../components/ChatBubble";
import { CustomAvatar } from "../components/CustomAvatar";
import { MessageInput } from "../components/MessageInput";
import { Sidebar } from "../components/Sidebar";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { useConversationById } from "../hooks/api/useConversation";
import { useConversationMessages, useSendConversationMessage } from "../hooks/api/useMessage";
import { useMe } from "../hooks/api/useUser";
import { getConversationAvatar, getConversationTitle } from "../utils/conversation";

export default function ChatView() {
  const { id } = useParams<{ id: string }>();
  const conversationId = Number(id);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: conversation, isLoading: conversationLoading } = useConversationById(conversationId);
  const { data: messages = [], isLoading: messagesLoading } = useConversationMessages(conversationId);
  const { data: currentUser } = useMe();
  const sendMessage = useSendConversationMessage(conversationId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageBody: string) => {
    try {
      await sendMessage.mutateAsync({
        body: messageBody,
        type: 'text',
      });
    } catch {
      toast.error('Failed to send message');
    }
  };

  if (conversationLoading || messagesLoading || !currentUser) {
    return (
      <div className="h-screen flex flex-col bg-background">
        <AppHeader />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <main className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </main>
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="h-screen flex flex-col bg-background">
        <AppHeader />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <main className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Conversation not found</p>
          </main>
        </div>
      </div>
    );
  }

  const title = getConversationTitle(conversation, currentUser.id);
  const avatar = getConversationAvatar(conversation, currentUser.id);

  return (
    <div className="h-screen flex flex-col bg-background">
      <AppHeader />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 flex flex-col bg-background">
          {/* Chat Header */}
          <div className="h-16 bg-card border-b border-border flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <CustomAvatar avatarUrl={avatar} name={title} size="md"/>
              <div>
                <h3>{title}</h3>
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
                message={msg}
                currentUserId={currentUser.id}
                conversation={conversation}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <MessageInput
            onSend={handleSendMessage}
            isLoading={sendMessage.isPending}
          />
        </main>
      </div>
    </div>
  );
}
