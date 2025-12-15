'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { Trash2 } from 'lucide-react'

interface DeleteButtonProps {
  id: string
  endpoint: string
  itemName: string
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'default' | 'sm' | 'lg'
}

export function DeleteButton({ id, endpoint, itemName, variant = 'ghost', size = 'sm' }: DeleteButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    
    try {
      const response = await fetch(`${endpoint}/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        router.refresh()
      } else {
        alert(data.error || 'Failed to delete')
      }
    } catch (error) {
      alert('An error occurred')
    } finally {
      setLoading(false)
      setShowConfirm(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="destructive"
          onClick={handleDelete}
          disabled={loading}
        >
          {loading ? 'Deleting...' : 'Confirm'}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowConfirm(false)}
        >
          Cancel
        </Button>
      </div>
    )
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => setShowConfirm(true)}
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      <Trash2 className="h-4 w-4 mr-1" />
      Delete
    </Button>
  )
}


