import fs from 'fs'
import nodePath from 'path'

function readAsaasKey(): string {
  // Lê o .env.local diretamente para evitar problemas com $ na chave
  try {
    const file = fs.readFileSync(nodePath.resolve(process.cwd(), '.env.local'), 'utf-8')
    for (const line of file.split('\n')) {
      const match = line.match(/^(?:NEXT_PUBLIC_)?ASAAS_API_KEY\s*=\s*['"]?(.+?)['"]?\s*$/)
      if (match?.[1]) return match[1].trim()
    }
  } catch { /* ignora */ }
  throw new Error('ASAAS_API_KEY não encontrada no .env.local')
}

const ASAAS_API_KEY = readAsaasKey()

async function asaasFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const apiKey = ASAAS_API_KEY
  const baseUrl =
    process.env.ASAAS_ENVIRONMENT === 'production'
      ? 'https://api.asaas.com/v3'
      : 'https://sandbox.asaas.com/api/v3'

  if (!apiKey) throw new Error('ASAAS_API_KEY não configurada.')

  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      access_token: apiKey,
      ...options.headers,
    },
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Asaas API error ${res.status}: ${body}`)
  }

  return res.json() as Promise<T>
}

// =============================================
// Types
// =============================================

export type AsaasBillingType = 'PIX' | 'CREDIT_CARD'

export interface AsaasCustomer {
  id: string
  name: string
  email: string
  phone: string
  cpfCnpj: string
}

export interface AsaasPayment {
  id: string
  status: string
  billingType: AsaasBillingType
  value: number
  netValue: number
  dueDate: string
  invoiceUrl: string
}

export interface AsaasPixQrCode {
  encodedImage: string   // base64 da imagem do QR Code
  payload: string        // código copia e cola
  expirationDate: string
}

export interface AsaasCreditCardPaymentResult {
  id: string
  status: 'CONFIRMED' | 'PENDING' | 'REFUSED'
  billingType: 'CREDIT_CARD'
  value: number
  netValue: number
  creditCard: {
    creditCardBrand: string
    creditCardNumber: string
  }
}

export interface CreateCustomerInput {
  name: string
  email: string
  phone: string
  cpfCnpj: string
  postalCode: string
  address: string
  addressNumber: string
  complement?: string
  province: string  // bairro
  city: string
  state: string
}

export interface CreatePixPaymentInput {
  customer: string      // Asaas customer id
  value: number         // em reais (float)
  dueDate: string       // YYYY-MM-DD
  description: string
  externalReference?: string  // nosso order id
}

export interface CreateCreditCardPaymentInput {
  customer: string
  value: number
  dueDate: string
  description: string
  externalReference?: string
  installmentCount?: number
  creditCard: {
    holderName: string
    number: string
    expiryMonth: string
    expiryYear: string
    ccv: string
  }
  creditCardHolderInfo: {
    name: string
    email: string
    cpfCnpj: string
    postalCode: string
    addressNumber: string
    phone: string
  }
  remoteIp: string
}

// =============================================
// Customers
// =============================================

export async function findOrCreateCustomer(
  input: CreateCustomerInput
): Promise<AsaasCustomer> {
  // Busca cliente existente pelo CPF/CNPJ
  const search = await asaasFetch<{ data: AsaasCustomer[] }>(
    `/customers?cpfCnpj=${input.cpfCnpj.replace(/\D/g, '')}`
  )

  if (search.data.length > 0) {
    return search.data[0]
  }

  return asaasFetch<AsaasCustomer>('/customers', {
    method: 'POST',
    body: JSON.stringify({
      name: input.name,
      email: input.email,
      phone: input.phone.replace(/\D/g, ''),
      cpfCnpj: input.cpfCnpj.replace(/\D/g, ''),
      postalCode: input.postalCode.replace(/\D/g, ''),
      address: input.address,
      addressNumber: input.addressNumber,
      complement: input.complement,
      province: input.province,
      city: input.city,
      state: input.state,
    }),
  })
}

// =============================================
// PIX
// =============================================

export async function createPixPayment(
  input: CreatePixPaymentInput
): Promise<AsaasPayment> {
  return asaasFetch<AsaasPayment>('/payments', {
    method: 'POST',
    body: JSON.stringify({
      customer: input.customer,
      billingType: 'PIX',
      value: input.value,
      dueDate: input.dueDate,
      description: input.description,
      externalReference: input.externalReference,
    }),
  })
}

export async function getPixQrCode(paymentId: string): Promise<AsaasPixQrCode> {
  return asaasFetch<AsaasPixQrCode>(`/payments/${paymentId}/pixQrCode`)
}

// =============================================
// Cartão de crédito
// =============================================

export async function createCreditCardPayment(
  input: CreateCreditCardPaymentInput
): Promise<AsaasCreditCardPaymentResult> {
  return asaasFetch<AsaasCreditCardPaymentResult>('/payments', {
    method: 'POST',
    body: JSON.stringify({
      customer: input.customer,
      billingType: 'CREDIT_CARD',
      dueDate: input.dueDate,
      description: input.description,
      externalReference: input.externalReference,
      ...(input.installmentCount && input.installmentCount > 1
        ? {
            installmentCount: input.installmentCount,
            installmentValue: parseFloat((input.value / input.installmentCount).toFixed(2)),
          }
        : { value: input.value }),
      creditCard: input.creditCard,
      creditCardHolderInfo: {
        name: input.creditCardHolderInfo.name,
        email: input.creditCardHolderInfo.email,
        cpfCnpj: input.creditCardHolderInfo.cpfCnpj.replace(/\D/g, ''),
        postalCode: input.creditCardHolderInfo.postalCode.replace(/\D/g, ''),
        addressNumber: input.creditCardHolderInfo.addressNumber,
        phone: input.creditCardHolderInfo.phone.replace(/\D/g, ''),
      },
      remoteIp: input.remoteIp,
    }),
  })
}

// =============================================
// Utilitários
// =============================================

export function centsToReais(cents: number): number {
  return parseFloat((cents / 100).toFixed(2))
}

export function todayPlusDays(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}
