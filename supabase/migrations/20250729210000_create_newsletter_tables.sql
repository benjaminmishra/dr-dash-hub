-- Create newsletter_subscriptions table
CREATE TABLE public.newsletter_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  api_query TEXT NOT NULL,
  cron_schedule TEXT NOT NULL,
  summarization_prompt TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add comments to the columns for clarity
COMMENT ON COLUMN public.newsletter_subscriptions.api_query IS 'The machine-readable query for the news APIs.';
COMMENT ON COLUMN public.newsletter_subscriptions.cron_schedule IS 'The cron expression for the schedule.';
COMMENT ON COLUMN public.newsletter_subscriptions.summarization_prompt IS 'The user''s exact instructions for how to summarize the content.';
COMMENT ON COLUMN public.newsletter_subscriptions.is_active IS 'A boolean to let users pause a newsletter.';


-- Enable Row Level Security
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own subscriptions"
ON public.newsletter_subscriptions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions"
ON public.newsletter_subscriptions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
ON public.newsletter_subscriptions
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subscriptions"
ON public.newsletter_subscriptions
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates on newsletter_subscriptions
CREATE TRIGGER update_newsletter_subscriptions_updated_at
  BEFORE UPDATE ON public.newsletter_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();


-- Create generated_newsletters table
CREATE TABLE public.generated_newsletters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription_id UUID NOT NULL REFERENCES public.newsletter_subscriptions(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  sources JSONB,
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add comments to the columns for clarity
COMMENT ON COLUMN public.generated_newsletters.subscription_id IS 'Links back to the subscription that generated it.';
COMMENT ON COLUMN public.generated_newsletters.content IS 'The final, summarized newsletter text.';
COMMENT ON COLUMN public.generated_newsletters.sources IS 'A JSON object containing a list of the original articles (title and URL) used for the summary.';
COMMENT ON COLUMN public.generated_newsletters.generated_at IS 'When it was created.';


-- Enable Row Level Security
ALTER TABLE public.generated_newsletters ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
-- Users can access newsletters if they own the subscription
CREATE POLICY "Users can view their own generated newsletters"
ON public.generated_newsletters
FOR SELECT
USING (auth.uid() = (
  SELECT user_id FROM public.newsletter_subscriptions WHERE id = subscription_id
));

CREATE POLICY "Users can delete their own generated newsletters"
ON public.generated_newsletters
FOR DELETE
USING (auth.uid() = (
  SELECT user_id FROM public.newsletter_subscriptions WHERE id = subscription_id
));
