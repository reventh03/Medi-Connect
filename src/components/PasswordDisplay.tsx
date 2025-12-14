'use client'

import { useState } from 'react'
import { Copy, Check, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PasswordDisplayProps {
  password: string
  email: string
}

export default function PasswordDisplay({ password, email }: PasswordDisplayProps) {
  const [copied, setCopied] = useState(false)
  const [showPassword, setShowPassword] = useState(true)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
          <span className="text-yellow-900 font-bold">!</span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-yellow-900 mb-1">
            Important: Save This Password
          </h3>
          <p className="text-sm text-yellow-800">
            This password will only be shown once. Make sure to copy it and share it securely with the user.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="bg-white border border-gray-300 rounded-md px-3 py-2">
            <code className="text-sm text-gray-900">{email}</code>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Temporary Password
          </label>
          <div className="flex gap-2">
            <div className="flex-1 bg-white border border-gray-300 rounded-md px-3 py-2 flex items-center justify-between">
              <code className="text-sm text-gray-900 font-mono">
                {showPassword ? password : '••••••••••••'}
              </code>
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-gray-500 hover:text-gray-700"
                type="button"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <Button
              type="button"
              onClick={copyToClipboard}
              variant="outline"
              className="flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-yellow-800">
        <p>The user should change this password after their first login.</p>
      </div>
    </div>
  )
}

