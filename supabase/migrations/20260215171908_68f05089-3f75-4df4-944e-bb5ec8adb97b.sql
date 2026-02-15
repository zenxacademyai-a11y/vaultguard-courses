
-- Profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  device_hash TEXT,
  last_ip TEXT,
  risk_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'INR',
  drm_enabled BOOLEAN DEFAULT true,
  watermark_enabled BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'draft',
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators can view own courses" ON public.courses FOR SELECT USING (auth.uid() = creator_id);
CREATE POLICY "Creators can insert own courses" ON public.courses FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Creators can update own courses" ON public.courses FOR UPDATE USING (auth.uid() = creator_id);
CREATE POLICY "Creators can delete own courses" ON public.courses FOR DELETE USING (auth.uid() = creator_id);

-- Modules table
CREATE TABLE public.modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators can manage modules" ON public.modules FOR ALL
  USING (EXISTS (SELECT 1 FROM public.courses WHERE courses.id = modules.course_id AND courses.creator_id = auth.uid()));

-- Lessons table
CREATE TABLE public.lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  video_url TEXT,
  duration_seconds INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators can manage lessons" ON public.lessons FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.modules m
    JOIN public.courses c ON c.id = m.course_id
    WHERE m.id = lessons.module_id AND c.creator_id = auth.uid()
  ));

-- Sessions table for device tracking
CREATE TABLE public.user_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  device_hash TEXT NOT NULL,
  ip_address TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions" ON public.user_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON public.user_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sessions" ON public.user_sessions FOR UPDATE USING (auth.uid() = user_id);

-- Playback logs
CREATE TABLE public.playback_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  lesson_id UUID REFERENCES public.lessons(id),
  ip_address TEXT,
  watermark_id TEXT,
  anomaly_flag BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.playback_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own playback logs" ON public.playback_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Creators can view playback logs" ON public.playback_logs FOR SELECT
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.lessons l
    JOIN public.modules m ON m.id = l.module_id
    JOIN public.courses c ON c.id = m.course_id
    WHERE l.id = playback_logs.lesson_id AND c.creator_id = auth.uid()
  ));

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
