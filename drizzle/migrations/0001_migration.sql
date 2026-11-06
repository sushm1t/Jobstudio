CREATE TABLE public.user_entitlements (
  user_id uuid PRIMARY KEY,
  is_pro boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.user_entitlements TO authenticated;
GRANT ALL ON public.user_entitlements TO service_role;
ALTER TABLE public.user_entitlements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own entitlement" ON public.user_entitlements FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.api_usage (
  user_id uuid NOT NULL,
  feature text NOT NULL,
  period text NOT NULL,
  count integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, feature, period)
);
GRANT SELECT ON public.api_usage TO authenticated;
GRANT ALL ON public.api_usage TO service_role;
ALTER TABLE public.api_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own usage" ON public.api_usage FOR SELECT TO authenticated USING (auth.uid() = user_id);