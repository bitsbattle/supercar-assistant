import React from "react";
import { Message } from "../../app/types";
import { MessageBubble } from "./MessageBubble";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const ChatMessages = ({ messages, isLoading, messagesEndRef }: ChatMessagesProps) => (
  <div className="mt-4 space-y-3 overflow-auto px-5">
    {messages.map((msg, index) => (
      <MessageBubble key={index} message={msg} />
    ))}
    {isLoading && (
      <div className="flex w-full items-center justify-center">
        {/* <AiLoadingIcon /> */}
      </div>
    )}
    <div ref={messagesEndRef} />
  </div>
);