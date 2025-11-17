import { ArrowDown, Loader2, MoreVertical, Phone, Video } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import {
  useConversationMessages,
  useSendConversationMessage,
  useSendDirectMessage,
} from "../hooks/api/useMessage";
import { useMe, useUserProfile } from "../hooks/api/useUser";
import { useConversationRealtime } from "../hooks/useConversationRealtime";
import type { Conversation } from "../types/conversation";
import { getConversationAvatar, getConversationTitle } from "../utils/conversation";

type ConversationType = 'existing' | 'draft';

interface ConversationViewProps {
  type: ConversationType;
}

export default function ConversationView({ type }: ConversationViewProps) {
  const { id, username } = useParams<{ id: string; username: string }>();
  const navigate = useNavigate();
  const conversationId = type === 'existing' ? Number(id) : undefined;

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);
  const previousScrollHeightRef = useRef<number>(0);

  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const { data: currentUser } = useMe();

  // For existing conversations
  const { data: conversation, isLoading: conversationLoading } = useConversationById(
    conversationId || 0,
    type === 'existing' && !!conversationId
  );
  const {
    data,
    isLoading: messagesLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useConversationMessages(conversationId || 0, type === 'existing' && !!conversationId);

  const messages = data?.messages || [];

  const sendConversationMessage = useSendConversationMessage(conversationId || 0);

  // Real-time updates for existing conversations
  useConversationRealtime(conversationId || null);

  // For draft conversations
  const { data: recipient, isLoading: recipientLoading } = useUserProfile(
    type === 'draft' ? (username || '') : ''
  );
  const sendDirectMessage = useSendDirectMessage();

  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
  }, []);

  const checkIfAtBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const threshold = 100;
    const isBottom = container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
    setIsAtBottom(isBottom);
    setShowScrollButton(!isBottom);
  }, []);

  const handleScroll = useCallback(() => {
    checkIfAtBottom();
  }, [checkIfAtBottom]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (isAtBottom && messages.length > 0) {
      scrollToBottom(true);
    }
  }, [messages.length, isAtBottom, scrollToBottom]);

  // Initial scroll to bottom on load
  useEffect(() => {
    if (messages.length > 0 && messagesContainerRef.current) {
      scrollToBottom(false);
      checkIfAtBottom();
    }
  }, [messagesLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    if (type === 'draft') return;

    const trigger = loadMoreTriggerRef.current;
    const container = messagesContainerRef.current;

    if (!trigger || !container || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && messages.length > 0 && hasNextPage && !isFetchingNextPage) {
          previousScrollHeightRef.current = container.scrollHeight;

          fetchNextPage().then(() => {
            requestAnimationFrame(() => {
              const newScrollHeight = container.scrollHeight;
              const scrollDiff = newScrollHeight - previousScrollHeightRef.current;
              container.scrollTop = container.scrollTop + scrollDiff;
            });
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
  }, [type, messages.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSendMessage = async (messageBody: string) => {
    try {
      if (type === 'existing' && conversationId) {
        await sendConversationMessage.mutateAsync({
          body: messageBody,
          type: 'text',
        });
      } else if (type === 'draft' && recipient) {
        const result = await sendDirectMessage.mutateAsync({
          recipient_id: recipient.id,
          body: messageBody,
          type: 'text',
        });
        // Navigate to the created conversation
        navigate(`/chats/${result.conversation_id}`);
      }
    } catch {
      toast.error('Failed to send message');
    }
  };

  // Loading state
  const isLoading = type === 'existing'
    ? (conversationLoading || messagesLoading || !currentUser)
    : (recipientLoading || !currentUser);

  if (isLoading) {
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

  // Error state
  if (type === 'existing' && !conversation) {
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

  if (type === 'draft' && !recipient) {
    return (
      <div className="h-screen flex flex-col bg-background">
        <AppHeader />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <main className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">User not found</p>
          </main>
        </div>
      </div>
    );
  }

  // Determine title and avatar based on type
  let title = '';
  let avatar: string | undefined = '';

  if (type === 'existing' && conversation && currentUser) {
    title = getConversationTitle(conversation, currentUser.id);
    avatar = getConversationAvatar(conversation, currentUser.id);
  } else if (type === 'draft' && recipient) {
    title = recipient.name;
    avatar = recipient.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${recipient.username}`;
  }

  const isSending = type === 'existing'
    ? sendConversationMessage.isPending
    : sendDirectMessage.isPending;

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
                <p className="text-sm text-muted-foreground">
                  {type === 'draft' ? 'Start conversation' : 'онлайн'}
                </p>
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
                  {type === 'existing' && (
                    <>
                      <DropdownMenuItem>Очистити історію</DropdownMenuItem>
                      <DropdownMenuItem>Вимкнути сповіщення</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Видалити чат</DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Messages or Empty State */}
          {type === 'draft' ? (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center text-muted-foreground space-y-2">
                <p className="text-lg">Start a new conversation</p>
                <p className="text-sm">Send a message to begin chatting</p>
              </div>
            </div>
          ) : (
            <div
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto p-4 space-y-2 relative"
            >
              {/* Load more trigger */}
              <div ref={loadMoreTriggerRef} className="h-1" />

              {/* Loading indicator */}
              {isFetchingNextPage && (
                <div className="flex justify-center py-2">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              )}

              {/* No more messages */}
              {!hasNextPage && messages.length > 0 && (
                <div className="flex justify-center py-2">
                  <p className="text-xs text-muted-foreground">Початок розмови</p>
                </div>
              )}

              {/* Messages */}
              {messages.map((msg) => (
                <ChatBubble
                  key={msg.id}
                  message={msg}
                  currentUserId={currentUser!.id}
                  conversation={conversation as Conversation}
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
          )}

          {/* Message Input */}
          <MessageInput
            onSend={handleSendMessage}
            isLoading={isSending}
          />
        </main>
      </div>
    </div>
  );
}
