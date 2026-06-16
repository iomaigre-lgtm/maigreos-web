import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { GlassFilter } from '@/components/ui/glass'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'MazyOS Web',
  description: 'Sistema operacional da agência — by Maigre IA',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" className={poppins.variable}>
      <body style={{ fontFamily: 'var(--font-poppins), -apple-system, sans-serif', background: '#111111', margin: 0 }}>
        <GlassFilter />
        {children}
      </body>
    </html>
  )
}
