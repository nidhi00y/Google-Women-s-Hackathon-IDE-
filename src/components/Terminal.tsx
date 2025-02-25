import { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Send, X } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';

interface TerminalProps {
  onInput?: (input: string) => void;
}

export default function Terminal({ onInput }: TerminalProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const { output, addOutput, clearOutput, isWaitingForInput, setIsWaitingForInput } = useEditorStore();

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output, isWaitingForInput]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const newHistory = [...history, input];
    setHistory(newHistory);
    setHistoryIndex(-1);
    
    if (isWaitingForInput && onInput) {
      onInput(input);
      setIsWaitingForInput(false);
    }
    
    addOutput(`> ${input}`);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#1E1E2E] text-[#CDD6F4]">
      <div className="flex items-center justify-between p-2 border-b border-[#313244] bg-[#181825]">
        <div className="flex items-center">
          <TerminalIcon className="w-4 h-4 text-[#89B4FA] mr-2" />
          <span className="text-sm font-medium">Terminal</span>
          {isWaitingForInput && (
            <span className="ml-2 text-xs text-[#F38BA8]">Waiting for input...</span>
          )}
        </div>
        <button
          onClick={() => clearOutput()}
          className="p-1 hover:bg-[#313244] rounded-md transition-colors duration-200"
          title="Clear Terminal"
        >
          <X className="w-4 h-4 text-[#F38BA8]" />
        </button>
      </div>
      
      <div 
        ref={terminalRef}
        className="flex-1 overflow-auto p-4 font-mono text-sm"
        style={{ fontFamily: 'JetBrains Mono, monospace' }}
      >
        {output.map((line, index) => (
          <div key={index} className="whitespace-pre-wrap mb-1">
            {line}
          </div>
        ))}
      </div>
      
      <form 
        onSubmit={handleSubmit}
        className="p-2 border-t border-[#313244] bg-[#181825]"
      >
        <div className="flex items-center bg-[#1E1E2E] rounded-md border border-[#313244] focus-within:border-[#89B4FA] transition-colors duration-200">
          <span className="pl-3 pr-2 text-[#6C7086] select-none">{'>'}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent p-2 outline-none text-[#CDD6F4] placeholder-[#6C7086] min-w-0"
            placeholder={isWaitingForInput ? "Enter your input..." : "Type a command..."}
            spellCheck={false}
            autoComplete="off"
          />
          <button
            type="submit"
            className="px-3 py-2 text-[#89B4FA] hover:text-[#B4BEFE] transition-colors duration-200"
            disabled={!input.trim()}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}