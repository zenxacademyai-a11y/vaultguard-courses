import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield, BookOpen, Users, AlertTriangle, Upload, BarChart3,
  Plus, Eye, Settings, LogOut, ChevronRight, Activity, Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const mockCourses = [
  { id: 1, title: "Advanced React Patterns", students: 234, revenue: "₹58,500", status: "active", drm: true },
  { id: 2, title: "System Design Masterclass", students: 189, revenue: "₹47,250", status: "active", drm: true },
  { id: 3, title: "DSA Complete Guide", students: 412, revenue: "₹1,03,000", status: "active", drm: false },
];

const mockAlerts = [
  { type: "warning", msg: "Suspicious login attempt from new IP — user@gmail.com", time: "2 min ago" },
  { type: "error", msg: "Screen recording detected — student45@mail.com", time: "15 min ago" },
  { type: "info", msg: "New device registered — pro_learner@outlook.com", time: "1 hr ago" },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("courses");

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border p-6 flex flex-col z-50">
        <Link to="/" className="flex items-center gap-2 mb-10">
          <Shield className="w-6 h-6 text-primary" />
          <span className="text-lg font-bold">Vault<span className="text-primary">Learn</span></span>
        </Link>

        <nav className="space-y-1 flex-1">
          {[
            { id: "courses", icon: BookOpen, label: "Courses" },
            { id: "students", icon: Users, label: "Students" },
            { id: "security", icon: Shield, label: "Security" },
            { id: "analytics", icon: BarChart3, label: "Analytics" },
            { id: "settings", icon: Settings, label: "Settings" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
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

        <Link to="/login">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </Link>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Creator Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage your secure courses</p>
          </div>
          <Button className="glow-primary">
            <Plus className="w-4 h-4 mr-2" /> New Course
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Students", value: "835", icon: Users, change: "+12%" },
            { label: "Active Courses", value: "3", icon: BookOpen, change: "+1" },
            { label: "Security Score", value: "98%", icon: Shield, change: "Excellent" },
            { label: "Revenue", value: "₹2.08L", icon: BarChart3, change: "+24%" },
          ].map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="gradient-card border-glow rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <s.icon className="w-5 h-5 text-primary" />
                <span className="text-xs font-mono text-success">{s.change}</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Courses Table */}
        <div className="gradient-card border-glow rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground">Your Courses</h2>
            <Button variant="ghost" size="sm" className="text-muted-foreground">View All <ChevronRight className="w-4 h-4 ml-1" /></Button>
          </div>
          <div className="space-y-3">
            {mockCourses.map((course) => (
              <Link
                to="/player"
                key={course.id}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm">{course.title}</div>
                    <div className="text-xs text-muted-foreground">{course.students} students · {course.revenue}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {course.drm && (
                    <span className="flex items-center gap-1 text-xs text-success font-mono">
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
        <div className="gradient-card border-glow rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Activity className="w-5 h-5 text-accent" /> Security Alerts
            </h2>
            <span className="text-xs font-mono text-accent">Live</span>
          </div>
          <div className="space-y-3">
            {mockAlerts.map((alert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30"
              >
                <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                  alert.type === "error" ? "text-destructive" : alert.type === "warning" ? "text-accent" : "text-primary"
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-foreground">{alert.msg}</p>
                  <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
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
