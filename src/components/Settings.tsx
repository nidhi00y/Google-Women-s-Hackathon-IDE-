import React from 'react';
import { useEditorStore } from '../store/editorStore';
import {
  Paintbrush,
  Layout,
  Languages,
  RefreshCw,
  Minus,
  Plus,
  Check
} from 'lucide-react';

export default function Settings() {
  const { 
    theme,
    setTheme,
    fontSize,
    setFontSize,
    wordWrap,
    setWordWrap,
    minimap,
    setMinimap,
    editor
  } = useEditorStore();

  const themes = [
    { id: 'vs-dark', name: 'Dark' },
    { id: 'vs-light', name: 'Light' }
  ];

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    if (editor) {
      editor.updateOptions({ theme: newTheme });
    }
  };

  const handleFontSizeChange = (newSize: number) => {
    setFontSize(newSize);
    if (editor) {
      editor.updateOptions({ fontSize: newSize });
    }
  };

  const handleWordWrapChange = (wrap: boolean) => {
    setWordWrap(wrap);
    if (editor) {
      editor.updateOptions({ wordWrap: wrap ? 'on' : 'off' });
    }
  };

  const handleMinimapChange = (show: boolean) => {
    setMinimap(show);
    if (editor) {
      editor.updateOptions({ minimap: { enabled: show } });
    }
  };

  const resetToDefaults = () => {
    handleThemeChange('vs-dark');
    handleFontSizeChange(14);
    handleWordWrapChange(true);
    handleMinimapChange(true);
  };

  return (
    <div className="h-full overflow-auto bg-[#1E1E2E] text-[#CDD6F4]">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-8 text-[#89B4FA]">Editor Settings</h2>

        {/* Theme Settings */}
        <div className="mb-10 bg-[#313244] rounded-lg p-6">
          <h3 className="flex items-center text-lg font-semibold mb-6 text-[#F5C2E7]">
            <Paintbrush className="w-5 h-5 mr-3" />
            Appearance
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[#BAC2DE]">Theme</span>
              <div className="flex gap-2">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleThemeChange(t.id)}
                    className={`ml-2 px-2 py-2 rounded-md transition-all duration-200 flex items-center gap-2
                      ${theme === t.id 
                        ? 'bg-[#89B4FA] text-[#1E1E2E]' 
                        : 'bg-[#45475A] text-[#CDD6F4] hover:bg-[#585B70]'
                      }`}
                  >
                    {theme === t.id && <Check className="w-4 h-4" />}
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Editor Settings */}
        <div className="mb-10 bg-[#313244] rounded-lg p-6">
          <h3 className="flex items-center text-lg font-semibold mb-6 text-[#FAB387]">
            <Layout className="w-5 h-5 mr-3" />
            Editor
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[#BAC2DE]">Font Size</span>
              <div className="flex items-center gap-3 bg-[#45475A] rounded-md">
                <button
                  onClick={() => handleFontSizeChange(Math.max(8, fontSize - 1))}
                  className="p-2 hover:bg-[#585B70] rounded-l-md transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-mono">{fontSize}px</span>
                <button
                  onClick={() => handleFontSizeChange(Math.min(32, fontSize + 1))}
                  className="p-2 hover:bg-[#585B70] rounded-r-md transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#BAC2DE]">Word Wrap</span>
              <button
                onClick={() => handleWordWrapChange(!wordWrap)}
                className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center gap-2
                  ${wordWrap 
                    ? 'bg-[#A6E3A1] text-[#1E1E2E]' 
                    : 'bg-[#45475A] text-[#CDD6F4] hover:bg-[#585B70]'
                  }`}
              >
                {wordWrap && <Check className="w-4 h-4" />}
                {wordWrap ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#BAC2DE]">Minimap</span>
              <button
                onClick={() => handleMinimapChange(!minimap)}
                className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center gap-2
                  ${minimap 
                    ? 'bg-[#A6E3A1] text-[#1E1E2E]' 
                    : 'bg-[#45475A] text-[#CDD6F4] hover:bg-[#585B70]'
                  }`}
              >
                {minimap && <Check className="w-4 h-4" />}
                {minimap ? 'Visible' : 'Hidden'}
              </button>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={resetToDefaults}
          className="w-full flex items-center justify-center px-6 py-3 bg-[#F38BA8] text-[#1E1E2E] rounded-lg hover:bg-[#F5C2E7] transition-all duration-200 font-semibold"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}