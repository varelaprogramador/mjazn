'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { CartItem, CartContextType } from '@/lib/types'
import { clamp } from '@/lib/utils'

const CartContext = createContext<CartContextType | null>(null)

function itemKey(productId: string, size: string, color: string) {
  return `${productId}::${size}::${color}`
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('rn-cart')
      if (stored) setItems(JSON.parse(stored))
    } catch {
      // ignore parse errors
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem('rn-cart', JSON.stringify(items))
    }
  }, [items, hydrated])

  const addItem = useCallback((newItem: CartItem) => {
    setItems((prev) => {
      const key = itemKey(newItem.productId, newItem.size, newItem.color)
      const existing = prev.find(
        (i) => itemKey(i.productId, i.size, i.color) === key
      )
      if (existing) {
        return prev.map((i) =>
          itemKey(i.productId, i.size, i.color) === key
            ? { ...i, quantity: clamp(i.quantity + newItem.quantity, 1, i.stock) }
            : i
        )
      }
      return [...prev, newItem]
    })
    setIsDrawerOpen(true)
  }, [])

  const removeItem = useCallback((productId: string, size: string, color: string) => {
    const key = itemKey(productId, size, color)
    setItems((prev) => prev.filter((i) => itemKey(i.productId, i.size, i.color) !== key))
  }, [])

  const updateQuantity = useCallback(
    (productId: string, size: string, color: string, qty: number) => {
      const key = itemKey(productId, size, color)
      if (qty <= 0) {
        setItems((prev) => prev.filter((i) => itemKey(i.productId, i.size, i.color) !== key))
      } else {
        setItems((prev) =>
          prev.map((i) =>
            itemKey(i.productId, i.size, i.color) === key
              ? { ...i, quantity: clamp(qty, 1, i.stock) }
              : i
          )
        )
      }
    },
    []
  )

  const clearCart = useCallback(() => setItems([]), [])
  const openDrawer = useCallback(() => setIsDrawerOpen(true), [])
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), [])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
