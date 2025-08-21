import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      okrs: {
        Row: {
          id: string
          user_id: string
          objective: string
          key_results: Array<{ text: string }>
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          objective: string
          key_results: Array<{ text: string }>
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          objective?: string
          key_results?: Array<{ text: string }>
          created_at?: string
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