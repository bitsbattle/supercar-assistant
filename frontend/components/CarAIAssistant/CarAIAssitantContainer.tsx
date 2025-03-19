"use client";

import React, { useEffect, useRef, useState } from "react";
import { StreamEventTypes } from '../../lib/sseTypes';
import ChatInput from "../MessageInput/MessageInput";
import { Header } from './Header';
import { Footer } from './Footer';
import { WelcomeMessage } from "./WelcomeMessages";
import { PromptSuggestions } from "./PromptSuggestions";
import { MessageBubble } from "./MessageBubble";
import { Loader } from "./loader";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  className?: string
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  tool?: string;
  toolArgs?: any;
  toolOutput?: string;
  toolStatus?: 'loading' | 'complete';
  isSentByGuest?: boolean;
  attached_files?: string[];
}

const prefetchedPrompts = [
  "I'm interested in test driving a SuperCar - how does it work?",
  "What are the available models at my local dealership?",
  "Can you check the weather for my test drive appointment?",
  "What are the financing options for a SuperCar?",
  "Can you show me the address of the nearest dealership?"
];

function CarAIAssitantContainer({ isOpen, onClose, className }: Props) {
  const [inputValue, setInputValue] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingPrompts, setIsFetchingPrompts] = useState(false);
  const [prompts, setPrompts] = useState<any[]>(prefetchedPrompts);

  // Session ID management
  const [sessionId, setSessionId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sessionId') || crypto.randomUUID();
    }
    return crypto.randomUUID();
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sessionId', sessionId);
    }
  }, [sessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    const userMessage: Message = { 
      role: 'user', 
      content: message,
      isSentByGuest: true
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setInputValue("");

    try {
      const response = await fetch('http://localhost:8000/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: message,
          session_id: sessionId
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (!reader) return;

      // Create initial assistant message
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '',
        toolStatus: undefined
      }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const events = chunk.split('\n\n').filter(Boolean);
        
        for (const event of events) {
          try {
            const [eventLine, dataLine] = event.split('\n');
            const eventType = eventLine.replace('event: ', '')?.trim();
            const rawData = dataLine.replace('data: ', '');
            switch(eventType) {
              case StreamEventTypes.CHUNK:
                setMessages(prev => {
                  const newMessages = [...prev];
                  const lastMessage = newMessages[newMessages.length - 1];
                  if (lastMessage.role === 'assistant' && !lastMessage.tool) {
                    if (rawData.trim()) {
                      lastMessage.content += rawData;
                    }
                  }
                  return newMessages;
                });
                break;

              case StreamEventTypes.TOOL_USE:
                try {
                  const toolData = JSON.parse(rawData);
                  setMessages(prev => [...prev, { 
                    role: 'assistant',
                    content: '',
                    tool: toolData.name,
                    toolArgs: toolData.arguments,
                    toolStatus: 'loading'
                  }]);
                } catch (error) {
                  console.error('Error processing tool use:', error);
                }
                break;

              case StreamEventTypes.TOOL_OUTPUT:
                try {
                  const toolData = JSON.parse(rawData);
                  let output = toolData.output;
                  try {
                    output = output.replace(/```/g, '').trim();
                    output = JSON.parse(output);
                  } catch (e) {
                    console.log('Using raw tool output');
                  }
                  
                  setMessages(prev => prev.map(msg => {
                    if (msg.toolStatus === 'loading') {
                      return { 
                        ...msg, 
                        toolOutput: output,
                        toolStatus: 'complete' 
                      };
                    }
                    return msg;
                  }));
                } catch (error) {
                  console.error('Error processing tool output:', error);
                }
                break;

              case StreamEventTypes.END:
                setIsLoading(false);
                break;
            }
          } catch (error) {
            console.error('Error processing event:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error processing stream:', error);
      setIsLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className={`fixed inset-0 z-30 bg-black/20`}
          onClick={onClose}
        />
      )}
      <div
        className={`fixed right-0 top-16 z-40 h-[87vh] !w-1/4 min-w-[368px] transform overflow-x-hidden border-x border-[#E4E9EF] bg-white transition-transform 
               duration-500 ease-in-out ${className} drawer-container`}
        style={{
          transform: isOpen
            ? "translate(-1.7rem, 0)"
            : "translate(100%, 0)",
        }}
      >
        <Header />
        <div className="h-full overflow-y-auto pt-[60px] pb-[160px]">
          <div className={`flex h-full flex-col ${!messages.length ? "justify-center px-5" : "justify-end overflow-auto pb-0.5"}`}>
            {!messages.length ? (
              <>
                <WelcomeMessage />
                <PromptSuggestions 
                  prompts={prompts} 
                  isFetchingPrompts={isFetchingPrompts} 
                  handleSendMessage={handleSendMessage} 
                />
              </>
            ) : (
              <div className="my-3 space-y-3 overflow-auto px-5">
                {messages.map((msg, index) => (
                  <MessageBubble key={index} message={msg} />
                ))}
                {isLoading && (
                  <Loader />
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 w-full bg-white">
          <ChatInput
            message={inputValue}
            setMessage={setInputValue}
            isLoadingMessage={isLoading}
            width={0}
            handleSubmit={() => handleSendMessage(inputValue)}
          />
          <Footer />
        </div>
      </div>
    </>
  );
}

export default CarAIAssitantContainer; 