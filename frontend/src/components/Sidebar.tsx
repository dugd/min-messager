import { useLocation } from "react-router-dom";
import { ChatActionsHeader } from "./ChatActionsHeader";
import { ChatList } from "./ChatList";

export function Sidebar() {
  const location = useLocation();
  const isChatsActive = location.pathname.startsWith("/chats");

  return (
    <aside className="w-full md:w-80 bg-card border-r border-border h-full flex flex-col">
      <ChatActionsHeader />
      {isChatsActive && <ChatList />}
    </aside>
  );
}
