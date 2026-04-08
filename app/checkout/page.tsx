export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <p className="text-[10px] font-display tracking-[0.5em] text-fire mb-4">FINALIZAR</p>
        <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-none text-off-white mb-10">
          Seu Pedido
        </h1>

        <div className="border border-gray-border bg-dark p-8 text-center space-y-4">
          <div className="text-5xl mb-4">🔥</div>
          <p className="font-display text-lg text-off-white">Checkout em breve</p>
          <p className="text-sm text-gray-muted max-w-sm mx-auto leading-relaxed">
            Integração com Mercado Pago em desenvolvimento.
            Entre em contato pelo WhatsApp para finalizar seu pedido agora.
          </p>
          <a
            href="https://wa.me/5592000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-12 px-8 bg-fire text-black font-display tracking-widest text-sm hover:bg-fire-light transition-colors duration-200 mt-4"
          >
            Finalizar pelo WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
