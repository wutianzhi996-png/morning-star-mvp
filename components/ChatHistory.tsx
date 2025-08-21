'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { MessageCircle, Clock, User, Bot } from 'lucide-react'

interface ChatSession {
  session_id: string
  messages: Array<{
    role: 'user' | 'assistant'
    content: string
    created_at: string
  }>
  created_at: string
}

export default function ChatHistory() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSession, setSelectedSession] = useState<string | null>(null)

  useEffect(() => {
    fetchChatHistory()
  }, [])

  const fetchChatHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Group messages by session
      const sessionsMap = new Map<string, ChatSession>()
      
      data?.forEach((record) => {
        const sessionId = record.session_id
        const message = record.message
        
        if (!sessionsMap.has(sessionId)) {
          sessionsMap.set(sessionId, {
            session_id: sessionId,
            messages: [],
            created_at: record.created_at
          })
        }
        
        sessionsMap.get(sessionId)!.messages.push({
          role: message.role,
          content: message.content,
          created_at: record.created_at
        })
      })

      // Convert to array and sort by latest message
      const sessions = Array.from(sessionsMap.values()).sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )

      setChatSessions(sessions)
    } catch (error) {
      console.error('Error fetching chat history:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      return '刚刚'
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}小时前`
    } else {
      return date.toLocaleDateString('zh-CN')
    }
  }

  const getSessionPreview = (messages: any[]) => {
    const userMessage = messages.find(m => m.role === 'user')
    if (userMessage) {
      const content = userMessage.content
      return content.length > 50 ? content.substring(0, 50) + '...' : content
    }
    return '对话记录'
  }

  if (loading) {
    return (
      <div className="p-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">加载聊天记录...</p>
        </div>
      </div>
    )
  }

  if (chatSessions.length === 0) {
    return (
      <div className="p-4">
        <div className="text-center py-8">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">还没有聊天记录</p>
          <p className="text-sm text-gray-400">开始与AI助手对话，记录将在这里显示</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[400px]">
      {/* Sessions List */}
      <div className="w-1/3 border-r overflow-y-auto">
        <div className="p-4">
          <h3 className="font-medium text-gray-900 mb-3">对话记录</h3>
          <div className="space-y-2">
            {chatSessions.map((session) => (
              <button
                key={session.session_id}
                onClick={() => setSelectedSession(session.session_id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedSession === session.session_id
                    ? 'bg-primary-50 border border-primary-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {getSessionPreview(session.messages)}
                  </span>
                  <Clock className="w-3 h-3 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500">
                  {formatTime(session.created_at)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {session.messages.length} 条消息
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Session Details */}
      <div className="flex-1 overflow-y-auto">
        {selectedSession ? (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">对话详情</h3>
              <button
                onClick={() => setSelectedSession(null)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                关闭
              </button>
            </div>
            
            <div className="space-y-4">
              {chatSessions
                .find(s => s.session_id === selectedSession)
                ?.messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 ${
                        message.role === 'user'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.role === 'assistant' && (
                          <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                        {message.role === 'user' && (
                          <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        )}
                      </div>
                      <div className={`text-xs mt-2 ${
                        message.role === 'user' ? 'text-primary-200' : 'text-gray-500'
                      }`}>
                        {new Date(message.created_at).toLocaleString('zh-CN')}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <div className="p-4">
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">选择一个对话记录查看详情</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 