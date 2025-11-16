import { useState } from "react";
import { AppHeader } from "../components/AppHeader";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { Heart } from "lucide-react";

interface Post {
  id: string;
  author: string;
  username: string;
  avatar: string;
  content: string;
  likes: number;
  isLiked: boolean;
  time: string;
}

const initialPosts: Post[] = [
  {
    id: "1",
    author: "Олена Коваленко",
    username: "olena_k",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=olena",
    content: "Щойно завершила роботу над новим проєктом! Так задоволена результатом 🎉",
    likes: 24,
    isLiked: false,
    time: "2 години тому",
  },
  {
    id: "2",
    author: "Андрій Шевченко",
    username: "andriy_s",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=andriy",
    content: "Дякую всім за підтримку! Разом ми можемо більше 💪",
    likes: 42,
    isLiked: true,
    time: "4 години тому",
  },
  {
    id: "3",
    author: "Alice",
    username: "alice",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
    content: "Сьогодні був продуктивний день! Завершили важливий етап проєкту та обговорили наступні кроки з командою. Разом ми сила! 💼✨",
    likes: 35,
    isLiked: false,
    time: "5 годин тому",
  },
  {
    id: "4",
    author: "Марія Петренко",
    username: "maria_p",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria",
    content: "Хто хоче приєднатися до нашої команди? Шукаємо талановитих дизайнерів! 🚀",
    likes: 18,
    isLiked: false,
    time: "6 годин тому",
  },
  {
    id: "5",
    author: "Bob",
    username: "bob",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
    content: "Нарешті знайшов час для хобі. Кодинг — це чудово, але іноді потрібно відпочити 😊🎮",
    likes: 12,
    isLiked: false,
    time: "8 годин тому",
  },
  {
    id: "6",
    author: "Іван Мельник",
    username: "ivan_m",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ivan",
    content: "Нова функція вже доступна! Перевірте та напишіть свої враження 😊",
    likes: 31,
    isLiked: false,
    time: "1 день тому",
  },
  {
    id: "7",
    author: "Carol",
    username: "carol",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carol",
    content: "Дякую за чудову презентацію вчора! Було дуже інформативно та корисно. Чекаю на наступну зустріч! 👏",
    likes: 27,
    isLiked: false,
    time: "1 день тому",
  },
];

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [newPost, setNewPost] = useState("");

  const handlePublish = () => {
    if (!newPost.trim()) {
      return;
    }

    const post: Post = {
      id: String(Date.now()),
      author: "Олександр Коваленко",
      username: "me",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
      content: newPost,
      likes: 0,
      isLiked: false,
      time: "Щойно",
    };

    setPosts([post, ...posts]);
    setNewPost("");
  };

  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !post.isLiked,
          };
        }
        return post;
      })
    );
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <AppHeader />

      <div className="flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-background h-full">
          <div className="max-w-2xl mx-auto p-6 space-y-6">
            {/* Post Composer */}
            <Card className="bg-card border-border p-6">
              <div className="flex gap-4">
                <Avatar>
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
                  <AvatarFallback>ME</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-4">
                  <Textarea
                    placeholder="Що нового?"
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="min-h-[100px] bg-secondary border-0 resize-none"
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={handlePublish}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Опублікувати
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Posts Feed */}
            {posts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>Ще немає постів. Напишіть перший.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <Card
                    key={post.id}
                    className="bg-card border-border p-6 hover:bg-[#1F1F1F] transition-colors"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <Avatar>
                        <AvatarImage src={post.avatar} />
                        <AvatarFallback>{post.author[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3>{post.author}</h3>
                        <p className="text-sm text-muted-foreground">
                          @{post.username} · {post.time}
                        </p>
                      </div>
                    </div>

                    <p className="mb-4 whitespace-pre-wrap">{post.content}</p>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(post.id)}
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            post.isLiked ? "fill-primary text-primary" : ""
                          } group-hover:scale-110 transition-transform`}
                        />
                        <span>{post.likes}</span>
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
