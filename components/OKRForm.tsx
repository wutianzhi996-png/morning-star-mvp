'use client'

import { useState, useEffect } from 'react'
import { 
  X, 
  Plus, 
  Trash2, 
  Target, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  TrendingUp,
  Clock,
  BookOpen
} from 'lucide-react'

interface OKRFormProps {
  okr?: any
  onClose: () => void
  onSuccess: (okr: any) => void
}

export default function OKRForm({ okr, onClose, onSuccess }: OKRFormProps) {
  const [step, setStep] = useState(1)
  const [objective, setObjective] = useState('')
  const [keyResults, setKeyResults] = useState([{ text: '', deadline: '', priority: 'medium' }])
  const [timeframe, setTimeframe] = useState('3months')
  const [category, setCategory] = useState('technical')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (okr) {
      setObjective(okr.objective)
      setKeyResults(okr.key_results || [{ text: '', deadline: '', priority: 'medium' }])
      setTimeframe(okr.timeframe || '3months')
      setCategory(okr.category || 'technical')
    }
  }, [okr])

  const addKeyResult = () => {
    if (keyResults.length < 5) {
      setKeyResults([...keyResults, { text: '', deadline: '', priority: 'medium' }])
    }
  }

  const removeKeyResult = (index: number) => {
    if (keyResults.length > 1) {
      setKeyResults(keyResults.filter((_, i) => i !== index))
    }
  }

  const updateKeyResult = (index: number, field: string, value: string) => {
    const newKeyResults = [...keyResults]
    newKeyResults[index] = { ...newKeyResults[index], [field]: value }
    setKeyResults(newKeyResults)
  }

  const validateStep = (stepNum: number) => {
    if (stepNum === 1) {
      return objective.trim().length > 10
    }
    if (stepNum === 2) {
      return keyResults.every(kr => kr.text.trim().length > 0)
    }
    return true
  }

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!objective.trim()) {
      setError('请输入学习目标')
      return
    }

    if (keyResults.some(kr => !kr.text.trim())) {
      setError('请填写所有关键结果')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { supabase } = await import('@/lib/supabase')
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('用户未登录')

      const okrData = {
        objective: objective.trim(),
        key_results: keyResults.map(kr => ({ 
          text: kr.text.trim(),
          deadline: kr.deadline,
          priority: kr.priority,
          progress: 0
        })),
        timeframe,
        category,
        user_id: user.id,
        created_at: okr ? okr.created_at : new Date().toISOString()
      }

      let result
      if (okr) {
        const { data, error } = await supabase
          .from('okrs')
          .update(okrData)
          .eq('id', okr.id)
          .select()
          .single()
        
        if (error) throw error
        result = data
      } else {
        const { data, error } = await supabase
          .from('okrs')
          .insert(okrData)
          .select()
          .single()
        
        if (error) throw error
        result = data
      }

      onSuccess(result)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const categoryOptions = [
    { value: 'technical', label: '技术技能', icon: '💻' },
    { value: 'academic', label: '学术研究', icon: '📚' },
    { value: 'language', label: '语言学习', icon: '🗣️' },
    { value: 'certification', label: '证书考试', icon: '🏆' },
    { value: 'project', label: '项目实践', icon: '🚀' },
    { value: 'personal', label: '个人发展', icon: '🌱' }
  ]

  const timeframeOptions = [
    { value: '1month', label: '1个月', description: '短期冲刺目标' },
    { value: '3months', label: '3个月', description: '季度学习目标' },
    { value: '6months', label: '6个月', description: '半年深度学习' },
    { value: '1year', label: '1年', description: '年度成长计划' }
  ]

  const priorityOptions = [
    { value: 'high', label: '高优先级', color: 'text-error-600 bg-error-50 border-error-200' },
    { value: 'medium', label: '中优先级', color: 'text-warning-600 bg-warning-50 border-warning-200' },
    { value: 'low', label: '低优先级', color: 'text-success-600 bg-success-50 border-success-200' }
  ]

  const suggestedObjectives = [
    "掌握React.js及其生态系统的核心概念和最佳实践",
    "通过系统学习数据结构与算法，提升编程解题能力",
    "深入学习人工智能和机器学习的理论与实践应用",
    "准备并通过AWS云计算相关认证考试",
    "提升英语口语和写作能力，达到商务沟通水平"
  ]

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-hard max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-display font-bold flex items-center">
                <Target className="w-7 h-7 mr-3" />
                {okr ? '编辑OKR目标' : '创建OKR学习目标'}
              </h2>
              <p className="text-primary-100 mt-1">
                {step === 1 && '第一步：设定你的学习目标'}
                {step === 2 && '第二步：制定关键结果'}
                {step === 3 && '第三步：完善目标设置'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 flex space-x-2">
            {[1, 2, 3].map((stepNum) => (
              <div 
                key={stepNum}
                className={`h-1 flex-1 rounded-full transition-all ${
                  step >= stepNum ? 'bg-white' : 'bg-white/30'
                }`} 
              />
            ))}
          </div>
        </div>

        <div className="p-8 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Objective */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <label htmlFor="objective" className="block text-lg font-semibold text-gray-900 mb-3">
                    你的学习目标是什么？
                  </label>
                  <textarea
                    id="objective"
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    className="textarea-field w-full"
                    placeholder="描述一个具体、可衡量、有时限的学习目标..."
                    rows={4}
                    required
                  />
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <Lightbulb className="w-4 h-4 mr-1" />
                    <span>建议使用SMART原则：具体、可衡量、可达成、相关、有时限</span>
                  </div>
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-3">
                    选择学习类别
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categoryOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setCategory(option.value)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          category === option.value
                            ? 'border-primary-300 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-2">{option.icon}</div>
                        <div className="font-medium text-gray-900">{option.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Timeframe Selection */}
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-3">
                    选择时间框架
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {timeframeOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setTimeframe(option.value)}
                        className={`p-4 rounded-xl border-2 text-center transition-all ${
                          timeframe === option.value
                            ? 'border-primary-300 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-semibold text-gray-900">{option.label}</div>
                        <div className="text-sm text-gray-500 mt-1">{option.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Suggested Objectives */}
                {!objective && (
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-3">
                      💡 目标建议
                    </label>
                    <div className="space-y-2">
                      {suggestedObjectives.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setObjective(suggestion)}
                          className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all"
                        >
                          <div className="text-gray-800">{suggestion}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Key Results */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-lg font-semibold text-gray-900">
                      设定关键结果 (Key Results)
                    </label>
                    <button
                      type="button"
                      onClick={addKeyResult}
                      disabled={keyResults.length >= 5}
                      className="btn-outline flex items-center text-sm disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      添加关键结果
                    </button>
                  </div>
                  <p className="text-gray-600 mb-4">
                    设定2-5个可衡量的关键结果，用于跟踪目标达成进度
                  </p>
                </div>
                
                <div className="space-y-4">
                  {keyResults.map((kr, index) => (
                    <div key={index} className="card p-4">
                      <div className="flex items-start space-x-3 mb-4">
                        <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1 space-y-3">
                          <input
                            type="text"
                            value={kr.text}
                            onChange={(e) => updateKeyResult(index, 'text', e.target.value)}
                            className="input-field"
                            placeholder={`关键结果 ${index + 1}：例如"完成10个算法练习题"`}
                            required
                          />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                截止日期
                              </label>
                              <input
                                type="date"
                                value={kr.deadline}
                                onChange={(e) => updateKeyResult(index, 'deadline', e.target.value)}
                                className="input-field"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                <TrendingUp className="w-4 h-4 inline mr-1" />
                                优先级
                              </label>
                              <select
                                value={kr.priority}
                                onChange={(e) => updateKeyResult(index, 'priority', e.target.value)}
                                className="input-field"
                              >
                                {priorityOptions.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                        
                        {keyResults.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeKeyResult(index)}
                            className="text-error-500 hover:text-error-700 transition-colors p-1 mt-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-secondary-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-secondary-900 mb-1">关键结果设定建议</div>
                      <ul className="text-sm text-secondary-700 space-y-1">
                        <li>• 使用具体的数字和指标（如：完成10个项目、通过3门考试）</li>
                        <li>• 设定合理的时间节点，避免过于紧张或宽松</li>
                        <li>• 优先级帮助你在时间有限时做出选择</li>
                        <li>• 每个关键结果都应该对目标达成有直接贡献</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    确认你的OKR设置
                  </h3>
                  <p className="text-gray-600">
                    请检查以下信息，确认无误后点击保存
                  </p>
                </div>

                {/* Review Summary */}
                <div className="card p-6">
                  <div className="mb-6">
                    <div className="flex items-center mb-3">
                      <Target className="w-5 h-5 text-primary-600 mr-2" />
                      <h4 className="font-semibold text-gray-900">学习目标</h4>
                      <span className="ml-auto text-sm px-2 py-1 bg-primary-100 text-primary-700 rounded">
                        {categoryOptions.find(c => c.value === category)?.label}
                      </span>
                    </div>
                    <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                      <p className="text-gray-800">{objective}</p>
                    </div>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      时间框架: {timeframeOptions.find(t => t.value === timeframe)?.label}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <CheckCircle className="w-5 h-5 text-success-600 mr-2" />
                      关键结果 ({keyResults.length}个)
                    </h4>
                    <div className="space-y-3">
                      {keyResults.map((kr, index) => {
                        const priorityOption = priorityOptions.find(p => p.value === kr.priority)
                        return (
                          <div key={index} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-medium text-gray-900 mb-2">
                                  {index + 1}. {kr.text}
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  {kr.deadline && (
                                    <span className="flex items-center">
                                      <Calendar className="w-3 h-3 mr-1" />
                                      {kr.deadline}
                                    </span>
                                  )}
                                  <span className={`px-2 py-1 rounded border text-xs ${priorityOption?.color}`}>
                                    {priorityOption?.label}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="status-error p-4 rounded-xl text-sm border mt-6">
                {error}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <div>
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="btn-secondary"
                  >
                    上一步
                  </button>
                )}
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-ghost"
                >
                  取消
                </button>
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!validateStep(step)}
                    className="btn-primary disabled:opacity-50"
                  >
                    下一步
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary disabled:opacity-50 flex items-center"
                  >
                    {loading ? (
                      <>
                        <div className="loading-dots mr-2">
                          <div></div>
                          <div></div>
                          <div></div>
                        </div>
                        保存中...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {okr ? '更新OKR' : '创建OKR'}
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 