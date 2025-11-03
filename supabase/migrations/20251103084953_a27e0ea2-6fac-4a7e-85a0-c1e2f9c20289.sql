-- Create table for tracking AI-generated quantum circuits
CREATE TABLE public.generated_circuits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  domain text NOT NULL,
  use_case text NOT NULL,
  generated_code text NOT NULL,
  algorithm_used text,
  qubit_count integer,
  executed boolean DEFAULT false,
  execution_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.generated_circuits ENABLE ROW LEVEL SECURITY;

-- Users can view their own generated circuits
CREATE POLICY "Users can view own generated circuits"
ON public.generated_circuits
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own generated circuits
CREATE POLICY "Users can insert own generated circuits"
ON public.generated_circuits
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own generated circuits
CREATE POLICY "Users can update own generated circuits"
ON public.generated_circuits
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own generated circuits
CREATE POLICY "Users can delete own generated circuits"
ON public.generated_circuits
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for efficient querying
CREATE INDEX idx_generated_circuits_user_id ON public.generated_circuits(user_id);
CREATE INDEX idx_generated_circuits_domain ON public.generated_circuits(domain);
CREATE INDEX idx_generated_circuits_created_at ON public.generated_circuits(created_at DESC);