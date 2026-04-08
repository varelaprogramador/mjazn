export default function IdentityBlock() {
  return (
    <section className="bg-black py-28 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative">
        {/* Background text */}
        <p
          className="absolute inset-0 flex items-center justify-center font-display text-[clamp(6rem,20vw,16rem)] leading-none text-off-white/3 select-none pointer-events-none"
          aria-hidden="true"
        >
          FOGO
        </p>

        {/* Content */}
        <div className="relative z-10 space-y-6">
          <div className="w-8 h-px bg-fire mx-auto mb-10" />

          <p className="font-display text-[clamp(1.4rem,3.5vw,2.5rem)] leading-tight text-off-white">
            Não é sobre roupa.
          </p>
          <p className="font-display text-[clamp(1.4rem,3.5vw,2.5rem)] leading-tight text-fire">
            É sobre carregar aquilo que<br className="hidden sm:block" />
            {' '}Deus acendeu em você.
          </p>

          <div className="w-8 h-px bg-gray-dim mx-auto mt-10" />

          <blockquote className="text-sm text-gray-muted max-w-md mx-auto leading-relaxed italic">
            "Uma geração em chamas não pede permissão para arder.
            Ela simplesmente arde."
          </blockquote>

          <p className="text-[10px] font-display tracking-[0.5em] text-fire">
            — REGIÃO NORTE
          </p>
        </div>
      </div>
    </section>
  )
}
