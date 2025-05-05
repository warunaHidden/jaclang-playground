
// Mock implementation of JacDebugger
export class JacDebugger {
  private code: string;
  private state: any;
  private running: boolean = false;
  private terminated: boolean = false;
  private _isPaused: boolean = true;
  private currentLineIndex: number = 0;
  private mockVariables: Record<string, any> = {
    "counter": 0,
    "result": null,
    "agents": []
  };
  private mockCallStack: string[] = ["main()"];
  private codeLines: string[];

  constructor(code: string) {
    this.code = code;
    this.codeLines = code.split('\n').filter(line => line.trim() !== '');
    this.state = this.createInitialState();
  }

  start(): void {
    this.running = true;
    this._isPaused = true;
    this.terminated = false;
    this.currentLineIndex = 0;
    this.updateState();
  }

  continue(): void {
    if (this._isPaused && !this.terminated) {
      this._isPaused = false;
      // Simulate execution by jumping to end
      this.currentLineIndex = this.codeLines.length - 1;
      this.mockVariables = {
        "counter": 10,
        "result": [0, 1, 1, 2, 3, 5, 8, 13, 21, 34],
        "agents": ["agent1", "agent2"]
      };
      this.mockCallStack = ["main()", "fibonacci(10)"];
      this._isPaused = true;
      this.updateState();
    }
  }

  stepOver(): void {
    if (this._isPaused && !this.terminated) {
      // Move to next line
      this.currentLineIndex = Math.min(this.currentLineIndex + 1, this.codeLines.length - 1);
      this.mockVariables.counter++;
      this.updateState();
    }
  }

  stepIn(): void {
    if (this._isPaused && !this.terminated) {
      // Simulate stepping into a function by adding to call stack
      this.currentLineIndex = Math.min(this.currentLineIndex + 1, this.codeLines.length - 1);
      this.mockCallStack.push(`fibonacci(${this.mockVariables.counter})`);
      this.mockVariables.counter++;
      this.updateState();
    }
  }

  stepOut(): void {
    if (this._isPaused && !this.terminated) {
      // Simulate stepping out of a function by removing from call stack
      if (this.mockCallStack.length > 1) {
        this.mockCallStack.pop();
      }
      this.currentLineIndex = Math.min(this.currentLineIndex + 2, this.codeLines.length - 1);
      this.mockVariables.counter++;
      this.updateState();
    }
  }

  restart(): void {
    this.start();
  }

  terminate(): void {
    this.running = false;
    this.terminated = true;
    this._isPaused = false;
  }

  getState(): any {
    return this.state;
  }

  isPaused(): boolean {
    return this._isPaused;
  }

  isTerminated(): boolean {
    return this.terminated;
  }

  private updateState(): void {
    // Get the current line number
    const currentLine = this.currentLineIndex + 1;
    
    // Update the graph as debugging progresses
    const graphData = this.generateGraphForCurrentState();
    
    this.state = {
      currentLine,
      variables: {...this.mockVariables},
      callStack: [...this.mockCallStack],
      graph: graphData
    };
  }

  private createInitialState(): any {
    return {
      currentLine: 1,
      variables: {...this.mockVariables},
      callStack: [...this.mockCallStack],
      graph: this.generateGraphForCurrentState()
    };
  }

  private generateGraphForCurrentState(): any {
    // This would normally generate a graph based on the current execution state
    // For now, return mock data that evolves based on current line
    const progress = this.currentLineIndex / (this.codeLines.length || 1);
    const nodeCount = Math.min(5, Math.max(2, Math.floor(progress * 6)));
    
    const nodes = [];
    const edges = [];
    
    for (let i = 1; i <= nodeCount; i++) {
      nodes.push({
        id: String(i),
        label: i === 1 ? "Start" : i % 2 === 0 ? `Agent${Math.ceil(i/2)}` : `Node${Math.floor(i/2)}`,
        type: i % 2 === 0 ? "agent" : "node"
      });
      
      if (i > 1) {
        edges.push({
          source: String(i-1),
          target: String(i),
          label: i % 2 === 0 ? "creates" : "connects"
        });
      }
    }
    
    // Add a closing loop if we have enough nodes
    if (nodeCount >= 4) {
      edges.push({
        source: String(nodeCount),
        target: "1",
        label: "closes-loop"
      });
    }
    
    return {
      nodes,
      edges
    };
  }
}
