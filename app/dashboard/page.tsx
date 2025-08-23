'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  User, 
  LogOut, 
  Plus, 
  Target, 
  MessageCircle, 
  History,
  TrendingUp,
  Calendar,
  Clock,
  Award,
  BookOpen,
  Star,
  Settings,
  Bell,
  BarChart3,
  Activity,
  CheckCircle,
  Circle,
  Brain,
  Zap
} from 'lucide-react'
import OKRForm from '@/components/OKRForm'
import ChatInterface from '@/components/ChatInterface'
import ChatHistory from '@/components/ChatHistory'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [okr, setOkr] = useState<any>(null)
  const [showOKRForm, setShowOKRForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const router = useRouter()

  useEffect(() => {
    checkUser()
    fetchOKR()
  }, [])

  const checkUser = async () => {
    try {
      const { supabase } = await import('@/lib/supabase')
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        console.error('认证检查失败:', error)
        router.push('/')
        return
      }
      
      if (!user) {
        console.log('用户未登录，重定向到主页')
        router.push('/')
        return
      }
      
      setUser(user)
    } catch (error) {
      console.error('认证检查异常:', error)
      router.push('/')
      return
    }
    setLoading(false)
  }

  const fetchOKR = async () => {
    try {
      const { supabase } = await import('@/lib/supabase')
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        console.error('获取用户信息失败:', userError)
        return
      }

      const { data, error } = await supabase
        .from('okrs')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle() // 使用 maybeSingle 允许没有数据的情况

      if (error) {
        console.error('获取OKR失败:', error)
        return
      }

      if (data) {
        setOkr(data)
      }
    } catch (error) {
      console.error('获取OKR异常:', error)
    }
  }

  const handleLogout = async () => {
    try {
      const { supabase } = await import('@/lib/supabase')
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('登出失败:', error)
      }
    } catch (error) {
      console.error('登出异常:', error)
    }
    
    // 无论登出是否成功，都重定向到主页
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-medium animate-pulse">
            <Star className="w-8 h-8 text-white" />
          </div>
          <div className="loading-dots text-gray-600 text-lg mb-2">
            <div></div>
            <div></div>
            <div></div>
          </div>
          <p className="text-gray-500">加载学习数据...</p>
        </div>
      </div>
    )
  }

  const mockStats = {
    todayTasks: 3,
    completedTasks: 2,
    studyTime: 125,
    streak: 7,
    totalPoints: 2840,
    level: 12
  }

  const mockTodayTasks = [
    { id: 1, title: '复习二叉树遍历算法', completed: true, estimatedTime: 45 },
    { id: 2, title: '练习动态规划题目', completed: true, estimatedTime: 60 },
    { id: 3, title: '阅读算法导论第3章', completed: false, estimatedTime: 30 }
  ]

  const mockRecentActivity = [
    { id: 1, type: 'study', content: '完成了"二叉树遍历"学习任务', time: '2小时前', icon: CheckCircle, color: 'text-success-500' },
    { id: 2, type: 'achievement', content: '获得"连续学习7天"徽章', time: '4小时前', icon: Award, color: 'text-warning-500' },
    { id: 3, type: 'chat', content: '与AI助手讨论了数据结构问题', time: '昨天', icon: MessageCircle, color: 'text-secondary-500' },
    { id: 4, type: 'okr', content: '更新了学习目标进度', time: '2天前', icon: Target, color: 'text-primary-500' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-soft border-b border-white/20 sticky top-0 z-40">
        <div className="container-custom">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-soft">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-gray-900">启明星平台</h1>
                <p className="text-sm text-gray-500">AI学习助手</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
                  <Award className="w-4 h-4 mr-2 text-warning-500" />
                  <span>Lv.{mockStats.level}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
                  <Zap className="w-4 h-4 mr-2 text-primary-500" />
                  <span>{mockStats.totalPoints}分</span>
                </div>
              </div>
              <button className="btn-ghost p-2">
                <Bell className="w-5 h-5" />
              </button>
              <button className="btn-ghost p-2">
                <Settings className="w-5 h-5" />
              </button>
              <div className="flex items-center text-sm text-gray-700 bg-white px-3 py-2 rounded-lg shadow-soft">
                <User className="w-4 h-4 mr-2" />
                <span className="max-w-32 truncate">{user?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="btn-ghost text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container-custom py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-display font-bold text-gray-900">
                欢迎回来！👋
              </h2>
              <p className="text-gray-600">
                今天是学习的好日子，继续保持学习节奏吧
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">今日学习时间</div>
              <div className="text-2xl font-bold text-primary-600">{mockStats.studyTime}分钟</div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-primary-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{mockStats.completedTasks}/{mockStats.todayTasks}</div>
              <div className="text-sm text-gray-500">今日任务完成</div>
            </div>
            
            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-secondary-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <Clock className="w-6 h-6 text-secondary-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{mockStats.studyTime}</div>
              <div className="text-sm text-gray-500">今日学习时间(分钟)</div>
            </div>
            
            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-success-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{mockStats.streak}</div>
              <div className="text-sm text-gray-500">连续学习天数</div>
            </div>
            
            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-warning-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <Award className="w-6 h-6 text-warning-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">Lv.{mockStats.level}</div>
              <div className="text-sm text-gray-500">当前等级</div>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
            {[
              { id: 'overview', name: '概览', icon: BarChart3 },
              { id: 'okr', name: 'OKR目标', icon: Target },
              { id: 'chat', name: 'AI助手', icon: Brain },
              { id: 'history', name: '学习历史', icon: History }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-primary-600 shadow-soft'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Today's Tasks */}
            <div className="lg:col-span-2">
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    今日学习任务
                  </h3>
                  <span className="text-sm text-gray-500">
                    {mockStats.completedTasks}/{mockStats.todayTasks} 已完成
                  </span>
                </div>
                
                <div className="space-y-3">
                  {mockTodayTasks.map((task) => (
                    <div key={task.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        task.completed ? 'bg-success-500' : 'bg-gray-300'
                      }`}>
                        {task.completed ? (
                          <CheckCircle className="w-3 h-3 text-white" />
                        ) : (
                          <Circle className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className={`font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                          {task.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          预计 {task.estimatedTime} 分钟
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {!okr && (
                  <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-100">
                    <div className="flex items-start space-x-3">
                      <Target className="w-5 h-5 text-primary-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-primary-900 mb-1">还未设置学习目标</div>
                        <div className="text-sm text-primary-700 mb-3">
                          创建OKR目标，让AI助手为你规划个性化学习任务
                        </div>
                        <button
                          onClick={() => setShowOKRForm(true)}
                          className="btn-primary text-sm"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          创建OKR目标
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  最近活动
                </h3>
                
                <div className="space-y-4">
                  {mockRecentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center ${activity.color}`}>
                        <activity.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-900 mb-1">
                          {activity.content}
                        </div>
                        <div className="text-xs text-gray-500">
                          {activity.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'okr' && (
          <div className="max-w-4xl">
            <div className="card p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Target className="w-6 h-6 mr-3" />
                    我的OKR学习目标
                  </h3>
                  <p className="text-gray-600 mt-1">设定明确的学习目标，跟踪你的学习进度</p>
                </div>
                {okr && (
                  <button
                    onClick={() => setShowOKRForm(true)}
                    className="btn-outline flex items-center"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    编辑目标
                  </button>
                )}
              </div>

              {okr ? (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">目标 (Objective)</h4>
                    <div className="p-4 bg-primary-50 rounded-lg border border-primary-100">
                      <p className="text-gray-800">{okr.objective}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">关键结果 (Key Results)</h4>
                    <div className="space-y-3">
                      {okr.key_results.map((kr: any, index: number) => (
                        <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-800 mb-2">{kr.text}</p>
                            <div className="progress-bar">
                              <div 
                                className="progress-fill" 
                                style={{ width: `${Math.random() * 60 + 20}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              进度: {Math.floor(Math.random() * 60 + 20)}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <Target className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">还未设置学习目标</h4>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    使用OKR方法论设定你的学习目标，AI助手将基于目标为你制定个性化学习计划
                  </p>
                  <button
                    onClick={() => setShowOKRForm(true)}
                    className="btn-primary flex items-center mx-auto"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    创建我的第一个OKR
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="max-w-5xl">
            <div className="card overflow-hidden">
              <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 p-6 text-white">
                <h3 className="text-xl font-semibold flex items-center mb-2">
                  <Brain className="w-6 h-6 mr-3" />
                  AI学习助手
                </h3>
                <p className="text-secondary-100">
                  基于你的OKR目标，为你提供个性化学习指导和智能问答
                </p>
              </div>
              
              <ChatInterface userOkr={okr} />
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="max-w-5xl">
            <div className="card">
              <div className="border-b p-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <History className="w-6 h-6 mr-3" />
                  学习历史记录
                </h3>
                <p className="text-gray-600 mt-1">
                  查看你的学习轨迹和对话记录
                </p>
              </div>
              <ChatHistory />
            </div>
          </div>
        )}
      </div>

      {/* OKR Form Modal */}
      {showOKRForm && (
        <OKRForm
          okr={okr}
          onClose={() => setShowOKRForm(false)}
          onSuccess={(newOkr) => {
            setOkr(newOkr)
            setShowOKRForm(false)
          }}
        />
      )}
    </div>
  )
} 