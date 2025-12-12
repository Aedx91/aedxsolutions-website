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
    } catch {
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

  // Note: Keyboard activation is omitted here to avoid nested interactive controls a11y lint error
  // because the back face contains its own checkbox and button. Flip remains mouse/touch activated.

  return (
    <div className={`${styles.container} ${animating ? styles.animating : ''}`}>
      <div
        ref={cardRef}
        className={styles.card}
        style={{ '--rotation': `${rotation}deg` } as React.CSSProperties}
        onClick={handleCardClick}
        onTransitionEnd={() => setAnimating(false)}
      >
        {/* Front face */}
        <div className={`${styles.face} ${styles.front}`}>
          <div>
            <div className={styles.iconCircle} aria-hidden="true">❤️</div>
            <h3 className="text-lg sm:text-xl font-bold text-primary px-2">{title}</h3>
            <p className={styles.hint}>Tap or click to flip and see details</p>
          </div>
        </div>

        {/* Back face */}
        <div className={`${styles.face} ${styles.back}`}>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-primary mb-3 leading-tight">{title}</h3>
            <div className="text-xs sm:text-sm text-text-secondary mb-4 leading-relaxed" onClick={(e) => e.stopPropagation()}>{subtitle}</div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <label className="flex items-start space-x-2 sm:space-x-3 cursor-pointer" onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary mt-1 min-w-[16px]"
              />
              <span className="text-xs sm:text-sm font-medium leading-tight">This is the right track for us</span>
            </label>

            <div className="flex">
              <button
                onClick={(e) => { e.stopPropagation(); void handleSubmit(); }}
                disabled={!isChecked || isLoading}
                className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg touch-manipulation"
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