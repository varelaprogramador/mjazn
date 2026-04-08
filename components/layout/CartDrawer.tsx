'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems, isDrawerOpen, closeDrawer } =
    useCart()

  return (
    <>
      {/* Backdrop */}
      <div
        className={[
          'fixed inset-0 bg-black/70 z-50 transition-opacity duration-300',
          isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={[
          'fixed top-0 right-0 h-full w-full max-w-md bg-dark-mid z-50',
          'flex flex-col shadow-2xl',
          'transform transition-transform duration-300 ease-in-out',
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
        aria-label="Carrinho"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-border">
          <div>
            <p className="font-display text-lg tracking-wider">Carrinho</p>
            {totalItems > 0 && (
              <p className="text-[11px] text-gray-muted">{totalItems} {totalItems === 1 ? 'item' : 'itens'}</p>
            )}
          </div>
          <button
            onClick={closeDrawer}
            className="text-gray-muted hover:text-off-white transition-colors p-1"
            aria-label="Fechar carrinho"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="text-6xl opacity-20">🔥</div>
              <p className="font-display text-lg text-gray-muted">Carrinho vazio</p>
              <p className="text-xs text-gray-dim">Explore nossa coleção e represente.</p>
              <button
                onClick={closeDrawer}
                className="mt-2 text-xs font-display tracking-widest text-fire hover:text-fire-light transition-colors"
              >
                Ver Coleção →
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.productId}-${item.size}-${item.color}`}
                className="flex gap-3 pb-4 border-b border-gray-border last:border-0"
              >
                {/* Image Placeholder */}
                <div className="w-16 h-20 bg-dark flex-shrink-0 flex items-center justify-center">
                  <span className="text-[10px] text-gray-dim font-display">RN</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-off-white truncate">{item.name}</p>
                  <p className="text-[11px] text-gray-muted mt-0.5">
                    {item.size} · {item.color}
                  </p>
                  <p className="text-sm text-fire font-display mt-1">{formatPrice(item.price)}</p>

                  {/* Quantity */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                      className="w-6 h-6 border border-gray-border text-off-white hover:border-fire hover:text-fire transition-colors flex items-center justify-center text-sm"
                      aria-label="Diminuir quantidade"
                    >
                      −
                    </button>
                    <span className="text-xs text-off-white w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                      className="w-6 h-6 border border-gray-border text-off-white hover:border-fire hover:text-fire transition-colors flex items-center justify-center text-sm"
                      aria-label="Aumentar quantidade"
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.productId, item.size, item.color)}
                  className="text-gray-dim hover:text-fire transition-colors self-start mt-0.5"
                  aria-label="Remover item"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4h6v2" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-5 border-t border-gray-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-muted">Subtotal</span>
              <span className="font-display text-lg text-off-white">{formatPrice(totalPrice)}</span>
            </div>
            <p className="text-[10px] text-gray-dim">Frete calculado no checkout</p>
            <Link
              href="/checkout"
              onClick={closeDrawer}
              className="block w-full h-12 bg-fire text-black font-display tracking-widest text-sm flex items-center justify-center hover:bg-fire-light transition-colors duration-200"
            >
              Finalizar Pedido
            </Link>
            <button
              onClick={closeDrawer}
              className="block w-full text-center text-xs font-display tracking-widest text-gray-muted hover:text-off-white transition-colors"
            >
              Continuar Comprando
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
