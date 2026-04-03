import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'StreamDeck',
  description: 'StreamDeck virtual para control del Mac Mini',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
