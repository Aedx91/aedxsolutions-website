'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import styles from './FlipCard.module.css'

interface FlipCardProps {
  title: string
  subtitle: React.ReactNode
  ctaHref: string
  ctaLabel?: string
}

export default function FlipCard({ title, subtitle, ctaHref, ctaLabel = 'More info' }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [animating, setAnimating] = useState(false)

  const handleCardClick = () => {
    setAnimating(true)
    setIsFlipped((prev) => !prev)
  }

  // Note: Keyboard activation is omitted here to avoid nested interactive controls a11y lint error
  // because the back face contains its own checkbox and button. Flip remains mouse/touch activated.

  return (
    <div className={`${styles.container} ${animating ? styles.animating : ''}`}>
      <div
        className={`${styles.card} ${isFlipped ? styles.flipped : ''}`}
        onClick={handleCardClick}
        onTransitionEnd={() => setAnimating(false)}
      >
        {/* Front face */}
        <div className={`${styles.face} ${styles.front}`}>
          <div>
            <div className={styles.iconCircle} aria-hidden="true" />
            <h3 className="text-lg sm:text-xl font-bold text-primary px-2">{title}</h3>
            <p className={styles.hint}>Tap or click to flip and see details</p>
          </div>
        </div>

        {/* Back face */}
        <div className={`${styles.face} ${styles.back}`}>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-primary mb-3 leading-tight">{title}</h3>
            <div
              className="text-xs sm:text-sm text-text-secondary mb-4 leading-relaxed"
              onClick={(e) => e.stopPropagation()}
            >
              {subtitle}
            </div>
          </div>

          <Link
            href={ctaHref}
            onClick={(e) => e.stopPropagation()}
            className="btn btn-outline w-full justify-center"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </div>
  )
}