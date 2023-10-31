import './globals.css'
import { Nunito } from 'next/font/google'
const fontData = Nunito({ subsets: ['latin'] })
import Script from 'next/script'
import { Footer, Header } from '@/components/layout';
import { ThemeProvider } from '@/context/theme';
import Head from 'next/head';
import { WriterProvider } from '@/context/writer';
import { StrictMode } from 'react';
import { EditorProvider } from '@/context/editor/valueEditor';

export const metadata = {
  title: 'Etlog Writer',
  description: ``,
  openGraph: {
    title: 'ETlog ',
    description: ``,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isProd = process.env.NODE_ENV === "production";

  return (
    <html lang="en">
      <body className={`${fontData.className} relative h-screen overflow-x-hidden overflow-y-auto`} >
        <StrictMode>
          <EditorProvider>
            <ThemeProvider>
              <WriterProvider>
                <div className='w-full z-10 fixed'>
                  <Header />
                </div>
                <main className='min-h-screen'>
                  {children}
                </main>
                <Footer />
              </WriterProvider>
            </ThemeProvider>
          </EditorProvider>
        </StrictMode>
      </body>
    </html>
  )
}
