'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Star, BookOpen, Target, MessageCircle } from 'lucide-react'

export default function HomePage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
      }
      
      router.push('/dashboard')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <Star className="w-16 h-16 text-yellow-500 mr-4" />
              <h1 className="text-5xl font-bold text-gray-900">启明星</h1>
            </div>
            <p className="text-xl text-gray-600 mb-4">AI智能学习助手平台</p>
            <p className="text-lg text-gray-500">基于OKR的个性化学习指导，让每个学生都成为自己的成长CEO</p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">OKR目标管理</h3>
              <p className="text-gray-600">设定学习目标，拆解关键结果，AI助手帮你规划每日任务</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <MessageCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI智能问答</h3>
              <p className="text-gray-600">24/7智能答疑，基于知识库提供精准的学习指导</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <BookOpen className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">个性化学习</h3>
              <p className="text-gray-600">AI分析你的学习进度，推荐最适合的学习资源和路径</p>
            </div>
          </div>

          {/* Auth Form */}
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {isLogin ? '欢迎回来' : '开始你的学习之旅'}
                </h2>
                <p className="text-gray-600 mt-2">
                  {isLogin ? '登录你的账户继续学习' : '创建账户开始使用AI助手'}
                </p>
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    邮箱地址
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    密码
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field"
                    placeholder="••••••••"
                    required
                  />
                </div>

                {error && (
                  <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3 text-lg disabled:opacity-50"
                >
                  {loading ? '处理中...' : (isLogin ? '登录' : '注册')}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  {isLogin ? '还没有账户？立即注册' : '已有账户？立即登录'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 