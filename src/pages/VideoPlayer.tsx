import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, ArrowLeft, Lock, Play, Pause, Volume2, Maximize, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const VideoPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [watermarkPos, setWatermarkPos] = useState({ x: 20, y: 20 });

  // Simulate moving watermark
  useEffect(() => {
    const interval = setInterval(() => {
      setWatermarkPos({
        x: Math.random() * 60 + 10,
        y: Math.random() * 60 + 10,
      });
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
      <div className="border-b border-border bg-card/80 backdrop-blur-xl px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
          </Link>
          <div className="h-4 w-px bg-border" />
          <h1 className="text-sm font-semibold text-foreground">Advanced React Patterns</h1>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-success">
          <Lock className="w-3 h-3" /> DRM Active · Watermark Enabled
        </div>
      </div>

      <div className="flex">
        {/* Video Area */}
        <div className="flex-1 p-6">
          <div
            className="relative aspect-video bg-card rounded-xl overflow-hidden border-glow"
            onContextMenu={(e) => e.preventDefault()}
          >
            {/* Fake video area */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary to-card flex items-center justify-center">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-20 h-20 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center hover:bg-primary/30 transition-colors glow-primary"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-primary" />
                ) : (
                  <Play className="w-8 h-8 text-primary ml-1" />
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
                <div className="text-foreground/15 font-mono text-xs space-y-0.5 rotate-[-15deg]">
                  <div>student@example.com</div>
                  <div>Rahul Sharma</div>
                  <div>+91 98765 43210</div>
                  <div className="text-[10px]">192.168.1.1 · {new Date().toISOString()}</div>
                </div>
              </motion.div>
            )}

            {/* Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-4">
              {/* Progress bar */}
              <div className="w-full h-1 bg-secondary rounded-full mb-3 cursor-pointer">
                <div className="h-full w-1/3 bg-primary rounded-full" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={() => setIsPlaying(!isPlaying)}>
                    {isPlaying ? <Pause className="w-4 h-4 text-foreground" /> : <Play className="w-4 h-4 text-foreground" />}
                  </button>
                  <SkipForward className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground" />
                  <Volume2 className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground" />
                  <span className="text-xs text-muted-foreground font-mono">12:34 / 38:20</span>
                </div>
                <Maximize className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground" />
              </div>
            </div>
          </div>

          {/* Lesson info */}
          <div className="mt-6">
            <h2 className="text-xl font-bold text-foreground">Welcome & Setup</h2>
            <p className="text-sm text-muted-foreground mt-1">Module 1 · Lesson 1 · 38 min</p>
          </div>
        </div>

        {/* Sidebar - Course modules */}
        <div className="w-80 border-l border-border p-6 space-y-4">
          <h3 className="text-sm font-bold text-foreground mb-4">Course Content</h3>
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
          <div className="mt-8 p-4 rounded-lg border-glow bg-secondary/30">
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
