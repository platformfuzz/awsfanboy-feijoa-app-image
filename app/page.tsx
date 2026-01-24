'use client'

import { useState, useEffect } from 'react'
import { FeijoaIcon, FeijoaBucketIcon } from './components/FeijoaIcon'
import { getItem, updateItem } from '@/lib/dynamodb'

export default function Home() {
  const [bucketCount, setBucketCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [animateAdd, setAnimateAdd] = useState(false)
  const [updateInProgress, setUpdateInProgress] = useState(false)

  // Load initial data from DynamoDB
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const bucketData = await getItem('bucket')
        
        if (bucketData) {
          setBucketCount(bucketData.value || 0)
        } else {
          // Initialize bucket if it doesn't exist
          await updateItem('bucket', { value: 0 })
          setBucketCount(0)
        }
      } catch (err: any) {
        console.error('Error fetching data:', err)
        setError('Failed to load data: ' + (err.message || 'Unknown error'))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Update bucket in DynamoDB and local state
  const updateBucket = async (newCount: number) => {
    if (updateInProgress) return
    
    try {
      setUpdateInProgress(true)
      setError(null)
      
      if (newCount > bucketCount) {
        setAnimateAdd(true)
        setTimeout(() => setAnimateAdd(false), 1000)
      }
      
      // Update local state first for better UX
      setBucketCount(newCount)
      
      // Then update in DynamoDB
      await updateItem('bucket', { value: newCount })
    } catch (err: any) {
      console.error('Error updating bucket:', err)
      setError('Failed to update bucket: ' + (err.message || 'Unknown error'))
      // Revert to previous count on error
      setBucketCount(bucketCount)
    } finally {
      setUpdateInProgress(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="animate-pulse-custom">
          <FeijoaIcon size={80} />
        </div>
        <h2 className="mt-8 text-2xl font-semibold text-white">Loading...</h2>
      </div>
    )
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4 animate-float">
            <FeijoaIcon size={48} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2 drop-shadow-lg">
            Feijoa Bucket
          </h1>
          <p className="text-white/80 text-sm sm:text-base">
            Powered by EKS Capabilities & DynamoDB
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl shadow-lg">
            <p className="text-red-800 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            Your Feijoa Collection
          </h2>
          
          {/* Bucket Display */}
          <div className="relative h-48 flex items-center justify-center mb-8">
            <div className="relative">
              <FeijoaBucketIcon size={150} count={bucketCount} />
              {animateAdd && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 animate-bounce-custom">
                  <FeijoaIcon size={40} />
                </div>
              )}
            </div>
          </div>
          
          {/* Count Display */}
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-green-400 to-emerald-500 text-white px-8 py-4 rounded-2xl shadow-lg">
              <div className="text-5xl font-bold mb-1">{bucketCount}</div>
              <div className="text-lg font-medium">
                {bucketCount === 1 ? 'Feijoa' : 'Feijoas'}
              </div>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => updateBucket(Math.max(0, bucketCount - 1))}
              disabled={bucketCount <= 0 || updateInProgress}
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:hover:shadow-md"
            >
              <FeijoaIcon size={24} />
              Remove
            </button>
            <button 
              onClick={() => updateBucket(bucketCount + 1)}
              disabled={updateInProgress}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:hover:shadow-md"
            >
              <FeijoaIcon size={24} />
              Add Feijoa
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-white/60 text-sm">
          Built with Next.js 15 & AWS SDK v3
        </div>
      </div>
    </main>
  )
}
