'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { User, LogOut, Plus, Send, Target, MessageCircle, History } from 'lucide-react'
import OKRForm from '@/components/OKRForm'
import ChatInterface from '@/components/ChatInterface'
import ChatHistory from '@/components/ChatHistory'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [okr, setOkr] = useState<any>(null)
  const [showOKRForm, setShowOKRForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUser()
    fetchOKR()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/')
      return
    }
    setUser(user)
    setLoading(false)
  }

  const fetchOKR = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('okrs')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (data) {
      setOkr(data)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Target className="w-8 h-8 text-primary-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">启明星平台</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-700">
                <User className="w-4 h-4 mr-2" />
                {user?.email}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                退出
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - OKR Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  我的OKR
                </h2>
                {!okr && (
                  <button
                    onClick={() => setShowOKRForm(true)}
                    className="btn-primary flex items-center text-sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    创建OKR
                  </button>
                )}
              </div>

              {okr ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">目标 (Objective)</h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{okr.objective}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">关键结果 (Key Results)</h3>
                    <div className="space-y-2">
                      {okr.key_results.map((kr: any, index: number) => (
                        <div key={index} className="flex items-start">
                          <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                            {index + 1}
                          </span>
                          <p className="text-gray-700 bg-gray-50 p-3 rounded-lg flex-1">{kr.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowOKRForm(true)}
                    className="btn-secondary w-full text-sm"
                  >
                    编辑OKR
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">还没有设定OKR目标</p>
                  <p className="text-sm text-gray-400">创建你的第一个学习目标，AI助手将为你规划每日任务</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Chat Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="border-b p-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  AI学习助手
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  基于你的OKR，为你提供个性化学习指导和任务推荐
                </p>
              </div>
              
              <ChatInterface userOkr={okr} />
            </div>
          </div>
        </div>

        {/* Chat History Section */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow">
            <div className="border-b p-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <History className="w-5 h-5 mr-2" />
                聊天历史
              </h2>
            </div>
            <ChatHistory />
          </div>
        </div>
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