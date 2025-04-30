
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlayIcon, SkipForward, ArrowDown, ArrowUp, RefreshCw, Bug } from "lucide-react";

export type DebugAction = 
  | "continue" 
  | "stepOver" 
  | "stepInto" 
  | "stepOut" 
  | "restart"
  | "toggle";

interface DebugControlProps {
  onAction: (action: DebugAction) => void;
  isDebugging: boolean;
  isActive: boolean;
  className?: string;
}

export function DebugControl({ 
  onAction, 
  isDebugging,
  isActive,
  className 
}: DebugControlProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        onClick={() => onAction("toggle")}
        variant={isDebugging ? "default" : "outline"}
        size="sm"
        className={isDebugging ? "bg-destructive hover:bg-destructive/90" : ""}
      >
        <Bug className="h-4 w-4" />
        <span>{isDebugging ? "Stop Debug" : "Debug"}</span>
      </Button>

      {isDebugging && (
        <>
          <Button
            onClick={() => onAction("continue")}
            variant="outline"
            size="icon"
            disabled={!isActive}
            title="Continue"
          >
            <PlayIcon className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => onAction("stepOver")}
            variant="outline"
            size="icon"
            disabled={!isActive}
            title="Step Over"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => onAction("stepInto")}
            variant="outline"
            size="icon"
            disabled={!isActive}
            title="Step Into"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => onAction("stepOut")}
            variant="outline"
            size="icon"
            disabled={!isActive}
            title="Step Out"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => onAction("restart")}
            variant="outline"
            size="icon"
            disabled={!isActive}
            title="Restart"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
}
