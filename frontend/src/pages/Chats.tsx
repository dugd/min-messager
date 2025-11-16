import { MessageSquare } from "lucide-react";
import { AppHeader } from "../components/AppHeader";
import { Sidebar } from "../components/Sidebar";

export default function Chats() {
  return (
    <div className="h-screen flex flex-col bg-background">
      <AppHeader />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

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
    </div>
  );
}
