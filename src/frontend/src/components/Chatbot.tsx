import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, MessageCircle, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  type ChatMessage,
  processMessage,
  resetConversation,
} from "../utils/chatbotLogic";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      content:
        "Hii! 😊 Main hoon revAlife Health Assistant — tumhara personal wellness buddy!\n\nKoi bhi health sawaal pooch sakte ho, ya batao kya problem hai — thakan, neend, gym, padhai, immunity — main perfect product suggest karoonga! 🌿",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    } else {
      resetConversation();
    }
  }, [isOpen]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      await new Promise<void>((resolve) => setTimeout(resolve, 300));
      const botResponse = processMessage(trimmed);
      setMessages((prev) => [...prev, botResponse]);
    } catch (err) {
      console.error("Health Assistant error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content:
            "Kuch technical issue aa gaya. Please dobara try karein ya page refresh karein. 🙏",
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {!isOpen && (
        <Button
          data-ocid="chatbot.open_modal_button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-elevated bg-wellness-green hover:bg-wellness-green-dark z-50 transition-all duration-200 hover:scale-105"
          size="icon"
          aria-label="Open Health Assistant"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <div
          data-ocid="chatbot.dialog"
          className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] h-[540px] bg-card rounded-2xl shadow-elevated flex flex-col z-50 border border-border/60 animate-scale-in"
        >
          {/* Header */}
          <div className="bg-wellness-green text-white px-4 py-3 rounded-t-2xl flex items-center justify-between shrink-0 shadow-subtle">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center shrink-0 overflow-hidden">
                <img
                  src="/assets/generated/chatbot-icon.dim_64x64.png"
                  alt="AI Assistant"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
                  }}
                />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm leading-tight">
                  revAlife Health Assistant
                </h3>
                <p className="text-[11px] opacity-80 leading-tight mt-0.5">
                  {isLoading
                    ? "Typing…"
                    : "Always available • Products ke liye guide karega"}
                </p>
              </div>
            </div>
            <Button
              data-ocid="chatbot.close_button"
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 h-8 w-8 shrink-0 transition-colors"
              aria-label="Close Health Assistant"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Disclaimer banner */}
          <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-2 shrink-0">
            <p className="text-xs text-amber-700 leading-relaxed">
              ⚠️ Yeh medical advice nahi hai. Serious health concerns ke liye
              doctor se milein.
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3">
            <div className="space-y-3">
              {messages.map((message, index) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: messages have no stable id
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap shadow-xs ${
                      message.role === "user"
                        ? "bg-wellness-green text-white rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm border border-border/30"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div
                  data-ocid="chatbot.loading_state"
                  className="flex justify-start"
                >
                  <div className="bg-muted border border-border/30 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5 shadow-xs">
                    <span className="w-2 h-2 bg-wellness-green rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-wellness-green rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-wellness-green rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className="px-3 pb-3 pt-2 border-t border-border/50 shrink-0">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                data-ocid="chatbot.input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isLoading ? "Please wait…" : "Message likhein…"}
                className="flex-1 text-sm rounded-full bg-muted border-border/50 focus:ring-2 focus:ring-wellness-green/30"
                disabled={isLoading}
                aria-label="Message input"
                autoComplete="off"
              />
              <Button
                data-ocid="chatbot.submit_button"
                onClick={handleSend}
                size="icon"
                className="bg-wellness-green hover:bg-wellness-green-dark shrink-0 rounded-full h-9 w-9 transition-all duration-200"
                disabled={isLoading || !input.trim()}
                aria-label="Send message"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5 text-center">
              Koi bhi sawaal pooch sakte ho — health, products, delivery!
            </p>
          </div>
        </div>
      )}
    </>
  );
}
