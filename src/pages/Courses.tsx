import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, BookOpen, Users, Lock, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Courses = () => {
  const [search, setSearch] = useState("");
  const { user } = useAuth();

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["public-courses"],
    queryFn: async () => {
      const { data } = await supabase
        .from("courses")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  const { data: enrollments = [] } = useQuery({
    queryKey: ["my-enrollments", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("enrollments")
        .select("course_id, status")
        .eq("user_id", user!.id);
      return data || [];
    },
    enabled: !!user,
  });

  const enrolledCourseIds = new Set(
    enrollments.filter((e) => e.status === "active").map((e) => e.course_id)
  );

  const filtered = courses.filter((c: any) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case "INR": return "₹";
      case "USD": return "$";
      case "EUR": return "€";
      default: return "₹";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/80 backdrop-blur-xl px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          <span className="text-lg font-bold">
            Vault<span className="text-primary">Learn</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          {user ? (
            <Link to="/dashboard">
              <Button variant="outline" size="sm">Dashboard</Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button size="sm" className="glow-primary">Sign In</Button>
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-3">
            Browse <span className="text-primary text-glow-primary">Courses</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            All courses are protected with DRM encryption and dynamic watermarking
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-10 bg-secondary border-border"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Course Grid */}
        {isLoading ? (
          <div className="text-center text-muted-foreground py-12">Loading courses...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">No courses found</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filtered.map((course: any) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="gradient-card border-glow rounded-xl overflow-hidden"
              >
                {/* Thumbnail placeholder */}
                <div className="aspect-video bg-secondary/50 flex items-center justify-center">
                  <BookOpen className="w-10 h-10 text-primary/30" />
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="font-bold text-foreground text-sm sm:text-base mb-1 line-clamp-2">
                    {course.title}
                  </h3>
                  {course.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                      {course.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mb-4">
                    {course.drm_enabled && (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-success">
                        <Lock className="w-3 h-3" /> DRM
                      </span>
                    )}
                    {course.watermark_enabled && (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-success">
                        <Shield className="w-3 h-3" /> Watermark
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-foreground">
                      {course.price > 0
                        ? `${getCurrencySymbol(course.currency)}${course.price}`
                        : "Free"}
                    </span>
                    {enrolledCourseIds.has(course.id) ? (
                      <Link to={`/player/${course.id}`}>
                        <Button size="sm" variant="outline" className="text-success border-success/30">
                          Continue <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </Link>
                    ) : (
                      <Link to={`/course/${course.id}`}>
                        <Button size="sm" className="glow-primary">
                          View Course
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
