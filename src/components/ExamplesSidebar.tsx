
import { useState } from "react";
import { BookOpen, ChevronRight, Code, Layout } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { exampleCodes } from "@/lib/examples";

interface ExamplesSidebarProps {
  onSelectExample: (code: string) => void;
  className?: string;
  isMobile?: boolean;
  onToggleMobile?: () => void;
}

export function ExamplesSidebar({
  onSelectExample,
  className,
  isMobile = false,
  onToggleMobile,
}: ExamplesSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    if (isMobile && onToggleMobile) {
      onToggleMobile();
    } else {
      setCollapsed(!collapsed);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col bg-sidebar text-sidebar-foreground border-l border-sidebar-border transition-all duration-300 ease-in-out",
        collapsed ? "w-12" : isMobile ? "w-full" : "w-64",
        className
      )}
    >
      <div className="flex items-center justify-between p-4 h-14">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <Layout className="h-5 w-5" />
            <h1 className="font-semibold">Jac Examples</h1>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={cn(collapsed && "mx-auto")}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronRight
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              !collapsed && "rotate-180"
            )}
          />
        </Button>
      </div>

      <Separator className="bg-sidebar-border" />

      {!collapsed && (
        <ScrollArea className="flex-1 px-2 py-4">
          <div className="space-y-1">
            {exampleCodes.map((example, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start text-sm"
                onClick={() => onSelectExample(example.code)}
              >
                <Code className="mr-2 h-4 w-4" />
                {example.name}
              </Button>
            ))}
          </div>
        </ScrollArea>
      )}

      <div className="p-4 flex justify-between items-center">
        {!collapsed && <ThemeToggle />}
        {collapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(false)}
            className="mx-auto"
            aria-label="Expand sidebar"
          >
            <BookOpen className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
