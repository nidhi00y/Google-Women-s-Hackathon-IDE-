import { Files, Settings, Terminal, TestTube, GitBranch, Sparkles } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const tabs = [
    { id: 'files', icon: Files, title: 'Files' },
    { id: 'git', icon: GitBranch, title: 'Source Control' },
    { id: 'ai', icon: Sparkles, title: 'AI Assistant' },
    { id: 'tests', icon: TestTube, title: 'Testing' },
    { id: 'terminal', icon: Terminal, title: 'Terminal' }
  ];

  return (
    <div className="h-full flex flex-col items-center py-4 border-r border-gray-800">
      <div className="flex flex-col space-y-2">
        {tabs.map(({ id, icon: Icon, title }) => (
          <button
            key={id}
            className={`p-3 rounded-lg transition-colors duration-200 relative group ${
              activeTab === id ? 'bg-gray-800 text-blue-400' : 'text-gray-400 hover:text-gray-200'
            }`}
            onClick={() => onTabChange(id)}
          >
            <Icon className="w-6 h-6" />
            <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
              {title}
            </span>
          </button>
        ))}
      </div>
      <div className="flex-1" />
      <button
        className={`p-3 rounded-lg transition-colors duration-200 relative group ${
          activeTab === 'settings' ? 'bg-gray-800 text-blue-400' : 'text-gray-400 hover:text-gray-200'
        }`}
        onClick={() => onTabChange('settings')}
      >
        <Settings className="w-6 h-6" />
        <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
          Settings
        </span>
      </button>
    </div>
  );
}