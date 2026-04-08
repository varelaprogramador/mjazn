import type { Drop } from '@/lib/types'

export const drops: Drop[] = [
  {
    id: 'drop_001',
    name: 'DROP 01',
    tagline: 'MARCADOS PELO FOGO',
    description: 'A primeira coleção da Região Norte. Peças limitadas para uma geração que não recua. Quando acabar, acabou.',
    startDate: '2025-04-01T00:00:00Z',
    endDate: '2025-05-01T23:59:59Z',
    productIds: ['prod_001', 'prod_002', 'prod_004', 'prod_006', 'prod_007'],
    stockLimit: 100,
    stockRemaining: 23,
    isActive: true,
  },
]

export function getActiveDrop(): Drop | undefined {
  return drops.find((d) => d.isActive)
}

export function getDropById(id: string): Drop | undefined {
  return drops.find((d) => d.id === id)
}
