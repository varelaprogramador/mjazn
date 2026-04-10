// =============================================
// Paleta de cores da marca
// =============================================
const C = {
  bg: '#0a0a0a',
  bgCard: '#111110',
  border: '#2a2825',
  fire: '#e63329',
  fireDim: '#b82921',
  offWhite: '#f5f0eb',
  muted: '#8a8580',
  dim: '#4a4845',
  black: '#000000',
}

// =============================================
// Layout base compartilhado
// =============================================
function layout(content: string, previewText = '') {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MJAZN</title>
</head>
<body style="margin:0;padding:0;background-color:${C.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  ${previewText ? `<div style="display:none;max-height:0;overflow:hidden;">${previewText}</div>` : ''}
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${C.bg};padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">

          <!-- Header logo -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <div style="letter-spacing:0.5em;font-size:22px;font-weight:700;color:${C.offWhite};text-transform:uppercase;">MJAZN</div>
              <div style="letter-spacing:0.4em;font-size:9px;color:${C.fire};margin-top:4px;">COLEÇÃO REGIÃO NORTE</div>
            </td>
          </tr>

          <!-- Card content -->
          <tr>
            <td style="background-color:${C.bgCard};border:1px solid ${C.border};padding:40px 36px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:32px;padding-bottom:40px;">
              <p style="margin:0;font-size:11px;color:${C.dim};letter-spacing:0.1em;">
                MJAZN · Moda Streetwear Cristã
              </p>
              <p style="margin:8px 0 0;font-size:10px;color:${C.dim};">
                Este e-mail foi enviado automaticamente, por favor não responda.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// =============================================
// Helpers
// =============================================
function badge(text: string, color = C.fire) {
  return `<span style="display:inline-block;background-color:${color}20;border:1px solid ${color}50;color:${color};font-size:9px;letter-spacing:0.4em;padding:3px 10px;">${text}</span>`
}

function divider() {
  return `<div style="border-top:1px solid ${C.border};margin:28px 0;"></div>`
}

function button(text: string, url: string) {
  return `<a href="${url}" style="display:inline-block;background-color:${C.fire};color:#000;font-size:12px;letter-spacing:0.3em;text-decoration:none;padding:14px 36px;font-weight:700;">${text}</a>`
}

// =============================================
// Template: Confirmação de Pedido
// =============================================
export interface OrderConfirmationData {
  orderId: string
  customerName: string
  customerEmail: string
  paymentMethod: 'PIX' | 'CREDIT_CARD'
  totalPrice: number // centavos
  items: Array<{ name: string; size: string; color: string; quantity: number; price: number }>
  pixPayload?: string
  cardBrand?: string
  installments?: number
  appUrl: string
}

export function orderConfirmationEmail(data: OrderConfirmationData): string {
  const total = (data.totalPrice / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  const itemsHtml = data.items.map(item => {
    const itemTotal = ((item.price * item.quantity) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    return `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid ${C.border};">
        <div style="font-size:13px;color:${C.offWhite};font-weight:600;">${item.name}</div>
        <div style="font-size:11px;color:${C.muted};margin-top:3px;">Tam: ${item.size} · Cor: ${item.color} · Qtd: ${item.quantity}</div>
      </td>
      <td align="right" style="padding:12px 0;border-bottom:1px solid ${C.border};font-size:13px;color:${C.offWhite};">
        ${itemTotal}
      </td>
    </tr>`
  }).join('')

  const paymentSection = data.paymentMethod === 'PIX' ? `
    <div style="background-color:#000;border:1px solid ${C.border};padding:20px;margin-top:8px;">
      <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.3em;color:${C.fire};">CÓDIGO PIX COPIA E COLA</p>
      <p style="margin:0;font-size:11px;color:${C.muted};word-break:break-all;font-family:monospace;">${data.pixPayload ?? ''}</p>
      <p style="margin:16px 0 0;font-size:11px;color:${C.muted};">O pedido será confirmado automaticamente após o pagamento.</p>
    </div>
  ` : `
    <p style="margin:8px 0 0;font-size:13px;color:${C.offWhite};">
      ${data.cardBrand ?? 'Cartão'}${data.installments && data.installments > 1 ? ` · ${data.installments}x` : ' · À vista'}
    </p>
    <p style="margin:8px 0 0;font-size:12px;color:${C.muted};">Pagamento aprovado. Seu pedido já está sendo processado!</p>
  `

  const content = `
    <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.4em;color:${C.fire};">PEDIDO RECEBIDO</p>
    <h1 style="margin:0 0 24px;font-size:22px;color:${C.offWhite};font-weight:700;">Obrigado, ${data.customerName.split(' ')[0]}!</h1>

    <p style="margin:0 0 24px;font-size:14px;color:${C.muted};line-height:1.6;">
      Recebemos seu pedido e já estamos cuidando de tudo. Você receberá outra notificação assim que o pagamento for confirmado.
    </p>

    <div style="background-color:#000;border:1px solid ${C.border};padding:14px 18px;margin-bottom:28px;">
      <span style="font-size:10px;letter-spacing:0.3em;color:${C.muted};">Nº DO PEDIDO · </span>
      <span style="font-size:12px;color:${C.offWhite};font-family:monospace;">${data.orderId}</span>
    </div>

    ${divider()}

    <p style="margin:0 0 12px;font-size:10px;letter-spacing:0.3em;color:${C.muted};">ITENS DO PEDIDO</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      ${itemsHtml}
      <tr>
        <td style="padding-top:16px;font-size:12px;color:${C.muted};letter-spacing:0.2em;">TOTAL</td>
        <td align="right" style="padding-top:16px;font-size:18px;color:${C.fire};font-weight:700;">${total}</td>
      </tr>
    </table>

    ${divider()}

    <p style="margin:0 0 12px;font-size:10px;letter-spacing:0.3em;color:${C.muted};">PAGAMENTO</p>
    <p style="margin:0;font-size:10px;letter-spacing:0.3em;color:${C.offWhite};">${data.paymentMethod === 'PIX' ? 'PIX' : 'CARTÃO DE CRÉDITO'}</p>
    ${paymentSection}

    ${divider()}

    <div align="center">
      ${button('VER MEU PEDIDO', `${data.appUrl}/conta/pedidos/${data.orderId}`)}
    </div>
  `

  return layout(content, `Pedido #${data.orderId.slice(-8).toUpperCase()} recebido · ${total}`)
}

// =============================================
// Template: Pagamento Confirmado
// =============================================
export interface PaymentConfirmedData {
  orderId: string
  customerName: string
  totalPrice: number // centavos
  appUrl: string
}

export function paymentConfirmedEmail(data: PaymentConfirmedData): string {
  const total = (data.totalPrice / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  const content = `
    <div align="center" style="margin-bottom:28px;">
      ${badge('PAGAMENTO CONFIRMADO')}
    </div>

    <h1 style="margin:0 0 16px;font-size:22px;color:${C.offWhite};font-weight:700;text-align:center;">Pagamento aprovado!</h1>

    <p style="margin:0 0 28px;font-size:14px;color:${C.muted};line-height:1.6;text-align:center;">
      Seu pagamento de <strong style="color:${C.offWhite};">${total}</strong> foi confirmado.<br/>
      Seu pedido já está em preparação e em breve será enviado.
    </p>

    <div style="background-color:#000;border:1px solid ${C.border};padding:20px;text-align:center;margin-bottom:28px;">
      <p style="margin:0 0 6px;font-size:10px;letter-spacing:0.3em;color:${C.muted};">NÚMERO DO PEDIDO</p>
      <p style="margin:0;font-size:16px;color:${C.offWhite};font-family:monospace;">${data.orderId}</p>
    </div>

    <div align="center">
      ${button('ACOMPANHAR PEDIDO', `${data.appUrl}/conta/pedidos/${data.orderId}`)}
    </div>

    ${divider()}

    <p style="margin:0;font-size:12px;color:${C.muted};text-align:center;line-height:1.6;">
      Olá, ${data.customerName.split(' ')[0]}! Assim que seu pedido for enviado você receberá outro e-mail com o código de rastreamento.
    </p>
  `

  return layout(content, `Pagamento confirmado para o pedido #${data.orderId.slice(-8).toUpperCase()}`)
}

// =============================================
// Template: Código OTP
// =============================================
export interface OtpCodeData {
  name?: string
  otp: string
  type: 'sign-in' | 'email-verification' | 'forget-password'
  expiresInMinutes?: number
}

const OTP_TITLES: Record<OtpCodeData['type'], { label: string; title: string; desc: string }> = {
  'sign-in': {
    label: 'CÓDIGO DE ACESSO',
    title: 'Seu código de login',
    desc: 'Use o código abaixo para entrar na sua conta MJAZN.',
  },
  'email-verification': {
    label: 'VERIFICAÇÃO DE E-MAIL',
    title: 'Confirme seu e-mail',
    desc: 'Use o código abaixo para verificar seu endereço de e-mail.',
  },
  'forget-password': {
    label: 'REDEFINIÇÃO DE SENHA',
    title: 'Código para redefinir senha',
    desc: 'Use o código abaixo para criar uma nova senha.',
  },
}

export function otpCodeEmail(data: OtpCodeData): string {
  const meta = OTP_TITLES[data.type]
  const expires = data.expiresInMinutes ?? 10

  const digits = data.otp.split('').map(d =>
    `<span style="display:inline-block;width:44px;height:56px;line-height:56px;text-align:center;background-color:#000;border:1px solid ${C.border};font-size:28px;font-weight:700;color:${C.offWhite};margin:0 4px;font-family:monospace;">${d}</span>`
  ).join('')

  const content = `
    <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.4em;color:${C.fire};">${meta.label}</p>
    <h1 style="margin:0 0 16px;font-size:22px;color:${C.offWhite};font-weight:700;">${meta.title}</h1>

    <p style="margin:0 0 28px;font-size:14px;color:${C.muted};line-height:1.6;">
      ${data.name ? `Olá, <strong style="color:${C.offWhite};">${data.name.split(' ')[0]}</strong>! ` : ''}${meta.desc}
    </p>

    <div align="center" style="margin:32px 0;">
      ${digits}
    </div>

    <p style="margin:0;font-size:12px;color:${C.muted};text-align:center;">
      Este código expira em <strong style="color:${C.offWhite};">${expires} minutos</strong>.
    </p>

    ${divider()}

    <p style="margin:0;font-size:11px;color:${C.dim};text-align:center;line-height:1.6;">
      Se você não solicitou este código, ignore este e-mail com segurança.<br/>
      Nunca compartilhe seu código com ninguém.
    </p>
  `

  return layout(content, `Seu código MJAZN: ${data.otp}`)
}

// =============================================
// Template: Redefinição de Senha (link)
// =============================================
export interface ResetPasswordData {
  name?: string
  resetUrl: string
}

export function resetPasswordEmail(data: ResetPasswordData): string {
  const content = `
    <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.4em;color:${C.fire};">REDEFINIÇÃO DE SENHA</p>
    <h1 style="margin:0 0 16px;font-size:22px;color:${C.offWhite};font-weight:700;">Redefinir sua senha</h1>

    <p style="margin:0 0 28px;font-size:14px;color:${C.muted};line-height:1.6;">
      ${data.name ? `Olá, <strong style="color:${C.offWhite};">${data.name.split(' ')[0]}</strong>! ` : ''}
      Recebemos uma solicitação para redefinir a senha da sua conta MJAZN.
      Clique no botão abaixo para criar uma nova senha.
    </p>

    <div align="center" style="margin:32px 0;">
      ${button('REDEFINIR MINHA SENHA', data.resetUrl)}
    </div>

    ${divider()}

    <p style="margin:0 0 8px;font-size:11px;color:${C.dim};text-align:center;">
      Este link expira em <strong style="color:${C.muted};">1 hora</strong>.
    </p>
    <p style="margin:0;font-size:11px;color:${C.dim};text-align:center;line-height:1.6;">
      Se você não solicitou a redefinição de senha, ignore este e-mail.<br/>
      Sua senha não será alterada.
    </p>
  `

  return layout(content, 'Redefinição de senha solicitada para sua conta MJAZN')
}

// =============================================
// Template: Boas-vindas (cadastro)
// =============================================
export interface WelcomeEmailData {
  name: string
  appUrl: string
}

export function welcomeEmail(data: WelcomeEmailData): string {
  const content = `
    <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.4em;color:${C.fire};">BEM-VINDO(A)</p>
    <h1 style="margin:0 0 16px;font-size:22px;color:${C.offWhite};font-weight:700;">Conta criada com sucesso!</h1>

    <p style="margin:0 0 28px;font-size:14px;color:${C.muted};line-height:1.6;">
      Olá, <strong style="color:${C.offWhite};">${data.name.split(' ')[0]}</strong>!<br/><br/>
      Sua conta na MJAZN foi criada. Agora você pode acompanhar seus pedidos, salvar endereços de entrega e muito mais.
    </p>

    <div align="center" style="margin:32px 0;">
      ${button('ACESSAR MINHA CONTA', `${data.appUrl}/conta`)}
    </div>

    ${divider()}

    <p style="margin:0;font-size:12px;color:${C.muted};text-align:center;line-height:1.6;">
      Explore nossa coleção e encontre sua próxima peça favorita.
    </p>
  `

  return layout(content, `Bem-vindo(a) à MJAZN, ${data.name.split(' ')[0]}!`)
}
