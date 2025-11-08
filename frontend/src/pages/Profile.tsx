import { Grid, Heart, MessageCircle } from "lucide-react";
import { useParams } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";
import { Sidebar } from "../components/Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

const mockPosts = [
  { id: "1", content: "Чудовий день для нових проєктів! 🚀", likes: 24, time: "2 години тому" },
  { id: "2", content: "Щойно завершив роботу над новим дизайном. Хочете побачити?", likes: 18, time: "5 годин тому" },
  { id: "3", content: "Дякую всім за підтримку! Ви найкращі 💙", likes: 42, time: "1 день тому" },
  { id: "4", content: "Новий пост з цікавими ідеями для розвитку проєкту", likes: 15, time: "2 дні тому" },
];

export default function Profile() {
  const { username } = useParams<{ username: string }>();

  return (
    <div className="h-screen flex flex-col bg-background">
      <AppHeader />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto bg-background">
          <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Profile Header */}
            <Card className="bg-card border-border p-8">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <Avatar className="w-32 h-32">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
                  <AvatarFallback>ME</AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl mb-2">Олександр Коваленко</h1>
                  <p className="text-muted-foreground mb-4">@{username || "me"}</p>
                  <p className="mb-6">
                    UX/UI Designer | Створюю красиві та зручні інтерфейси 🎨
                  </p>
                  
                  {/* won't be implemented */}
                  {/* <div className="flex gap-6 justify-center md:justify-start mb-6">
                    <div>
                      <div className="text-2xl">156</div>
                      <div className="text-sm text-muted-foreground">Постів</div>
                    </div>
                    <div>
                      <div className="text-2xl">842</div>
                      <div className="text-sm text-muted-foreground">Підписників</div>
                    </div>
                    <div>
                      <div className="text-2xl">291</div>
                      <div className="text-sm text-muted-foreground">Підписки</div>
                    </div>
                  </div> */}

                  <div className="flex gap-3 justify-center md:justify-start">
                    <Button className="bg-primary hover:bg-primary/90">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Написати
                    </Button>
                    <Button variant="outline" className="border-border hover:bg-secondary">
                      <Grid className="w-4 h-4 mr-2" />
                      Пости
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Posts Section */}
            <div>
              <h2 className="text-2xl mb-4">Останні пости</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="bg-card border-border p-6 hover:bg-[#1F1F1F] transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <Avatar>
                        <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
                        <AvatarFallback>ME</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3>Олександр Коваленко</h3>
                        <p className="text-sm text-muted-foreground">{post.time}</p>
                      </div>
                    </div>

                    <p className="mb-4">{post.content}</p>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Heart className="w-5 h-5" />
                      <span>{post.likes}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
