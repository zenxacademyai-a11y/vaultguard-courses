import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, ArrowLeft, Lock, Play, Pause, Volume2, Maximize, SkipForward, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const VideoPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [watermarkPos, setWatermarkPos] = useState({ x: 20, y: 20 });
  const [showModules, setShowModules] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setWatermarkPos({ x: Math.random() * 60 + 10, y: Math.random() * 60 + 10 });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const modules = [
    { title: "Module 1: Introduction", lessons: ["Welcome & Setup", "Course Overview", "Prerequisites"], active: true },
    { title: "Module 2: Core Concepts", lessons: ["Fundamentals", "Advanced Patterns", "Best Practices"], active: false },
    { title: "Module 3: Projects", lessons: ["Project Setup", "Implementation", "Deployment"], active: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="border-b border-border bg-card/80 backdrop-blur-xl px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="px-2 sm:px-3">
              <ArrowLeft className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </Link>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <h1 className="text-xs sm:text-sm font-semibold text-foreground truncate">Advanced React Patterns</h1>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-success">
          <Lock className="w-3 h-3" /> DRM Active
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Video Area */}
        <div className="flex-1 p-3 sm:p-6">
          <div
            className="relative aspect-video bg-card rounded-xl overflow-hidden border-glow"
            onContextMenu={(e) => e.preventDefault()}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-secondary to-card flex items-center justify-center">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center hover:bg-primary/30 transition-colors glow-primary"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                ) : (
                  <Play className="w-6 h-6 sm:w-8 sm:h-8 text-primary ml-1" />
                )}
              </button>
            </div>

            {/* Dynamic Watermark */}
            {isPlaying && (
              <motion.div
                animate={{ left: `${watermarkPos.x}%`, top: `${watermarkPos.y}%` }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="absolute pointer-events-none select-none"
              >
                <div className="text-foreground/15 font-mono text-[8px] sm:text-xs space-y-0.5 rotate-[-15deg]">
                  <div>student@example.com</div>
                  <div>Rahul Sharma</div>
                  <div>+91 98765 43210</div>
                </div>
              </motion.div>
            )}

            {/* Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-3 sm:p-4">
              <div className="w-full h-1 bg-secondary rounded-full mb-2 sm:mb-3 cursor-pointer">
                <div className="h-full w-1/3 bg-primary rounded-full" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <button onClick={() => setIsPlaying(!isPlaying)}>
                    {isPlaying ? <Pause className="w-4 h-4 text-foreground" /> : <Play className="w-4 h-4 text-foreground" />}
                  </button>
                  <SkipForward className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground" />
                  <Volume2 className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground hidden sm:block" />
                  <span className="text-[10px] sm:text-xs text-muted-foreground font-mono">12:34 / 38:20</span>
                </div>
                <Maximize className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground" />
              </div>
            </div>
          </div>

          {/* Lesson info */}
          <div className="mt-4 sm:mt-6">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">Welcome & Setup</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Module 1 · Lesson 1 · 38 min</p>
          </div>

          {/* Mobile modules toggle */}
          <button
            onClick={() => setShowModules(!showModules)}
            className="lg:hidden w-full mt-4 flex items-center justify-between p-3 rounded-lg bg-secondary/30 border-glow"
          >
            <span className="text-sm font-semibold text-foreground">Course Content</span>
            {showModules ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>
        </div>

        {/* Sidebar - Course modules */}
        <div className={`lg:w-80 lg:border-l border-border p-4 sm:p-6 space-y-4 ${showModules ? 'block' : 'hidden lg:block'}`}>
          <h3 className="text-sm font-bold text-foreground mb-4 hidden lg:block">Course Content</h3>
          {modules.map((mod, mi) => (
            <div key={mi} className="space-y-1">
              <div className={`text-xs font-mono uppercase tracking-wider mb-2 ${mod.active ? "text-primary" : "text-muted-foreground"}`}>
                {mod.title}
              </div>
              {mod.lessons.map((lesson, li) => (
                <button
                  key={li}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    mod.active && li === 0
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  <span className="font-mono text-xs mr-2">{mi + 1}.{li + 1}</span>
                  {lesson}
                </button>
              ))}
            </div>
          ))}

          {/* Security badge */}
          <div className="mt-6 sm:mt-8 p-4 rounded-lg border-glow bg-secondary/30">
            <div className="flex items-center gap-2 text-xs text-primary font-mono mb-2">
              <Shield className="w-3 h-3" /> SECURITY STATUS
            </div>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between"><span>DRM</span><span className="text-success">Active</span></div>
              <div className="flex justify-between"><span>Watermark</span><span className="text-success">Enabled</span></div>
              <div className="flex justify-between"><span>Device Lock</span><span className="text-success">Verified</span></div>
              <div className="flex justify-between"><span>Session</span><span className="text-success">Valid</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
