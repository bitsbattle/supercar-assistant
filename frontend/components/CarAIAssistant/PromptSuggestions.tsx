import React from "react";

interface PromptSuggestionsProps {
  prompts: string[];
  isFetchingPrompts: boolean;
  handleSendMessage: (msg: string) => void;
}

export const PromptSuggestions = ({ prompts, isFetchingPrompts, handleSendMessage }: PromptSuggestionsProps) => (
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
          className="cursor-pointer rounded-lg border border-[#E3E7EC] px-[10px] py-2 text-xs text-gray-600"
        >
          {msg}
        </div>
      ))
    )}
  </div>
);