import './globals.css'

export const metadata = {
  title: 'Eclipse Comics',
  description: 'The Shadow Has A Name.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

