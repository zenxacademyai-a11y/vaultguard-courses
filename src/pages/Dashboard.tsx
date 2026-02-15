import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield, BookOpen, Users, AlertTriangle, Upload, BarChart3,
  Plus, Eye, Settings, LogOut, ChevronRight, Activity, Lock,
  Menu, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("courses");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const { data: courses = [] } = useQuery({
    queryKey: ['courses', user?.id],
    queryFn: async () => {
      const { data } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const mockAlerts = [
    { type: "warning", msg: "Suspicious login attempt from new IP — user@gmail.com", time: "2 min ago" },
    { type: "error", msg: "Screen recording detected — student45@mail.com", time: "15 min ago" },
    { type: "info", msg: "New device registered — pro_learner@outlook.com", time: "1 hr ago" },
  ];

  const sidebarItems = [
    { id: "courses", icon: BookOpen, label: "Courses" },
    { id: "students", icon: Users, label: "Students" },
    { id: "security", icon: Shield, label: "Security" },
    { id: "analytics", icon: BarChart3, label: "Analytics" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-background/80 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border p-6 flex flex-col z-50 transition-transform lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex items-center justify-between mb-10">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <span className="text-lg font-bold">Vault<span className="text-primary">Learn</span></span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="space-y-1 flex-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                activeTab === item.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-4 sm:p-6 lg:p-8">
        {/* Mobile Header */}
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2">
              <Menu className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Creator Dashboard</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">Manage your secure courses</p>
            </div>
          </div>
          <Link to="/create-course">
            <Button className="glow-primary" size="sm">
              <Plus className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">New Course</span>
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {[
            { label: "Total Students", value: "835", icon: Users, change: "+12%" },
            { label: "Active Courses", value: String(courses.length || 3), icon: BookOpen, change: `${courses.length}` },
            { label: "Security Score", value: "98%", icon: Shield, change: "Excellent" },
            { label: "Revenue", value: "₹2.08L", icon: BarChart3, change: "+24%" },
          ].map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="gradient-card border-glow rounded-xl p-4 sm:p-6"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <s.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <span className="text-xs font-mono text-success">{s.change}</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-foreground">{s.value}</div>
              <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Courses Table */}
        <div className="gradient-card border-glow rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-bold text-foreground">Your Courses</h2>
            <Button variant="ghost" size="sm" className="text-muted-foreground text-xs sm:text-sm">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {(courses.length > 0 ? courses : [
              { id: '1', title: "Advanced React Patterns", status: "active", drm_enabled: true },
              { id: '2', title: "System Design Masterclass", status: "active", drm_enabled: true },
              { id: '3', title: "DSA Complete Guide", status: "draft", drm_enabled: false },
            ]).map((course: any) => (
              <Link
                to="/player"
                key={course.id}
                className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-foreground text-xs sm:text-sm truncate">{course.title}</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground">
                      {course.status === 'active' ? 'Published' : 'Draft'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  {course.drm_enabled && (
                    <span className="hidden sm:flex items-center gap-1 text-xs text-success font-mono">
                      <Lock className="w-3 h-3" /> DRM
                    </span>
                  )}
                  <Eye className="w-4 h-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Security Alerts */}
        <div className="gradient-card border-glow rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-accent" /> Security Alerts
            </h2>
            <span className="text-xs font-mono text-accent">Live</span>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {mockAlerts.map((alert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-secondary/30"
              >
                <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                  alert.type === "error" ? "text-destructive" : alert.type === "warning" ? "text-accent" : "text-primary"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-foreground">{alert.msg}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">{alert.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
