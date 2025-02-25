import React, { useState, useEffect, useRef } from 'react';
import Split from 'react-split';
import CodeEditor from './components/Editor';
import Sidebar from './components/Sidebar';
import FileExplorer from './components/FileExplorer';
import AIAssistant from './components/AIAssistant';
import CommandPalette from './components/CommandPalette';
import Terminal from './components/Terminal';
import Settings from './components/Settings';
import { useEditorStore } from './store/editorStore';
import { Menu, X } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('files');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showTerminal, setShowTerminal] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { output, isRunning, setIsWaitingForInput } = useEditorStore();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setShowSidebar(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleUserInput = (input: string) => {
    console.log('User input:', input);
    setIsWaitingForInput(false);
  };

  const renderSideContent = () => {
    switch (activeTab) {
      case 'files':
        return <FileExplorer />;
      case 'ai':
        return <AIAssistant />;
      case 'terminal':
        return <Terminal onInput={handleUserInput} />;
      case 'settings':
        return <Settings />;
      default:
        return null;
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const toggleTerminal = () => {
    setShowTerminal(!showTerminal);
  };

  return (
    <div ref={containerRef} className="h-screen flex bg-[#1E1E2E] text-[#CDD6F4] overflow-hidden">
      <CommandPalette isOpen={isCommandPaletteOpen} setIsOpen={setIsCommandPaletteOpen} />
      
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-[#313244] rounded-md hover:bg-[#45475A] transition-colors duration-200"
        >
          {showSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`
          ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
          ${isMobile ? 'fixed inset-y-0 left-0 z-40 w-64 bg-[#1E1E2E] shadow-lg' : 'relative w-16'}
          transition-transform duration-200 ease-in-out
        `}
      >
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {(!isMobile || !showSidebar) && (
          <>
            {/* Editor and Side Panel */}
            <div className="flex-1 flex overflow-hidden">
              <Split
                className="flex-1 flex"
                sizes={[20, 80]}
                minSize={[200, 300]}
                gutterSize={4}
                snapOffset={30}
              >
                {/* Side Panel */}
                <div className="h-full overflow-hidden">
                  {renderSideContent()}
                </div>
                
                {/* Editor */}
                <div className="h-full flex flex-col">
                  <div className="flex-1 min-h-0">
                    <CodeEditor
                      language="javascript"
                      theme="vs-dark"
                      code=""
                      onChange={() => {}}
                    />
                  </div>
                  
                  {/* Terminal */}
                  {showTerminal && (
                    <div className="h-1/3 min-h-[100px] border-t border-[#313244]">
                      <Terminal onInput={handleUserInput} />
                    </div>
                  )}
                  
                  {/* Terminal Toggle Button */}
                  <button
                    onClick={toggleTerminal}
                    className="absolute bottom-4 right-4 z-10 p-2 bg-[#313244] rounded-md hover:bg-[#45475A] transition-colors duration-200"
                  >
                    {showTerminal ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                  </button>
                </div>
              </Split>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;