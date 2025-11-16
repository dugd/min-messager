import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateConversation } from "../hooks/api/useConversation";
import { BaseModal } from "./BaseModal";
import { UserSearchInput } from "./UserSearchInput";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface GroupCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GroupCreateModal({ open, onOpenChange }: GroupCreateModalProps) {
  const [groupName, setGroupName] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const navigate = useNavigate();
  const createConversation = useCreateConversation();

  const handleToggleUser = (userId: number) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreate = async () => {
    if (!groupName.trim() || selectedUserIds.length === 0) {
      return;
    }

    try {
      const conversation = await createConversation.mutateAsync({
        type: "group",
        title: groupName,
        participants: selectedUserIds,
      });

      onOpenChange(false);
      setGroupName("");
      setSelectedUserIds([]);

      navigate(`/chats/${conversation.id}`);
    } catch (error) {
      console.error("Failed to create group:", error);
    }
  };

  const handleCancel = () => {
    setGroupName("");
    setSelectedUserIds([]);
  };

  const isFormValid = groupName.trim().length > 0 && selectedUserIds.length > 0;

  return (
    <BaseModal
      open={open}
      onOpenChange={onOpenChange}
      title="Нова група"
      onCancel={handleCancel}
      onConfirm={handleCreate}
      confirmLabel="Створити"
      cancelLabel="Скасувати"
      confirmDisabled={!isFormValid}
      confirmLoading={createConversation.isPending}
    >
      <div className="space-y-2">
        <Label htmlFor="groupName">Назва групи</Label>
        <Input
          id="groupName"
          placeholder="Введіть назву групи..."
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="bg-secondary border-0"
        />
      </div>

      <div className="space-y-2">
        <Label>Учасники</Label>
        <UserSearchInput
          mode="multi"
          selectedUserIds={selectedUserIds}
          onToggleUser={handleToggleUser}
          placeholder="Пошук користувачів..."
          showSelectedCount={true}
        />
      </div>
    </BaseModal>
  );
}
