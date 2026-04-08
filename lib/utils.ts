import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100)
}

export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getTotalStock(variants: { stock: number }[]): number {
  return variants.reduce((sum, v) => sum + v.stock, 0)
}

export function isLowStock(stock: number): boolean {
  return stock > 0 && stock <= 5
}

export function getStockLabel(stock: number): string {
  if (stock === 0) return 'Esgotado'
  if (stock <= 3) return `Apenas ${stock} restante${stock === 1 ? '' : 's'}`
  if (stock <= 5) return `Últimas ${stock} peças`
  return ''
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
