
-- ===============================================
-- MIGRACJA BAZY DANYCH SUPABASE
-- ===============================================

-- 1. ROZSZERZONE TABELE KURSÓW I LEKCJI
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  estimated_hours INTEGER DEFAULT 1,
  order_index INTEGER DEFAULT 0,
  is_premium BOOLEAN DEFAULT false,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content JSONB, -- Rich content: paragraphs, videos, quizzes, charts
  quiz_questions JSONB, -- Array of quiz questions
  xp_reward INTEGER DEFAULT 0,
  order_index INTEGER DEFAULT 0,
  duration_minutes INTEGER DEFAULT 10,
  is_free BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABELA PORTFELI UŻYTKOWNIKÓW
CREATE TABLE IF NOT EXISTS user_portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL DEFAULT 'Mój Portfel',
  positions JSONB DEFAULT '[]'::jsonb, -- Array of positions
  cash DECIMAL DEFAULT 10000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 3. ROZSZERZONA TABELA AKTUALNOŚCI
CREATE TABLE IF NOT EXISTS financial_news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  source TEXT,
  url TEXT,
  category TEXT,
  impact_level TEXT CHECK (impact_level IN ('low', 'medium', 'high')) DEFAULT 'medium',
  sentiment TEXT CHECK (sentiment IN ('positive', 'negative', 'neutral')) DEFAULT 'neutral',
  relevant_symbols TEXT[], -- Array of stock symbols
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABELA DANYCH RYNKOWYCH (CACHE)
CREATE TABLE IF NOT EXISTS market_data_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL,
  data_type TEXT NOT NULL, -- 'stock_price', 'company_info', 'exchange_rate'
  data JSONB NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(symbol, data_type)
);

