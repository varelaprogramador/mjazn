import { SignIn } from '@clerk/nextjs'
import Image from 'next/image'

export default function AdminSignIn() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 gap-8">
      <div className="flex flex-col items-center gap-1">
        <Image
          src="/logo-simbol.png"
          alt="Região Norte"
          width={120}
          height={160}
          className="h-20 w-auto"
        />
        <p className="text-[10px] font-display tracking-[0.4em] text-fire">ADMIN</p>
      </div>

      <SignIn
        appearance={{
          variables: {
            colorPrimary: '#FF4500',
            colorBackground: '#111111',
            colorText: '#F5F0EB',
            colorInputBackground: '#0a0a0a',
            colorInputText: '#F5F0EB',
            borderRadius: '0px',
            fontFamily: 'var(--font-geist-sans)',
          },
          elements: {
            card: 'bg-[#111] border border-[#2a2a2a] shadow-none rounded-none',
            headerTitle: 'font-display tracking-widest text-off-white',
            headerSubtitle: 'text-gray-muted text-xs',
            formButtonPrimary:
              'bg-fire hover:bg-fire-light text-black font-display tracking-widest rounded-none text-xs h-11',
            formFieldInput:
              'bg-[#0a0a0a] border-[#2a2a2a] text-off-white focus:border-fire rounded-none',
            formFieldLabel: 'text-[10px] font-display tracking-widest text-gray-muted',
            footerActionLink: 'text-fire hover:text-fire-light',
            identityPreviewText: 'text-off-white',
            identityPreviewEditButton: 'text-fire',
          },
        }}
      />

      <p className="text-[10px] text-gray-dim">
        Acesso restrito — equipe Região Norte
      </p>
    </div>
  )
}
