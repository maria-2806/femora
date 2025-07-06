import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { auth } from '@/firebaseConfig'
import { Input } from '@/components/ui/input';
import { Send, Bot, User } from 'lucide-react';
interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}
import ReactMarkdown from 'react-markdown';

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content:
        "Hello! I'm your personal health assistant. I can help you understand your PCOS data, period patterns, and provide personalized insights. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
  if (!inputValue.trim()) return;

  const currentUser = auth.currentUser;
  const idToken = currentUser && (await currentUser.getIdToken());

  const userMessage: Message = {
    id: Date.now().toString(),
    type: 'user',
    content: inputValue,
    timestamp: new Date(),
  };

  setMessages((prev) => [...prev, userMessage]);
  setInputValue('');
  setIsTyping(true);

  try {
    console.log('🛫 Sending message to backend...', inputValue);
console.log('🧾 ID Token:', idToken);
    const response = await fetch('http://localhost:5000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`, 
      },
      body: JSON.stringify({ prompt: inputValue }),
    });

    const data = await response.json();

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: data.response || 'Sorry, I couldn’t understand that.',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botMessage]);
  } catch (error) {
    console.error('Error fetching from Gemini API:', error);
  } finally {
    setIsTyping(false);
  }
};

  const quickQuestions = [
    'Analyze my recent PCOS results',
    'What do my cycle patterns indicate?',
    'Generate health summary report',
    'Recommend lifestyle changes',
  ];

  return (
    <section id="chat" className="py-20 bg-gradient-soft">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">AI Health</span> Assistant
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get personalized insights and answers about your health data with our intelligent AI companion
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-elegant border-border/50 h-[600px] flex flex-col animate-slide-in-right">
            <CardHeader className="border-b border-border/50">
              <CardTitle className="flex items-center space-x-2">
                <div className="p-2 bg-gradient-primary rounded-lg">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
                <span>Femora AI Assistant</span>
                <div className="flex items-center space-x-1 ml-auto">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span className="text-sm text-success">Online</span>
                </div>
              </CardTitle>
              <CardDescription>
                AI-powered health insights based on your personal data
              </CardDescription>
            </CardHeader>

            {/* Chat Messages */}
            <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                >
                  <div
                    className={`flex items-start space-x-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}
                  >
                    <div className={`p-2 rounded-full ${message.type === 'user' ? 'bg-primary' : 'bg-secondary'}`}>
                      {message.type === 'user' ? (
                        <User className="w-4 h-4 text-primary-foreground" />
                      ) : (
                        <Bot className="w-4 h-4 text-secondary-foreground" />
                      )}
                    </div>
                    <div
                      className={`p-4 rounded-2xl ${message.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted border border-border/50'
                        }`}
                    >
                      <p className="text-sm leading-relaxed"><ReactMarkdown>{message.content}</ReactMarkdown></p>
                      <span className="text-xs opacity-70 mt-2 block">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start animate-fade-in-up">
                  <div className="flex items-start space-x-3 max-w-[80%]">
                    <div className="p-2 bg-secondary rounded-full">
                      <Bot className="w-4 h-4 text-secondary-foreground" />
                    </div>
                    <div className="p-4 bg-muted border border-border/50 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: '0.1s' }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: '0.2s' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </CardContent>

            {/* Quick Questions */}
            <div className="px-6 py-3 border-t border-border/50">
              <div className="flex flex-wrap gap-2 mb-3">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setInputValue(question)}
                    className="text-xs"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-6 border-t border-border/50">
              <div className="flex space-x-3">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about your health data, PCOS results, or cycle patterns..."
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1"
                />
                <Button
                  onClick={sendMessage}
                  variant="feminine"
                  className="px-6"
                  disabled={isTyping}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                AI responses are for informational purposes. Always consult healthcare professionals for medical advice.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Chat;
