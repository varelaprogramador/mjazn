'use client'

import type { AsaasPixQrCode } from '@/lib/asaas'

export default function PixDisplay({ pix }: { pix: AsaasPixQrCode }) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(pix.payload)
      alert('Código PIX copiado!')
    } catch { /* ignore */ }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {pix.encodedImage && (
          <div className="bg-white p-3 flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`data:image/png;base64,${pix.encodedImage}`}
              alt="QR Code PIX"
              className="w-36 h-36"
            />
          </div>
        )}
        <div className="flex-1 space-y-3 w-full">
          <p className="text-[10px] font-display tracking-widest text-gray-muted">COPIA E COLA</p>
          <div className="flex items-center gap-2 bg-black border border-gray-border p-3">
            <p className="text-xs text-off-white truncate flex-1 font-mono">{pix.payload}</p>
            <button
              onClick={copy}
              className="text-[9px] font-display tracking-widest text-fire border border-fire px-3 py-1.5 hover:bg-fire hover:text-black transition-colors whitespace-nowrap"
            >
              COPIAR
            </button>
          </div>
          {pix.expirationDate && (
            <p className="text-[10px] text-gray-muted">
              Expira: {new Date(pix.expirationDate).toLocaleString('pt-BR')}
            </p>
          )}
        </div>
      </div>
      <div className="bg-fire/5 border border-fire/20 p-3">
        <p className="text-[10px] text-fire">Escaneie o QR Code ou cole o código no seu app bancário para confirmar o pagamento.</p>
      </div>
    </div>
  )
}
