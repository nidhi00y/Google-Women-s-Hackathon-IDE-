import { useState, useCallback } from 'react';
import { Sparkles, Send, Loader, RefreshCw } from 'lucide-react';
import { generateCode } from '../services/ai';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: 'error';
}

export default function AIAssistant() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    id: 'welcome',
    role: 'assistant',
    content: 'Hello! I can help you generate code using Google\'s Gemini AI. Try something like:\n- "Create a function to sort an array"\n- "Write a React component for a todo list"\n- "Generate a class for handling API requests"'
  }]);

  const handleGenerateCode = useCallback(async () => {
    if (!prompt.trim() || isLoading) return;

    const messageId = Date.now().toString();
    setIsLoading(true);
    
    const userMessage: Message = {
      id: messageId,
      role: 'user',
      content: prompt
    };
    
    setMessages(prev => [...prev, userMessage]);
    setPrompt('');

    try {
      const generatedCode = await generateCode(prompt);
      setMessages(prev => [
        ...prev,
        {
          id: `${messageId}-response`,
          role: 'assistant',
          content: generatedCode
        }
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          id: `${messageId}-error`,
          role: 'assistant',
          content: error instanceof Error ? error.message : 'An error occurred',
          type: 'error'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, isLoading]);

  const handleRetry = useCallback(async (message: Message) => {
    if (isLoading || message.role !== 'user') return;

    const messageId = Date.now().toString();
    setIsLoading(true);

    try {
      const generatedCode = await generateCode(message.content);
      setMessages(prev => {
        const index = prev.findIndex(m => m.id === message.id);
        if (index === -1) return prev;

        const newMessages = [...prev];
        // Remove the old response if it exists
        if (index + 1 < prev.length && prev[index + 1].role === 'assistant') {
          newMessages.splice(index + 1, 1);
        }
        // Add the new response
        newMessages.splice(index + 1, 0, {
          id: messageId,
          role: 'assistant',
          content: generatedCode
        });
        return newMessages;
      });
    } catch (error) {
      setMessages(prev => {
        const index = prev.findIndex(m => m.id === message.id);
        if (index === -1) return prev;

        const newMessages = [...prev];
        // Remove the old response if it exists
        if (index + 1 < prev.length && prev[index + 1].role === 'assistant') {
          newMessages.splice(index + 1, 1);
        }
        // Add the error message
        newMessages.splice(index + 1, 0, {
          id: messageId,
          role: 'assistant',
          content: error instanceof Error ? error.message : 'An error occurred',
          type: 'error'
        });
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="flex items-center justify-between p-3 border-b border-gray-800">
        <div className="flex items-center">
          <Sparkles className="w-5 h-5 text-purple-400 mr-2" />
          <span className="font-medium">Gemini AI Assistant</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : message.type === 'error'
                  ? 'bg-red-900/50 text-red-200 border border-red-700'
                  : 'bg-gray-800 text-gray-200'
              }`}
            >
              <pre className="whitespace-pre-wrap font-mono text-sm">
                {message.content}
              </pre>
              {message.role === 'user' && (
                <button
                  onClick={() => handleRetry(message)}
                  className="mt-2 flex items-center text-xs text-gray-400 hover:text-gray-200"
                  disabled={isLoading}
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Regenerate
                </button>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-lg p-3 flex items-center space-x-2">
              <Loader className="w-4 h-4 animate-spin text-purple-400" />
              <span className="text-gray-200">Generating code with Gemini...</span>
            </div>
          </div>
        )}
      </div>
      
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleGenerateCode();
        }} 
        className="p-4 border-t border-gray-800"
      >
        <div className="flex items-center bg-gray-800 rounded-lg">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the code you want to generate..."
            className="flex-1 bg-transparent p-3 outline-none text-gray-200 placeholder-gray-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`p-3 ${
              isLoading ? 'text-gray-500' : 'text-gray-400 hover:text-gray-200'
            }`}
            disabled={isLoading}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}