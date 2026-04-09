import { createClient, SupabaseClient } from '@supabase/supabase-js'

export const STORAGE_BUCKET = 'regiao-norte'

// ─── Lazy clients ─────────────────────────────────────────────────────────────
// Criados apenas quando chamados pela primeira vez, não no import.
// Isso evita erro "supabaseUrl is required" durante o build do Next.js.

let _supabase: SupabaseClient | null = null
let _supabaseAdmin: SupabaseClient | null = null

function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
    if (!url || !key) throw new Error('Supabase env vars não configuradas.')
    _supabase = createClient(url, key)
  }
  return _supabase
}

function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? anonKey
    if (!url || !serviceKey) throw new Error('Supabase admin env vars não configuradas.')
    _supabaseAdmin = createClient(url, serviceKey, { auth: { persistSession: false } })
  }
  return _supabaseAdmin
}

// Manter exports nomeados para compatibilidade com código existente
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return (getSupabase() as never)[prop]
  },
})

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return (getSupabaseAdmin() as never)[prop]
  },
})

// ─── Upload de imagem de produto ─────────────────────────────────────────────
export async function uploadProductImage(
  file: File,
  productSlug: string
): Promise<string> {
  const admin = getSupabaseAdmin()
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `products/${productSlug}/${Date.now()}.${ext}`

  const { data, error } = await admin.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type })

  if (error) throw new Error(`Upload falhou: ${error.message}`)

  const { data: urlData } = admin.storage.from(STORAGE_BUCKET).getPublicUrl(data.path)
  return urlData.publicUrl
}

// ─── Deletar imagem de produto ───────────────────────────────────────────────
export async function deleteProductImage(url: string): Promise<void> {
  const path = url.split(`${STORAGE_BUCKET}/`)[1]
  if (!path) return
  await getSupabaseAdmin().storage.from(STORAGE_BUCKET).remove([path])
}

// ─── Upload de imagem de categoria ───────────────────────────────────────────
export async function uploadCategoryImage(
  file: File,
  categorySlug: string
): Promise<string> {
  const admin = getSupabaseAdmin()
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `categories/${categorySlug}/${Date.now()}.${ext}`

  const { data, error } = await admin.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type })

  if (error) throw new Error(`Upload falhou: ${error.message}`)

  const { data: urlData } = admin.storage.from(STORAGE_BUCKET).getPublicUrl(data.path)
  return urlData.publicUrl
}

// ─── Deletar imagem de categoria ─────────────────────────────────────────────
export async function deleteCategoryImageFile(url: string): Promise<void> {
  const path = url.split(`${STORAGE_BUCKET}/`)[1]
  if (!path) return
  await getSupabaseAdmin().storage.from(STORAGE_BUCKET).remove([path])
}

// ─── URL assinada ─────────────────────────────────────────────────────────────
export async function getSignedUrl(path: string, expiresIn = 3600): Promise<string> {
  const { data, error } = await getSupabaseAdmin().storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(path, expiresIn)

  if (error) throw error
  return data.signedUrl
}
