import { MessageSquare, Plus, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";
import { GroupCreateModal } from "../components/GroupCreateModal";
import { Sidebar } from "../components/Sidebar";
import { UserSearchDialog } from "../components/UserSearchDialog";
import { Button } from "../components/ui/button";
import { useConversations } from "../hooks/api/useConversation";
import { useMe } from "../hooks/api/useUser";
import type { UserSearch } from "../types/user";
import { getOtherParticipant } from "../utils/conversation";

export default function Chats() {
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [isGroupCreateOpen, setIsGroupCreateOpen] = useState(false);
  const navigate = useNavigate();
  const { data: conversations = [] } = useConversations();
  const { data: currentUser } = useMe();

  const handleUserSelect = (user: UserSearch) => {
    if (!currentUser) return;

    // Check if a direct conversation already exists with this user
    const existingConversation = conversations.find((conv) => {
      if (conv.type !== 'direct') return false;
      const otherParticipant = getOtherParticipant(conv, currentUser.id);
      return otherParticipant?.id === user.id;
    });

    if (existingConversation) {
      // Navigate to existing conversation
      navigate(`/chats/${existingConversation.id}`);
    } else {
      // Navigate to draft chat
      navigate(`/chats/new/${user.id}`);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <AppHeader />

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-full md:w-80 bg-card border-r border-border h-full flex flex-col">
          <Sidebar />

          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Button
                onClick={() => setIsNewChatOpen(true)}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Новий чат
              </Button>

              <Button
                onClick={() => setIsGroupCreateOpen(true)}
                variant="outline"
                className="flex-1 border-border hover:bg-secondary"
              >
                <Users className="w-4 h-4 mr-2" />
                Нова група
              </Button>
            </div>
          </div>
        </aside>

        <main className="flex-1 flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <MessageSquare className="w-20 h-20 text-muted-foreground mx-auto opacity-50" />
            <div className="space-y-2">
              <h2 className="text-2xl text-muted-foreground">Виберіть чат</h2>
              <p className="text-muted-foreground">
                Оберіть чат зліва або створіть новий, щоб почати спілкування
              </p>
            </div>
          </div>
        </main>
      </div>

      <UserSearchDialog
        open={isNewChatOpen}
        onOpenChange={setIsNewChatOpen}
        onUserSelect={handleUserSelect}
        title="Новий чат"
      />

      <GroupCreateModal
        open={isGroupCreateOpen}
        onOpenChange={setIsGroupCreateOpen}
      />
    </div>
  );
}
