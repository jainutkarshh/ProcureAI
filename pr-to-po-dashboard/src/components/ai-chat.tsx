"use client";

import { useState } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";

interface AiChatProps {
  metrics: any;
}

export function AiChat({ metrics }: AiChatProps) {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/explain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userMessage.content,
          context: metrics ? `Current metrics: ${JSON.stringify(metrics)}` : "",
        }),
      });

      if (!response.ok) throw new Error("Chat failed");

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Ensure the backend is running." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-6 lg:p-8 flex flex-col h-[500px]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center">
          <Bot className="w-5 h-5 text-brand-purple" />
        </div>
        <div>
          <h3 className="text-xl font-display font-bold text-slate-900">Procurement Copilot</h3>
          <p className="text-sm text-slate-500">Ask questions about delays or vendor risks</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-4 space-y-4 mb-4 custom-scrollbar">
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
            Ask me why Finance is slow or how to reduce cycle time...
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-brand-blue" : "bg-slate-200"}`}>
              {msg.role === "user" ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-slate-600" />}
            </div>
            <div className={`p-3 rounded-2xl max-w-[80%] text-sm leading-relaxed ${
              msg.role === "user" ? "bg-brand-blue text-white rounded-tr-sm" : "bg-white border border-slate-200 text-slate-700 rounded-tl-sm"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-slate-600" />
            </div>
            <div className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-700 rounded-tl-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-brand-purple" />
              <span className="text-sm">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="e.g., Why is Finance team slow?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple transition-all"
        />
        <button 
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center text-white disabled:opacity-50 transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
