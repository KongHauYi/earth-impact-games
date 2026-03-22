
-- TrashProject: global counter for rubbish thrown
CREATE TABLE public.trash_counter (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  count BIGINT NOT NULL DEFAULT 0,
  goal BIGINT NOT NULL DEFAULT 1000000
);
INSERT INTO public.trash_counter (id, count, goal) VALUES (1, 0, 1000000);

ALTER TABLE public.trash_counter ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read trash counter" ON public.trash_counter FOR SELECT USING (true);
CREATE POLICY "Anyone can update trash counter" ON public.trash_counter FOR UPDATE USING (true) WITH CHECK (true);

-- Deforestation: global tree counter
CREATE TABLE public.tree_counter (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  count BIGINT NOT NULL DEFAULT 1000000,
  winner TEXT DEFAULT NULL
);
INSERT INTO public.tree_counter (id, count) VALUES (1, 1000000);

ALTER TABLE public.tree_counter ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read tree counter" ON public.tree_counter FOR SELECT USING (true);
CREATE POLICY "Anyone can update tree counter" ON public.tree_counter FOR UPDATE USING (true) WITH CHECK (true);

-- ElementStar: ratings per gas
CREATE TABLE public.element_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gas_name TEXT NOT NULL,
  stars INTEGER NOT NULL CHECK (stars >= 1 AND stars <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.element_ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read ratings" ON public.element_ratings FOR SELECT USING (true);
CREATE POLICY "Anyone can insert ratings" ON public.element_ratings FOR INSERT WITH CHECK (true);

-- ElementStar: reviews (rare)
CREATE TABLE public.element_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gas_name TEXT NOT NULL,
  reviewer_id TEXT NOT NULL,
  review_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.element_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read reviews" ON public.element_reviews FOR SELECT USING (true);
CREATE POLICY "Anyone can insert reviews" ON public.element_reviews FOR INSERT WITH CHECK (true);

-- RPC to atomically increment trash counter
CREATE OR REPLACE FUNCTION public.increment_trash()
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_count BIGINT;
  current_goal BIGINT;
BEGIN
  UPDATE trash_counter SET count = count + 1 WHERE id = 1 RETURNING count, goal INTO new_count, current_goal;
  IF new_count >= current_goal THEN
    UPDATE trash_counter SET goal = 1000000000 WHERE id = 1;
  END IF;
  RETURN new_count;
END;
$$;

-- RPC to atomically change tree counter
CREATE OR REPLACE FUNCTION public.change_trees(delta INTEGER)
RETURNS TABLE(new_count BIGINT, winner TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE tree_counter SET count = GREATEST(0, count + delta) WHERE id = 1;
  IF (SELECT tree_counter.count FROM tree_counter WHERE id = 1) = 0 THEN
    UPDATE tree_counter SET winner = 'Cut' WHERE id = 1 AND winner IS NULL;
  END IF;
  RETURN QUERY SELECT tree_counter.count, tree_counter.winner FROM tree_counter WHERE id = 1;
END;
$$;
