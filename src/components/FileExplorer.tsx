import { useState } from 'react';
import { ChevronRight, ChevronDown, FileText, Folder, Plus, Trash2 } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
}

const SUPPORTED_LANGUAGES = [
  { value: 'typescript', label: 'TypeScript' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'rust', label: 'Rust' },
  { value: 'php', label: 'PHP' }
];

function CreateFileDialog({ isOpen, onClose, onSubmit }: { 
  isOpen: boolean; 
  onClose: () => void;
  onSubmit: (name: string, language: string) => void;
}) {
  const [fileName, setFileName] = useState('');
  const [language, setLanguage] = useState('typescript');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Create New File</h2>
        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="File name (e.g., main.ts)"
          className="w-full bg-gray-700 p-2 rounded mb-4 text-white"
        />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full bg-gray-700 p-2 rounded mb-4 text-white"
        >
          {SUPPORTED_LANGUAGES.map(lang => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (fileName) {
                onSubmit(fileName, language);
                onClose();
                setFileName('');
              }
            }}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FileExplorer() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { files, createFile, currentFile, setCurrentFile, deleteFile } = useEditorStore();

  const handleCreateFile = (name: string, language: string) => {
    const defaultContent = getDefaultContent(language);
    createFile(name, defaultContent, language);
  };

  const getDefaultContent = (language: string): string => {
    switch (language) {
      case 'typescript':
        return '// Write your TypeScript code here\n\n';
      case 'javascript':
        return '// Write your JavaScript code here\n\n';
      case 'python':
        return '# Write your Python code here\n\n';
      case 'java':
        return 'public class Main {\n    public static void main(String[] args) {\n        // Write your Java code here\n    }\n}\n';
      case 'cpp':
        return '#include <iostream>\n\nint main() {\n    // Write your C++ code here\n    return 0;\n}\n';
      case 'c':
        return '#include <stdio.h>\n\nint main() {\n    // Write your C code here\n    return 0;\n}\n';
      case 'csharp':
        return 'using System;\n\nclass Program {\n    static void Main() {\n        // Write your C# code here\n    }\n}\n';
      case 'go':
        return 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Write your Go code here\n}\n';
      case 'ruby':
        return '# Write your Ruby code here\n\n';
      case 'rust':
        return 'fn main() {\n    // Write your Rust code here\n}\n';
      case 'php':
        return '<?php\n// Write your PHP code here\n\n';
      default:
        return '// Write your code here\n\n';
    }
  };

  return (
    <div className="h-full bg-gray-900 text-gray-300 flex flex-col">
      <div className="flex items-center justify-between p-3 border-b border-gray-800">
        <span className="font-medium">EXPLORER</span>
        <button
          onClick={() => setIsCreateDialogOpen(true)}
          className="p-1 hover:bg-gray-800 rounded"
          title="New File"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-auto p-2">
        {Object.entries(files).map(([filename, fileData]) => (
          <div
            key={filename}
            className={`flex items-center py-1 px-2 rounded cursor-pointer ${
              currentFile === filename ? 'bg-gray-800' : 'hover:bg-gray-800'
            }`}
            onClick={() => setCurrentFile(filename)}
          >
            <FileText className="w-4 h-4 text-gray-400 mr-2" />
            <span className="flex-1">{filename}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteFile(filename);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-700 rounded"
              title="Delete File"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          </div>
        ))}
      </div>
      <CreateFileDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateFile}
      />
    </div>
  );
}