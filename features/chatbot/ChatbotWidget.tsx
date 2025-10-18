import React, { useState, useEffect, useRef } from 'react';
import { useUIStore } from '../../stores/uiStore';
import { getChatbotResponseStream } from '../../services/geminiService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Spinner } from '../../components/UI';
import { IconBot, IconX, IconSend } from '../../components/Icons';
import { vi } from '../../lang/vi';

export const ChatbotWidget: React.FC = () => {
  const { isChatbotOpen, toggleChatbot } = useUIStore();
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const newMessages = [...messages, { role: 'user' as const, text: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));
      const stream = await getChatbotResponseStream(history, input);
      
      let currentResponse = "";
      setMessages(prev => [...prev, { role: 'model', text: "" }]);

      for await (const chunk of stream) {
        currentResponse += chunk.text;
        setMessages(prev => {
          const lastMsgIndex = prev.length - 1;
          const updatedMessages = [...prev];
          if(updatedMessages[lastMsgIndex]) {
            updatedMessages[lastMsgIndex] = { ...updatedMessages[lastMsgIndex], text: currentResponse };
          }
          return updatedMessages;
        });
      }

    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages(prev => [...prev, { role: 'model', text: vi.chatbot.errorMessage }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button onClick={toggleChatbot} className="rounded-full shadow-lg !p-4">
          {isChatbotOpen ? <IconX size={28} /> : <IconBot size={28} />}
        </Button>
      </div>
      {isChatbotOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-full max-w-sm h-[60vh] flex flex-col">
          <Card className="flex-grow flex flex-col">
            <div className="p-4 border-b border-white/20">
              <h3 className="text-white font-bold">{vi.chatbot.assistant}</h3>
            </div>
            <div className="flex-grow p-4 overflow-y-auto space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-3 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-brand-600 text-white' : 'bg-gray-700 text-white'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && messages.length > 0 && messages[messages.length-1].role === 'user' && (
                <div className="flex justify-start"><div className="px-3 py-2 rounded-2xl bg-gray-700 text-white"><Spinner size="sm" /></div></div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-white/20 flex gap-2">
              <Input 
                value={input} 
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={vi.chatbot.placeholder}
                className="flex-grow" 
              />
              <Button onClick={handleSend} disabled={loading}><IconSend size={20} /></Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
