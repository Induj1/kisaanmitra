import React, { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff, Volume2, Volume1 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Message {
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatbotWidgetProps {
  widgetLanguage?: "english" | "hindi" | "kannada";
  translations?: {
    title?: {
      english: string;
      hindi: string;
      kannada: string;
    };
    placeholder?: {
      english: string;
      hindi: string;
      kannada: string;
    };
    button?: {
      english: string;
      hindi: string;
      kannada: string;
    };
    greeting?: {
      english: string;
      hindi: string;
      kannada: string;
    };
  };
}

const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({
  widgetLanguage = "english",
  translations,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text:
        translations?.greeting?.[widgetLanguage] ||
        "नमस्ते! मैं आपका कृषि सहायक हूँ। आप मुझसे फसल, मौसम, या सरकारी योजनाओं के बारे में पूछ सकते हैं।",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      text: input,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    fetch("https://api-container-706781556411.us-central1.run.app/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: input,
        language: widgetLanguage,
      }),
    })
      .then((e) => e.json())
      .then((e) => {
        // Add bot response
        const botMessage = {
          text: e.reply,
          isBot: true,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botMessage]);
      });
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real implementation, this would use the Web Speech API
    if (!isRecording) {
      // Start recording
      alert("Voice recording started. This is a mock implementation.");
      setTimeout(() => {
        setInput("मौसम का पूर्वानुमान बताएं");
        setIsRecording(false);
      }, 2000);
    } else {
      // Stop recording
      alert("Voice recording stopped");
    }
  };

  const speakText = (text: string) => {
    // In a real implementation, this would use the Web Speech API
    alert(`Speaking: ${text}`);
  };

  const getTitle = () => {
    if (translations?.title) {
      return translations.title[widgetLanguage];
    }
    return "AI किसान सहायक (Farmer Assistant)";
  };

  const getPlaceholder = () => {
    if (translations?.placeholder) {
      return translations.placeholder[widgetLanguage];
    }
    return "आप यहां टाइप कर सकते हैं या माइक आइकन पर क्लिक करके बोल सकते हैं...";
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col h-[400px]">
      <div className="bg-primary p-3 text-white">
        <h3 className="font-medium flex items-center">
          <Volume2 size={18} className="mr-2" />
          {getTitle()}
        </h3>
      </div>

      <div className="flex-grow overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.isBot ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.isBot
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none"
                    : "bg-primary text-white rounded-tr-none"
                }`}
              >
                <p className="text-sm font-noto">{message.text}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>

                  {message.isBot && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => speakText(message.text)}
                    >
                      <Volume1 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div id="scrollToBottomRef" ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 p-3">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className={
              isRecording ? "bg-red-100 text-red-600 border-red-300" : ""
            }
            onClick={toggleRecording}
          >
            {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
          </Button>

          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={getPlaceholder()}
            className="min-h-10 font-noto"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />

          <Button
            variant="default"
            size="icon"
            onClick={handleSendMessage}
            disabled={!input.trim()}
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotWidget;
