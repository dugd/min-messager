import { Plus, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { UserSearchDialog } from "./UserSearchDialog";
import { GroupCreateModal } from "./GroupCreateModal";
import { useConversations } from "../hooks/api/useConversation";
import { useMe } from "../hooks/api/useUser";
import type { UserSearch } from "../types/user";
import { getOtherParticipant } from "../utils/conversation";

export function ChatActionsHeader() {
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
      navigate(`/chats/${existingConversation.id}`);
    } else {
      navigate(`/chats/new/${user.username}`);
    }
  };

  return (
    <>
      <div className="p-4 border-b border-border">
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
    </>
  );
}
