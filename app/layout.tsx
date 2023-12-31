import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Theme } from '@radix-ui/themes';

import SideMenu from './components/layout/SideMenu';

import '@radix-ui/themes/styles.css';
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className='dark' lang="en" style={{ colorScheme: 'dark', }}>
      <body className={inter.className}>
        <Theme appearance="dark">
          <main className="flex min-h-screen p-24 gap-4">
            <SideMenu />
            <div className="w-2/3 bg-[#9e565b] rounded-lg p-6 shadow-lg">
              {children}
            </div>
          </main>
        </Theme>
      </body>
    </html>
  )
}
