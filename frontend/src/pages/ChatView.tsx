import { ArrowDown, Loader2, MoreVertical, Phone, Video } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { useConversationMessages, useLoadMoreMessages, useSendConversationMessage } from "../hooks/api/useMessage";
import { useMe } from "../hooks/api/useUser";
import { getConversationAvatar, getConversationTitle } from "../utils/conversation";

export default function ChatView() {
  const { id } = useParams<{ id: string }>();
  const conversationId = Number(id);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);
  const previousScrollHeightRef = useRef<number>(0);

  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { data: conversation, isLoading: conversationLoading } = useConversationById(conversationId);
  const { data: messages = [], isLoading: messagesLoading } = useConversationMessages(conversationId);
  const { data: currentUser } = useMe();
  const sendMessage = useSendConversationMessage(conversationId);
  const loadMore = useLoadMoreMessages(conversationId);

  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
  }, []);

  // Check if user is at bottom of scroll
  const checkIfAtBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const threshold = 100;
    const isBottom = container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
    setIsAtBottom(isBottom);
    setShowScrollButton(!isBottom);
  }, []);

  // Handle scroll event
  const handleScroll = useCallback(() => {
    checkIfAtBottom();
  }, [checkIfAtBottom]);

  // Auto-scroll to bottom when new messages arrive (only if already at bottom)
  useEffect(() => {
    if (isAtBottom && messages.length > 0) {
      scrollToBottom(true);
    }
  }, [messages, isAtBottom, scrollToBottom]);

  // Initial scroll to bottom on load
  useEffect(() => {
    if (messages.length > 0 && messagesContainerRef.current) {
      scrollToBottom(false);
      checkIfAtBottom();
    }
  }, [messagesLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  // IntersectionObserver for infinite scroll (load older messages)
  useEffect(() => {
    const trigger = loadMoreTriggerRef.current;
    const container = messagesContainerRef.current;

    if (!trigger || !container || !hasMore || loadMore.isPending) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && messages.length > 0 && hasMore && !loadMore.isPending) {
          const oldestMessage = messages[0];

          // Store current scroll height to restore position after loading
          previousScrollHeightRef.current = container.scrollHeight;

          loadMore.mutate(oldestMessage.id, {
            onSuccess: (newMessages) => {
              // If less than 50 messages returned, we've reached the end
              if (newMessages.length < 50) {
                setHasMore(false);
              }

              // Restore scroll position after prepending messages
              requestAnimationFrame(() => {
                const newScrollHeight = container.scrollHeight;
                const scrollDiff = newScrollHeight - previousScrollHeightRef.current;
                container.scrollTop = container.scrollTop + scrollDiff;
              });
            },
          });
        }
      },
      {
        root: container,
        threshold: 0.1,
      }
    );

    observer.observe(trigger);

    return () => observer.disconnect();
  }, [messages, hasMore, loadMore]);

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
          <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 space-y-2 relative"
          >
            {/* Load more trigger (invisible element at top) */}
            <div ref={loadMoreTriggerRef} className="h-1" />

            {/* Loading indicator at top */}
            {loadMore.isPending && (
              <div className="flex justify-center py-2">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            )}

            {/* No more messages indicator */}
            {!hasMore && messages.length > 0 && (
              <div className="flex justify-center py-2">
                <p className="text-xs text-muted-foreground">Початок розмови</p>
              </div>
            )}

            {/* Messages */}
            {messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                message={msg}
                currentUserId={currentUser.id}
                conversation={conversation}
              />
            ))}
            <div ref={messagesEndRef} />

            {/* Scroll to bottom button */}
            {showScrollButton && (
              <Button
                onClick={() => scrollToBottom(true)}
                size="icon"
                className="fixed bottom-24 right-8 rounded-full shadow-lg bg-primary hover:bg-primary/90 z-10"
              >
                <ArrowDown className="w-5 h-5" />
              </Button>
            )}
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
