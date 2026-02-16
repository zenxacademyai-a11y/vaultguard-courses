
-- Enrollments table for student course access
CREATE TABLE public.enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_id TEXT,
  payment_provider TEXT DEFAULT 'razorpay',
  amount_paid NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'INR',
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Students can view their own enrollments
CREATE POLICY "Users can view own enrollments"
ON public.enrollments FOR SELECT
USING (auth.uid() = user_id);

-- Students can insert own enrollments (after payment verification)
CREATE POLICY "Users can insert own enrollments"
ON public.enrollments FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Creators can view enrollments for their courses
CREATE POLICY "Creators can view course enrollments"
ON public.enrollments FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.courses
  WHERE courses.id = enrollments.course_id
  AND courses.creator_id = auth.uid()
));

-- Add public read policy for courses (students need to browse)
CREATE POLICY "Anyone can view published courses"
ON public.courses FOR SELECT
USING (status = 'active');

-- Students enrolled in a course can view its modules
CREATE POLICY "Enrolled students can view modules"
ON public.modules FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.enrollments
  WHERE enrollments.course_id = modules.course_id
  AND enrollments.user_id = auth.uid()
  AND enrollments.status = 'active'
));

-- Students enrolled in a course can view its lessons
CREATE POLICY "Enrolled students can view lessons"
ON public.lessons FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.modules m
  JOIN public.enrollments e ON e.course_id = m.course_id
  WHERE m.id = lessons.module_id
  AND e.user_id = auth.uid()
  AND e.status = 'active'
));

-- Create video storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('course-videos', 'course-videos', false);

-- Creators can upload videos
CREATE POLICY "Creators can upload videos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'course-videos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Creators can view their own videos
CREATE POLICY "Creators can view own videos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'course-videos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Enrolled students can view course videos (via signed URLs in edge function)
CREATE POLICY "Creators can update own videos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'course-videos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Creators can delete own videos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'course-videos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Enable realtime on playback_logs for live security alerts
ALTER PUBLICATION supabase_realtime ADD TABLE public.playback_logs;
