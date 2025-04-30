
import { useState, useEffect, useCallback } from "react";
import { Play, RefreshCw, FileCode, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/CodeEditor";
import { OutputPanel } from "@/components/OutputPanel";
import { ExamplesSidebar } from "@/components/ExamplesSidebar";
import { ResizablePanel } from "@/components/ResizablePanel";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { executeCode } from "@/lib/codeService";
import { defaultCode } from "@/lib/examples";
import { useMobileDetect } from "@/hooks/useMobileDetect";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const isMobile = useMobileDetect();
  const { toast } = useToast();

  const runCode = useCallback(async () => {
    try {
      setIsRunning(true);
      setOutput("");
      const result = await executeCode(code);
      setOutput(result);
    } catch (error) {
      console.error("Failed to execute code:", error);
      setOutput("Error: Failed to execute code.");
      toast({
        title: "Execution Error",
        description: "Failed to execute the code.",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  }, [code, toast]);

  const handleReset = () => {
    setCode(defaultCode);
    setOutput("");
    toast({
      title: "Editor Reset",
      description: "Code has been reset to default example.",
    });
  };

  const handleSelectExample = (exampleCode: string) => {
    setCode(exampleCode);
    if (isMobile) {
      setShowMobileSidebar(false);
    }
    toast({
      title: "Example Loaded",
      description: "Code example has been loaded into the editor.",
    });
  };

  const toggleMobileSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  return (
    <ThemeProvider>
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-background">
        {/* Header */}
        <header className="h-14 border-b bg-card flex items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <FileCode className="h-6 w-6 text-primary" />
            <h1 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Jaclang Playground</h1>
          </div>
          <div className="flex items-center space-x-2">
            {isMobile && (
              <Button
                variant="outline"
                size="icon"
                onClick={toggleMobileSidebar}
                aria-label="Toggle sidebar"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <ThemeToggle />
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Editor Toolbar */}
            <div className="h-12 border-b bg-card flex items-center justify-between px-4">
              <div className="flex items-center space-x-2">
                <Button
                  onClick={runCode}
                  disabled={isRunning}
                  className="space-x-1 bg-primary hover:bg-primary/90"
                >
                  <Play className="h-4 w-4" />
                  <span>Run</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="space-x-1"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Reset</span>
                </Button>
              </div>
            </div>

            {/* Editor and output panels */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Editor Section */}
              <div className="flex-1 overflow-hidden">
                <CodeEditor
                  value={code}
                  onChange={setCode}
                  language="python" // Using Python as closest syntax to Jaclang
                  className="h-full"
                />
              </div>

              {/* Output Panel */}
              <ResizablePanel
                direction="horizontal"
                defaultSize={30}
                minSize={20}
                maxSize={50}
                className="overflow-hidden border-t"
              >
                <OutputPanel
                  output={output}
                  isLoading={isRunning}
                  className="h-full"
                />
              </ResizablePanel>
            </div>
          </div>

          {/* Sidebar - hidden on mobile until toggled */}
          {(showMobileSidebar || !isMobile) && (
            <ExamplesSidebar
              onSelectExample={handleSelectExample}
              isMobile={isMobile}
              onToggleMobile={toggleMobileSidebar}
              className={isMobile ? "absolute inset-0 z-50" : "border-l"}
            />
          )}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
