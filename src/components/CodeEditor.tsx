
import { useRef, useCallback, useState, useEffect } from "react";
import Editor, { OnMount, Monaco } from "@monaco-editor/react";
import { cn } from "@/lib/utils";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  className?: string;
  breakpoints?: number[];
  onToggleBreakpoint?: (line: number) => void;
}

export function CodeEditor({
  value,
  onChange,
  language = "javascript",
  className,
  breakpoints = [],
  onToggleBreakpoint,
}: CodeEditorProps) {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const [decorations, setDecorations] = useState<string[]>([]);

  const handleEditorDidMount: OnMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    editor.focus();
    
    // Add gutter click event for breakpoints
    editor.onMouseDown((e) => {
      if (e.target.type === monaco.editor.MouseTargetType.GUTTER_LINE_NUMBERS) {
        const position = e.target.position;
        if (position && onToggleBreakpoint) {
          onToggleBreakpoint(position.lineNumber);
        }
      }
    });

    // Initialize breakpoints if any
    updateBreakpointDecorations(breakpoints);
  }, [breakpoints, onToggleBreakpoint]);

  // Update breakpoint decorations when breakpoints change
  const updateBreakpointDecorations = useCallback((lines: number[]) => {
    if (!editorRef.current || !monacoRef.current) return;
    
    const decorationsArray = lines.map(line => ({
      range: new monacoRef.current!.Range(line, 1, line, 1),
      options: {
        isWholeLine: false,
        glyphMarginClassName: 'breakpoint-glyph',
        glyphMarginHoverMessage: { value: 'Breakpoint' },
      },
    }));

    const newDecorations = editorRef.current.deltaDecorations(
      decorations,
      decorationsArray
    );
    
    setDecorations(newDecorations);
  }, [decorations]);

  // Update decorations when breakpoints change
  useEffect(() => {
    updateBreakpointDecorations(breakpoints);
  }, [breakpoints, updateBreakpointDecorations]);

  return (
    <div className={cn("h-full w-full overflow-hidden", className)}>
      <style jsx global>{`
        .breakpoint-glyph {
          background-color: #e51400;
          border-radius: 50%;
          width: 8px !important;
          height: 8px !important;
          margin-left: 5px;
          margin-top: 2px;
        }
      `}</style>
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
          lineNumbers: "on",
          glyphMargin: true, // Enable gutter for breakpoints
          folding: true,
          lineDecorationsWidth: 10,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          renderLineHighlight: "all",
          tabSize: 2,
          fixedOverflowWidgets: true,
          padding: { top: 10, bottom: 10 },
        }}
      />
    </div>
  );
}
