import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, ArrowLeft, Plus, Trash2, GripVertical, Upload, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LessonDraft {
  title: string;
  videoFile?: File;
  uploading?: boolean;
  videoUrl?: string;
}

interface ModuleDraft {
  title: string;
  lessons: LessonDraft[];
}

const CreateCourse = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [drmEnabled, setDrmEnabled] = useState(true);
  const [watermarkEnabled, setWatermarkEnabled] = useState(true);

  const [modules, setModules] = useState<ModuleDraft[]>([
    { title: "Module 1", lessons: [{ title: "Lesson 1" }] },
  ]);

  const addModule = () => {
    setModules([...modules, { title: `Module ${modules.length + 1}`, lessons: [{ title: "Lesson 1" }] }]);
  };

  const removeModule = (idx: number) => {
    if (modules.length > 1) setModules(modules.filter((_, i) => i !== idx));
  };

  const addLesson = (moduleIdx: number) => {
    const updated = [...modules];
    updated[moduleIdx].lessons.push({ title: `Lesson ${updated[moduleIdx].lessons.length + 1}` });
    setModules(updated);
  };

  const removeLesson = (moduleIdx: number, lessonIdx: number) => {
    const updated = [...modules];
    if (updated[moduleIdx].lessons.length > 1) {
      updated[moduleIdx].lessons = updated[moduleIdx].lessons.filter((_, i) => i !== lessonIdx);
      setModules(updated);
    }
  };

  const updateModuleTitle = (idx: number, title: string) => {
    const updated = [...modules];
    updated[idx].title = title;
    setModules(updated);
  };

  const updateLessonTitle = (moduleIdx: number, lessonIdx: number, title: string) => {
    const updated = [...modules];
    updated[moduleIdx].lessons[lessonIdx].title = title;
    setModules(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in");
      return;
    }
    if (!title.trim()) {
      toast.error("Course title is required");
      return;
    }

    setSaving(true);
    try {
      // Create course
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .insert({
          creator_id: user.id,
          title: title.trim(),
          description: description.trim() || null,
          price: parseFloat(price) || 0,
          currency,
          drm_enabled: drmEnabled,
          watermark_enabled: watermarkEnabled,
          status: 'draft',
        })
        .select()
        .single();

      if (courseError) throw courseError;

      // Create modules and lessons
      for (let mi = 0; mi < modules.length; mi++) {
        const mod = modules[mi];
        const { data: moduleData, error: modError } = await supabase
          .from('modules')
          .insert({
            course_id: course.id,
            title: mod.title,
            sort_order: mi,
          })
          .select()
          .single();

        if (modError) throw modError;

        // Create lessons and upload videos
        for (let li = 0; li < mod.lessons.length; li++) {
          const lesson = mod.lessons[li];
          let videoUrl: string | null = null;

          if (lesson.videoFile) {
            const filePath = `${user.id}/${course.id}/${moduleData.id}/${Date.now()}_${lesson.videoFile.name}`;
            const { error: uploadError } = await supabase.storage
              .from('course-videos')
              .upload(filePath, lesson.videoFile);
            if (uploadError) throw uploadError;
            videoUrl = filePath;
          }

          const { error: lessonError } = await supabase.from('lessons').insert({
            module_id: moduleData.id,
            title: lesson.title,
            sort_order: li,
            video_url: videoUrl,
          });
          if (lessonError) throw lessonError;
        }
      }

      toast.success("Course created successfully!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Failed to create course");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="border-b border-border bg-card/80 backdrop-blur-xl px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="px-2 sm:px-3">
              <ArrowLeft className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </Link>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <h1 className="text-sm sm:text-base font-semibold text-foreground">Create New Course</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        {/* Course Details */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-card border-glow rounded-xl p-4 sm:p-6"
        >
          <h2 className="text-lg font-bold text-foreground mb-4 sm:mb-6">Course Details</h2>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground">Course Title</Label>
              <Input
                placeholder="e.g. Advanced React Patterns"
                className="mt-1 bg-secondary border-border"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Description</Label>
              <Textarea
                placeholder="Describe what students will learn..."
                className="mt-1 bg-secondary border-border min-h-[100px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Price</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="999"
                    className="pl-10 bg-secondary border-border"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="mt-1 bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">₹ INR</SelectItem>
                    <SelectItem value="USD">$ USD</SelectItem>
                    <SelectItem value="EUR">€ EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Security Settings */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="gradient-card border-glow rounded-xl p-4 sm:p-6"
        >
          <h2 className="text-lg font-bold text-foreground mb-4 sm:mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" /> Security Settings
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm text-foreground">DRM Protection</Label>
                <p className="text-xs text-muted-foreground">Enable Widevine + FairPlay encryption</p>
              </div>
              <Switch checked={drmEnabled} onCheckedChange={setDrmEnabled} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm text-foreground">Dynamic Watermark</Label>
                <p className="text-xs text-muted-foreground">Overlay user info on video playback</p>
              </div>
              <Switch checked={watermarkEnabled} onCheckedChange={setWatermarkEnabled} />
            </div>
          </div>
        </motion.div>

        {/* Modules & Lessons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="gradient-card border-glow rounded-xl p-4 sm:p-6"
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg font-bold text-foreground">Modules & Lessons</h2>
            <Button type="button" variant="outline" size="sm" onClick={addModule} className="border-primary/30 text-primary hover:bg-primary/10">
              <Plus className="w-4 h-4 mr-1" /> Module
            </Button>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {modules.map((mod, mi) => (
              <div key={mi} className="rounded-lg bg-secondary/30 p-3 sm:p-4 border border-border/50">
                <div className="flex items-center gap-2 sm:gap-3 mb-3">
                  <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0 hidden sm:block" />
                  <Input
                    value={mod.title}
                    onChange={(e) => updateModuleTitle(mi, e.target.value)}
                    className="bg-secondary border-border font-semibold text-sm"
                    placeholder="Module title"
                  />
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeModule(mi)} className="text-destructive flex-shrink-0 px-2">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2 ml-0 sm:ml-7">
                  {mod.lessons.map((lesson, li) => (
                    <div key={li} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-muted-foreground w-6 flex-shrink-0">{mi + 1}.{li + 1}</span>
                        <Input
                          value={lesson.title}
                          onChange={(e) => updateLessonTitle(mi, li, e.target.value)}
                          className="bg-secondary/50 border-border/50 text-sm"
                          placeholder="Lesson title"
                        />
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeLesson(mi, li)} className="text-muted-foreground hover:text-destructive flex-shrink-0 px-2">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      {/* Video upload */}
                      <div className="ml-8 flex items-center gap-2">
                        <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer hover:text-primary transition-colors px-2 py-1.5 rounded-md bg-secondary/30 border border-border/30">
                          <Upload className="w-3 h-3" />
                          {lesson.videoFile ? lesson.videoFile.name : "Upload video"}
                          <input
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const updated = [...modules];
                                updated[mi].lessons[li].videoFile = file;
                                setModules(updated);
                              }
                            }}
                          />
                        </label>
                        {lesson.videoFile && (
                          <span className="text-[10px] text-success font-mono">
                            {(lesson.videoFile.size / (1024 * 1024)).toFixed(1)}MB
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => addLesson(mi)}
                    className="text-muted-foreground hover:text-primary text-xs ml-6"
                  >
                    <Plus className="w-3 h-3 mr-1" /> Add Lesson
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <Link to="/dashboard">
            <Button type="button" variant="outline" className="w-full sm:w-auto">Cancel</Button>
          </Link>
          <Button type="submit" className="glow-primary w-full sm:w-auto" disabled={saving}>
            {saving ? "Creating..." : "Create Course"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateCourse;
