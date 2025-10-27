import { FileText, MessageSquare } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ChatList } from "./ChatList";
import { cn } from "./ui/utils";

export function Sidebar() {
  const location = useLocation();
  const isChatsActive = location.pathname.startsWith("/chats");
  const isPostsActive = location.pathname.startsWith("/posts");

  return (
    <aside className="w-full md:w-80 bg-card border-r border-border h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex gap-2">
          <Link to="/chats" className="flex-1">
            <div
              className={cn(
                "flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors",
                isChatsActive
                  ? "bg-primary text-white"
                  : "hover:bg-secondary text-muted-foreground"
              )}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Чати</span>
            </div>
          </Link>

          <Link to="/posts" className="flex-1">
            <div
              className={cn(
                "flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors",
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

      {isChatsActive && <ChatList />}
    </aside>
  );
}
