import type { UserSearch } from "../types/user";
import { BaseModal } from "./BaseModal";
import { UserSearchInput } from "./UserSearchInput";

interface UserSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserSelect: (user: UserSearch) => void;
  title?: string;
}

export function UserSearchDialog({
  open,
  onOpenChange,
  onUserSelect,
  title = "Новий чат",
}: UserSearchDialogProps) {
  const handleUserSelect = (user: UserSearch) => {
    onUserSelect(user);
    onOpenChange(false);
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      footer={null}
    >
      <UserSearchInput mode="single" onUserSelect={handleUserSelect} />
    </BaseModal>
  );
}
