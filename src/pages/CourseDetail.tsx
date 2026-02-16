import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, BookOpen, Lock, ArrowLeft, Play, CheckCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [enrolling, setEnrolling] = useState(false);

  const { data: course, isLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const { data } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId!)
        .single();
      return data;
    },
    enabled: !!courseId,
  });

  const { data: modules = [] } = useQuery({
    queryKey: ["course-modules", courseId],
    queryFn: async () => {
      const { data } = await supabase
        .from("modules")
        .select("*, lessons(*)")
        .eq("course_id", courseId!)
        .order("sort_order");
      return data || [];
    },
    enabled: !!courseId,
  });

  const { data: enrollment } = useQuery({
    queryKey: ["enrollment", courseId, user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("enrollments")
        .select("*")
        .eq("course_id", courseId!)
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    },
    enabled: !!courseId && !!user,
  });

  const handleEnroll = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (course?.price && course.price > 0) {
      // Razorpay payment flow - will be handled by edge function
      toast.info("Payment integration coming soon. For now, enrolling for free.");
    }

    setEnrolling(true);
    try {
      const { error } = await supabase.from("enrollments").insert({
        user_id: user.id,
        course_id: courseId!,
        status: "active",
        amount_paid: 0,
      });
      if (error) throw error;
      toast.success("Enrolled successfully!");
      queryClient.invalidateQueries({ queryKey: ["enrollment", courseId] });
    } catch (err: any) {
      toast.error(err.message || "Enrollment failed");
    } finally {
      setEnrolling(false);
    }
  };

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case "INR": return "₹";
      case "USD": return "$";
      case "EUR": return "€";
      default: return "₹";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        Course not found
      </div>
    );
  }

  const totalLessons = modules.reduce(
    (acc: number, m: any) => acc + (m.lessons?.length || 0), 0
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="border-b border-border bg-card/80 backdrop-blur-xl px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/courses">
            <Button variant="ghost" size="sm" className="px-2 sm:px-3">
              <ArrowLeft className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Courses</span>
            </Button>
          </Link>
        </div>
        {user && (
          <Link to="/dashboard">
            <Button variant="outline" size="sm">Dashboard</Button>
          </Link>
        )}
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Course Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-card border-glow rounded-xl p-6 sm:p-8 mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-3xl font-bold text-foreground mb-2">{course.title}</h1>
              {course.description && (
                <p className="text-sm text-muted-foreground mb-4">{course.description}</p>
              )}
              <div className="flex flex-wrap gap-3 text-xs">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <BookOpen className="w-3 h-3" /> {modules.length} modules · {totalLessons} lessons
                </span>
                {course.drm_enabled && (
                  <span className="flex items-center gap-1 text-success font-mono">
                    <Lock className="w-3 h-3" /> DRM Protected
                  </span>
                )}
                {course.watermark_enabled && (
                  <span className="flex items-center gap-1 text-success font-mono">
                    <Shield className="w-3 h-3" /> Watermarked
                  </span>
                )}
              </div>
            </div>
            <div className="text-center sm:text-right">
              <div className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                {course.price && course.price > 0
                  ? `${getCurrencySymbol(course.currency || "INR")}${course.price}`
                  : "Free"}
              </div>
              {enrollment?.status === "active" ? (
                <Link to={`/player/${course.id}`}>
                  <Button className="glow-primary w-full sm:w-auto">
                    <Play className="w-4 h-4 mr-2" /> Start Learning
                  </Button>
                </Link>
              ) : (
                <Button
                  className="glow-primary w-full sm:w-auto"
                  onClick={handleEnroll}
                  disabled={enrolling}
                >
                  {enrolling ? "Enrolling..." : "Enroll Now"}
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Course Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="gradient-card border-glow rounded-xl p-4 sm:p-6"
        >
          <h2 className="text-lg font-bold text-foreground mb-4">Course Content</h2>
          <div className="space-y-3">
            {modules.map((mod: any, mi: number) => (
              <div key={mod.id} className="rounded-lg bg-secondary/30 p-3 sm:p-4">
                <div className="text-xs font-mono uppercase tracking-wider text-primary mb-2">
                  {mod.title}
                </div>
                <div className="space-y-1">
                  {(mod.lessons || [])
                    .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
                    .map((lesson: any, li: number) => (
                      <div
                        key={lesson.id}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground"
                      >
                        {enrollment?.status === "active" ? (
                          <Play className="w-3 h-3 text-primary flex-shrink-0" />
                        ) : (
                          <Lock className="w-3 h-3 flex-shrink-0" />
                        )}
                        <span className="font-mono text-xs mr-1">{mi + 1}.{li + 1}</span>
                        {lesson.title}
                      </div>
                    ))}
                </div>
              </div>
            ))}
            {modules.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Course content will be available soon.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CourseDetail;
