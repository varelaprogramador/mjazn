import { config } from 'dotenv'
config({ path: '.env.local' })

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // ─── Limpar tabelas ──────────────────────────────────────────────────────
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.productVariant.deleteMany()
  await prisma.product.deleteMany()
  await prisma.drop.deleteMany()
  await prisma.testimonial.deleteMany()
  console.log('🗑  Tabelas limpas')

  // ─── Drop 01 ─────────────────────────────────────────────────────────────
  const drop = await prisma.drop.create({
    data: {
      name: 'DROP 01',
      tagline: 'MARCADOS PELO FOGO',
      description: 'A primeira coleção da Região Norte. Peças limitadas para uma geração que não recua. Quando acabar, acabou.',
      startDate: new Date('2025-04-01'),
      endDate: new Date('2025-07-01'),
      stockLimit: 100,
      stockRemaining: 23,
      isActive: true,
    },
  })
  console.log('✅ Drop criado:', drop.name)

  // ─── Produtos ─────────────────────────────────────────────────────────────
  const productsData = [
    // ── Drop 01 exclusivos ───────────────────────────────────────────────
    {
      slug: 'camiseta-oversized-chamas',
      name: 'Camiseta Oversized Chamas',
      price: 14900,
      description: 'Camiseta oversized em algodão 100% premium com estampa "Chamas" na frente e "Região Norte" nas costas. Modelagem ampla, caimento perfeito.',
      shortDescription: 'Algodão premium oversized — estampa fogo exclusiva',
      category: 'camisetas' as const,
      images: [] as string[],
      isNew: true,
      isLimited: true,
      tags: ['fogo', 'oversized', 'grafismo', 'drop01'],
      dropId: drop.id,
      variants: [
        { size: 'P',   color: 'Preto', colorHex: '#000000', stock: 14 },
        { size: 'M',   color: 'Preto', colorHex: '#000000', stock: 9  },
        { size: 'G',   color: 'Preto', colorHex: '#000000', stock: 4  },
        { size: 'GG',  color: 'Preto', colorHex: '#000000', stock: 2  },
        { size: 'XGG', color: 'Preto', colorHex: '#000000', stock: 0  },
      ],
    },
    {
      slug: 'polo-regiao-norte',
      name: 'Polo Região Norte',
      price: 19900,
      description: 'Polo premium com bordado exclusivo "RN" no peito. Caimento slim, tecido piquet de alta qualidade. Elegância urbana com identidade espiritual.',
      shortDescription: 'Piquet premium — bordado RN no peito',
      category: 'polos' as const,
      images: [] as string[],
      isNew: true,
      isLimited: true,
      tags: ['polo', 'bordado', 'premium', 'drop01'],
      dropId: drop.id,
      variants: [
        { size: 'P',  color: 'Preto', colorHex: '#000000', stock: 8  },
        { size: 'M',  color: 'Preto', colorHex: '#000000', stock: 12 },
        { size: 'G',  color: 'Preto', colorHex: '#000000', stock: 6  },
        { size: 'GG', color: 'Preto', colorHex: '#000000', stock: 3  },
      ],
    },
    {
      slug: 'camiseta-sem-meia-profundidade',
      name: 'Sem Meia Profundidade',
      price: 14900,
      originalPrice: 17900,
      description: '"Sem meia profundidade" — uma declaração de comprometimento total. Camiseta oversized com estampa gráfica de alto impacto nas costas.',
      shortDescription: 'Oversized branca — estampa gráfica impacto total',
      category: 'camisetas' as const,
      images: [] as string[],
      isNew: false,
      isLimited: true,
      tags: ['frase', 'oversized', 'branca', 'drop01'],
      dropId: drop.id,
      variants: [
        { size: 'P',  color: 'Branco', colorHex: '#EAEAEA', stock: 5 },
        { size: 'M',  color: 'Branco', colorHex: '#EAEAEA', stock: 3 },
        { size: 'G',  color: 'Branco', colorHex: '#EAEAEA', stock: 1 },
        { size: 'GG', color: 'Branco', colorHex: '#EAEAEA', stock: 0 },
      ],
    },
    {
      slug: 'polo-marcados-pelo-fogo',
      name: 'Polo Marcados pelo Fogo',
      price: 21900,
      description: 'Polo exclusiva do DROP 01. Bordado "Marcados pelo Fogo" no peito. Caimento slim-fit, piquet premium. Edição extremamente limitada.',
      shortDescription: 'Polo premium limitada — bordado exclusivo DROP 01',
      category: 'polos' as const,
      images: [] as string[],
      isNew: true,
      isLimited: true,
      tags: ['polo', 'limitada', 'fogo', 'drop01'],
      dropId: drop.id,
      variants: [
        { size: 'P',  color: 'Preto', colorHex: '#000000', stock: 3 },
        { size: 'M',  color: 'Preto', colorHex: '#000000', stock: 4 },
        { size: 'G',  color: 'Preto', colorHex: '#000000', stock: 2 },
        { size: 'GG', color: 'Preto', colorHex: '#000000', stock: 0 },
      ],
    },
    {
      slug: 'kit-fogo',
      name: 'Kit Fogo',
      price: 34900,
      originalPrice: 44700,
      description: 'O Kit Fogo é mais do que um conjunto — é um ponto de partida. Camiseta Oversized Chamas + Bíblia NVI Letra Grande + Devocional "Marcados pelo Fogo".',
      shortDescription: 'Camiseta + Bíblia NVI + Devocional — combo completo',
      category: 'kits' as const,
      images: [] as string[],
      isNew: true,
      isLimited: true,
      tags: ['kit', 'biblia', 'devocional', 'drop01', 'upsell'],
      dropId: drop.id,
      variants: [
        { size: 'P',  color: 'Preto', colorHex: '#000000', stock: 10 },
        { size: 'M',  color: 'Preto', colorHex: '#000000', stock: 10 },
        { size: 'G',  color: 'Preto', colorHex: '#000000', stock: 8  },
        { size: 'GG', color: 'Preto', colorHex: '#000000', stock: 4  },
      ],
    },
    // ── Coleção permanente ───────────────────────────────────────────────
    {
      slug: 'camiseta-fe-ativa',
      name: 'Camiseta Fé Ativa',
      price: 12900,
      description: 'Camiseta com gráfico "Fé Ativa" — a fé que move, age e transforma. Modelo regular fit em algodão penteado com estampa tipográfica bold.',
      shortDescription: 'Algodão penteado — tipografia bold exclusiva',
      category: 'camisetas' as const,
      images: [] as string[],
      isNew: false,
      isLimited: false,
      tags: ['fe', 'tipografia', 'regular-fit'],
      variants: [
        { size: 'P',  color: 'Preto', colorHex: '#000000', stock: 20 },
        { size: 'M',  color: 'Preto', colorHex: '#000000', stock: 18 },
        { size: 'G',  color: 'Preto', colorHex: '#000000', stock: 15 },
        { size: 'GG', color: 'Preto', colorHex: '#000000', stock: 10 },
      ],
    },
    {
      slug: 'camiseta-geracao-em-chamas',
      name: 'Geração em Chamas',
      price: 12900,
      description: 'Para quem pertence a uma geração que não recua. Camiseta regular fit com estampa "Uma Geração em Chamas" — identidade e fogo em cada fio.',
      shortDescription: 'Regular fit — identidade de geração',
      category: 'camisetas' as const,
      images: [] as string[],
      isNew: false,
      isLimited: false,
      tags: ['geracao', 'fogo', 'identidade'],
      variants: [
        { size: 'P',  color: 'Preto', colorHex: '#000000', stock: 22 },
        { size: 'M',  color: 'Preto', colorHex: '#000000', stock: 19 },
        { size: 'G',  color: 'Preto', colorHex: '#000000', stock: 13 },
        { size: 'GG', color: 'Preto', colorHex: '#000000', stock: 7  },
      ],
    },
    {
      slug: 'bone-regiao-norte',
      name: 'Boné Região Norte',
      price: 8900,
      description: 'Boné dad hat com bordado "RN" na frente e "Região Norte" na lateral. Ajuste em couro sintético. Preto total — discrição com identidade.',
      shortDescription: 'Dad hat bordado — ajuste couro sintético',
      category: 'acessorios' as const,
      images: [] as string[],
      isNew: false,
      isLimited: false,
      tags: ['bone', 'acessorio', 'bordado'],
      variants: [
        { size: 'Único', color: 'Preto', colorHex: '#000000', stock: 25 },
      ],
    },
    // ── Extras para encher a loja ────────────────────────────────────────
    {
      slug: 'camiseta-palavra-viva',
      name: 'Palavra Viva',
      price: 11900,
      description: 'Camiseta com verso bíblico em tipografia contemporânea. "A palavra de Deus é viva e eficaz" — arte minimalista, impacto máximo. Regular fit em algodão 100%.',
      shortDescription: 'Regular fit — verso tipográfico minimalista',
      category: 'camisetas' as const,
      images: [] as string[],
      isNew: true,
      isLimited: false,
      tags: ['biblia', 'tipografia', 'minimalista'],
      variants: [
        { size: 'P',  color: 'Preto', colorHex: '#000000', stock: 30 },
        { size: 'M',  color: 'Preto', colorHex: '#000000', stock: 28 },
        { size: 'G',  color: 'Preto', colorHex: '#000000', stock: 20 },
        { size: 'GG', color: 'Preto', colorHex: '#000000', stock: 12 },
        { size: 'P',  color: 'Off-White', colorHex: '#EAEAEA', stock: 15 },
        { size: 'M',  color: 'Off-White', colorHex: '#EAEAEA', stock: 12 },
        { size: 'G',  color: 'Off-White', colorHex: '#EAEAEA', stock: 8  },
      ],
    },
    {
      slug: 'camiseta-norte-profundo',
      name: 'Norte Profundo',
      price: 13900,
      description: 'A Amazônia não é só paisagem — é chamado. Estampa oversized "Norte Profundo" com grafismo de raízes amazônicas. 100% algodão penteado, modelagem ampla.',
      shortDescription: 'Oversized — grafismo amazônico exclusivo',
      category: 'camisetas' as const,
      images: [] as string[],
      isNew: true,
      isLimited: false,
      tags: ['amazonia', 'grafismo', 'oversized', 'norte'],
      variants: [
        { size: 'P',  color: 'Preto', colorHex: '#000000', stock: 18 },
        { size: 'M',  color: 'Preto', colorHex: '#000000', stock: 22 },
        { size: 'G',  color: 'Preto', colorHex: '#000000', stock: 16 },
        { size: 'GG', color: 'Preto', colorHex: '#000000', stock: 9  },
        { size: 'XGG', color: 'Preto', colorHex: '#000000', stock: 4 },
      ],
    },
    {
      slug: 'camiseta-avivamento',
      name: 'Avivamento',
      price: 12900,
      description: 'Geração que clama, que ora e que age. Estampa "Avivamento" em lettering artístico na frente. Algodão 100%, regular fit confortável para o dia a dia.',
      shortDescription: 'Regular fit — lettering artístico frente',
      category: 'camisetas' as const,
      images: [] as string[],
      isNew: false,
      isLimited: false,
      tags: ['oracao', 'avivamento', 'lettering'],
      variants: [
        { size: 'P',  color: 'Preto', colorHex: '#000000', stock: 25 },
        { size: 'M',  color: 'Preto', colorHex: '#000000', stock: 25 },
        { size: 'G',  color: 'Preto', colorHex: '#000000', stock: 20 },
        { size: 'GG', color: 'Preto', colorHex: '#000000', stock: 15 },
      ],
    },
    {
      slug: 'camiseta-fogo-interior',
      name: 'Fogo Interior',
      price: 13900,
      description: 'O fogo que transforma vem de dentro. Camiseta cropped para o público feminino com estampa "Fogo Interior" e micro-logo nas costas. Algodão premium, corte moderno.',
      shortDescription: 'Cropped feminino — estampa exclusiva',
      category: 'camisetas' as const,
      images: [] as string[],
      isNew: true,
      isLimited: false,
      tags: ['feminino', 'cropped', 'fogo'],
      variants: [
        { size: 'P',  color: 'Preto', colorHex: '#000000', stock: 20 },
        { size: 'M',  color: 'Preto', colorHex: '#000000', stock: 18 },
        { size: 'G',  color: 'Preto', colorHex: '#000000', stock: 12 },
        { size: 'GG', color: 'Preto', colorHex: '#000000', stock: 6  },
        { size: 'P',  color: 'Off-White', colorHex: '#EAEAEA', stock: 14 },
        { size: 'M',  color: 'Off-White', colorHex: '#EAEAEA', stock: 10 },
        { size: 'G',  color: 'Off-White', colorHex: '#EAEAEA', stock: 6  },
      ],
    },
    {
      slug: 'polo-selva-urbana',
      name: 'Polo Selva Urbana',
      price: 18900,
      description: 'A tensão entre a selva e o asfalto. Polo com bordado "RN" diferenciado no peito e detalhe na manga. Piquet premium, caimento regular. Para quem é de dois mundos.',
      shortDescription: 'Piquet premium — bordado detalhe manga',
      category: 'polos' as const,
      images: [] as string[],
      isNew: false,
      isLimited: false,
      tags: ['polo', 'bordado', 'urbano'],
      variants: [
        { size: 'P',  color: 'Preto', colorHex: '#000000', stock: 15 },
        { size: 'M',  color: 'Preto', colorHex: '#000000', stock: 18 },
        { size: 'G',  color: 'Preto', colorHex: '#000000', stock: 12 },
        { size: 'GG', color: 'Preto', colorHex: '#000000', stock: 7  },
        { size: 'P',  color: 'Off-White', colorHex: '#EAEAEA', stock: 8 },
        { size: 'M',  color: 'Off-White', colorHex: '#EAEAEA', stock: 10 },
        { size: 'G',  color: 'Off-White', colorHex: '#EAEAEA', stock: 5  },
      ],
    },
    {
      slug: 'bone-fogo',
      name: 'Boné Fogo',
      price: 9900,
      description: 'Boné dad hat com bordado de chamas na frente e "Região Norte" na aba. Ajuste metálico dourado. Preto com detalhes laranja fogo.',
      shortDescription: 'Dad hat — bordado chamas com detalhe fogo',
      category: 'acessorios' as const,
      images: [] as string[],
      isNew: true,
      isLimited: false,
      tags: ['bone', 'fogo', 'acessorio'],
      variants: [
        { size: 'Único', color: 'Preto/Fogo', colorHex: '#111111', stock: 30 },
      ],
    },
    {
      slug: 'mochila-regiao-norte',
      name: 'Mochila Região Norte',
      price: 12900,
      description: 'Mochila de nylon reforçado com bordado "RN" na frente. Capacidade 20L, compartimento para notebook 15". Preta total — funcional e com identidade.',
      shortDescription: 'Nylon reforçado 20L — bordado RN',
      category: 'acessorios' as const,
      images: [] as string[],
      isNew: false,
      isLimited: false,
      tags: ['mochila', 'acessorio', 'utilidade'],
      variants: [
        { size: 'Único', color: 'Preto', colorHex: '#000000', stock: 20 },
      ],
    },
    {
      slug: 'kit-discipulo',
      name: 'Kit Discípulo',
      price: 27900,
      originalPrice: 34700,
      description: 'O ponto de partida para quem quer ir fundo. Camiseta Fé Ativa + Bíblia de Estudo NVI + Caneta premium. Para o discipulado do dia a dia.',
      shortDescription: 'Camiseta + Bíblia de Estudo + Caneta — trio do discípulo',
      category: 'kits' as const,
      images: [] as string[],
      isNew: false,
      isLimited: false,
      tags: ['kit', 'biblia', 'discipulado'],
      variants: [
        { size: 'P',  color: 'Preto', colorHex: '#000000', stock: 15 },
        { size: 'M',  color: 'Preto', colorHex: '#000000', stock: 15 },
        { size: 'G',  color: 'Preto', colorHex: '#000000', stock: 12 },
        { size: 'GG', color: 'Preto', colorHex: '#000000', stock: 8  },
      ],
    },
    {
      slug: 'carteira-rn',
      name: 'Carteira RN',
      price: 6900,
      description: 'Carteira slim em couro sintético com logo "RN" em relevo. 8 slots para cartão, compartimento para notas. Preta minimalista — presente ideal.',
      shortDescription: 'Couro sintético slim — logo RN em relevo',
      category: 'acessorios' as const,
      images: [] as string[],
      isNew: false,
      isLimited: false,
      tags: ['carteira', 'acessorio', 'presente'],
      variants: [
        { size: 'Único', color: 'Preto', colorHex: '#000000', stock: 40 },
      ],
    },
  ]

  for (const { variants, dropId, ...data } of productsData) {
    const product = await prisma.product.create({
      data: {
        ...data,
        ...(dropId ? { dropId } : {}),
        variants: { create: variants },
      },
    })
    console.log('✅ Produto:', product.name)
  }

  // ─── Depoimentos ──────────────────────────────────────────────────────────
  const testimonialsData = [
    { name: 'Lucas Ferreira', location: 'Manaus, AM', rating: 5, text: 'Quando vi essa camiseta sabia que era mais do que uma roupa. Uso com orgulho porque representa o que eu sou. Qualidade incrível, entrega rápida.', productName: 'Camiseta Oversized Chamas', avatarInitials: 'LF' },
    { name: 'Ana Clara', location: 'Belém, PA', rating: 5, text: 'A polo é simplesmente perfeita. Bordado impecável, tecido premium. Todo mundo pergunta onde comprei. Orgulho de representar o ministério.', productName: 'Polo Região Norte', avatarInitials: 'AC' },
    { name: 'Rafael Mendes', location: 'Porto Velho, RO', rating: 5, text: 'Comprei o Kit Fogo e foi um presente de Deus. A bíblia é linda, o devocional transformador, e a camiseta é a melhor que já usei. Valeu cada centavo.', productName: 'Kit Fogo', avatarInitials: 'RM' },
    { name: 'Juliana Costa', location: 'Boa Vista, RR', rating: 5, text: '"Sem meia profundidade" é exatamente o que o texto da estampa prega. A Região Norte entende que fé e estilo andam juntos. Top demais.', productName: 'Sem Meia Profundidade', avatarInitials: 'JC' },
    { name: 'Mateus Oliveira', location: 'Macapá, AP', rating: 5, text: 'Já era fã do ministério, mas quando vi a loja não tive dúvidas. Comprei três camisetas de uma vez. Qualidade streetwear mesmo, não é brincadeira.', productName: 'Camiseta Fé Ativa', avatarInitials: 'MO' },
    { name: 'Brenda Santos', location: 'Rio Branco, AC', rating: 5, text: 'Chegou muito bem embalado, antes do prazo. O boné é lindo, discreto mas com identidade. Já estou de olho no Drop 02!', productName: 'Boné Região Norte', avatarInitials: 'BS' },
  ]

  await prisma.testimonial.createMany({ data: testimonialsData })
  console.log('✅ Depoimentos criados:', testimonialsData.length)

  console.log(`\n🔥 Seed concluído! ${productsData.length} produtos, 1 drop, ${testimonialsData.length} depoimentos.`)
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
