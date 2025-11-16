import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { useSearchUsers } from '../hooks/api/useUser';
import type { UserSearch } from '../types/user';
import { CustomAvatar } from './CustomAvatar';

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
  title = 'New Chat',
}: UserSearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query (500ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: users = [], isLoading } = useSearchUsers(debouncedQuery);

  const handleUserSelect = (user: UserSearch) => {
    onUserSelect(user);
    setSearchQuery('');
    setDebouncedQuery('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              autoFocus
            />
          </div>

          {/* Search Results */}
          <div className="max-h-[400px] overflow-y-auto space-y-1">
            {isLoading && (
              <div className="text-center py-8 text-muted-foreground">
                Loading...
              </div>
            )}

            {!isLoading && searchQuery && users.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No users found
              </div>
            )}

            {!isLoading && !searchQuery && (
              <div className="text-center py-8 text-muted-foreground">
                Start typing to search users
              </div>
            )}

            {!isLoading &&
              users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleUserSelect(user)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <CustomAvatar
                    avatarUrl={user.avatar_url}
                    name={user.name}
                    size="md"
                  />
                  <div className="flex-1 text-left">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">
                      @{user.username}
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
