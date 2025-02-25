import { useRef, useEffect, useState, useCallback } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import { 
  FileText, 
  Play, 
  Bug, 
  TestTube, 
  RefreshCw, 
  Save,
  Download,
  Copy,
  Settings,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { useEditorStore } from '../store/editorStore';

interface EditorProps {
  language: string;
  theme: string;
  code: string;
  onChange: (value: string | undefined) => void;
}

const PISTON_LANGUAGE_MAP: Record<string, string> = {
  'typescript': 'typescript',
  'javascript': 'javascript',
  'python': 'python',
  'java': 'java',
  'cpp': 'c++',
  'c': 'c',
  'csharp': 'c#',
  'go': 'go',
  'ruby': 'ruby',
  'rust': 'rust',
  'php': 'php'
};

export default function CodeEditor({ language, theme, code, onChange }: EditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { 
    setMonaco, 
    setEditor, 
    currentFile, 
    files,
    updateFileContent,
    addOutput,
    clearOutput,
    setIsRunning,
    setIsWaitingForInput,
    userInput,
    setUserInput
  } = useEditorStore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentExecution, setCurrentExecution] = useState<AbortController | null>(null);

  const handleResize = useCallback(() => {
    if (editorRef.current) {
      window.requestAnimationFrame(() => {
        editorRef.current?.layout();
      });
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const resizeObserver = new ResizeObserver(() => {
        handleResize();
      });

      resizeObserver.observe(container);
      return () => resizeObserver.disconnect();
    }
  }, [handleResize]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;
    setMonaco(monaco);
    setEditor(editor);
    
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleSave();
    });

    // Configure TypeScript/JavaScript IntelliSense
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
      noSuggestionDiagnostics: false,
    });

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: "React",
      allowJs: true,
      typeRoots: ["node_modules/@types"],
      strict: true,
      baseUrl: ".",
      paths: {
        "*": ["*", "node_modules/*"]
      }
    });

    // Add extra libraries for better suggestions
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `declare module 'react' {
        export interface Component {}
        export function useState<T>(initialState: T): [T, (newState: T) => void];
        export function useEffect(effect: () => void, deps?: any[]): void;
        export function useCallback(callback: Function, deps: any[]): Function;
        export function useMemo<T>(factory: () => T, deps: any[]): T;
        export function useRef<T>(initialValue: T): { current: T };
      }`,
      'file:///node_modules/@types/react/index.d.ts'
    );

    // Configure editor features
    editor.updateOptions({
      fontSize: 14,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      wordWrap: 'on',
      lineNumbers: 'on',
      folding: true,
      foldingStrategy: 'indentation',
      showFoldingControls: 'always',
      bracketPairColorization: { enabled: true },
      formatOnPaste: true,
      formatOnType: true,
      suggestOnTriggerCharacters: true,
      acceptSuggestionOnEnter: 'smart',
      tabCompletion: 'on',
      snippetSuggestions: 'inline',
      semanticHighlighting: { enabled: true },
      linkedEditing: true,
      autoClosingBrackets: 'always',
      autoClosingQuotes: 'always',
      autoIndent: 'full',
      autoSurround: 'languageDefined',
      codeLens: true,
      contextmenu: true,
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
      dragAndDrop: true,
      fixedOverflowWidgets: true,
      guides: {
        bracketPairs: true,
        indentation: true,
        highlightActiveIndentation: true,
        bracketPairsHorizontal: 'active'
      },
      hover: {
        enabled: true,
        delay: 300,
        sticky: true
      },
      inlayHints: {
        enabled: true
      },
      lightbulb: {
        enabled: true
      },
      parameterHints: {
        enabled: true,
        cycle: true
      },
      quickSuggestions: {
        other: true,
        comments: true,
        strings: true
      },
      quickSuggestionsDelay: 10,
      suggest: {
        localityBonus: true,
        showIcons: true,
        showStatusBar: true,
        preview: true,
        shareSuggestSelections: true,
        showInlineDetails: true,
        showMethods: true,
        showFunctions: true,
        showVariables: true,
        showConstants: true,
        showConstructors: true,
        showFields: true,
        showFiles: true,
        showFolders: true,
        showKeywords: true,
        showSnippets: true,
        showUsers: true,
        showWords: true
      }
    });

    // Add custom completions
    monaco.languages.registerCompletionItemProvider('typescript', {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };

        return {
          suggestions: [
            {
              label: 'useEffect',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'useEffect(() => {\n\t${1}\n}, [${2}]);',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'React useEffect hook',
              range
            },
            {
              label: 'useState',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'const [${1}, set${2}] = useState(${3});',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'React useState hook',
              range
            },
            {
              label: 'console.log',
              kind: monaco.languages.CompletionItemKind.Method,
              insertText: 'console.log(${1});',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Console log statement',
              range
            }
          ]
        };
      }
    });
  };

  const handleSave = async () => {
    if (currentFile && editorRef.current) {
      const content = editorRef.current.getValue();
      updateFileContent(currentFile, content);
      addOutput(`File ${currentFile} saved successfully`);
    }
  };

  const executeCode = async (code: string, language: string, stdin?: string) => {
    const pistonLanguage = PISTON_LANGUAGE_MAP[language] || language;
    
    try {
      const controller = new AbortController();
      setCurrentExecution(controller);

      const response = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: pistonLanguage,
          version: '*',
          files: [
            {
              content: code,
            },
          ],
          stdin: stdin || '',
        }),
        signal: controller.signal,
      });

      const result = await response.json();
      
      if (result.run) {
        if (result.run.stdout) {
          addOutput(result.run.stdout);
        }
        if (result.run.stderr) {
          addOutput(`Error: ${result.run.stderr}`);
        }
      } else {
        addOutput('Error: Failed to execute code');
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        addOutput('Execution cancelled');
      } else {
        addOutput(`Error: ${error.message}`);
      }
    } finally {
      setCurrentExecution(null);
    }
  };

  const handleRunCode = async () => {
    if (!currentFile || !editorRef.current) return;
    
    const content = editorRef.current.getValue();
    const fileLanguage = files[currentFile].language;
    
    setIsRunning(true);
    clearOutput();
    addOutput(`Executing ${fileLanguage} code...`);
    
    await executeCode(content, fileLanguage);
    setIsRunning(false);
  };

  const handleUserInput = async (input: string) => {
    if (!currentFile || !editorRef.current) return;
    
    const content = editorRef.current.getValue();
    const fileLanguage = files[currentFile].language;
    
    setUserInput(input);
    await executeCode(content, fileLanguage, input);
    setUserInput(null);
  };

  const handleDebug = () => {
    if (!currentFile) return;
    addOutput('Starting debug session...');
    addOutput('Debug functionality will be implemented with a proper debugging protocol');
  };

  const handleTest = async () => {
    if (!currentFile) return;
    addOutput('Running tests...');
    addOutput('Test runner will be implemented with proper testing framework integration');
  };

  const handleFormat = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
      addOutput('Code formatted successfully');
    }
  };

  const handleDownload = () => {
    if (!currentFile || !editorRef.current) return;
    
    const content = editorRef.current.getValue();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFile;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    addOutput(`File ${currentFile} downloaded successfully`);
  };

  const handleCopyToClipboard = async () => {
    if (!currentFile || !editorRef.current) return;
    
    const content = editorRef.current.getValue();
    await navigator.clipboard.writeText(content);
    addOutput('Code copied to clipboard');
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (editorRef.current) {
      editorRef.current.layout();
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`h-full flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-[#1E1E2E]' : ''}`}
    >
      <div className="bg-[#1E1E2E] p-2 flex items-center space-x-2 border-b border-[#313244] overflow-x-auto">
        <div className="flex items-center space-x-1 shrink-0">
          <button
            onClick={handleSave}
            className="p-2 hover:bg-[#313244] rounded-md transition-colors duration-200 group relative"
            title="Save (⌘/Ctrl + S)"
          >
            <Save className="w-5 h-5 text-[#89B4FA] group-hover:text-[#B4BEFE]" />
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-[#313244] text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Save
            </span>
          </button>
          <button
            onClick={handleRunCode}
            className="p-2 hover:bg-[#313244] rounded-md transition-colors duration-200 group relative"
            title="Run Code"
          >
            <Play className="w-5 h-5 text-[#A6E3A1] group-hover:text-[#94E2D5]" />
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-[#313244] text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Run
            </span>
          </button>
          <button
            onClick={handleDebug}
            className="p-2 hover:bg-[#313244] rounded-md transition-colors duration-200 group relative"
            title="Debug"
          >
            <Bug className="w-5 h-5 text-[#F38BA8] group-hover:text-[#F5C2E7]" />
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-[#313244] text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Debug
            </span>
          </button>
          <button
            onClick={handleTest}
            className="p-2 hover:bg-[#313244] rounded-md transition-colors duration-200 group relative"
            title="Run Tests"
          >
            <TestTube className="w-5 h-5 text-[#CBA6F7] group-hover:text-[#DDB6F2]" />
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-[#313244] text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Test
            </span>
          </button>
          <button
            onClick={handleFormat}
            className="p-2 hover:bg-[#313244] rounded-md transition-colors duration-200 group relative"
            title="Format Code"
          >
            <RefreshCw className="w-5 h-5 text-[#FAB387] group-hover:text-[#F9E2AF]" />
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-[#313244] text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Format
            </span>
          </button>
        </div>
        
        <div className="h-6 w-px bg-[#313244] mx-2" />
        
        <div className="flex items-center space-x-1">
          <button
            onClick={handleDownload}
            className="p-2 hover:bg-[#313244] rounded-md transition-colors duration-200 group relative"
            title="Download Code"
          >
            <Download className="w-5 h-5 text-[#94E2D5] group-hover:text-[#89DCEB]" />
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-[#313244] text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Download
            </span>
          </button>
          <button
            onClick={handleCopyToClipboard}
            className="p-2 hover:bg-[#313244] rounded-md transition-colors duration-200 group relative"
            title="Copy to Clipboard"
          >
            <Copy className="w-5 h-5 text-[#89B4FA] group-hover:text-[#B4BEFE]" />
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-[#313244] text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Copy
            </span>
          </button>
        </div>

        <div className="flex-1" />
        
        <div className="flex items-center space-x-2">
          <div className="text-sm text-[#CDD6F4] flex items-center bg-[#313244] px-3 py-1.5 rounded-md">
            <FileText className="w-4 h-4 mr-2 text-[#89B4FA]" />
            {currentFile || 'No file selected'}
          </div>
          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-[#313244] rounded-md transition-colors duration-200"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5 text-[#89B4FA]" />
            ) : (
              <Maximize2 className="w-5 h-5 text-[#89B4FA]" />
            )}
          </button>
        </div>
      </div>
      
      <div className="flex-1 relative">
        {currentFile ? (
          <Editor
            height="100%"
            defaultLanguage={files[currentFile].language}
            value={files[currentFile].content}
            theme="vs-dark"
            onChange={(value) => value && updateFileContent(currentFile, value)}
            onMount={handleEditorDidMount}
            options={{
              fontSize: 14,
              fontFamily: 'JetBrains Mono, monospace',
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordWrap: 'on',
              padding: { top: 16, bottom: 16 },
              smoothScrolling: true,
              cursorSmoothCaretAnimation: 'on',
              lineNumbers: 'on',
              renderLineHighlight: 'all',
              folding: true,
              foldingStrategy: 'indentation',
              showFoldingControls: 'always',
              bracketPairColorization: { enabled: true },
              formatOnPaste: true,
              formatOnType: true,
              suggestOnTriggerCharacters: true,
              acceptSuggestionOnEnter: 'smart',
              tabCompletion: 'on',
              snippetSuggestions: 'inline',
              semanticHighlighting: { enabled: true },
              linkedEditing: true,
              autoClosingBrackets: 'always',
              autoClosingQuotes: 'always',
              autoIndent: 'full',
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              smoothScrolling: true,
              mouseWheelZoom: true,
              guides: {
                indentation: true,
                bracketPairs: true,
                highlightActiveIndentation: true,
                bracketPairsHorizontal: true
              }
            }}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-[#6C7086] bg-[#1E1E2E]">
            <div className="text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No file selected</p>
              <p className="text-sm mt-2">Create a new file or select an existing one to start coding</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}