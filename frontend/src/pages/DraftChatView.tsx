import { MoreVertical, Phone, Video } from "lucide-react";
import { useParams } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";
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

/**
 * DraftChatView - Placeholder for new direct message conversations
 *
 * TODO: Implement draft chat functionality
 *
 * Implementation plan:
 * 1. Get recipientId from URL params
 * 2. Fetch recipient user info using useUserProfile or similar hook
 * 3. Use useSendDirectMessage() hook to send first message
 * 4. On successful send, navigate to the created conversation using conversation_id from response
 * 5. Show empty state with "Start conversation" message
 * 6. Handle loading states and errors
 *
 * Example implementation:
 * ```typescript
 * const { recipientId } = useParams<{ recipientId: string }>();
 * const { data: recipient } = useUserProfile(recipientId); // Need to create by-ID variant
 * const sendDirectMessage = useSendDirectMessage();
 * const navigate = useNavigate();
 *
 * const handleSend = async (message: string) => {
 *   try {
 *     const result = await sendDirectMessage.mutateAsync({
 *       recipient_id: Number(recipientId),
 *       body: message,
 *       type: 'text'
 *     });
 *     // Navigate to the created conversation
 *     navigate(`/chats/${result.conversation_id}`);
 *   } catch (error) {
 *     toast.error('Failed to send message');
 *   }
 * };
 * ```
 */

export default function DraftChatView() {
  const { recipientId } = useParams<{ recipientId: string }>();
  // const navigate = useNavigate();

  // TODO: Fetch recipient user information
  // const { data: recipient, isLoading } = useUserProfile(recipientId);

  // TODO: Initialize sendDirectMessage hook
  // const sendDirectMessage = useSendDirectMessage();

  // TODO: Implement handleSend function
  const handleSendMessage = (message: string) => {
    console.log('TODO: Send direct message to recipient', recipientId, message);
    // Implementation needed - see comments above
  };

  // TODO: Add loading state when fetching recipient
  // if (isLoading) { return <LoadingState />; }

  // TODO: Add error state if recipient not found
  // if (!recipient) { return <NotFoundState />; }

  return (
    <div className="h-screen flex flex-col bg-background">
      <AppHeader />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 flex flex-col bg-background">
          {/* Chat Header */}
          <div className="h-16 bg-card border-b border-border flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              {/* TODO: Use recipient avatar and name */}
              <CustomAvatar avatarUrl={undefined} name="Loading..." size="md"/>
              <div>
                <h3>Draft Chat (Recipient ID: {recipientId})</h3>
                <p className="text-sm text-muted-foreground">TODO: Show recipient status</p>
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
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Empty State */}
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center text-muted-foreground space-y-2">
              <p className="text-lg">Start a new conversation</p>
              <p className="text-sm">Send a message to begin chatting</p>
            </div>
          </div>

          {/* Message Input */}
          <MessageInput
            onSend={handleSendMessage}
            // TODO: Pass isLoading={sendDirectMessage.isPending}
          />
        </main>
      </div>
    </div>
  );
}
