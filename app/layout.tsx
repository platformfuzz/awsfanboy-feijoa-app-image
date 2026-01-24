import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Feijoa Bucket - EKS Platform Demo',
  description: 'A beautiful Next.js app demonstrating EKS Capabilities with DynamoDB',
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
