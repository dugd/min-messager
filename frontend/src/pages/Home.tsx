import { MessageCircle, Shield, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-[#0D0D0D] via-[#1a1a2e] to-[#16213e]">
      <header className="p-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-8 h-8 text-primary" />
          <span className="text-2xl">Min Messenger</span>
        </div>
        <div className="flex gap-3">
          <Link to="/login">
            <Button variant="ghost" className="hover:bg-secondary">
              Увійти
            </Button>
          </Link>
          <Link to="/register">
            <Button className="bg-primary hover:bg-primary/90">
              Зареєструватися
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-4xl space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl bg-linear-to-r from-white to-primary bg-clip-text text-transparent">
              Український месенджер
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Швидке, безпечне та зручне спілкування. Залишайтеся на зв'язку з друзями та колегами в будь-який час.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-primary hover:bg-primary/90 px-8">
                Почати
              </Button>
            </Link>
            <Link to="/chats">
              <Button size="lg" variant="outline" className="px-8 border-border hover:bg-secondary">
                Переглянути демо
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border hover:border-primary/50 transition-all">
              <Zap className="w-10 h-10 text-primary mb-4 mx-auto" />
              <h3 className="mb-2">Швидкість</h3>
              <p className="text-sm text-muted-foreground">
                Миттєва доставка повідомлень та синхронізація між пристроями
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border hover:border-primary/50 transition-all">
              <Shield className="w-10 h-10 text-primary mb-4 mx-auto" />
              <h3 className="mb-2">Безпека</h3>
              <p className="text-sm text-muted-foreground">
                Наскрізне шифрування для захисту вашої приватності
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border hover:border-primary/50 transition-all">
              <Users className="w-10 h-10 text-primary mb-4 mx-auto" />
              <h3 className="mb-2">Спільнота</h3>
              <p className="text-sm text-muted-foreground">
                Групові чати, канали та багато іншого для команд
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="p-6 text-center text-sm text-muted-foreground">
        © 2025 Min Messenger. Всі права захищені.
      </footer>
    </div>
  );
}
