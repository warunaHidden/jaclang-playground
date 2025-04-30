
import { cn } from "@/lib/utils";
import { Bug } from "lucide-react";

export type DebugVariable = {
  name: string;
  value: any;
  type: string;
};

interface DebugPanelProps {
  variables: DebugVariable[];
  currentLine?: number;
  isActive: boolean;
  className?: string;
}

export function DebugPanel({
  variables,
  currentLine,
  isActive,
  className,
}: DebugPanelProps) {
  return (
    <div
      className={cn(
        "flex flex-col h-full w-full bg-card text-foreground font-mono p-2 overflow-auto rounded-md",
        className
      )}
    >
      <div className="flex items-center justify-between mb-2 p-2 bg-muted/30 rounded-md">
        <div className="flex items-center gap-2">
          <Bug className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium">Variables</h3>
        </div>
        {currentLine !== undefined && (
          <div className="text-xs text-muted-foreground">
            Line {currentLine}
          </div>
        )}
      </div>
      <div className="flex-1 p-2 bg-editor-background rounded-md text-editor-foreground">
        {isActive ? (
          variables.length > 0 ? (
            <div className="space-y-2">
              {variables.map((variable, index) => (
                <div
                  key={`${variable.name}-${index}`}
                  className="flex justify-between border-b border-muted/30 pb-1"
                >
                  <div className="flex gap-2">
                    <span className="text-primary">{variable.name}</span>
                    <span className="text-muted-foreground text-xs">
                      {variable.type}
                    </span>
                  </div>
                  <div>
                    <pre className="text-sm">
                      {typeof variable.value === "object"
                        ? JSON.stringify(variable.value)
                        : String(variable.value)}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              No variables to display at current breakpoint.
            </div>
          )
        ) : (
          <div className="text-sm text-muted-foreground">
            Debugger not active. Set breakpoints and start debugging to see variables.
          </div>
        )}
      </div>
    </div>
  );
}
