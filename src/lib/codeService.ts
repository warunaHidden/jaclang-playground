import { JacDebugger } from "jac-debugger";
import { defaultCode } from "./examples";

let debuggerInstance: JacDebugger | null = null;
let breakpoints: number[] = [];
let isPaused: boolean = false;
let isDebugging: boolean = false;

export const executeCode = async (code: string): Promise<string> => {
  try {
    const response = await fetch('/api/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Failed to execute code:", error);
    return `Error: ${error}`;
  }
};

export const startDebugging = (code: string) => {
  debuggerInstance = new JacDebugger(code);
  debuggerInstance.start();
  isDebugging = true;
  isPaused = true;
  return debuggerInstance.getState();
};

export const stopDebugging = () => {
  if (debuggerInstance) {
    debuggerInstance.terminate();
    debuggerInstance = null;
    isDebugging = false;
    isPaused = false;
  }
};

export const debugAction = (action: string, code: string) => {
  if (!debuggerInstance) {
    debuggerInstance = new JacDebugger(code);
    debuggerInstance.start();
  }

  switch (action) {
    case "continue":
      debuggerInstance.continue();
      break;
    case "stepOver":
      debuggerInstance.stepOver();
      break;
    case "stepInto":
      debuggerInstance.stepIn();
      break;
    case "stepOut":
      debuggerInstance.stepOut();
      break;
    case "restart":
      debuggerInstance.restart();
      break;
    case "stop":
      stopDebugging();
      break;
    default:
      console.warn("Unknown debug action:", action);
      return null;
  }

  isPaused = debuggerInstance.isPaused();
  isDebugging = !debuggerInstance.isTerminated();
  return debuggerInstance.getState();
};

export const toggleBreakpoint = (line: number): number[] => {
  const index = breakpoints.indexOf(line);
  if (index > -1) {
    breakpoints.splice(index, 1); // Remove breakpoint
  } else {
    breakpoints.push(line); // Add breakpoint
  }
  return breakpoints;
};

export const getBreakpoints = (): number[] => {
  return breakpoints;
};

export const getIsPaused = (): boolean => {
  return isPaused;
};

export const getIsDebugging = (): boolean => {
  return isDebugging;
};

// Add getGraphData function
export function getGraphData() {
  // This would normally fetch data from an API or interpreter
  // For now, return mock data
  return {
    nodes: [
      { id: "1", label: "Start", type: "node" },
      { id: "2", label: "Agent1", type: "agent" },
      { id: "3", label: "Node1", type: "node" },
      { id: "4", label: "Agent2", type: "agent" },
      { id: "5", label: "Node2", type: "node" },
    ],
    edges: [
      { source: "1", target: "2", label: "creates" },
      { source: "2", target: "3", label: "connects" },
      { source: "3", target: "4", label: "spawns" },
      { source: "4", target: "5", label: "visits" },
      { source: "5", target: "1", label: "closes-loop" },
    ]
  };
}
