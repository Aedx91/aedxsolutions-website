import React from 'react'

type Props = { children: React.ReactNode; variant?: 'app'|'section'|'raised'; className?: string }

export default function Section({ children, variant='section', className='' }: Props) {
  const bg = variant === 'app' ? 'bg-surface-app' : variant === 'raised' ? 'bg-surface-raised' : 'bg-surface-section'
  return <section className={`${bg}`}><div className={`container section ${className}`}>{children}</div></section>
}