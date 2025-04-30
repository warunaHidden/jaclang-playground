
// This is a mock service as we can't actually run Jaclang in the browser
// In a real implementation, this would connect to a backend service

export type DebugInfo = {
  line: number;
  variables: Array<{
    name: string;
    value: any;
    type: string;
  }>;
};

// For simulating the code execution
let debugState = {
  isDebugging: false,
  breakpoints: [] as number[],
  currentLine: 0,
  variables: [] as Array<{name: string, value: any, type: string}>,
  code: "",
  codeLines: [] as string[],
  debugStepIndex: 0,
  debugSteps: [] as DebugInfo[],
};

export async function executeCode(code: string): Promise<string> {
  // Not in debug mode, normal execution
  if (!debugState.isDebugging) {
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
  
  // Debug mode execution begins here
  return "Debugger started. Use the debug controls to step through the code.";
}

// Helper function to prepare debug session
export function prepareDebugSession(code: string, breakpoints: number[]): void {
  debugState.isDebugging = true;
  debugState.breakpoints = [...breakpoints];
  debugState.code = code;
  debugState.codeLines = code.split("\n");
  debugState.currentLine = 0;
  debugState.variables = [];
  debugState.debugStepIndex = 0;
  
  // Generate debug steps (simulate tracing through the code)
  generateDebugSteps(code, breakpoints);
}

// Helper function to end debug session
export function endDebugSession(): void {
  debugState.isDebugging = false;
  debugState.breakpoints = [];
  debugState.currentLine = 0;
  debugState.variables = [];
  debugState.debugSteps = [];
}

// Debug step actions
export function debugContinue(): DebugInfo | null {
  if (!debugState.isDebugging || debugState.debugSteps.length === 0) {
    return null;
  }
  
  // Find next breakpoint
  for (let i = debugState.debugStepIndex + 1; i < debugState.debugSteps.length; i++) {
    const step = debugState.debugSteps[i];
    if (debugState.breakpoints.includes(step.line)) {
      debugState.debugStepIndex = i;
      debugState.currentLine = step.line;
      debugState.variables = step.variables;
      return step;
    }
  }
  
  // No more breakpoints, finish debugging
  return null;
}

export function debugStepOver(): DebugInfo | null {
  if (!debugState.isDebugging || debugState.debugSteps.length === 0) {
    return null;
  }
  
  if (debugState.debugStepIndex + 1 < debugState.debugSteps.length) {
    debugState.debugStepIndex++;
    const step = debugState.debugSteps[debugState.debugStepIndex];
    debugState.currentLine = step.line;
    debugState.variables = step.variables;
    return step;
  }
  
  return null;
}

export function debugStepInto(): DebugInfo | null {
  // In our simplified simulation, stepInto works the same as stepOver
  return debugStepOver();
}

export function debugStepOut(): DebugInfo | null {
  // In our simplified simulation, we'll just move a few steps forward to simulate stepping out
  if (!debugState.isDebugging || debugState.debugSteps.length === 0) {
    return null;
  }
  
  const targetIndex = Math.min(
    debugState.debugStepIndex + 3,
    debugState.debugSteps.length - 1
  );
  
  debugState.debugStepIndex = targetIndex;
  const step = debugState.debugSteps[debugState.debugStepIndex];
  debugState.currentLine = step.line;
  debugState.variables = step.variables;
  return step;
}

export function debugRestart(): DebugInfo | null {
  if (!debugState.isDebugging || debugState.debugSteps.length === 0) {
    return null;
  }
  
  debugState.debugStepIndex = 0;
  const step = debugState.debugSteps[0];
  debugState.currentLine = step.line;
  debugState.variables = step.variables;
  return step;
}

export function getCurrentDebugState(): DebugInfo | null {
  if (!debugState.isDebugging || debugState.debugSteps.length === 0) {
    return null;
  }
  
  return debugState.debugSteps[debugState.debugStepIndex];
}

// Helper to generate debug steps
function generateDebugSteps(code: string, breakpoints: number[]) {
  const lines = code.split("\n");
  debugState.debugSteps = [];
  
  // Variables will change as we step through
  const simulatedVars = [
    { name: "i", type: "number", value: 0 },
    { name: "result", type: "number", value: 0 }
  ];

  // Generate debug info for each potential line of execution
  // This is a simplified simulation for our mock debugger
  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1; // Monaco editor lines are 1-indexed
    const line = lines[i].trim();
    
    // Skip empty lines and comments
    if (!line || line.startsWith("#")) continue;
    
    // Clone the variables for this step
    const stepVars = JSON.parse(JSON.stringify(simulatedVars));
    
    // Update variables based on line content (a very simplified simulation)
    if (line.includes("=")) {
      const parts = line.split("=");
      const varName = parts[0].trim();
      
      // Handle some common cases
      if (varName === "i" && lineNum > 3) {
        const currentI = stepVars.find(v => v.name === "i");
        if (currentI) {
          currentI.value = Math.min(9, currentI.value + 1);
        }
      }
      else if (varName === "result" && lineNum > 5) {
        const currentResult = stepVars.find(v => v.name === "result");
        if (currentResult) {
          // Simulate fibonacci sequence for result
          const i = stepVars.find(v => v.name === "i")?.value || 0;
          if (i <= 1) {
            currentResult.value = i;
          } else {
            // This is a simplification, not actual fibonacci calculation
            const fibValues = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34];
            currentResult.value = fibValues[i];
          }
        }
      }
    }
    
    debugState.debugSteps.push({
      line: lineNum,
      variables: JSON.parse(JSON.stringify(stepVars))
    });
  }
  
  // Add an initial step at line 1
  if (debugState.debugSteps.length === 0 || debugState.debugSteps[0].line !== 1) {
    debugState.debugSteps.unshift({
      line: 1,
      variables: [
        { name: "i", type: "number", value: 0 },
        { name: "result", type: "number", value: 0 }
      ]
    });
  }
  
  // Make sure we have a step at each breakpoint
  for (const bp of breakpoints) {
    if (!debugState.debugSteps.some(step => step.line === bp)) {
      // Find closest line before breakpoint that has a step
      let closestLine = 0;
      for (let i = bp - 1; i >= 1; i--) {
        if (debugState.debugSteps.some(step => step.line === i)) {
          closestLine = i;
          break;
        }
      }
      
      if (closestLine > 0) {
        const closeStep = debugState.debugSteps.find(step => step.line === closestLine);
        if (closeStep) {
          debugState.debugSteps.push({
            line: bp,
            variables: JSON.parse(JSON.stringify(closeStep.variables))
          });
        }
      }
    }
  }
  
  // Sort steps by line number
  debugState.debugSteps.sort((a, b) => a.line - b.line);
  
  // Set initial debug step
  if (debugState.debugSteps.length > 0) {
    const firstStep = debugState.debugSteps[0];
    debugState.currentLine = firstStep.line;
    debugState.variables = firstStep.variables;
  }
}
