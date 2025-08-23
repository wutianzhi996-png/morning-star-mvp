import { createClient } from '@supabase/supabase-js'

// 从环境变量获取Supabase配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 验证必要的环境变量
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

// 检查是否使用了默认配置
if (supabaseUrl.includes('your-project-ref') || supabaseAnonKey.includes('sample-anon-key')) {
  console.warn('🔄 请在.env.local中替换为您真实的Supabase项目配置')
  console.warn('📋 获取步骤：')
  console.warn('1. 访问 https://supabase.com/dashboard')
  console.warn('2. 选择您的项目')
  console.warn('3. 前往 Settings -> API')
  console.warn('4. 复制 URL 和 anon key 到 .env.local')
}

// 创建Supabase客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      okrs: {
        Row: {
          id: string
          user_id: string
          objective: string
          key_results: Array<{ 
            text: string
            deadline?: string
            priority?: 'high' | 'medium' | 'low'
            progress?: number
          }>
          timeframe?: string
          category?: string
          status?: 'active' | 'completed' | 'paused'
          progress?: number
          created_at: string
          updated_at?: string
        }
        Insert: {
          id?: string
          user_id: string
          objective: string
          key_results: Array<{ 
            text: string
            deadline?: string
            priority?: 'high' | 'medium' | 'low'
            progress?: number
          }>
          timeframe?: string
          category?: string
          status?: 'active' | 'completed' | 'paused'
          progress?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          objective?: string
          key_results?: Array<{ 
            text: string
            deadline?: string
            priority?: 'high' | 'medium' | 'low'
            progress?: number
          }>
          timeframe?: string
          category?: string
          status?: 'active' | 'completed' | 'paused'
          progress?: number
          created_at?: string
          updated_at?: string
        }
      }
      chat_history: {
        Row: {
          id: number
          user_id: string
          session_id: string
          message: { role: 'user' | 'assistant'; content: string }
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          session_id?: string
          message: { role: 'user' | 'assistant'; content: string }
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          session_id?: string
          message?: { role: 'user' | 'assistant'; content: string }
          created_at?: string
        }
      }
    }
  }
} 