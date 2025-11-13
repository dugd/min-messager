import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CustomAvatar } from "./CustomAvatar";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
}

const availableUsers: User[] = [
  {
    id: "alice",
    name: "Alice",
    username: "alice",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
  },
  {
    id: "bob",
    name: "Bob",
    username: "bob",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
  },
  {
    id: "carol",
    name: "Carol",
    username: "carol",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carol",
  },
  {
    id: "olena",
    name: "Олена Коваленко",
    username: "olena_k",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=olena",
  },
  {
    id: "andriy",
    name: "Андрій Шевченко",
    username: "andriy_s",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=andriy",
  },
];

interface GroupCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GroupCreateModal({ open, onOpenChange }: GroupCreateModalProps) {
  const [groupName, setGroupName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const navigate = useNavigate();

  const filteredUsers = availableUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreate = () => {
    if (!groupName.trim()) {
      return;
    }

    if (selectedUsers.length === 0) {
      return;
    }

    // Create new group chat with ID
    const newGroupId = `group-${Date.now()}`;

    onOpenChange(false);

    // Reset form
    setGroupName("");
    setSearchQuery("");
    setSelectedUsers([]);

    // Navigate to new chat
    navigate(`/chats/${newGroupId}`);
  };

  const handleCancel = () => {
    setGroupName("");
    setSearchQuery("");
    setSelectedUsers([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle>Нова група</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Пошук користувачів..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-secondary border-0"
              />
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 border border-border rounded-lg p-2 bg-secondary/50">
              {filteredUsers.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Користувачів не знайдено
                </p>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-2 hover:bg-secondary rounded-lg cursor-pointer"
                    onClick={() => handleToggleUser(user.id)}
                  >
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => handleToggleUser(user.id)}
                    />
                    <CustomAvatar name={user.name} avatarUrl={user.avatar} size="sm"/>
                    <div className="flex-1 min-w-0">
                      <p className="truncate">{user.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        @{user.username}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {selectedUsers.length > 0 && (
              <p className="text-sm text-muted-foreground">
                Обрано: {selectedUsers.length}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1 border-border hover:bg-secondary"
            >
              Скасувати
            </Button>
            <Button
              onClick={handleCreate}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Створити
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
