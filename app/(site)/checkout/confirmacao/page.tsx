'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'

function ConfirmacaoContent() {
  const params = useSearchParams()

  const orderId = params.get('orderId') ?? ''
  const method = params.get('method') ?? 'PIX'
  const pixPayload = params.get('pixPayload') ?? ''
  const pixImage = params.get('pixImage') ?? ''
  const pixExpiry = params.get('pixExpiry') ?? ''
  const cardStatus = params.get('status') ?? ''
  const cardBrand = params.get('cardBrand') ?? ''

  const shortId = orderId.slice(-8).toUpperCase()

  async function copyPix() {
    try {
      await navigator.clipboard.writeText(pixPayload)
      alert('Código PIX copiado!')
    } catch {
      /* ignora em ambientes sem clipboard */
    }
  }

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div>
          <p className="text-[10px] font-display tracking-[0.5em] text-fire mb-4">PEDIDO REALIZADO</p>
          <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-none text-off-white">
            {method === 'PIX' ? 'Agora pague pelo PIX' : cardStatus === 'CONFIRMED' ? 'Pagamento aprovado!' : 'Pagamento pendente'}
          </h1>
          <p className="text-gray-muted text-sm mt-3">
            Pedido <span className="text-off-white font-display">#{shortId}</span>
          </p>
        </div>

        {/* PIX */}
        {method === 'PIX' && (
          <div className="border border-gray-border bg-dark p-6 space-y-6">
            <div className="text-center space-y-4">
              {pixImage && (
                <div className="inline-block bg-white p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`data:image/png;base64,${pixImage}`}
                    alt="QR Code PIX"
                    className="w-48 h-48 mx-auto"
                  />
                </div>
              )}
              <div>
                <p className="text-xs text-gray-muted font-display tracking-widest mb-1">OU COPIE O CÓDIGO</p>
                <div className="flex items-center gap-2 bg-black border border-gray-border p-3">
                  <p className="text-xs text-off-white truncate flex-1 font-mono">{pixPayload}</p>
                  <button
                    onClick={copyPix}
                    className="text-[10px] font-display tracking-widest text-fire border border-fire px-3 py-1.5 hover:bg-fire hover:text-black transition-colors whitespace-nowrap"
                  >
                    COPIAR
                  </button>
                </div>
              </div>
              {pixExpiry && (
                <p className="text-[10px] text-gray-muted">
                  Expira em: {new Date(pixExpiry).toLocaleString('pt-BR')}
                </p>
              )}
            </div>

            <div className="border-t border-gray-border pt-4 space-y-2">
              <p className="text-xs text-gray-muted font-display tracking-widest">COMO PAGAR:</p>
              <ol className="text-sm text-off-white space-y-1 list-decimal list-inside">
                <li>Abra o app do seu banco</li>
                <li>Vá em PIX &rarr; Pagar com QR Code ou Copia e Cola</li>
                <li>Escaneie o QR Code ou cole o código acima</li>
                <li>Confirme o pagamento de <strong>{params.get('total') ?? 'o valor do pedido'}</strong></li>
              </ol>
            </div>

            <div className="bg-fire/10 border border-fire/30 p-4">
              <p className="text-xs text-fire font-display tracking-widest mb-1">IMPORTANTE</p>
              <p className="text-xs text-off-white leading-relaxed">
                Seu pedido será confirmado automaticamente assim que o pagamento for identificado. Você receberá uma confirmação por e-mail.
              </p>
            </div>
          </div>
        )}

        {/* Cartão */}
        {method === 'CREDIT_CARD' && (
          <div className="border border-gray-border bg-dark p-6 space-y-4">
            {cardStatus === 'CONFIRMED' && (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 border border-green-500/50 flex items-center justify-center">
                    <span className="text-green-400 text-lg">✓</span>
                  </div>
                  <div>
                    <p className="font-display text-off-white">Pagamento aprovado</p>
                    {cardBrand && (
                      <p className="text-xs text-gray-muted">{cardBrand}</p>
                    )}
                  </div>
                </div>
                <p className="text-sm text-off-white leading-relaxed">
                  Seu pedido foi confirmado e está sendo preparado. Você receberá atualizações por e-mail.
                </p>
              </>
            )}

            {cardStatus === 'PENDING' && (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500/20 border border-yellow-500/50 flex items-center justify-center">
                    <span className="text-yellow-400 text-lg">⏳</span>
                  </div>
                  <div>
                    <p className="font-display text-off-white">Pagamento em análise</p>
                    <p className="text-xs text-gray-muted">Aguardando confirmação da operadora</p>
                  </div>
                </div>
                <p className="text-sm text-off-white leading-relaxed">
                  Seu pagamento está sendo analisado pela operadora. Em geral, a confirmação ocorre em alguns minutos. Você receberá um e-mail quando for aprovado.
                </p>
              </>
            )}

            {cardStatus === 'REFUSED' && (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500/20 border border-red-500/50 flex items-center justify-center">
                    <span className="text-red-400 text-lg">✕</span>
                  </div>
                  <div>
                    <p className="font-display text-off-white">Pagamento recusado</p>
                    <p className="text-xs text-gray-muted">Verifique os dados e tente novamente</p>
                  </div>
                </div>
                <p className="text-sm text-off-white leading-relaxed">
                  Seu cartão foi recusado pela operadora. Verifique os dados, limite disponível ou tente outro cartão.
                </p>
                <Link
                  href="/checkout"
                  className="inline-flex items-center justify-center h-12 px-8 bg-fire text-black font-display tracking-widest text-sm hover:bg-fire-light transition-colors"
                >
                  TENTAR NOVAMENTE
                </Link>
              </>
            )}
          </div>
        )}

        {/* Rodapé */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="flex-1 h-12 border border-gray-border text-gray-muted font-display tracking-widest text-xs flex items-center justify-center hover:border-off-white hover:text-off-white transition-colors"
          >
            VOLTAR AO INÍCIO
          </Link>
          <Link
            href="/loja"
            className="flex-1 h-12 border border-fire text-fire font-display tracking-widest text-xs flex items-center justify-center hover:bg-fire hover:text-black transition-colors"
          >
            CONTINUAR COMPRANDO
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ConfirmacaoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-fire border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ConfirmacaoContent />
    </Suspense>
  )
}
