"use client";

import React, { useEffect, useRef, useState } from "react";
// import PowerhouseLogo from "../../assets/logo.png";
import { StreamEventTypes } from '../lib/sseTypes';
import { WeatherCard } from './ToolOutputs/WeatherCard';
import ChatInput from "./MessageInput/MessageInput";
import Image from "next/image";

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
  "I was injured in a car accident and need legal help.",
  "I'm dealing with a workplace injury claim.",
  "I slipped and fell on someone's property what can I do?",
  "I want to know if I have a strong personal injury case.",
  "I want to understand my legal rights after an injury."
];

function SummaryAIAssitantDrawer({ isOpen, onClose, className }: Props) {
  const [inputValue, setInputValue] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filesUrls, setFilesUrls] = useState<string[]>([]);
  const [fileUploading, setFileUploading] = useState(false);
  const [isFetchingPrompts, setIsFetchingPrompts] = useState(false);
  const [prompts, setPrompts] = useState<any[]>(prefetchedPrompts);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    console.log('Messages updated:', messages);
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    const userMessage: Message = { 
      role: 'user', 
      content: message,
      isSentByGuest: true,
      attached_files: filesUrls
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setFiles([]);
    setFilesUrls([]);
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
            const eventType = eventLine.replace('event: ', '');
            const rawData = dataLine.replace('data: ', '');

            switch(eventType) {
              case StreamEventTypes.CHUNK:
                setMessages(prev => {
                  const newMessages = [...prev];
                  const lastMessage = newMessages[newMessages.length - 1];
                  if (lastMessage.role === 'assistant' && !lastMessage.tool) {
                    // Only append non-empty chunks
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
                    // If parsing fails, use the raw output
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

  

  const getFileName = (url: string) => {
    return url.split('/').pop();
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
        <div className="fixed top-0 w-full z-10">
          <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90.59deg, #00469B 0.51%, #00171F 144.1%)' }} />
          <div className="flex items-center justify-between bg-[#F2F4F8] p-2">
            <div className=" inline-flex items-center gap-2">
              <div className="rounded-lg shadow-md">
                {/* <BgOrangeSparkles /> */}
              </div>
              <span className="text-sm font-semibold !leading-[18px] text-[#060C18]">
                Ask Summit Legal Group's Intake AI
              </span>
            </div>
          </div>
        </div>
        <div className="h-full overflow-y-auto pt-[60px] pb-[160px]">
          <div className={`flex h-full flex-col ${!messages.length ? "justify-center px-5" : "justify-end overflow-auto pb-0.5"}`}>
            {!messages.length ? (
              <>
                <div className="text-xl font-bold ">
                  Hi there,
                  <br />
                  <span className="bg-[linear-gradient(105.36deg,#101828_0%,#000D36_13.18%,#FF9B05_90.11%)] bg-clip-text text-transparent">
                    How can we assist you today?
                  </span>
                </div>
                <div className="mt-2 text-xs font-normal text-[#667085]">
                  Not sure where to start? Just tell us your situation—we'll guide you!
                </div>

                <div className="mt-4 space-y-3">
                  {isFetchingPrompts ? (
                    <div className="space-y-2">
                      {[...Array(5)].map((_, index) => (
                        <div key={index} className="w-full h-8 rounded-lg bg-gray-200 animate-pulse mb-2"></div>
                      ))}
                    </div>
                  ) : (
                    prompts.map((msg, index) => (
                      <div
                        key={index}
                        onClick={() => handleSendMessage(msg)}
                        className="cursor-pointer rounded-lg border border-[#E3E7EC] px-[10px] py-2 text-xs"
                      >
                        {msg}
                      </div>
                    ))
                  )}
                  <button 
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => setPrompts(prefetchedPrompts)}
                  >
                    {/* <RefreshIcon /> */}
                    <span className="text-xs font-normal text-[#475467]">
                      Refresh Prompts
                    </span>
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-4 space-y-3 overflow-auto px-5">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === 'user' ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-xl px-[10px] py-2 text-xs
                        ${msg.role === 'assistant' 
                          ? "rounded-bl-md bg-[#F2F2F5] text-[#101828]" 
                          : "ml-auto rounded-br-md bg-[#ECF5FF] text-black"
                        }`}
                    >
                      {msg.content}
                      {msg.tool === 'get_weather' && msg.toolOutput && (
                        <WeatherCard 
                          city={msg.toolArgs?.city} 
                          temp={parseInt(msg.toolOutput.match(/\d+/)?.[0] || '0')}
                        />
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex w-full items-center justify-center">
                    {/* <AiLoadingIcon /> */}
                  </div>
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
          <div className="h-11 w-full bg-[#F2F4F8] flex items-center justify-center gap-0.5">
            {/* <Image src={PowerhouseLogo} width={24} height={24} alt="Powerhouse Logo" /> */}
            <div>
              <div className="text-[#001D6C] text-[6px] font-light">Powered by</div>
              <div className="text-[#001D6C] text-[10px] font-bold">Powerhouse</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SummaryAIAssitantDrawer; 