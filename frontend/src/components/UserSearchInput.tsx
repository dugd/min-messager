import { Search } from "lucide-react";
import { useState } from "react";
import { useSearchUsers } from "../hooks/api/useUser";
import { useDebounce } from "../hooks/useDebounce";
import type { UserSearch } from "../types/user";
import { CustomAvatar } from "./CustomAvatar";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";

type UserSearchInputProps =
  | {
      mode: "single";
      onUserSelect: (user: UserSearch) => void;
      placeholder?: string;
    }
  | {
      mode: "multi";
      selectedUserIds: number[];
      onToggleUser: (userId: number) => void;
      placeholder?: string;
      showSelectedCount?: boolean;
    };

export function UserSearchInput(props: UserSearchInputProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 500);

  const { data: users = [], isLoading } = useSearchUsers(debouncedQuery);

  const placeholder = props.placeholder || "Пошук користувачів...";

  const handleUserClick = (user: UserSearch) => {
    if (props.mode === "single") {
      props.onUserSelect(user);
      setSearchQuery("");
    } else {
      props.onToggleUser(user.id);
    }
  };

  const isUserSelected = (userId: number): boolean => {
    if (props.mode === "multi") {
      return props.selectedUserIds.includes(userId);
    }
    return false;
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 bg-secondary border-0"
        />
      </div>

      <div className="max-h-60 overflow-y-auto space-y-2 border border-border rounded-lg p-2 bg-secondary/50">
        {isLoading ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Завантаження...
          </p>
        ) : searchQuery.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Почніть вводити для пошуку
          </p>
        ) : users.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Користувачів не знайдено
          </p>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 p-2 hover:bg-secondary rounded-lg cursor-pointer"
              onClick={() => handleUserClick(user)}
            >
              {props.mode === "multi" && (
                <Checkbox
                  checked={isUserSelected(user.id)}
                  onCheckedChange={() => handleUserClick(user)}
                />
              )}
              <CustomAvatar name={user.name} avatarUrl={user.avatar_url} size="sm" />
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

      {props.mode === "multi" &&
        props.showSelectedCount &&
        props.selectedUserIds.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Обрано: {props.selectedUserIds.length}
          </p>
        )}
    </div>
  );
}
