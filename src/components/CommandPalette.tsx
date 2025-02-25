import { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import {
  Search,
  FileCode,
  Play,
  Settings,
  GitBranch,
  TestTube,
  Sparkles,
  Code2,
  Bug,
  RefreshCw
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function CommandPalette({ isOpen, setIsOpen }: CommandPaletteProps) {
  const [search, setSearch] = useState('');

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [isOpen, setIsOpen]);

  const handleSelect = (value: string) => {
    console.log('Selected:', value);
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50">
          <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-[640px]">
            <Command
              className="rounded-lg border border-gray-700 bg-gray-900 text-gray-100 shadow-2xl"
              onKeyDown={(e) => {
                if (e.key === 'Escape') setIsOpen(false);
              }}
            >
              <div className="flex items-center border-b border-gray-700 px-3">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <Command.Input
                  autoFocus
                  placeholder="Type a command or search..."
                  className="flex-1 h-12 bg-transparent outline-none placeholder:text-gray-400"
                  value={search}
                  onValueChange={setSearch}
                />
              </div>
              <Command.List className="max-h-[300px] overflow-y-auto p-2">
                <Command.Group heading="Actions">
                  <Command.Item
                    onSelect={() => handleSelect('new-file')}
                    className="flex items-center px-2 py-2 text-sm rounded-md hover:bg-gray-800 aria-selected:bg-gray-800"
                  >
                    <FileCode className="w-4 h-4 mr-2 text-blue-400" />
                    New File
                  </Command.Item>
                  <Command.Item
                    onSelect={() => handleSelect('run-code')}
                    className="flex items-center px-2 py-2 text-sm rounded-md hover:bg-gray-800 aria-selected:bg-gray-800"
                  >
                    <Play className="w-4 h-4 mr-2 text-green-400" />
                    Run Code
                  </Command.Item>
                  <Command.Item
                    onSelect={() => handleSelect('debug')}
                    className="flex items-center px-2 py-2 text-sm rounded-md hover:bg-gray-800 aria-selected:bg-gray-800"
                  >
                    <Bug className="w-4 h-4 mr-2 text-yellow-400" />
                    Start Debugging
                  </Command.Item>
                </Command.Group>
                <Command.Group heading="AI Assistant">
                  <Command.Item
                    onSelect={() => handleSelect('generate-tests')}
                    className="flex items-center px-2 py-2 text-sm rounded-md hover:bg-gray-800 aria-selected:bg-gray-800"
                  >
                    <TestTube className="w-4 h-4 mr-2 text-purple-400" />
                    Generate Unit Tests
                  </Command.Item>
                  <Command.Item
                    onSelect={() => handleSelect('explain-code')}
                    className="flex items-center px-2 py-2 text-sm rounded-md hover:bg-gray-800 aria-selected:bg-gray-800"
                  >
                    <Code2 className="w-4 h-4 mr-2 text-blue-400" />
                    Explain Code
                  </Command.Item>
                  <Command.Item
                    onSelect={() => handleSelect('optimize-code')}
                    className="flex items-center px-2 py-2 text-sm rounded-md hover:bg-gray-800 aria-selected:bg-gray-800"
                  >
                    <RefreshCw className="w-4 h-4 mr-2 text-green-400" />
                    Optimize Code
                  </Command.Item>
                </Command.Group>
                <Command.Group heading="Git">
                  <Command.Item
                    onSelect={() => handleSelect('git-commit')}
                    className="flex items-center px-2 py-2 text-sm rounded-md hover:bg-gray-800 aria-selected:bg-gray-800"
                  >
                    <GitBranch className="w-4 h-4 mr-2 text-purple-400" />
                    Commit Changes
                  </Command.Item>
                </Command.Group>
                <Command.Group heading="Settings">
                  <Command.Item
                    onSelect={() => handleSelect('settings')}
                    className="flex items-center px-2 py-2 text-sm rounded-md hover:bg-gray-800 aria-selected:bg-gray-800"
                  >
                    <Settings className="w-4 h-4 mr-2 text-yellow-400" />
                    Open Settings
                  </Command.Item>
                </Command.Group>
              </Command.List>
            </Command>
          </div>
        </div>
      )}
    </>
  );
}