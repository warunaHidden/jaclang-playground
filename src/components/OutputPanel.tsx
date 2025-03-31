
import { cn } from "@/lib/utils";

interface OutputPanelProps {
  output: string;
  isLoading?: boolean;
  className?: string;
}

export function OutputPanel({
  output,
  isLoading = false,
  className,
}: OutputPanelProps) {
  return (
    <div
      className={cn(
        "flex flex-col h-full w-full bg-editor-background text-editor-foreground font-mono p-4 overflow-auto rounded-md",
        className
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Output</h3>
        {isLoading && (
          <div className="flex items-center">
            <div className="animate-spin mr-2 h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
            <span className="text-xs">Running...</span>
          </div>
        )}
      </div>
      <pre className="flex-1 whitespace-pre-wrap text-sm">
        {output || "// Output will appear here after running code"}
      </pre>
    </div>
  );
}
