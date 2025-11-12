import { MessageSquare, Plus, Users } from "lucide-react";
import { useState } from "react";
import { AppHeader } from "../components/AppHeader";
import { GroupCreateModal } from "../components/GroupCreateModal";
import { Sidebar } from "../components/Sidebar";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";

export default function Chats() {
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [isGroupCreateOpen, setIsGroupCreateOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-background">
      <AppHeader />

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-full md:w-80 bg-card border-r border-border h-full flex flex-col">
          <Sidebar />

          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
                <DialogTrigger asChild>
                  <Button className="flex-1 bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Новий чат
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border">
                  <DialogHeader>
                    <DialogTitle>Новий чат</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input placeholder="Введіть ім'я користувача..." className="bg-secondary border-0" />
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      Створити чат
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

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
        </aside>

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

      <GroupCreateModal
        open={isGroupCreateOpen}
        onOpenChange={setIsGroupCreateOpen}
      />
    </div>
  );
}
