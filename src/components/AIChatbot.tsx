import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Bot } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const faqs = [
    {
      question: "Quels sont vos services principaux ?",
      answer: "Je propose du développement web full-stack, de la conception UI/UX, et du conseil en transformation digitale."
    },
    {
      question: "Quelles technologies utilisez-vous ?",
      answer: "Je travaille principalement avec React, TypeScript, Node.js, PHP, et les outils de design comme Figma."
    },
    {
      question: "Comment puis-je vous contacter ?",
      answer: "Vous pouvez m'envoyer un email à abdallahuix.dev@gmail.com ou m'appeler au +221 78 291 7770."
    },
    {
      question: "Combien de temps pour un projet ?",
      answer: "Cela dépend de la complexité. Un site web simple peut prendre 2-3 semaines, un projet plus complexe 1-3 mois."
    },
    {
      question: "Proposez-vous de la maintenance ?",
      answer: "Oui, je propose des services de maintenance et d'évolution pour tous mes projets."
    }
  ];

  const botResponses = [
    "Merci pour votre question ! Consultez la section Contact pour plus d'informations.",
    "C'est une excellente question ! N'hésitez pas à me contacter directement pour en discuter.",
    "Je serais ravi de vous aider avec votre projet. Contactez-moi pour en parler plus en détail.",
    "Intéressant ! Vous pouvez trouver plus d'informations dans mes projets ou me contacter directement."
  ];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        text: "Salut ! Je suis Abdoulaye, votre assistant virtuel. Comment puis-je vous aider aujourd'hui ?",
        isBot: true,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate bot response delay
    setTimeout(() => {
      const faqMatch = faqs.find(faq => 
        text.toLowerCase().includes(faq.question.toLowerCase().split(' ')[0]) ||
        faq.question.toLowerCase().includes(text.toLowerCase().split(' ')[0])
      );

      const botText = faqMatch 
        ? faqMatch.answer 
        : botResponses[Math.floor(Math.random() * botResponses.length)];

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botText,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleFaqClick = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white p-4 rounded-full shadow-sm transition-all duration-300 transform hover:scale-105"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 border border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-4 rounded-t-2xl flex items-center">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
              <img 
                src="/img/moi.jpeg" 
                alt="Abdoulaye" 
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling!.style.display = 'flex';
                }}
              />
              <User className="w-6 h-6 text-primary-600 hidden" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold">Salut ! Je suis Abdoulaye</h4>
              <p className="text-sm opacity-90">Assistant Support. Comment puis-je vous aider ?</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* FAQ Section */}
          {messages.length <= 1 && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Questions fréquentes :
              </h5>
              <div className="space-y-2">
                {faqs.slice(0, 3).map((faq, index) => (
                  <button
                    key={index}
                    onClick={() => handleFaqClick(faq.question)}
                    className="w-full text-left text-xs text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    • {faq.question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-2 ${message.isBot ? '' : 'justify-end'}`}
              >
                {message.isBot && (
                  <div className="w-6 h-6 bg-teal-950 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    message.isBot
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      : 'bg-gradient-to-r from-primary-600 to-primary-700 text-white'
                  }`}
                >
                  {message.text}
                </div>
                {!message.isBot && (
                  <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3 h-3 text-white" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
                placeholder="Posez votre question..."
                className="flex-1 p-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm"
              />
              <button
                onClick={() => handleSendMessage(inputText)}
                disabled={!inputText.trim() || isTyping}
                className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-all duration-200"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
