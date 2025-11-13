import { FileText, MessageCircle, MessageSquare, Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { CustomAvatar } from "./CustomAvatar";
import { Input } from "./ui/input";
import { cn } from "./ui/utils";

export function AppHeader() {
  const location = useLocation();
  const isChatsActive = location.pathname.startsWith("/chats");
  const isPostsActive = location.pathname.startsWith("/posts");
  
  const { user: authUser } = useAuth();

  return (
    <header className="h-16 bg-card border-b border-border flex justify-between items-center px-4 gap-4 sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2">
        <MessageCircle className="w-8 h-8 text-primary" />
        <span className="text-xl font-semibold text-nowrap">Min Messenger</span>
      </Link>
      <div className="flex flex-1 max-w-2xl min-w-sm gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Пошук..."
            className="pl-10 bg-secondary border-0 rounded-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <Link to="/chats">
            <div
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full transition-colors",
                isChatsActive
                  ? "bg-primary text-white"
                  : "hover:bg-secondary text-muted-foreground"
              )}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Чати</span>
            </div>
          </Link>

          <Link to="/posts">
            <div
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full transition-colors",
                isPostsActive
                  ? "bg-primary text-white"
                  : "hover:bg-secondary text-muted-foreground"
              )}
            >
              <FileText className="w-4 h-4" />
              <span>Пости</span>
            </div>
          </Link>
        </div>
      </div>

      <Link to={`/profile/${authUser?.username}`}>
        <CustomAvatar name={authUser?.name || "M E"} avatarUrl={authUser?.avatar_url} size="lg" className="cursor-pointer hover:ring-2 hover:ring-primary transition-all"/>
      </Link>
    </header>
  );
}
