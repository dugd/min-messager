import { Send, Paperclip, Smile } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useState } from "react";

interface MessageInputProps {
  onSend?: (message: string) => void;
}

export function MessageInput({ onSend }: MessageInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSend?.(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-border bg-card p-4">
      <div className="flex items-end gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 hover:bg-secondary"
        >
          <Paperclip className="w-5 h-5" />
        </Button>

        <div className="flex-1 relative">
          <Textarea
            placeholder="Введіть повідомлення..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="resize-none bg-secondary border-0 rounded-2xl pr-12 min-h-[44px] max-h-32"
            rows={1}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 bottom-2 hover:bg-transparent"
          >
            <Smile className="w-5 h-5" />
          </Button>
        </div>

        <Button
          size="icon"
          onClick={handleSend}
          disabled={!message.trim()}
          className="shrink-0 bg-primary hover:bg-primary/90 rounded-full"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
