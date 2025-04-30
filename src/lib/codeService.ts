
import { DebugState } from "@/components/DebugPanel";

// This is a mock service as we can't actually run Jaclang in the browser
// In a real implementation, this would connect to a backend service

// Simulated debug state
let currentDebugState: DebugState | null = null;
let breakpoints: number[] = [];
let debugInterval: number | null = null;
let isPaused = false;
let isDebugging = false;

// Simple graph data for visualization
const sampleGraphData = {
  nodes: [
    { id: "n1", label: "main", type: "node" },
    { id: "n2", label: "walker", type: "agent" },
    { id: "n3", label: "data", type: "node" },
    { id: "n4", label: "proc", type: "node" }
  ],
  edges: [
    { source: "n1", target: "n2", label: "spawns" },
    { source: "n2", target: "n3", label: "visits" },
    { source: "n3", target: "n4" }
  ]
};

// Initialize debug state
const initDebugState = (code: string): DebugState => {
  return {
    currentLine: 1,
    variables: { "count": 0, "result": [] },
    callStack: ["main()"],
    graph: sampleGraphData
  };
};

export async function executeCode(code: string): Promise<string> {
  // Simulate a network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Parse the code to generate a simulated output
  const outputLines: string[] = [];
  
  // Simple parsing to simulate execution
  const lines = code.split("\n");
  let inFunction = false;
  let indentLevel = 0;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Handle print statements
    if (trimmedLine.startsWith("print(") && trimmedLine.endsWith(");") || 
        trimmedLine.startsWith("print(") && trimmedLine.endsWith(")")) {
      // Extract content inside print()
      const match = trimmedLine.match(/print\((.*)\)/);
      if (match && match[1]) {
        let content = match[1];
        
        // Handle string literals
        if (content.startsWith('"') && content.endsWith('"')) {
          content = content.slice(1, -1);
        } else if (content.includes(",")) {
          // Handle multiple arguments
          content = content.split(",").map(arg => arg.trim()).join(" ");
        }
        
        outputLines.push(content);
      }
    }
    
    // Simulate function execution for fibonacci
    if (trimmedLine === "for i in range(10):") {
      // Special case for the default example
      if (code.includes("fibonacci(i)")) {
        outputLines.push("Fibonacci Sequence:");
        // Calculate actual fibonacci numbers
        const fibs = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34];
        fibs.forEach(num => outputLines.push(num.toString()));
      }
    }
  }
  
  return outputLines.join("\n");
}

// Start debugging session
export function startDebugging(code: string): DebugState {
  stopDebugging(); // Stop any existing debug session
  isDebugging = true;
  isPaused = true;
  currentDebugState = initDebugState(code);
  return currentDebugState;
}

// Stop debugging session
export function stopDebugging(): void {
  if (debugInterval) {
    clearInterval(debugInterval);
    debugInterval = null;
  }
  isDebugging = false;
  isPaused = false;
  currentDebugState = null;
}

// Get current debug state
export function getDebugState(): DebugState | null {
  return currentDebugState;
}

// Set breakpoints
export function setBreakpoints(lines: number[]): number[] {
  breakpoints = [...lines];
  return breakpoints;
}

// Toggle a breakpoint
export function toggleBreakpoint(line: number): number[] {
  const index = breakpoints.indexOf(line);
  if (index === -1) {
    breakpoints.push(line);
  } else {
    breakpoints.splice(index, 1);
  }
  return [...breakpoints];
}

// Get current breakpoints
export function getBreakpoints(): number[] {
  return [...breakpoints];
}

// Check if debugging is paused
export function getIsPaused(): boolean {
  return isPaused;
}

// Check if debugging is active
export function getIsDebugging(): boolean {
  return isDebugging;
}

// Debug actions
export async function debugAction(action: string, code: string): Promise<DebugState | null> {
  if (!isDebugging && action !== "toggle") {
    return null;
  }

  switch (action) {
    case "toggle":
      if (isDebugging) {
        stopDebugging();
        return null;
      } else {
        return startDebugging(code);
      }
    
    case "continue":
      isPaused = false;
      // Simulate execution until next breakpoint
      await simulateExecution(5);
      isPaused = true;
      return currentDebugState;
    
    case "stepOver":
      // Simulate stepping over current line
      await simulateStep(1);
      return currentDebugState;
    
    case "stepInto":
      // Simulate stepping into a function
      if (!currentDebugState) return null;
      
      await simulateStep(1);
      
      // Add to call stack to simulate stepping into
      if (Math.random() > 0.5 && !currentDebugState.callStack.includes("process()")) {
        currentDebugState.callStack.unshift("process()");
      }
      
      return currentDebugState;
    
    case "stepOut":
      // Simulate stepping out of a function
      if (!currentDebugState) return null;
      
      await simulateStep(2);
      
      // Remove from call stack to simulate stepping out
      if (currentDebugState.callStack.length > 1) {
        currentDebugState.callStack.shift();
      }
      
      return currentDebugState;
    
    case "restart":
      return startDebugging(code);
    
    case "stop":
      stopDebugging();
      return null;
    
    default:
      return currentDebugState;
  }
}

// Helper function to simulate execution
async function simulateExecution(steps: number): Promise<void> {
  if (!currentDebugState) return;
  
  for (let i = 0; i < steps; i++) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Update state
    currentDebugState.currentLine += 1;
    
    // Add or update a variable occasionally
    if (Math.random() > 0.7) {
      const varName = `var${Math.floor(Math.random() * 5)}`;
      currentDebugState.variables[varName] = Math.floor(Math.random() * 100);
    }
    
    // Check if we've hit a breakpoint
    if (breakpoints.includes(currentDebugState.currentLine)) {
      break;
    }
  }
}

// Helper function to simulate a single step
async function simulateStep(lines: number): Promise<void> {
  if (!currentDebugState) return;
  
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Update line number
  currentDebugState.currentLine += lines;
  
  // Occasionally update variables to simulate state changes
  if (Math.random() > 0.5) {
    const varName = `i`;
    const currentVal = currentDebugState.variables[varName] || 0;
    currentDebugState.variables[varName] = currentVal + 1;
    
    if (currentVal > 5 && !currentDebugState.variables.hasOwnProperty("result")) {
      currentDebugState.variables["result"] = [1, 1, 2, 3, 5];
    }
  }
  
  // Occasionally update graph to simulate algorithm progress
  if (Math.random() > 0.7) {
    const nodeId = `n${Math.floor(Math.random() * 5) + 5}`;
    
    // Add a new node occasionally
    if (!currentDebugState.graph.nodes.find(n => n.id === nodeId)) {
      currentDebugState.graph.nodes.push({
        id: nodeId,
        label: `node${currentDebugState.graph.nodes.length + 1}`,
        type: Math.random() > 0.5 ? "node" : "agent"
      });
      
      // Add edge to a random existing node
      const existingNodeId = currentDebugState.graph.nodes[
        Math.floor(Math.random() * (currentDebugState.graph.nodes.length - 1))
      ].id;
      
      currentDebugState.graph.edges.push({
        source: existingNodeId,
        target: nodeId,
        label: Math.random() > 0.5 ? "connects" : undefined
      });
    }
  }
}
