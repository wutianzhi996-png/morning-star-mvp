'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Star, 
  BookOpen, 
  Target, 
  MessageCircle, 
  TrendingUp, 
  Users, 
  Award, 
  ArrowRight,
  CheckCircle,
  Sparkles,
  Brain,
  Zap,
  X
} from 'lucide-react'

export default function HomePage() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [studyField, setStudyField] = useState('')
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // 注册时的额外验证
      if (!isLogin) {
        if (!fullName.trim()) {
          setError('请输入您的姓名')
          return
        }
        if (password.length < 8) {
          setError('密码长度至少需要8位')
          return
        }
        if (password !== confirmPassword) {
          setError('两次输入的密码不一致')
          return
        }
        if (!agreeToTerms) {
          setError('请同意服务条款和隐私政策')
          return
        }
        // 密码强度验证
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
        if (!passwordRegex.test(password)) {
          setError('密码必须包含大写字母、小写字母和数字，至少8位')
          return
        }
      }

      // 直接导入Supabase客户端
      const { supabase } = await import('@/lib/supabase')
      
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
          options: {
            data: {
              full_name: fullName,
              phone_number: phoneNumber,
              study_field: studyField,
            }
          }
        })
        if (error) throw error
        setError('')
        alert(`注册成功！欢迎 ${fullName} 加入启明星学习社区！请查看邮箱完成验证。`)
      }
      
      router.push('/dashboard')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-200/30 rounded-full blur-3xl animate-pulse-soft"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-200/20 rounded-full blur-3xl animate-pulse-soft"></div>
        <div className="absolute top-3/4 left-1/3 w-48 h-48 bg-warning-200/25 rounded-full blur-3xl animate-pulse-soft"></div>
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="container-custom py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-display font-bold text-gradient-primary">启明星</h1>
            </div>
            <div className="flex items-center space-x-6">
              <div className="hidden sm:flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                <span>10,000+ 学生在线学习</span>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setIsLogin(true)
                    setShowAuthModal(true)
                  }}
                  className="btn-ghost px-4 py-2 text-sm"
                >
                  登录
                </button>
                <button
                  onClick={() => {
                    setIsLogin(false)
                    setShowAuthModal(true)
                  }}
                  className="btn-primary px-4 py-2 text-sm"
                >
                  注册
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="container-custom">
          {/* Hero Section */}
          <div className="text-center py-20">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-primary-100">
                <Sparkles className="w-4 h-4" />
                <span>AI智能学习助手平台</span>
              </div>
              
              <h1 className="font-display text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
                让学习更
                <span className="text-gradient-primary relative">
                  智能
                  <div className="absolute -inset-2 bg-primary-100/50 rounded-2xl -z-10 animate-pulse-soft"></div>
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-4 leading-relaxed">
                基于OKR的个性化学习指导，结合AI智能助手
              </p>
              <p className="text-lg text-gray-500 mb-12">
                让每个学生都成为自己的成长CEO，实现高效学习目标
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
                <button
                  onClick={() => {
                    setIsLogin(false)
                    setShowAuthModal(true)
                  }}
                  className="btn-primary text-lg px-8 py-4 flex items-center space-x-2 animate-glow"
                >
                  <span>免费开始</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  <span>无需信用卡，立即体验</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-20">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">98%</div>
                  <div className="text-sm text-gray-600">学习目标达成率</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary-600 mb-2">24/7</div>
                  <div className="text-sm text-gray-600">AI智能答疑</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-success-600 mb-2">10K+</div>
                  <div className="text-sm text-gray-600">活跃学习者</div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="py-20">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl font-bold text-gray-900 mb-4">
                为什么选择启明星？
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                结合现代教育理念与AI技术，为你提供前所未有的学习体验
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              {/* Feature 1 */}
              <div className="card-elevated p-8 text-center group hover:scale-105 transition-transform duration-300">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mx-auto flex items-center justify-center shadow-medium">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -inset-4 bg-primary-100 rounded-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">OKR目标管理</h3>
                <p className="text-gray-600 mb-6">
                  科学的目标设定与跟踪体系，将大目标拆解为可执行的关键结果，让学习进度一目了然
                </p>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success-500 mr-2" />
                    目标进度可视化
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success-500 mr-2" />
                    智能任务分解
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success-500 mr-2" />
                    数据驱动决策
                  </li>
                </ul>
              </div>

              {/* Feature 2 */}
              <div className="card-elevated p-8 text-center group hover:scale-105 transition-transform duration-300">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl mx-auto flex items-center justify-center shadow-medium">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -inset-4 bg-secondary-100 rounded-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">AI智能问答</h3>
                <p className="text-gray-600 mb-6">
                  24/7在线智能助手，基于海量知识库提供精准答疑，让学习困惑随时得到解决
                </p>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success-500 mr-2" />
                    即时智能回答
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success-500 mr-2" />
                    个性化建议
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success-500 mr-2" />
                    学习路径规划
                  </li>
                </ul>
              </div>

              {/* Feature 3 */}
              <div className="card-elevated p-8 text-center group hover:scale-105 transition-transform duration-300">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl mx-auto flex items-center justify-center shadow-medium">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -inset-4 bg-success-100 rounded-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">学习进度分析</h3>
                <p className="text-gray-600 mb-6">
                  智能分析学习行为和进度，提供个性化的学习建议和资源推荐，提升学习效率
                </p>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success-500 mr-2" />
                    学习轨迹追踪
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success-500 mr-2" />
                    弱点识别改进
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success-500 mr-2" />
                    成就激励体系
                  </li>
                </ul>
              </div>
            </div>
          </div>


          {/* Footer */}
          <footer className="py-12 border-t border-gray-200">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-display font-bold text-gradient-primary">启明星平台</span>
              </div>
              <p className="text-gray-600 text-sm">
                © 2024 启明星平台. 让每个学生都能高效学习，成就更好的自己.
              </p>
            </div>
          </footer>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slide-up">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-display font-bold flex items-center">
                    {isLogin ? <Star className="w-7 h-7 mr-3" /> : <Zap className="w-7 h-7 mr-3" />}
                    {isLogin ? '欢迎回来！' : '开始学习之旅'}
                  </h2>
                  <p className="text-primary-100 mt-1">
                    {isLogin ? '继续你的学习进程' : '加入万名学生的学习社区'}
                  </p>
                </div>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="text-white/80 hover:text-white transition-colors p-2"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              <form onSubmit={handleAuth} className="space-y-6">
                {/* 注册时显示姓名字段 */}
                {!isLogin && (
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                      姓名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="input-field"
                      placeholder="请输入您的真实姓名"
                      required
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    邮箱地址 <span className="text-red-500">*</span>
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

                {/* 注册时显示手机号码字段 */}
                {!isLogin && (
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                      手机号码 <span className="text-gray-400">(可选)</span>
                    </label>
                    <input
                      id="phoneNumber"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="input-field"
                      placeholder="13800000000"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    密码 <span className="text-red-500">*</span>
                    {!isLogin && <span className="text-xs text-gray-500 ml-2">(至少8位，包含大小写字母和数字)</span>}
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

                {/* 注册时显示确认密码字段 */}
                {!isLogin && (
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      确认密码 <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="input-field"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                )}

                {/* 注册时显示学习领域选择 */}
                {!isLogin && (
                  <div>
                    <label htmlFor="studyField" className="block text-sm font-medium text-gray-700 mb-2">
                      主要学习领域 <span className="text-gray-400">(可选)</span>
                    </label>
                    <select
                      id="studyField"
                      value={studyField}
                      onChange={(e) => setStudyField(e.target.value)}
                      className="input-field"
                    >
                      <option value="">请选择您的学习领域</option>
                      <option value="programming">编程开发</option>
                      <option value="mathematics">数学</option>
                      <option value="science">自然科学</option>
                      <option value="languages">语言学习</option>
                      <option value="business">商业管理</option>
                      <option value="design">设计艺术</option>
                      <option value="other">其他</option>
                    </select>
                  </div>
                )}

                {/* 注册时显示服务条款同意 */}
                {!isLogin && (
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <input
                        id="agreeToTerms"
                        type="checkbox"
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                        className="mt-1 w-4 h-4 text-primary-600 bg-white border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                        required
                      />
                      <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
                        我已阅读并同意
                        <a href="#" className="text-primary-600 hover:text-primary-700 mx-1 underline">用户协议</a>
                        和
                        <a href="#" className="text-primary-600 hover:text-primary-700 ml-1 underline">隐私政策</a>
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-blue-900 mb-1">免费注册包含：</div>
                          <ul className="text-sm text-blue-700 space-y-1">
                            <li>• 无限制OKR目标创建</li>
                            <li>• 24/7 AI学习助手</li>
                            <li>• 个性化学习建议</li>
                            <li>• 学习进度跟踪</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="status-error p-4 rounded-xl text-sm border">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full text-lg disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="loading-dots">
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                      <span>处理中...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span>{isLogin ? '登录账户' : '创建账户'}</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
                >
                  {isLogin ? '还没有账户？立即注册' : '已有账户？立即登录'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 