import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { admin, emailOTP } from 'better-auth/plugins'
import { prisma } from './prisma'
import { sendEmail } from './resend'
import { otpCodeEmail, resetPasswordEmail, welcomeEmail } from './email-templates'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),

  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: 'Redefinir senha — MJAZN',
        html: resetPasswordEmail({ name: user.name, resetUrl: url }),
      })
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user }) => {
      await sendEmail({
        to: user.email,
        subject: 'Bem-vindo(a) à MJAZN!',
        html: welcomeEmail({ name: user.name, appUrl: APP_URL }),
      }).catch(() => { /* não bloqueia o fluxo */ })
    },
  },

  plugins: [
    admin(),
    emailOTP({
      otpLength: 6,
      expiresIn: 600, // 10 minutos em segundos
      async sendVerificationOTP({ email, otp, type }) {
        const typeMap: Record<string, 'sign-in' | 'email-verification' | 'forget-password'> = {
          'sign-in': 'sign-in',
          'email-verification': 'email-verification',
          'forget-password': 'forget-password',
        }

        await sendEmail({
          to: email,
          subject:
            type === 'sign-in'
              ? `Seu código de acesso MJAZN: ${otp}`
              : type === 'forget-password'
              ? `Código para redefinir senha MJAZN: ${otp}`
              : `Confirme seu e-mail MJAZN: ${otp}`,
          html: otpCodeEmail({
            otp,
            type: typeMap[type] ?? 'sign-in',
            expiresInMinutes: 10,
          }),
        })
      },
    }),
  ],

  trustedOrigins: [APP_URL],
})

export type Session = typeof auth.$Infer.Session
