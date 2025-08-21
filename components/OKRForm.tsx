'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { X, Plus, Trash2 } from 'lucide-react'

interface OKRFormProps {
  okr?: any
  onClose: () => void
  onSuccess: (okr: any) => void
}

export default function OKRForm({ okr, onClose, onSuccess }: OKRFormProps) {
  const [objective, setObjective] = useState('')
  const [keyResults, setKeyResults] = useState([{ text: '' }])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (okr) {
      setObjective(okr.objective)
      setKeyResults(okr.key_results)
    }
  }, [okr])

  const addKeyResult = () => {
    if (keyResults.length < 3) {
      setKeyResults([...keyResults, { text: '' }])
    }
  }

  const removeKeyResult = (index: number) => {
    if (keyResults.length > 1) {
      setKeyResults(keyResults.filter((_, i) => i !== index))
    }
  }

  const updateKeyResult = (index: number, text: string) => {
    const newKeyResults = [...keyResults]
    newKeyResults[index].text = text
    setKeyResults(newKeyResults)
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
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('用户未登录')

      const okrData = {
        objective: objective.trim(),
        key_results: keyResults.map(kr => ({ text: kr.text.trim() })),
        user_id: user.id
      }

      let result
      if (okr) {
        // Update existing OKR
        const { data, error } = await supabase
          .from('okrs')
          .update(okrData)
          .eq('id', okr.id)
          .select()
          .single()
        
        if (error) throw error
        result = data
      } else {
        // Create new OKR
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {okr ? '编辑OKR' : '创建OKR'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="objective" className="block text-sm font-medium text-gray-700 mb-2">
                学习目标 (Objective) *
              </label>
              <textarea
                id="objective"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="input-field min-h-[80px] resize-none"
                placeholder="例如：本学期掌握数据结构与算法的核心概念，能够独立解决中等难度的编程问题"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                描述你想要达成的学习目标，要具体且可衡量
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  关键结果 (Key Results) *
                </label>
                <button
                  type="button"
                  onClick={addKeyResult}
                  disabled={keyResults.length >= 3}
                  className="btn-secondary flex items-center text-sm disabled:opacity-50"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  添加
                </button>
              </div>
              
              <div className="space-y-3">
                {keyResults.map((kr, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <input
                      type="text"
                      value={kr.text}
                      onChange={(e) => updateKeyResult(index, e.target.value)}
                      className="input-field flex-1"
                      placeholder={`关键结果 ${index + 1}`}
                      required
                    />
                    {keyResults.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeKeyResult(index)}
                        className="text-red-500 hover:text-red-700 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              <p className="text-sm text-gray-500 mt-2">
                设定2-3个可衡量的关键结果，用于跟踪目标达成进度
              </p>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? '保存中...' : (okr ? '更新OKR' : '创建OKR')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 