import React from 'react'
import { cn } from '@/lib/utils'

export function GlassFilter() {
  return (
    <svg style={{ display: 'none' }} xmlns="http://www.w3.org/2000/svg">
      <filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.001 0.005" numOctaves="1" seed="17" result="turbulence"/>
        <feComponentTransfer in="turbulence" result="mapped">
          <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5"/>
          <feFuncG type="gamma" amplitude="0" exponent="1" offset="0"/>
          <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5"/>
        </feComponentTransfer>
        <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap"/>
        <feSpecularLighting in="softMap" surfaceScale="5" specularConstant="1"
          specularExponent="100" lightingColor="white" result="specLight">
          <fePointLight x="-200" y="-200" z="300"/>
        </feSpecularLighting>
        <feComposite in="specLight" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litImage"/>
        <feDisplacementMap in="SourceGraphic" in2="softMap" scale="200"
          xChannelSelector="R" yChannelSelector="G"/>
      </filter>
    </svg>
  )
}

type GlassVariant = 'default' | 'accent' | 'dark'

interface GlassProps {
  children: React.ReactNode
  className?: string
  variant?: GlassVariant
  style?: React.CSSProperties
  onClick?: () => void
}

const fillColor: Record<GlassVariant, string> = {
  default: 'rgba(255,255,255,0.045)',
  accent:  'rgba(193,255,114,0.07)',
  dark:    'rgba(0,0,0,0.3)',
}

const borderColor: Record<GlassVariant, string> = {
  default: 'rgba(255,255,255,0.1)',
  accent:  'rgba(193,255,114,0.18)',
  dark:    'rgba(255,255,255,0.07)',
}

export function Glass({ children, className, variant = 'default', style, onClick }: GlassProps) {
  return (
    <div
      className={cn('relative overflow-hidden', className)}
      onClick={onClick}
      style={{
        boxShadow: `0 1px 1px rgba(255,255,255,0.04), 0 4px 16px rgba(0,0,0,0.4),
          inset 1px 1px 0 rgba(255,255,255,0.08), inset -1px -1px 0 rgba(255,255,255,0.03)`,
        ...style,
      }}
    >
      {/* Layer 1: backdrop blur + SVG distortion */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backdropFilter: 'blur(24px) saturate(160%)',
        WebkitBackdropFilter: 'blur(24px) saturate(160%)',
        borderRadius: 'inherit',
        filter: 'url(#glass-distortion)',
      }}/>
      {/* Layer 2: translucent fill */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        borderRadius: 'inherit',
        background: fillColor[variant],
      }}/>
      {/* Layer 3: border highlight */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        borderRadius: 'inherit',
        border: `1px solid ${borderColor[variant]}`,
        boxShadow: `inset 1px 1px 0 rgba(255,255,255,0.12), inset -1px -1px 0 rgba(255,255,255,0.03)`,
      }}/>
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 3 }}>
        {children}
      </div>
    </div>
  )
}
