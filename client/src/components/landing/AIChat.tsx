import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Send, Bot, User} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hello! I'm your personal health assistant. I can help you understand your PCOS data, period patterns, and provide personalized insights. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: generateAIResponse(inputValue),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (input: string): string => {
    const responses = [
      "Based on your recent MRI analysis showing a 75% PCOS probability, I recommend discussing hormone therapy options with your healthcare provider. Your cycle data also shows some irregularities that support this assessment.",
      "Your period tracking shows a 32-day average cycle, which is slightly longer than typical. Combined with your PCOS indicators, this suggests monitoring your ovulation patterns more closely.",
      "I notice you haven't logged any symptoms lately. Tracking mood, energy levels, and physical symptoms can help identify patterns related to your PCOS and menstrual cycle.",
      "Your health data indicates consistent patterns that are valuable for your healthcare provider. Would you like me to generate a comprehensive report for your next appointment?",
      "Based on your question about diet and PCOS, I'd recommend focusing on low-glycemic foods and regular meal timing. Your cycle data suggests this could help with hormone regulation."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const quickQuestions = [
    "Analyze my recent PCOS results",
    "What do my cycle patterns indicate?",
    "Generate health summary report",
    "Recommend lifestyle changes"
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
                  <div className={`flex items-start space-x-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`p-2 rounded-full ${message.type === 'user' ? 'bg-primary' : 'bg-secondary'}`}>
                      {message.type === 'user' ? (
                        <User className="w-4 h-4 text-primary-foreground" />
                      ) : (
                        <Bot className="w-4 h-4 text-secondary-foreground" />
                      )}
                    </div>
                    <div className={`p-4 rounded-2xl ${
                      message.type === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted border border-border/50'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <span className="text-xs opacity-70 mt-2 block">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1"
                />
                <Button onClick={sendMessage} variant="feminine" className="px-6">
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

export default AIChat;