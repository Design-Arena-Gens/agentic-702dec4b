import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Network Monitoring Platform',
  description: 'Comprehensive multi-vendor, multi-technology network monitoring',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
