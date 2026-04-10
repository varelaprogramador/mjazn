'use client'

import { useEffect, useState, useTransition } from 'react'
import {
  getCustomerProfile,
  updateCustomerProfile,
  getCustomerAddresses,
  saveCustomerAddress,
  deleteCustomerAddress,
  setDefaultAddress,
  type AddressInput,
} from '@/app/actions/customer'
import { authClient } from '@/lib/auth-client'

type Address = {
  id: string
  label: string
  recipientName: string
  street: string
  number: string
  complement: string | null
  neighborhood: string
  city: string
  state: string
  zipCode: string
  isDefault: boolean
}

const EMPTY_ADDR: AddressInput = {
  label: 'Casa',
  recipientName: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  zipCode: '',
  isDefault: false,
}

export default function PerfilPage() {
  const [profile, setProfile] = useState<{ name: string; email: string; phone: string | null } | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [profileMsg, setProfileMsg] = useState<string | null>(null)

  const [currentPwd, setCurrentPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [pwdMsg, setPwdMsg] = useState<string | null>(null)

  const [showAddrForm, setShowAddrForm] = useState(false)
  const [addrForm, setAddrForm] = useState<AddressInput>(EMPTY_ADDR)
  const [addrMsg, setAddrMsg] = useState<string | null>(null)

  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    Promise.all([getCustomerProfile(), getCustomerAddresses()]).then(([p, a]) => {
      if (p) {
        setProfile(p)
        setName(p.name)
        setPhone(p.phone ?? '')
      }
      setAddresses(a)
    })
  }, [])

  function setAddr(k: keyof AddressInput) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setAddrForm((prev) => ({ ...prev, [k]: e.target.value }))
  }

  async function fetchViaCep(zip: string) {
    const clean = zip.replace(/\D/g, '')
    if (clean.length !== 8) return
    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`)
      const data = await res.json()
      if (!data.erro) {
        setAddrForm((p) => ({
          ...p,
          street: data.logradouro ?? p.street,
          neighborhood: data.bairro ?? p.neighborhood,
          city: data.localidade ?? p.city,
          state: data.uf ?? p.state,
        }))
      }
    } catch { /* ignore */ }
  }

  function handleSaveProfile() {
    startTransition(async () => {
      try {
        await updateCustomerProfile({ name, phone: phone || undefined })
        setProfileMsg('Perfil atualizado!')
        setTimeout(() => setProfileMsg(null), 3000)
      } catch {
        setProfileMsg('Erro ao atualizar.')
      }
    })
  }

  async function handleChangePwd(e: React.FormEvent) {
    e.preventDefault()
    setPwdMsg(null)
    if (newPwd !== confirmPwd) { setPwdMsg('As senhas não coincidem.'); return }
    if (newPwd.length < 8) { setPwdMsg('Mínimo 8 caracteres.'); return }

    const { error } = await authClient.changePassword({
      currentPassword: currentPwd,
      newPassword: newPwd,
      revokeOtherSessions: false,
    })

    if (error) {
      setPwdMsg('Senha atual incorreta.')
    } else {
      setPwdMsg('Senha alterada com sucesso!')
      setCurrentPwd(''); setNewPwd(''); setConfirmPwd('')
      setTimeout(() => setPwdMsg(null), 3000)
    }
  }

  function handleSaveAddr() {
    startTransition(async () => {
      try {
        await saveCustomerAddress(addrForm)
        const updated = await getCustomerAddresses()
        setAddresses(updated)
        setAddrForm(EMPTY_ADDR)
        setShowAddrForm(false)
        setAddrMsg('Endereço salvo!')
        setTimeout(() => setAddrMsg(null), 3000)
      } catch {
        setAddrMsg('Erro ao salvar endereço.')
      }
    })
  }

  async function handleDeleteAddr(id: string) {
    await deleteCustomerAddress(id)
    setAddresses((prev) => prev.filter((a) => a.id !== id))
  }

  async function handleSetDefault(id: string) {
    await setDefaultAddress(id)
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    )
  }

  return (
    <div className="p-6 md:p-8 pt-20 md:pt-8 max-w-3xl space-y-8">
      <div>
        <p className="text-[10px] font-display tracking-[0.5em] text-fire mb-1">CONTA</p>
        <h1 className="font-display text-3xl text-off-white">Perfil & Endereços</h1>
      </div>

      {/* ── Dados pessoais ── */}
      <Section title="Dados Pessoais">
        <div className="space-y-4">
          <Field label="Nome Completo">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={input}
              placeholder="Seu nome"
            />
          </Field>
          <Field label="E-mail">
            <input
              value={profile?.email ?? ''}
              disabled
              className={`${input} opacity-50 cursor-not-allowed`}
            />
          </Field>
          <Field label="Telefone / WhatsApp">
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={input}
              placeholder="(92) 99999-9999"
            />
          </Field>

          {profileMsg && (
            <p className={`text-xs ${profileMsg.includes('Erro') ? 'text-red-400' : 'text-green-400'}`}>
              {profileMsg}
            </p>
          )}

          <button
            onClick={handleSaveProfile}
            disabled={isPending}
            className="h-10 px-8 bg-fire text-black font-display tracking-widest text-xs hover:bg-fire-light transition-colors disabled:opacity-60"
          >
            {isPending ? 'Salvando...' : 'Salvar Dados'}
          </button>
        </div>
      </Section>

      {/* ── Alterar senha ── */}
      <Section title="Alterar Senha">
        <form onSubmit={handleChangePwd} className="space-y-4">
          <Field label="Senha Atual">
            <input type="password" value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)} required className={input} placeholder="••••••••" />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nova Senha">
              <input type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} required className={input} placeholder="Mínimo 8 caracteres" />
            </Field>
            <Field label="Confirmar Senha">
              <input type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} required className={input} placeholder="Repita a senha" />
            </Field>
          </div>
          {pwdMsg && (
            <p className={`text-xs ${pwdMsg.includes('Erro') || pwdMsg.includes('incorreta') || pwdMsg.includes('coincidem') || pwdMsg.includes('caracteres') ? 'text-red-400' : 'text-green-400'}`}>
              {pwdMsg}
            </p>
          )}
          <button type="submit" className="h-10 px-8 border border-gray-border text-off-white font-display tracking-widest text-xs hover:border-fire hover:text-fire transition-colors">
            Alterar Senha
          </button>
        </form>
      </Section>

      {/* ── Endereços ── */}
      <Section title="Endereços de Entrega">
        {addrMsg && (
          <p className={`text-xs mb-4 ${addrMsg.includes('Erro') ? 'text-red-400' : 'text-green-400'}`}>{addrMsg}</p>
        )}

        {addresses.length === 0 && !showAddrForm && (
          <p className="text-xs text-gray-muted mb-4">Nenhum endereço salvo. Adicione um para agilizar seus próximos pedidos.</p>
        )}

        <div className="space-y-3 mb-4">
          {addresses.map((addr) => (
            <div key={addr.id} className={`border p-4 ${addr.isDefault ? 'border-fire/40 bg-fire/5' : 'border-gray-border bg-black'}`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-display tracking-widest text-gray-muted">{addr.label.toUpperCase()}</span>
                    {addr.isDefault && (
                      <span className="text-[8px] font-display tracking-widest text-fire border border-fire/40 px-1.5 py-0.5">PADRÃO</span>
                    )}
                  </div>
                  <p className="text-xs text-off-white font-display">{addr.recipientName}</p>
                  <p className="text-[10px] text-gray-muted mt-0.5">
                    {addr.street}, {addr.number}{addr.complement ? `, ${addr.complement}` : ''}
                  </p>
                  <p className="text-[10px] text-gray-muted">
                    {addr.neighborhood} — {addr.city}/{addr.state} · CEP {addr.zipCode}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="text-[9px] font-display tracking-widest text-gray-muted border border-gray-border px-2 py-1 hover:border-fire hover:text-fire transition-colors"
                    >
                      Padrão
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteAddr(addr.id)}
                    className="text-[9px] font-display tracking-widest text-red-400/60 border border-red-400/20 px-2 py-1 hover:border-red-400 hover:text-red-400 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add address form */}
        {showAddrForm ? (
          <div className="border border-gray-border bg-dark p-5 space-y-4">
            <p className="text-[10px] font-display tracking-widest text-gray-muted">NOVO ENDEREÇO</p>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Rótulo (Casa, Trabalho...)">
                <input value={addrForm.label} onChange={setAddr('label')} className={input} placeholder="Casa" />
              </Field>
              <Field label="Nome do Destinatário">
                <input value={addrForm.recipientName} onChange={setAddr('recipientName')} className={input} placeholder="Quem vai receber" />
              </Field>
            </div>

            <Field label="CEP">
              <input
                value={addrForm.zipCode}
                onChange={setAddr('zipCode')}
                onBlur={() => fetchViaCep(addrForm.zipCode)}
                className={input}
                placeholder="69000-000"
              />
            </Field>

            <Field label="Rua / Avenida">
              <input value={addrForm.street} onChange={setAddr('street')} className={input} placeholder="Rua das Flores" />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Número">
                <input value={addrForm.number} onChange={setAddr('number')} className={input} placeholder="123" />
              </Field>
              <Field label="Complemento (opcional)">
                <input value={addrForm.complement ?? ''} onChange={setAddr('complement')} className={input} placeholder="Apto 4" />
              </Field>
            </div>

            <Field label="Bairro">
              <input value={addrForm.neighborhood} onChange={setAddr('neighborhood')} className={input} placeholder="Centro" />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Cidade">
                <input value={addrForm.city} onChange={setAddr('city')} className={input} placeholder="Manaus" />
              </Field>
              <Field label="Estado (UF)">
                <input value={addrForm.state} onChange={setAddr('state')} maxLength={2} className={input} placeholder="AM" />
              </Field>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={addrForm.isDefault}
                onChange={(e) => setAddrForm((p) => ({ ...p, isDefault: e.target.checked }))}
                className="accent-fire"
              />
              <span className="text-xs text-off-white">Definir como endereço padrão</span>
            </label>

            <div className="flex gap-3">
              <button
                onClick={handleSaveAddr}
                disabled={isPending}
                className="h-10 px-8 bg-fire text-black font-display tracking-widest text-xs hover:bg-fire-light transition-colors disabled:opacity-60"
              >
                {isPending ? 'Salvando...' : 'Salvar Endereço'}
              </button>
              <button
                onClick={() => { setShowAddrForm(false); setAddrForm(EMPTY_ADDR) }}
                className="h-10 px-6 border border-gray-border text-gray-muted font-display tracking-widest text-xs hover:border-off-white hover:text-off-white transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddrForm(true)}
            className="h-10 px-8 border border-gray-border text-gray-muted font-display tracking-widest text-xs hover:border-fire hover:text-fire transition-colors"
          >
            + Adicionar Endereço
          </button>
        )}
      </Section>
    </div>
  )
}

const input = 'w-full h-11 bg-black border border-gray-border px-4 text-sm text-off-white placeholder-gray-dim focus:outline-none focus:border-fire transition-colors'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-gray-border bg-dark p-6 space-y-1">
      <p className="text-[9px] font-display tracking-[0.4em] text-gray-muted mb-4">{title.toUpperCase()}</p>
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
