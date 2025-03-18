
import { useRef, useState } from 'react';
import ButtonPrimary from "../ButtonPrimary/ButtonPrimary";

interface ChatInputProps {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  isLoadingMessage: boolean;
  width: number;
  handleSubmit: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  message,
  setMessage,
  isLoadingMessage,
  handleSubmit,
}) => {
  const validExtensions = [".pdf", ".doc", ".docx", ".csv", ".xls", ".xlsx"];


  const handleMessageSubmit = () => {
    handleSubmit();
  };

  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="flex w-full flex-col items-center rounded-b-md  p-4 pt-0">
      <div className="flex min-h-[104px] w-full flex-col items-end space-x-3 rounded-lg border border-[#D0D5DD] p-3">

        <div className="w-full">
          <textarea
            value={message}
            ref={textareaRef}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your reply"
            rows={1}
            className="max-h-20 min-h-9 w-full flex-grow rounded-lg p-2 text-sm text-[#182230] placeholder:text-[#667085] outline-0 resize-none"
            style={{ height: "auto" }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${target.scrollHeight}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && message.trim() !== "") {
                e.preventDefault();
                handleMessageSubmit();
              }
            }}
            onSelect={(e) => {
              setSelectionStart(e.currentTarget.selectionStart);
              setSelectionEnd(e.currentTarget.selectionEnd);
            }}
          />
        </div>

        <div className={`flex h-full w-full items-end justify-end`}>
          

          <div className="flex items-center gap-2">
            {/* <EmojiPicker onSelect={(emoji) => {
              const textarea = textareaRef.current;
              const newMessage = 
                message.slice(0, selectionStart) + 
                emoji + 
                message.slice(selectionEnd);
              setMessage(newMessage);
              
              // Move cursor to position after inserted emoji
              setTimeout(() => {
                if (textarea) {
                  const newPos = selectionStart + emoji.length;
                  textarea.setSelectionRange(newPos, newPos);
                  textarea.focus();
                }
              }, 0);
            }} /> */}
            

            
              <ButtonPrimary
                disabled={
                  isLoadingMessage
                }
                text="Send"
                // icon={<ArrowUpIcon />}
                className=""
                onClick={handleMessageSubmit}
              />
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
