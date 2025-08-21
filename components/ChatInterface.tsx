'use client'

import { useState, useRef, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Send, Bot, User } from 'lucide-react'

interface ChatInterfaceProps {
  userOkr: any
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ChatInterface({ userOkr }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    const newMessage: Message = {
      role,
      content,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
  }

  const saveChatHistory = async (userMessage: string, aiResponse: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const sessionId = crypto.randomUUID()
      
      // Save user message
      await supabase.from('chat_history').insert({
        user_id: user.id,
        session_id: sessionId,
        message: { role: 'user', content: userMessage }
      })

      // Save AI response
      await supabase.from('chat_history').insert({
        user_id: user.id,
        session_id: sessionId,
        message: { role: 'assistant', content: aiResponse }
      })
    } catch (error) {
      console.error('Error saving chat history:', error)
    }
  }

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // 模拟AI响应，实际项目中这里会调用真实的AI API
    const lowerMessage = userMessage.toLowerCase()
    
    // 检查是否是任务推荐请求
    if (lowerMessage.includes('今天') && (lowerMessage.includes('做什么') || lowerMessage.includes('任务'))) {
      if (!userOkr) {
        return '你还没有设定OKR目标。请先创建你的学习目标，我才能为你推荐每日任务。'
      }
      
      return generateTaskRecommendation(userOkr)
    }
    
    // 检查是否是知识问答
    if (lowerMessage.includes('b+树') || lowerMessage.includes('数据结构')) {
      return generateKnowledgeAnswer(userMessage)
    }
    
    // 默认回复
    return generateDefaultResponse(userMessage)
  }

  const generateTaskRecommendation = (okr: any): string => {
    const objective = okr.objective
    const keyResults = okr.key_results
    
    let response = `基于你的OKR目标"${objective}"，我为你推荐今天的任务：\n\n`
    
    keyResults.forEach((kr: any, index: number) => {
      response += `${index + 1}. ${kr.text}\n`
      response += `   - 建议投入时间：2-3小时\n`
      response += `   - 完成标准：能够清晰解释概念并完成相关练习\n\n`
    })
    
    response += `💡 小贴士：建议按照优先级顺序执行，遇到困难时随时向我提问！`
    
    return response
  }

  const generateKnowledgeAnswer = (question: string): string => {
    if (question.includes('B+树')) {
      return `B+树是一种多路平衡查找树，常用于数据库和文件系统的索引结构。

主要特点：
• 所有叶子节点都在同一层
• 叶子节点通过链表相连，便于范围查询
• 非叶子节点只存储键值，不存储数据
• 支持高效的插入、删除和查找操作

与B树的区别：
• B+树的叶子节点包含所有键值信息
• B+树的范围查询性能更好
• B+树的空间利用率更高

应用场景：
• 数据库索引（MySQL、PostgreSQL等）
• 文件系统索引
• 内存中的有序数据结构`
    }
    
    return `这是一个关于数据结构的问题。我可以帮你解答各种算法和数据结构的概念，包括：
• 数组、链表、栈、队列
• 树结构（二叉树、B树、B+树等）
• 图算法
• 排序和搜索算法
• 动态规划等

请具体描述你的问题，我会为你提供详细的解答。`
  }

  const generateDefaultResponse = (message: string): string => {
    const responses = [
      '我理解你的问题，让我为你提供帮助。',
      '这是一个很好的问题，我来为你解答。',
      '基于你的学习需求，我建议...',
      '让我为你分析一下这个问题。',
      '我注意到你在学习过程中遇到了困难，让我来协助你。'
    ]
    
    return responses[Math.floor(Math.random() * responses.length)] + 
           '\n\n你可以问我关于学习规划、技术问题或者请求每日任务推荐。'
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!inputMessage.trim() || loading) return
    
    const userMessage = inputMessage.trim()
    setInputMessage('')
    addMessage('user', userMessage)
    setLoading(true)
    
    try {
      const aiResponse = await generateAIResponse(userMessage)
      addMessage('assistant', aiResponse)
      await saveChatHistory(userMessage, aiResponse)
    } catch (error) {
      addMessage('assistant', '抱歉，我遇到了一些问题。请稍后再试。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[600px]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">欢迎使用AI学习助手！</p>
            <p className="text-sm text-gray-400">
              你可以问我学习问题，或者输入"今天做什么"获取任务推荐
            </p>
          </div>
        )}
        
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.role === 'assistant' && (
                  <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                )}
                <div className="whitespace-pre-wrap">{message.content}</div>
                {message.role === 'user' && (
                  <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                )}
              </div>
              <div className={`text-xs mt-2 ${
                message.role === 'user' ? 'text-primary-200' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="输入你的问题或请求任务推荐..."
            className="input-field flex-1"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !inputMessage.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        
        <div className="mt-2 text-xs text-gray-500">
          提示：输入"今天做什么"获取基于OKR的任务推荐
        </div>
      </div>
    </div>
  )
} 