-- 5. ROZSZERZONE OSIĄGNIĘCIA
CREATE TABLE IF NOT EXISTS achievement_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('learning', 'trading', 'social', 'milestone')) DEFAULT 'learning',
  requirements JSONB, -- Conditions to unlock
  reward_xp INTEGER DEFAULT 0,
  reward_badge TEXT, -- Badge image URL
  rarity TEXT CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')) DEFAULT 'common',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TABELA SUBSKRYPCJI
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  plan_type TEXT CHECK (plan_type IN ('free', 'premium', 'pro')) DEFAULT 'free',
  status TEXT CHECK (status IN ('active', 'canceled', 'expired', 'trial')) DEFAULT 'free',
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 7. INDEKSY DLA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_courses_difficulty ON courses(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_courses_premium ON courses(is_premium);
CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_module ON user_progress(module_id);
CREATE INDEX IF NOT EXISTS idx_market_data_symbol ON market_data_cache(symbol);
CREATE INDEX IF NOT EXISTS idx_market_data_expires ON market_data_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_financial_news_category ON financial_news(category);
CREATE INDEX IF NOT EXISTS idx_financial_news_published ON financial_news(published_at);

-- 8. ROW LEVEL SECURITY (RLS)
ALTER TABLE user_portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Polityki RLS
CREATE POLICY "Users can view own portfolios" ON user_portfolios
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own portfolios" ON user_portfolios
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own portfolios" ON user_portfolios
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own portfolios" ON user_portfolios
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own subscriptions" ON user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Publiczne tabele (dostępne dla wszystkich)
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievement_definitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Courses are viewable by everyone" ON courses FOR SELECT USING (true);
CREATE POLICY "Lessons are viewable by everyone" ON lessons FOR SELECT USING (true);
CREATE POLICY "News are viewable by everyone" ON financial_news FOR SELECT USING (true);
CREATE POLICY "Achievements are viewable by everyone" ON achievement_definitions FOR SELECT USING (true);

-- 9. TRIGGERS FOR UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON user_portfolios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 10. WSTAWIENIE PRZYKŁADOWYCH DANYCH

-- Definicje osiągnięć
INSERT INTO achievement_definitions (name, title, description, category, requirements, reward_xp, rarity) VALUES
('first_step', 'Pierwszy Krok', 'Ukończ swoją pierwszą lekcję', 'learning', '{"lessons_completed": 1}', 50, 'common'),
('week_streak', 'Gorąca Passa', '7 dni nauki pod rząd', 'learning', '{"streak_days": 7}', 100, 'rare'),
('quiz_master', 'Mistrz Quizów', '100% w 10 quizach z rzędu', 'learning', '{"perfect_quizzes": 10}', 200, 'epic'),
('first_million', 'Pierwszy Milion', 'Osiągnij 1M USD w wirtualnym portfelu', 'trading', '{"portfolio_value": 1000000}', 500, 'legendary'),
('diversifier', 'Dywersyfikator', 'Miej akcje z 5 różnych sektorów', 'trading', '{"sectors_count": 5}', 150, 'rare'),
('long_term', 'Długoterminowiec', 'Trzymaj pozycję przez 6 miesięcy', 'trading', '{"holding_days": 180}', 300, 'epic'),
('course_complete', 'Absolwent', 'Ukończ swój pierwszy kompletny kurs', 'learning', '{"courses_completed": 1}', 250, 'rare'),
('knowledge_seeker', 'Poszukiwacz Wiedzy', 'Zdobądź 1000 XP', 'milestone', '{"total_xp": 1000}', 100, 'common'),
('expert', 'Ekspert', 'Osiągnij poziom 10', 'milestone', '{"level": 10}', 1000, 'legendary');

-- Przykładowe kursy
INSERT INTO courses (title, description, difficulty_level, estimated_hours, order_index, is_premium) VALUES 
('Podstawy Inwestowania', 'Poznaj fundamenty świata finansów i inwestycji. Idealne wprowadzenie dla początkujących.', 'beginner', 4, 1, false),
('Analiza Techniczna', 'Naucz się czytać wykresy i przewidywać trendy rynkowe.', 'intermediate', 6, 2, true),
('Analiza Fundamentalna', 'Oceń prawdziwą wartość spółek i aktywów.', 'intermediate', 8, 3, true),
('Polski Rynek Giełdowy', 'Specyfika GPW i polskich spółek.', 'beginner', 5, 4, false),
('Inwestowanie w ETF', 'Pasywne inwestowanie i budowanie portfela.', 'beginner', 3, 5, false),
('Zarządzanie Ryzykiem', 'Ochrona kapitału i zaawansowane strategie.', 'advanced', 6, 6, true);

-- Przykładowe newsy finansowe
INSERT INTO financial_news (title, summary, source, category, impact_level, sentiment, published_at) VALUES
('Fed utrzymuje stopy procentowe', 'Rezerwa Federalna pozostawia stopy bez zmian', 'Federal Reserve', 'monetary_policy', 'high', 'neutral', NOW() - INTERVAL '2 hours'),
('Apple prezentuje nowe produkty', 'Gigant technologiczny zaprezentował najnowsze urządzenia', 'Apple Inc.', 'earnings', 'medium', 'positive', NOW() - INTERVAL '4 hours'),
('Wzrost inflacji w strefie euro', 'Inflacja przekroczyła oczekiwania analityków', 'ECB', 'monetary_policy', 'high', 'negative', NOW() - INTERVAL '6 hours');

-- ===============================================
-- FUNKCJE POMOCNICZE
-- ===============================================

-- Funkcja do czyszczenia starych danych z cache
CREATE OR REPLACE FUNCTION clean_expired_cache()
RETURNS void AS $$
BEGIN
    DELETE FROM market_data_cache WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Funkcja do obliczania poziomu użytkownika na podstawie XP
CREATE OR REPLACE FUNCTION calculate_user_level(total_xp INTEGER)
RETURNS INTEGER AS $$
BEGIN
    RETURN GREATEST(1, FLOOR(total_xp / 1000.0) + 1);
END;
$$ LANGUAGE plpgsql;

-- Funkcja do aktualizacji statystyk użytkownika
CREATE OR REPLACE FUNCTION update_user_stats(
    p_user_id UUID,
    p_xp_gained INTEGER DEFAULT 0,
    p_lesson_completed BOOLEAN DEFAULT false,
    p_course_completed BOOLEAN DEFAULT false
)
RETURNS void AS $$
DECLARE
    current_stats RECORD;
    new_level INTEGER;
BEGIN
    -- Pobierz aktualne statystyki
    SELECT * INTO current_stats 
    FROM user_stats 
    WHERE user_id = p_user_id;
    
    -- Jeśli nie ma statystyk, utwórz nowe
    IF NOT FOUND THEN
        INSERT INTO user_stats (user_id, total_xp, level, modules_completed, last_activity)
        VALUES (p_user_id, p_xp_gained, calculate_user_level(p_xp_gained), 0, NOW());
        RETURN;
    END IF;
    
    -- Oblicz nowy poziom
    new_level := calculate_user_level(current_stats.total_xp + p_xp_gained);
    
    -- Aktualizuj statystyki
    UPDATE user_stats 
    SET 
        total_xp = total_xp + p_xp_gained,
        level = new_level,
        modules_completed = modules_completed + CASE WHEN p_course_completed THEN 1 ELSE 0 END,
        last_activity = NOW()
    WHERE user_id = p_user_id;
    
    -- Sprawdź nowe osiągnięcia
    PERFORM check_achievements(p_user_id);
END;
$$ LANGUAGE plpgsql;

-- Funkcja do sprawdzania osiągnięć
CREATE OR REPLACE FUNCTION check_achievements(p_user_id UUID)
RETURNS void AS $$
DECLARE
    achievement_record RECORD;
    user_data RECORD;
    requirement_met BOOLEAN;
BEGIN
    -- Pobierz dane użytkownika
    SELECT 
        us.*,
        COUNT(DISTINCT up.module_id) as courses_completed,
        COUNT(up.id) as lessons_completed,
        COALESCE(MAX(up.created_at) - MIN(up.created_at), INTERVAL '0 days') as learning_span
    INTO user_data
    FROM user_stats us
    LEFT JOIN user_progress up ON us.user_id = up.user_id AND up.completed_at IS NOT NULL
    WHERE us.user_id = p_user_id
    GROUP BY us.user_id, us.total_xp, us.level, us.modules_completed, us.streak_days;
    
    -- Sprawdź każde osiągnięcie
    FOR achievement_record IN 
        SELECT * FROM achievement_definitions 
        WHERE is_active = true 
        AND name NOT IN (
            SELECT achievement_name FROM achievements WHERE user_id = p_user_id
        )
    LOOP
        requirement_met := false;
        
        -- Sprawdź wymagania na podstawie kategorii
        CASE achievement_record.category
            WHEN 'learning' THEN
                IF (achievement_record.requirements->>'lessons_completed')::INTEGER <= user_data.lessons_completed OR
                   (achievement_record.requirements->>'courses_completed')::INTEGER <= user_data.courses_completed OR
                   (achievement_record.requirements->>'streak_days')::INTEGER <= user_data.streak_days THEN
                    requirement_met := true;
                END IF;
            WHEN 'milestone' THEN
                IF (achievement_record.requirements->>'total_xp')::INTEGER <= user_data.total_xp OR
                   (achievement_record.requirements->>'level')::INTEGER <= user_data.level THEN
                    requirement_met := true;
                END IF;
            -- Dodaj więcej kategorii w przyszłości
        END CASE;
        
        -- Jeśli wymagania spełnione, dodaj osiągnięcie
        IF requirement_met THEN
            INSERT INTO achievements (user_id, achievement_name, achievement_type, xp_reward)
            VALUES (p_user_id, achievement_record.name, achievement_record.category, achievement_record.reward_xp);
            
            -- Dodaj XP za osiągnięcie
            UPDATE user_stats 
            SET total_xp = total_xp + achievement_record.reward_xp
            WHERE user_id = p_user_id;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
