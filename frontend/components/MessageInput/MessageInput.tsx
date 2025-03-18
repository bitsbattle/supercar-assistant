import { useRef, useState, useCallback, memo } from 'react';
import ButtonPrimary from "../ButtonPrimary/ButtonPrimary";
import { RiSendPlaneFill } from 'react-icons/ri';

interface ChatInputProps {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  isLoadingMessage: boolean;
  width: number;
  handleSubmit: () => void;
}

const ChatInput: React.FC<ChatInputProps> = memo(({
  message,
  setMessage,
  isLoadingMessage,
  handleSubmit,
}) => {
  const [selectionRange, setSelectionRange] = useState({ start: 0, end: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleMessageSubmit = useCallback(() => {
    if (message.trim()) {
      handleSubmit();
    }
  }, [handleSubmit, message]);

  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  }, [setMessage]);

  const handleTextareaInput = useCallback((e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = 'auto';
    target.style.height = `${target.scrollHeight}px`;
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && message.trim()) {
      e.preventDefault();
      handleMessageSubmit();
    }
  }, [handleMessageSubmit, message]);

  const handleSelectionChange = useCallback((e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const { selectionStart, selectionEnd } = e.currentTarget;
    setSelectionRange({ start: selectionStart, end: selectionEnd });
  }, []);

  return (
    <div className="w-full p-4 rounded-b-md">
      <div className="w-full p-3 border rounded-lg min-h-[104px] border-gray-300">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleTextareaChange}
          onInput={handleTextareaInput}
          onKeyDown={handleKeyDown}
          onSelect={handleSelectionChange}
          placeholder="Write your reply..."
          rows={1}
          className="w-full text-sm rounded-lg resize-none min-h-9 max-h-20 text-gray-900 placeholder-gray-500 focus:outline-none"
          style={{ height: "auto" }}
          aria-label="Message input"
        />
        <div className="flex justify-end w-full mt-2">
          <ButtonPrimary
            disabled={isLoadingMessage}
            size="sm"
            text="Send"
            icon={<RiSendPlaneFill aria-hidden="true" />}
            onClick={handleMessageSubmit}
            aria-label="Send message"
          />
        </div>
      </div>
    </div>
  );
});

ChatInput.displayName = 'ChatInput';

export default ChatInput;
