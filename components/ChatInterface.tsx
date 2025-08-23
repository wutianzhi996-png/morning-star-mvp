'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Send, 
  Bot, 
  User, 
  Lightbulb,
  Calendar,
  BookOpen,
  TrendingUp,
  Star,
  Clock,
  Target,
  Sparkles,
  RefreshCw,
  Copy,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react'

interface ChatInterfaceProps {
  userOkr: any
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  type?: 'task' | 'knowledge' | 'general'
  metadata?: {
    taskCount?: number
    difficulty?: 'easy' | 'medium' | 'hard'
    category?: string
  }
}

export default function ChatInterface({ userOkr }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (messages.length === 0) {
      addWelcomeMessage()
    }
  }, [userOkr])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const addWelcomeMessage = () => {
    const welcomeContent = userOkr 
      ? `你好！我是你的AI学习助手 🤖\n\n我已经了解了你的学习目标："${userOkr.objective}"\n\n我可以帮助你：\n• 制定每日学习任务\n• 解答学科问题\n• 提供学习建议\n• 跟踪学习进度\n\n试试输入"今天做什么"来获取个性化任务推荐！`
      : `你好！我是你的AI学习助手 🤖\n\n虽然你还没有设定OKR目标，但我依然可以：\n• 回答学科问题\n• 提供学习建议\n• 推荐学习资源\n\n建议你先创建一个OKR目标，这样我就能为你制定更精准的学习计划了！`

    const welcomeMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: welcomeContent,
      timestamp: new Date(),
      type: 'general'
    }
    setMessages([welcomeMessage])
  }

  const addMessage = (role: 'user' | 'assistant', content: string, type?: Message['type'], metadata?: Message['metadata']) => {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      role,
      content,
      timestamp: new Date(),
      type,
      metadata
    }
    setMessages(prev => [...prev, newMessage])
  }

  const saveChatHistory = async (userMessage: string, aiResponse: string) => {
    try {
      const { supabase } = await import('@/lib/supabase')
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        console.error('无法获取用户信息:', userError)
        return
      }

      const sessionId = crypto.randomUUID()
      
      // 保存用户消息
      const { error: userMsgError } = await supabase.from('chat_history').insert({
        user_id: user.id,
        session_id: sessionId,
        message: { role: 'user', content: userMessage }
      })

      if (userMsgError) {
        console.error('保存用户消息失败:', userMsgError)
      }

      // 保存AI回复
      const { error: aiMsgError } = await supabase.from('chat_history').insert({
        user_id: user.id,
        session_id: sessionId,
        message: { role: 'assistant', content: aiResponse }
      })

      if (aiMsgError) {
        console.error('保存AI消息失败:', aiMsgError)
      }
    } catch (error) {
      console.error('保存聊天历史异常:', error)
    }
  }

  const generateAIResponse = async (userMessage: string): Promise<{ content: string; type: Message['type']; metadata?: Message['metadata'] }> => {
    const lowerMessage = userMessage.toLowerCase()
    
    // 任务推荐
    if (lowerMessage.includes('今天') && (lowerMessage.includes('做什么') || lowerMessage.includes('任务'))) {
      if (!userOkr) {
        return {
          content: '你还没有设定OKR目标。请先创建你的学习目标，我才能为你推荐每日任务。\n\n点击左侧的"创建OKR"按钮开始设定你的学习目标吧！',
          type: 'general'
        }
      }
      
      const response = generateTaskRecommendation(userOkr)
      return {
        content: response,
        type: 'task',
        metadata: { taskCount: userOkr.key_results?.length || 0 }
      }
    }

    // 学习进度查询
    if (lowerMessage.includes('进度') || lowerMessage.includes('完成')) {
      const response = generateProgressReport(userOkr)
      return {
        content: response,
        type: 'general'
      }
    }

    // 学习建议
    if (lowerMessage.includes('建议') || lowerMessage.includes('如何') || lowerMessage.includes('怎么')) {
      const response = generateLearningAdvice(userMessage, userOkr)
      return {
        content: response,
        type: 'general'
      }
    }
    
    // 知识问答
    if (lowerMessage.includes('什么是') || lowerMessage.includes('解释') || 
        lowerMessage.includes('数据结构') || lowerMessage.includes('算法') ||
        lowerMessage.includes('b+树') || lowerMessage.includes('编程')) {
      const response = generateKnowledgeAnswer(userMessage)
      return {
        content: response,
        type: 'knowledge',
        metadata: { difficulty: 'medium', category: 'technical' }
      }
    }
    
    // 默认回复
    const response = generateDefaultResponse(userMessage)
    return {
      content: response,
      type: 'general'
    }
  }

  const generateTaskRecommendation = (okr: any): string => {
    const objective = okr.objective
    const keyResults = okr.key_results || []
    
    let response = `🎯 基于你的学习目标："${objective}"\n\n📋 今日推荐任务：\n\n`
    
    keyResults.forEach((kr: any, index: number) => {
      const priority = kr.priority || 'medium'
      const priorityEmoji = priority === 'high' ? '🔥' : priority === 'medium' ? '⚡' : '💫'
      
      response += `${priorityEmoji} **任务 ${index + 1}：** ${kr.text}\n`
      response += `   ⏱️ 建议时长：${getPriorityTime(priority)}\n`
      response += `   📊 难度：${getDifficulty()}\n`
      if (kr.deadline) {
        response += `   📅 截止时间：${kr.deadline}\n`
      }
      response += `\n`
    })
    
    response += `💡 **学习建议：**\n`
    response += `• 按优先级顺序执行任务\n`
    response += `• 每完成一个任务休息15分钟\n`
    response += `• 遇到困难随时向我提问\n`
    response += `• 记录学习笔记和心得\n\n`
    response += `需要针对某个具体任务的详细指导吗？`
    
    return response
  }

  const generateProgressReport = (okr: any): string => {
    if (!okr) {
      return '你还没有设定OKR目标，无法查看学习进度。建议先创建学习目标来跟踪进度！'
    }

    // 模拟进度数据
    const totalTasks = okr.key_results?.length || 0
    const completedTasks = Math.floor(Math.random() * totalTasks)
    const progressPercentage = totalTasks > 0 ? Math.floor((completedTasks / totalTasks) * 100) : 0

    let response = `📊 **学习进度报告**\n\n`
    response += `🎯 目标：${okr.objective}\n\n`
    response += `📈 **整体进度：${progressPercentage}%**\n`
    response += `✅ 已完成：${completedTasks}/${totalTasks} 个关键结果\n\n`
    
    response += `📋 **关键结果进度：**\n`
    okr.key_results?.forEach((kr: any, index: number) => {
      const progress = Math.floor(Math.random() * 100)
      const status = progress > 80 ? '🟢' : progress > 50 ? '🟡' : '🔴'
      response += `${status} ${kr.text}：${progress}%\n`
    })

    response += `\n💪 继续保持！建议今天重点关注进度较慢的任务。`
    
    return response
  }

  const generateLearningAdvice = (question: string, okr: any): string => {
    const advice = [
      '制定清晰的学习计划，分解大目标为小任务',
      '使用番茄工作法，25分钟专注学习，5分钟休息',
      '建立学习笔记体系，定期复习和整理',
      '找到适合的学习环境，减少干扰因素',
      '与同学或学习小组交流，互相监督进步'
    ]

    let response = `💡 **个性化学习建议：**\n\n`
    
    if (okr) {
      response += `基于你的目标"${okr.objective}"：\n\n`
    }
    
    const randomAdvice = advice.sort(() => 0.5 - Math.random()).slice(0, 3)
    randomAdvice.forEach((tip, index) => {
      response += `${index + 1}. ${tip}\n`
    })

    response += `\n🎯 **针对你的问题：**\n`
    response += `我理解你想了解"${question}"。建议你：\n`
    response += `• 将复杂问题分解成小步骤\n`
    response += `• 多做实践练习巩固理论\n`
    response += `• 寻找相关的优质学习资源\n\n`
    response += `需要我为你推荐具体的学习资源吗？`
    
    return response
  }

  const generateKnowledgeAnswer = (question: string): string => {
    const lowerQuestion = question.toLowerCase()
    
    if (lowerQuestion.includes('b+树') || lowerQuestion.includes('b树')) {
      return `📚 **B+树详解**\n\nB+树是一种多路平衡查找树，在数据库索引中应用广泛。\n\n🔑 **核心特点：**\n• 所有叶子节点在同一层级\n• 叶子节点间通过指针连接，支持顺序访问\n• 非叶子节点只存储键值，数据全部在叶子节点\n• 具有良好的磁盘I/O性能\n\n🆚 **与B树的区别：**\n• B+树的数据只存在叶子节点\n• B+树的范围查询效率更高\n• B+树的空间利用率更好\n\n🏢 **实际应用：**\n• MySQL的InnoDB存储引擎\n• 文件系统索引\n• 内存数据库索引\n\n需要我解释B+树的插入删除算法吗？`
    }

    if (lowerQuestion.includes('算法复杂度') || lowerQuestion.includes('时间复杂度')) {
      return `⏱️ **算法复杂度分析**\n\n复杂度分析是评估算法效率的重要方法。\n\n📊 **时间复杂度等级：**\n• O(1) - 常数时间，最优\n• O(log n) - 对数时间，很好\n• O(n) - 线性时间，一般\n• O(n log n) - 线性对数，可接受\n• O(n²) - 平方时间，需要优化\n• O(2ⁿ) - 指数时间，通常不可接受\n\n🎯 **分析技巧：**\n• 关注最坏情况下的表现\n• 忽略常数因子和低阶项\n• 重点关注输入规模增长时的趋势\n\n💡 想了解具体算法的复杂度分析吗？`
    }

    // 通用知识回答模板
    return `🧠 **知识解答**\n\n这是一个很好的问题！关于"${question}"，我来为你详细解答：\n\n我可以帮你深入了解以下技术领域：\n• 数据结构与算法\n• 编程语言概念\n• 数据库原理\n• 操作系统\n• 计算机网络\n• 软件工程\n\n请告诉我你想深入了解哪个具体方面，我会为你提供更详细的解释和学习建议！\n\n💡 **学习建议：** 结合理论学习和实践编程，效果会更好。`
  }

  const generateDefaultResponse = (message: string): string => {
    const responses = [
      '我理解你的问题！让我来帮助你解决。',
      '这是一个有趣的问题，让我为你分析一下。',
      '基于我的理解，我来为你提供一些建议。',
      '我会尽我所能帮助你学习和成长！',
      '让我们一起探讨这个问题吧。'
    ]
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)]
    
    return `${randomResponse}\n\n🤖 **我能为你做什么：**\n• 📋 制定学习任务 - 输入"今天做什么"\n• 📊 查看学习进度 - 输入"我的进度"\n• 💡 提供学习建议 - 询问"如何学习..."\n• 📚 解答知识问题 - 直接提问\n\n有什么具体问题我可以帮你解决吗？`
  }

  const getPriorityTime = (priority: string): string => {
    switch (priority) {
      case 'high': return '3-4小时'
      case 'medium': return '2-3小时'
      case 'low': return '1-2小时'
      default: return '2-3小时'
    }
  }

  const getDifficulty = (): string => {
    const difficulties = ['入门', '中等', '进阶']
    return difficulties[Math.floor(Math.random() * difficulties.length)]
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!inputMessage.trim() || loading) return
    
    const userMessage = inputMessage.trim()
    setInputMessage('')
    setShowSuggestions(false)
    addMessage('user', userMessage)
    setLoading(true)
    
    try {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))
      
      const { content, type, metadata } = await generateAIResponse(userMessage)
      addMessage('assistant', content, type, metadata)
      await saveChatHistory(userMessage, content)
    } catch (error) {
      addMessage('assistant', '抱歉，我遇到了一些技术问题 😅\n\n请稍后再试，或者尝试重新描述你的问题。如果问题持续存在，请检查网络连接。', 'general')
    } finally {
      setLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion)
    setShowSuggestions(false)
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    // 可以添加一个toast提示
  }

  const suggestions = userOkr ? [
    '今天做什么',
    '查看我的学习进度',
    '如何提高学习效率',
    '推荐相关学习资源'
  ] : [
    '什么是数据结构',
    '如何开始学习编程',
    '推荐学习计划',
    '算法复杂度分析'
  ]

  return (
    <div className="flex flex-col h-[700px]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-2xl rounded-br-md'
                  : 'bg-white border border-gray-200 text-gray-900 rounded-2xl rounded-bl-md shadow-soft'
              } p-4`}
            >
              <div className="flex items-start space-x-3">
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </div>
                  {message.metadata && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.metadata.taskCount && (
                        <span className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                          <Target className="w-3 h-3 mr-1" />
                          {message.metadata.taskCount} 个任务
                        </span>
                      )}
                      {message.metadata.difficulty && (
                        <span className="inline-flex items-center px-2 py-1 bg-warning-100 text-warning-700 text-xs rounded-full">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {message.metadata.difficulty}
                        </span>
                      )}
                      {message.metadata.category && (
                        <span className="inline-flex items-center px-2 py-1 bg-secondary-100 text-secondary-700 text-xs rounded-full">
                          <BookOpen className="w-3 h-3 mr-1" />
                          {message.metadata.category}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <div className={`text-xs ${
                  message.role === 'user' ? 'text-primary-200' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString('zh-CN', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
                
                {message.role === 'assistant' && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => copyMessage(message.content)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                      title="复制消息"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button className="text-gray-400 hover:text-success-600 p-1" title="有帮助">
                      <ThumbsUp className="w-3 h-3" />
                    </button>
                    <button className="text-gray-400 hover:text-error-600 p-1" title="无帮助">
                      <ThumbsDown className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md shadow-soft p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="flex items-center space-x-2">
                  <div className="loading-dots text-gray-400">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                  <span className="text-gray-500 text-sm">正在思考...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {showSuggestions && messages.length <= 1 && (
        <div className="px-6 pb-4">
          <div className="text-sm text-gray-500 mb-3 flex items-center">
            <Sparkles className="w-4 h-4 mr-1" />
            试试这些问题：
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t bg-gray-50 p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="输入你的问题，我来帮你解答..."
            className="input-field flex-1 bg-white"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !inputMessage.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
        
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span>💡 试试问我"今天做什么"来获取学习任务推荐</span>
          <span>按 Enter 发送</span>
        </div>
      </div>
    </div>
  )
} 