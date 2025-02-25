import { create } from 'zustand';
import { Monaco } from '@monaco-editor/react';
import { editor } from 'monaco-editor';

interface FileData {
  content: string;
  language: string;
}

interface EditorState {
  monaco: Monaco | null;
  editor: editor.IStandaloneCodeEditor | null;
  currentFile: string | null;
  files: { [key: string]: FileData };
  theme: string;
  fontSize: number;
  wordWrap: boolean;
  minimap: boolean;
  isRunning: boolean;
  output: string[];
  userInput: string | null;
  isWaitingForInput: boolean;
  setMonaco: (monaco: Monaco) => void;
  setEditor: (editor: editor.IStandaloneCodeEditor) => void;
  setCurrentFile: (file: string) => void;
  createFile: (name: string, content: string, language: string) => void;
  updateFileContent: (file: string, content: string) => void;
  deleteFile: (file: string) => void;
  setTheme: (theme: string) => void;
  setFontSize: (size: number) => void;
  setWordWrap: (wrap: boolean) => void;
  setMinimap: (show: boolean) => void;
  addOutput: (text: string) => void;
  clearOutput: () => void;
  setIsRunning: (isRunning: boolean) => void;
  setUserInput: (input: string | null) => void;
  setIsWaitingForInput: (isWaiting: boolean) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  monaco: null,
  editor: null,
  currentFile: null,
  files: {},
  theme: 'vs-dark',
  fontSize: 14,
  wordWrap: true,
  minimap: true,
  isRunning: false,
  output: [],
  userInput: null,
  isWaitingForInput: false,
  setMonaco: (monaco) => set({ monaco }),
  setEditor: (editor) => set({ editor }),
  setCurrentFile: (file) => set({ currentFile: file }),
  createFile: (name, content, language) =>
    set((state) => ({
      files: {
        ...state.files,
        [name]: { content, language },
      },
      currentFile: name,
    })),
  updateFileContent: (file, content) =>
    set((state) => ({
      files: {
        ...state.files,
        [file]: { ...state.files[file], content },
      },
    })),
  deleteFile: (file) =>
    set((state) => {
      const newFiles = { ...state.files };
      delete newFiles[file];
      return { files: newFiles, currentFile: null };
    }),
  setTheme: (theme) => set({ theme }),
  setFontSize: (fontSize) => set({ fontSize }),
  setWordWrap: (wordWrap) => set({ wordWrap }),
  setMinimap: (minimap) => set({ minimap }),
  addOutput: (text) => set((state) => ({ output: [...state.output, text] })),
  clearOutput: () => set({ output: [] }),
  setIsRunning: (isRunning) => set({ isRunning }),
  setUserInput: (input) => set({ userInput: input }),
  setIsWaitingForInput: (isWaiting) => set({ isWaitingForInput: isWaiting }),
}));