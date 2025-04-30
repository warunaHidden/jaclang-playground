
import { useRef, useCallback, useEffect } from "react";
import Editor, { OnMount, useMonaco } from "@monaco-editor/react";
import { cn } from "@/lib/utils";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  className?: string;
  lineNumbers?: boolean;
  readOnly?: boolean;
  breakpoints?: number[];
  currentLine?: number;
  onBreakpointChange?: (breakpoints: number[]) => void;
  debugMode?: boolean;
}

export function CodeEditor({
  value,
  onChange,
  language = "javascript",
  className,
  lineNumbers = true,
  readOnly = false,
  breakpoints = [],
  currentLine,
  onBreakpointChange,
  debugMode = false,
}: CodeEditorProps) {
  const editorRef = useRef<any>(null);
  const monaco = useMonaco();
  const breakpointDecorations = useRef<string[]>([]);
  const currentLineDecoration = useRef<string[]>([]);

  const handleEditorDidMount: OnMount = useCallback((editor) => {
    editorRef.current = editor;
    
    if (!readOnly) {
      editor.focus();
    }

    // Add breakpoint handler
    if (onBreakpointChange) {
      editor.onMouseDown((e) => {
        if (e.target.type === 1) { // Line numbers margin
          const position = e.target.position;
          const lineNumber = position?.lineNumber;
          
          // Check if position exists and has a lineNumber
          if (lineNumber) {
            const newBreakpoints = [...breakpoints];
            const index = newBreakpoints.indexOf(lineNumber);
            
            if (index === -1) {
              newBreakpoints.push(lineNumber);
            } else {
              newBreakpoints.splice(index, 1);
            }
            
            onBreakpointChange(newBreakpoints);
          }
        }
      });
    }
  }, [breakpoints, onBreakpointChange, readOnly]);

  // Update breakpoint decorations
  useEffect(() => {
    if (editorRef.current && monaco) {
      // Clear previous decorations
      breakpointDecorations.current = editorRef.current.deltaDecorations(
        breakpointDecorations.current, 
        []
      );

      // Add new decorations
      const decorations = breakpoints.map(lineNumber => ({
        range: new monaco.Range(lineNumber, 1, lineNumber, 1),
        options: {
          isWholeLine: true,
          glyphMarginClassName: 'editor-breakpoint',
          glyphMarginHoverMessage: { value: 'Breakpoint at line ' + lineNumber },
          className: debugMode ? 'breakpoint-line' : ''
        }
      }));
      
      breakpointDecorations.current = editorRef.current.deltaDecorations(
        [], 
        decorations
      );
    }
  }, [breakpoints, monaco, debugMode]);

  // Update current line decoration for debugging
  useEffect(() => {
    if (editorRef.current && monaco && currentLine && debugMode) {
      // Clear previous current line decorations
      currentLineDecoration.current = editorRef.current.deltaDecorations(
        currentLineDecoration.current, 
        []
      );

      // Add new current line decoration
      currentLineDecoration.current = editorRef.current.deltaDecorations(
        [], 
        [{
          range: new monaco.Range(currentLine, 1, currentLine, 1),
          options: {
            isWholeLine: true,
            className: 'debug-current-line',
            linesDecorationsClassName: 'debug-current-line-decoration'
          }
        }]
      );

      // Ensure the current line is visible
      editorRef.current.revealLineInCenter(currentLine);
    }
  }, [currentLine, monaco, debugMode]);

  // Add custom CSS for breakpoints and debug line
  useEffect(() => {
    if (!document.getElementById('code-editor-styles')) {
      const style = document.createElement('style');
      style.id = 'code-editor-styles';
      style.innerHTML = `
        .editor-breakpoint {
          content: '';
          display: block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #cc0000;
          margin-top: 5px;
          margin-left: 6px;
        }
        .breakpoint-line {
          background-color: rgba(204, 0, 0, 0.1);
        }
        .debug-current-line {
          background-color: rgba(0, 122, 204, 0.2);
        }
        .debug-current-line-decoration {
          width: 0 !important;
          border-left: 2px solid #007acc;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div className={cn("h-full w-full overflow-hidden", className)}>
      <Editor
        height="100%"
        width="100%"
        language={language}
        value={value}
        theme="vs-dark"
        onChange={(value) => onChange(value || "")}
        onMount={handleEditorDidMount}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollbar: {
            vertical: "visible",
            horizontal: "visible",
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
          lineNumbers: lineNumbers ? "on" : "off",
          glyphMargin: true,
          folding: true,
          lineDecorationsWidth: 10,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          renderLineHighlight: "all",
          tabSize: 2,
          readOnly: readOnly,
          fixedOverflowWidgets: true,
          padding: { top: 10, bottom: 10 },
        }}
      />
    </div>
  );
}
