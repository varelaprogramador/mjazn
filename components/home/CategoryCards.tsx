import Link from 'next/link'

const categories = [
  {
    slug: 'camisetas',
    label: 'Camisetas',
    description: 'Oversized & Regular Fit',
    color: 'from-fire/20 via-dark to-dark',
    accent: '#FF4D00',
  },
  {
    slug: 'polos',
    label: 'Polos',
    description: 'Bordados Exclusivos',
    color: 'from-gray-dim/30 via-dark to-dark',
    accent: '#EAEAEA',
  },
  {
    slug: 'kits',
    label: 'Kits',
    description: 'Conjuntos Especiais',
    color: 'from-fire-light/15 via-dark to-dark',
    accent: '#FF7A00',
  },
  {
    slug: 'acessorios',
    label: 'Acessórios',
    description: 'Bonés & Mais',
    color: 'from-gray-muted/20 via-dark to-dark',
    accent: '#888888',
  },
]

export default function CategoryCards() {
  return (
    <section className="bg-dark-mid py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="text-[10px] font-display tracking-[0.5em] text-fire mb-2">EXPLORE</p>
          <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] leading-none text-off-white">
            Categorias
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/loja?categoria=${cat.slug}`}
              className="group relative block overflow-hidden aspect-[3/4] bg-dark"
            >
              {/* Background gradient */}
              <div
                className={[
                  'absolute inset-0 bg-gradient-to-b',
                  cat.color,
                  'transition-opacity duration-500 group-hover:opacity-80',
                ].join(' ')}
              />

              {/* Decorative accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                style={{ backgroundColor: cat.accent }}
              />

              {/* Grid pattern */}
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: `
                    linear-gradient(${cat.accent}33 1px, transparent 1px),
                    linear-gradient(90deg, ${cat.accent}33 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px',
                }}
              />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5">
                <p
                  className="font-display text-[clamp(1.2rem,3vw,2rem)] leading-none text-off-white mb-1 transition-transform duration-300 group-hover:-translate-y-1"
                >
                  {cat.label}
                </p>
                <p className="text-[10px] font-display tracking-widest text-gray-muted">
                  {cat.description}
                </p>
                <div
                  className="mt-3 flex items-center gap-1 text-[10px] font-display tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ color: cat.accent }}
                >
                  Ver Coleção
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
