-- 启明星平台 MVP 数据库初始化脚本
-- 在 Supabase SQL Editor 中运行此脚本

-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- 创建 OKR 表
CREATE TABLE IF NOT EXISTS public.okrs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    objective TEXT NOT NULL,
    key_results JSONB NOT NULL DEFAULT '[]',
    timeframe VARCHAR(20) DEFAULT '3months',
    category VARCHAR(50) DEFAULT 'technical',
    status VARCHAR(20) DEFAULT 'active',
    progress INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 创建聊天记录表
CREATE TABLE IF NOT EXISTS public.chat_history (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id UUID DEFAULT gen_random_uuid(),
    message JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 创建知识库向量表
CREATE TABLE IF NOT EXISTS public.knowledge_chunks (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    embedding VECTOR(1536),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_okrs_user_id ON public.okrs(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON public.chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_session_id ON public.chat_history(session_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_embedding ON public.knowledge_chunks USING ivfflat (embedding vector_cosine_ops);

-- 启用行级安全策略 (RLS)
ALTER TABLE public.okrs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_chunks ENABLE ROW LEVEL SECURITY;

-- 创建 RLS 策略

-- OKR 表策略：用户只能操作自己的OKR
CREATE POLICY "用户只能操作自己的OKR" ON public.okrs
    FOR ALL USING (auth.uid() = user_id);

-- 聊天记录表策略：用户只能操作自己的聊天记录
CREATE POLICY "用户只能操作自己的聊天记录" ON public.chat_history
    FOR ALL USING (auth.uid() = user_id);

-- 知识库表策略：所有认证用户都可以读取
CREATE POLICY "对所有认证用户开放读取权限" ON public.knowledge_chunks
    FOR SELECT USING (auth.role() = 'authenticated');

-- 知识库表策略：只有服务角色可以写入（用于知识库更新）
CREATE POLICY "只有服务角色可以写入知识库" ON public.knowledge_chunks
    FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为 OKR 表添加更新时间触发器
CREATE TRIGGER update_okrs_updated_at 
    BEFORE UPDATE ON public.okrs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 插入示例知识库内容（可选）
INSERT INTO public.knowledge_chunks (content, metadata) VALUES
('B+树是一种多路平衡查找树，常用于数据库和文件系统的索引结构。主要特点包括：所有叶子节点都在同一层，叶子节点通过链表相连便于范围查询，非叶子节点只存储键值不存储数据，支持高效的插入、删除和查找操作。', '{"topic": "数据结构", "subtopic": "B+树", "difficulty": "中等"}'),
('数据结构是计算机存储、组织数据的方式。常见的数据结构包括：数组、链表、栈、队列、树、图等。选择合适的数据结构对于算法的效率至关重要。', '{"topic": "数据结构", "subtopic": "基础概念", "difficulty": "基础"}'),
('算法是解决特定问题的一系列步骤。好的算法应该具有正确性、可读性、健壮性和高效性。常见的算法类型包括：排序算法、搜索算法、图算法、动态规划等。', '{"topic": "算法", "subtopic": "基础概念", "difficulty": "基础"}');

-- 创建视图：用户OKR概览
CREATE OR REPLACE VIEW user_okr_overview AS
SELECT 
    u.id as user_id,
    u.email,
    o.id as okr_id,
    o.objective,
    o.key_results,
    o.created_at as okr_created_at,
    o.updated_at as okr_updated_at
FROM auth.users u
LEFT JOIN public.okrs o ON u.id = o.user_id;

-- 创建视图：聊天统计
CREATE OR REPLACE VIEW chat_statistics AS
SELECT 
    user_id,
    COUNT(DISTINCT session_id) as total_sessions,
    COUNT(*) as total_messages,
    MIN(created_at) as first_message,
    MAX(created_at) as last_message
FROM public.chat_history
GROUP BY user_id;

-- 授予必要的权限
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.okrs TO anon, authenticated;
GRANT ALL ON public.chat_history TO anon, authenticated;
GRANT SELECT ON public.knowledge_chunks TO anon, authenticated;
GRANT USAGE ON SEQUENCE public.chat_history_id_seq TO anon, authenticated;

-- 创建函数：获取用户OKR
CREATE OR REPLACE FUNCTION get_user_okr(user_uuid UUID)
RETURNS TABLE (
    id UUID,
    objective TEXT,
    key_results JSONB,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT o.id, o.objective, o.key_results, o.created_at, o.updated_at
    FROM public.okrs o
    WHERE o.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建函数：获取用户聊天历史
CREATE OR REPLACE FUNCTION get_user_chat_history(user_uuid UUID, limit_count INTEGER DEFAULT 50)
RETURNS TABLE (
    session_id UUID,
    message JSONB,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT ch.session_id, ch.message, ch.created_at
    FROM public.chat_history ch
    WHERE ch.user_id = user_uuid
    ORDER BY ch.created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 输出完成信息
SELECT '启明星平台 MVP 数据库初始化完成！' as status; 