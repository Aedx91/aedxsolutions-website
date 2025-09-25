'use client'

import React, { useRef, useState } from 'react'
import styles from './FlipCard.module.css'

interface FlipCardProps {
  title: string
  subtitle: React.ReactNode
  optionKey: string
}

export default function FlipCard({ title, subtitle, optionKey }: FlipCardProps) {
  const [rotation, setRotation] = useState(0)
  const [isChecked, setIsChecked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const [animating, setAnimating] = useState(false)

  const handleSubmit = async () => {
    if (!isChecked) return
    setIsLoading(true)
    try {
      const response = await fetch('/api/date/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ option: optionKey })
      })
      const result = await response.json().catch(() => ({}))
      if (result?.success) {
        alert('Thank you! Your choice has been recorded.')
      } else {
        alert('Response recorded (check server logs).')
      }
      // After submitting, rotate another 180° to return to the opposite face (likely the front)
      setRotation((prev) => prev + 180)
      setIsChecked(false)
    } catch (e) {
      alert('Oops! Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCardClick = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const centerX = rect.left + rect.width / 2
    const delta = e.clientX < centerX ? -180 : 180
    setAnimating(true)
    setRotation((prev) => prev + delta)
  }

  const rotSteps = Math.round(rotation / 180)
  const rotClass = (rotSteps === 0) ? 'rot-0' : `rot-${rotSteps}`

  return (
    <div className={`${styles.container} ${animating ? styles.animating : ''}`}>
      <div
        ref={cardRef}
        className={`${styles.card} ${styles[rotClass as keyof typeof styles] ?? ''}`}
        onClick={handleCardClick}
        onTransitionEnd={() => setAnimating(false)}
      >
        {/* Front face */}
        <div className={`${styles.face} ${styles.front}`}>
          <div>
            <div className={styles.iconCircle}>💜</div>
            <h3 className="text-xl font-bold text-primary">{title}</h3>
            <p className={styles.hint}>Click to flip and see details</p>
          </div>
        </div>

        {/* Back face */}
        <div className={`${styles.face} ${styles.back}`}>
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">{title}</h3>
            <div className="text-sm text-text-secondary mb-4" onClick={(e) => e.stopPropagation()}>{subtitle}</div>
          </div>

          <div className="space-y-4">
            <label className="flex items-start space-x-3 cursor-pointer" onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary mt-1"
              />
              <span className="text-sm font-medium">Yes, I'd love this date!</span>
            </label>

            <div className="flex">
              <button
                onClick={(e) => { e.stopPropagation(); void handleSubmit(); }}
                disabled={!isChecked || isLoading}
                className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg"
              >
                {isLoading ? 'Sending...' : 'Accept & Send'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}