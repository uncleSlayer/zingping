'use client'

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="mt-24 main-container text-black dark:text-white">
      {children}
    </div >
  )
}
