import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { MessageCircle, Mail, Lock, User, Loader2 } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: {
      name?: string;
      username?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!name) {
      newErrors.name = "Ім'я обов'язкове";
    } else if (name.length < 2) {
      newErrors.name = "Ім'я має бути мінімум 2 символи";
    }

    if (!username) {
      newErrors.username = "Username обов'язковий";
    } else if (username.length < 3) {
      newErrors.username = "Username має бути мінімум 3 символи";
    }

    if (!email) {
      newErrors.email = "Email обов'язковий";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Введіть правильний email";
    }

    if (!password) {
      newErrors.password = "Пароль обов'язковий";
    } else if (password.length < 6) {
      newErrors.password = "Пароль має бути мінімум 6 символів";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Підтвердіть пароль";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Паролі не співпадають";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await register({
        name,
        username,
        email,
        password,
        password_confirmation: confirmPassword,
      });
      navigate("/chats");
    } catch (error) {
      setErrors({ general: "Помилка реєстрації. Спробуйте інший email або username" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-[#0D0D0D] via-[#1a1a2e] to-[#16213e]">
      <Card className="w-full max-w-md bg-card border-border shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <MessageCircle className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Реєстрація</CardTitle>
          <CardDescription className="text-muted-foreground">
            Створіть акаунт, щоб почати спілкування
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive text-center">{errors.general}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Ім'я</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Ваше ім'я"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrors({ ...errors, name: undefined, general: undefined });
                  }}
                  className="pl-10 bg-secondary border-0"
                />
              </div>
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setErrors({ ...errors, username: undefined, general: undefined });
                  }}
                  className="pl-10 bg-secondary border-0"
                />
              </div>
              {errors.username && (
                <p className="text-sm text-destructive">{errors.username}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="example@mail.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({ ...errors, email: undefined, general: undefined });
                  }}
                  className="pl-10 bg-secondary border-0"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors({ ...errors, password: undefined, general: undefined });
                  }}
                  className="pl-10 bg-secondary border-0"
                />
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Підтвердіть пароль</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors({ ...errors, confirmPassword: undefined, general: undefined });
                  }}
                  className="pl-10 bg-secondary border-0"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="rounded border-border mt-1" required />
              <span className="text-muted-foreground">
                Я погоджуюся з{" "}
                <a href="#" className="text-primary hover:underline">
                  умовами використання
                </a>{" "}
                та{" "}
                <a href="#" className="text-primary hover:underline">
                  політикою конфіденційності
                </a>
              </span>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Реєструємось...
                </>
              ) : (
                "Зареєструватися"
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Вже є акаунт?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Увійти
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
