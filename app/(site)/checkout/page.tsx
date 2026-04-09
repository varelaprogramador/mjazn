'use client'

import { useState, useTransition } from 'react'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'
import { checkoutAction, type CheckoutResult } from '@/app/actions/checkout'
import { useRouter } from 'next/navigation'

type PaymentMethod = 'PIX' | 'CREDIT_CARD'
type Step = 'dados' | 'pagamento' | 'processando'

interface FormState {
  name: string
  email: string
  phone: string
  cpf: string
  zipCode: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
  cardHolder: string
  cardNumber: string
  cardExpiry: string
  cardCvv: string
  installments: string
}

const EMPTY: FormState = {
  name: '', email: '', phone: '', cpf: '',
  zipCode: '', street: '', number: '', complement: '',
  neighborhood: '', city: '', state: '',
  cardHolder: '', cardNumber: '', cardExpiry: '', cardCvv: '', installments: '1',
}

function formatCpf(v: string) {
  return v.replace(/\D/g, '').slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

function formatPhone(v: string) {
  return v.replace(/\D/g, '').slice(0, 11)
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
}

function formatZip(v: string) {
  return v.replace(/\D/g, '').slice(0, 8)
    .replace(/(\d{5})(\d)/, '$1-$2')
}

function formatCard(v: string) {
  return v.replace(/\D/g, '').slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ')
}

function formatExpiry(v: string) {
  return v.replace(/\D/g, '').slice(0, 4)
    .replace(/(\d{2})(\d)/, '$1/$2')
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [step, setStep] = useState<Step>('dados')
  const [method, setMethod] = useState<PaymentMethod>('PIX')
  const [form, setForm] = useState<FormState>(EMPTY)
  const [error, setError] = useState<string | null>(null)

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let v = e.target.value
    if (k === 'cpf') v = formatCpf(v)
    else if (k === 'phone') v = formatPhone(v)
    else if (k === 'zipCode') v = formatZip(v)
    else if (k === 'cardNumber') v = formatCard(v)
    else if (k === 'cardExpiry') v = formatExpiry(v)
    setForm((prev) => ({ ...prev, [k]: v }))
  }

  async function fetchAddress(zip: string) {
    const clean = zip.replace(/\D/g, '')
    if (clean.length !== 8) return
    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`)
      const data = await res.json()
      if (data.erro) return
      setForm((prev) => ({
        ...prev,
        street: data.logradouro ?? prev.street,
        neighborhood: data.bairro ?? prev.neighborhood,
        city: data.localidade ?? prev.city,
        state: data.uf ?? prev.state,
      }))
    } catch { /* ignora */ }
  }

  function validateDados() {
    if (!form.name.trim()) return 'Nome obrigatório.'
    if (!form.email.includes('@')) return 'E-mail inválido.'
    if (form.phone.replace(/\D/g, '').length < 10) return 'Telefone inválido.'
    if (form.cpf.replace(/\D/g, '').length !== 11) return 'CPF inválido.'
    if (form.zipCode.replace(/\D/g, '').length !== 8) return 'CEP inválido.'
    if (!form.street.trim()) return 'Rua obrigatória.'
    if (!form.number.trim()) return 'Número obrigatório.'
    if (!form.neighborhood.trim()) return 'Bairro obrigatório.'
    if (!form.city.trim()) return 'Cidade obrigatória.'
    if (!form.state.trim()) return 'Estado obrigatório.'
    return null
  }

  function validateCard() {
    if (!form.cardHolder.trim()) return 'Nome no cartão obrigatório.'
    if (form.cardNumber.replace(/\s/g, '').length < 13) return 'Número do cartão inválido.'
    if (form.cardExpiry.length !== 5) return 'Validade inválida (MM/AA).'
    if (form.cardCvv.length < 3) return 'CVV inválido.'
    return null
  }

  function handleNextStep() {
    const err = validateDados()
    if (err) { setError(err); return }
    setError(null)
    setStep('pagamento')
  }

  function handleSubmit() {
    if (method === 'CREDIT_CARD') {
      const err = validateCard()
      if (err) { setError(err); return }
    }
    setError(null)
    setStep('processando')

    startTransition(async () => {
      const [expMonth, expYear] = form.cardExpiry.split('/')

      const base = {
        customerName: form.name,
        customerEmail: form.email,
        customerPhone: form.phone,
        customerCpf: form.cpf,
        street: form.street,
        number: form.number,
        complement: form.complement || undefined,
        neighborhood: form.neighborhood,
        city: form.city,
        state: form.state,
        zipCode: form.zipCode,
        totalPrice,
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          size: i.size,
          color: i.color,
          quantity: i.quantity,
          price: i.price,
        })),
      }

      const input =
        method === 'PIX'
          ? { ...base, paymentMethod: 'PIX' as const }
          : {
              ...base,
              paymentMethod: 'CREDIT_CARD' as const,
              installments: parseInt(form.installments),
              card: {
                holderName: form.cardHolder,
                number: form.cardNumber,
                expiryMonth: expMonth,
                expiryYear: `20${expYear}`,
                ccv: form.cardCvv,
              },
            }

      const result: CheckoutResult = await checkoutAction(input)

      if (!result.success) {
        setError(result.error)
        setStep('pagamento')
        return
      }

      clearCart()

      if (result.paymentMethod === 'PIX') {
        const params = new URLSearchParams({
          orderId: result.orderId,
          method: 'PIX',
          pixPayload: result.pix.payload,
          pixImage: result.pix.encodedImage,
          pixExpiry: result.pix.expirationDate,
        })
        router.push(`/checkout/confirmacao?${params.toString()}`)
      } else {
        const params = new URLSearchParams({
          orderId: result.orderId,
          method: 'CREDIT_CARD',
          status: result.status,
          cardBrand: result.cardBrand,
        })
        router.push(`/checkout/confirmacao?${params.toString()}`)
      }
    })
  }

  if (items.length === 0 && step !== 'processando') {
    return (
      <div className="min-h-screen bg-black pt-16 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="font-display text-lg text-off-white">Carrinho vazio.</p>
          <a href="/loja" className="text-fire text-sm underline">Voltar à loja</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <p className="text-[10px] font-display tracking-[0.5em] text-fire mb-4">FINALIZAR</p>
        <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-none text-off-white mb-10">
          Seu Pedido
        </h1>

        {/* Indicador de etapas */}
        <div className="flex items-center gap-2 mb-10 text-xs font-display tracking-widest">
          <span className={step === 'dados' ? 'text-fire' : 'text-gray-muted'}>DADOS</span>
          <span className="text-gray-border">—</span>
          <span className={step === 'pagamento' || step === 'processando' ? 'text-fire' : 'text-gray-muted'}>PAGAMENTO</span>
          <span className="text-gray-border">—</span>
          <span className={step === 'processando' ? 'text-fire' : 'text-gray-muted'}>PROCESSANDO</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna principal */}
          <div className="lg:col-span-2 space-y-6">

            {/* ETAPA 1 — Dados pessoais e endereço */}
            {step === 'dados' && (
              <>
                <Section title="Dados pessoais">
                  <Field label="Nome completo">
                    <Input value={form.name} onChange={set('name')} placeholder="Seu nome" />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="E-mail">
                      <Input value={form.email} onChange={set('email')} placeholder="email@exemplo.com" type="email" />
                    </Field>
                    <Field label="Telefone / WhatsApp">
                      <Input value={form.phone} onChange={set('phone')} placeholder="(92) 99999-9999" />
                    </Field>
                  </div>
                  <Field label="CPF">
                    <Input value={form.cpf} onChange={set('cpf')} placeholder="000.000.000-00" />
                  </Field>
                </Section>

                <Section title="Endereço de entrega">
                  <Field label="CEP">
                    <Input
                      value={form.zipCode}
                      onChange={set('zipCode')}
                      placeholder="69000-000"
                      onBlur={() => fetchAddress(form.zipCode)}
                    />
                  </Field>
                  <Field label="Rua / Avenida">
                    <Input value={form.street} onChange={set('street')} placeholder="Rua das Flores" />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Número">
                      <Input value={form.number} onChange={set('number')} placeholder="123" />
                    </Field>
                    <Field label="Complemento">
                      <Input value={form.complement} onChange={set('complement')} placeholder="Apto 4 (opcional)" />
                    </Field>
                  </div>
                  <Field label="Bairro">
                    <Input value={form.neighborhood} onChange={set('neighborhood')} placeholder="Centro" />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Cidade">
                      <Input value={form.city} onChange={set('city')} placeholder="Manaus" />
                    </Field>
                    <Field label="Estado (UF)">
                      <Input value={form.state} onChange={set('state')} placeholder="AM" maxLength={2} />
                    </Field>
                  </div>
                </Section>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                  onClick={handleNextStep}
                  className="w-full h-14 bg-fire text-black font-display tracking-widest text-sm hover:bg-fire-light transition-colors duration-200"
                >
                  CONTINUAR PARA PAGAMENTO
                </button>
              </>
            )}

            {/* ETAPA 2 — Pagamento */}
            {step === 'pagamento' && (
              <>
                <Section title="Forma de pagamento">
                  <div className="grid grid-cols-2 gap-3">
                    <MethodButton
                      active={method === 'PIX'}
                      onClick={() => setMethod('PIX')}
                      label="PIX"
                      sub="Aprovação imediata"
                    />
                    <MethodButton
                      active={method === 'CREDIT_CARD'}
                      onClick={() => setMethod('CREDIT_CARD')}
                      label="Cartão de crédito"
                      sub="Até 12x"
                    />
                  </div>

                  {method === 'PIX' && (
                    <div className="mt-4 border border-gray-border bg-black p-4 space-y-2">
                      <p className="text-sm text-off-white font-display">Como funciona:</p>
                      <ol className="text-xs text-gray-muted space-y-1 list-decimal list-inside">
                        <li>Clique em &quot;Finalizar pedido&quot;</li>
                        <li>Um QR Code PIX será gerado na próxima tela</li>
                        <li>Escaneie com o app do seu banco</li>
                        <li>Confirmação em até 1 minuto</li>
                      </ol>
                    </div>
                  )}

                  {method === 'CREDIT_CARD' && (
                    <div className="mt-4 space-y-4">
                      <Field label="Nome no cartão">
                        <Input value={form.cardHolder} onChange={set('cardHolder')} placeholder="Como aparece no cartão" />
                      </Field>
                      <Field label="Número do cartão">
                        <Input value={form.cardNumber} onChange={set('cardNumber')} placeholder="0000 0000 0000 0000" />
                      </Field>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Validade (MM/AA)">
                          <Input value={form.cardExpiry} onChange={set('cardExpiry')} placeholder="12/29" maxLength={5} />
                        </Field>
                        <Field label="CVV">
                          <Input value={form.cardCvv} onChange={set('cardCvv')} placeholder="123" maxLength={4} />
                        </Field>
                      </div>
                      <Field label="Parcelas">
                        <select
                          value={form.installments}
                          onChange={set('installments')}
                          className="w-full h-12 bg-black border border-gray-border text-off-white px-4 text-sm focus:outline-none focus:border-fire"
                        >
                          {[1,2,3,4,5,6,7,8,9,10,11,12].map((n) => (
                            <option key={n} value={n}>
                              {n}x de {formatPrice(Math.ceil(totalPrice / n))}{n === 1 ? ' (sem juros)' : ''}
                            </option>
                          ))}
                        </select>
                      </Field>
                    </div>
                  )}
                </Section>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="flex gap-3">
                  <button
                    onClick={() => { setStep('dados'); setError(null) }}
                    className="h-14 px-6 border border-gray-border text-gray-muted font-display tracking-widest text-xs hover:border-off-white hover:text-off-white transition-colors"
                  >
                    VOLTAR
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isPending}
                    className="flex-1 h-14 bg-fire text-black font-display tracking-widest text-sm hover:bg-fire-light transition-colors duration-200 disabled:opacity-60"
                  >
                    FINALIZAR PEDIDO
                  </button>
                </div>
              </>
            )}

            {/* ETAPA 3 — Processando */}
            {step === 'processando' && (
              <div className="border border-gray-border bg-dark p-10 text-center space-y-4">
                <div className="w-10 h-10 border-2 border-fire border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="font-display text-off-white tracking-widest">PROCESSANDO PAGAMENTO</p>
                <p className="text-sm text-gray-muted">Aguarde, não feche essa página.</p>
              </div>
            )}
          </div>

          {/* Resumo lateral */}
          <div className="space-y-4">
            <div className="border border-gray-border bg-dark p-6 space-y-4">
              <p className="font-display text-xs tracking-widest text-gray-muted">RESUMO</p>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.size}-${item.color}`} className="flex justify-between">
                    <div>
                      <p className="font-display text-xs text-off-white">{item.name}</p>
                      <p className="text-gray-muted text-[10px] mt-0.5">{item.size} · {item.color} · {item.quantity}x</p>
                    </div>
                    <p className="text-off-white text-xs font-display">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-border pt-4 flex justify-between">
                <p className="font-display text-xs tracking-widest text-gray-muted">TOTAL</p>
                <p className="font-display text-fire">{formatPrice(totalPrice)}</p>
              </div>
            </div>
            <p className="text-[10px] text-gray-muted leading-relaxed">
              Pagamento processado com segurança pelo Asaas. Seus dados não são armazenados em nossos servidores.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// =============================================
// Componentes locais
// =============================================

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-gray-border bg-dark p-6 space-y-4">
      <p className="font-display text-xs tracking-widest text-gray-muted">{title.toUpperCase()}</p>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-display tracking-widest text-gray-muted">{label.toUpperCase()}</label>
      {children}
    </div>
  )
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full h-12 bg-black border border-gray-border text-off-white px-4 text-sm focus:outline-none focus:border-fire transition-colors placeholder:text-gray-border"
    />
  )
}

function MethodButton({ active, onClick, label, sub }: {
  active: boolean; onClick: () => void; label: string; sub: string
}) {
  return (
    <button
      onClick={onClick}
      className={`border p-4 text-left transition-colors ${
        active ? 'border-fire bg-fire/5' : 'border-gray-border hover:border-gray-muted'
      }`}
    >
      <p className={`font-display text-sm tracking-wide ${active ? 'text-fire' : 'text-off-white'}`}>{label}</p>
      <p className="text-[10px] text-gray-muted mt-0.5">{sub}</p>
    </button>
  )
}
