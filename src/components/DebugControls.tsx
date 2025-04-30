
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { 
  Play, 
  SkipForward, 
  ArrowDown, 
  ArrowUp, 
  RotateCw, 
  Square, 
  ToggleRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export type DebugAction = "continue" | "stepOver" | "stepInto" | "stepOut" | "restart" | "stop" | "toggle";

interface DebugControlsProps {
  isDebugging: boolean;
  isPaused: boolean;
  onDebugAction: (action: DebugAction) => void;
  className?: string;
}

export function DebugControls({ 
  isDebugging,
  isPaused,
  onDebugAction,
  className
}: DebugControlsProps) {
  return (
    <div className={cn(
      "flex items-center gap-2 p-2 bg-card border-t border-border", 
      className
    )}>
      <Toggle 
        pressed={isDebugging}
        onPressedChange={() => onDebugAction("toggle")}
        aria-label="Toggle debug mode"
        className="gap-1"
      >
        <ToggleRight className="h-4 w-4" />
        <span className="hidden sm:inline">Debug Mode</span>
      </Toggle>
      
      {isDebugging && (
        <>
          <div className="h-4 border-l border-border mx-1" />
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onDebugAction("continue")}
            disabled={!isPaused}
            className="gap-1"
          >
            <Play className="h-4 w-4" />
            <span className="hidden sm:inline">Continue</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onDebugAction("stepOver")}
            disabled={!isPaused}
            className="gap-1"
          >
            <SkipForward className="h-4 w-4" />
            <span className="hidden sm:inline">Step Over</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onDebugAction("stepInto")}
            disabled={!isPaused}
            className="gap-1"
          >
            <ArrowDown className="h-4 w-4" />
            <span className="hidden sm:inline">Step Into</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onDebugAction("stepOut")}
            disabled={!isPaused}
            className="gap-1"
          >
            <ArrowUp className="h-4 w-4" />
            <span className="hidden sm:inline">Step Out</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onDebugAction("restart")}
            className="gap-1"
          >
            <RotateCw className="h-4 w-4" />
            <span className="hidden sm:inline">Restart</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onDebugAction("stop")}
            className="gap-1 text-red-500 hover:text-red-600"
          >
            <Square className="h-4 w-4" />
            <span className="hidden sm:inline">Stop</span>
          </Button>
        </>
      )}
    </div>
  );
}
