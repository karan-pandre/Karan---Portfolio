import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, RefreshCw, X, MessageSquare, Check, HelpCircle } from 'lucide-react';

interface AICareerAssistantProps {
  darkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export const AICareerAssistant: React.FC<AICareerAssistantProps> = ({
  darkMode,
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: "Hello! I am Karan Pandre's AI Career Twin. Ask me anything about Karan's B.Tech degree, campaign ROI analytics at Physics Wallah, Infosys BI internship, or his technical skill set!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const quickQuestions = [
    "What makes Karan stand out for Data Analytics roles?",
    "What are his top Power BI & SQL skills?",
    "Tell me about his experience at Physics Wallah.",
    "What Google & IBM certifications does he hold?"
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessages = [...messages, { sender: 'user' as const, text, time }];
    setMessages(newMessages);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, conversationHistory: newMessages })
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [
          ...prev,
          { sender: 'ai', text: data.reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]);
      }
    } catch (err) {
      console.error("AI Twin chat failed:", err);
      setMessages(prev => [
        ...prev,
        { 
          sender: 'ai', 
          text: "Karan Pandre holds a B.Tech in IT (Alliance University, 7.7 CGPA), works as Senior Associate at Physics Wallah managing campaign analytics, and holds certifications from Google, IBM, Cisco, and Infosys Springboard.", 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className={`max-w-2xl w-full h-[600px] flex flex-col rounded-2xl border shadow-2xl relative overflow-hidden ${
        darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-none">Karan's AI Career Twin</h3>
              <span className="text-[11px] text-blue-100 opacity-90">Powered by Gemini 2.5 AI</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Questions Pills */}
        <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-wrap gap-1.5 overflow-x-auto text-xs">
          <span className="font-semibold text-slate-500 self-center text-[10px] mr-1">Quick Ask:</span>
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(q)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                darkMode ? 'bg-slate-800 hover:bg-slate-700 text-blue-300' : 'bg-white hover:bg-blue-50 text-blue-800 border border-blue-200'
              }`}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Message Log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 max-w-[85%] ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${
                msg.sender === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-1 ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : darkMode ? 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none' : 'bg-slate-100 text-slate-800 rounded-tl-none'
              }`}>
                <p className="whitespace-pre-line">{msg.text}</p>
                <span className="text-[10px] opacity-60 block text-right font-mono">{msg.time}</span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500" />
              <span>Karan's AI Twin is composing a response...</span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              id="ai-chat-input-text"
              type="text"
              placeholder="Ask about Karan's projects, degree, or Google fit..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
            <button
              id="btn-ai-chat-send"
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
