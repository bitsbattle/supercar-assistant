import React from "react";
import { Message } from "../../app/types";
import { WeatherCard } from "./ToolOutputs/WeatherCard";

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => (
  <div className={`flex ${message.role === 'user' ? "flex-row-reverse" : "flex-row"}`}>
    <div
      className={`max-w-[80%] rounded-xl px-[10px] py-2 text-xs
        ${message.role === 'assistant' 
          ? "rounded-bl-md bg-[#F2F2F5] text-[#101828]" 
          : "ml-auto rounded-br-md bg-[#ECF5FF] text-black"
        }`}
    >
      {message.content}
      {message.tool === 'get_weather' && message.toolOutput && (
        <WeatherCard 
          city={message.toolArgs?.city} 
          temp={parseInt(message.toolOutput.match(/\d+/)?.[0] || '0')}
        />
      )}
    </div>
  </div>
);