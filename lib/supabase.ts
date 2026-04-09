import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
  ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? supabaseAnonKey

// ─── Cliente público (frontend / leitura) ───────────────────────────────────
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ─── Cliente admin (server-side / upload) ───────────────────────────────────
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
})

// ─── Nome do bucket ──────────────────────────────────────────────────────────
export const STORAGE_BUCKET = 'regiao-norte'

// ─── Upload de imagem de produto ─────────────────────────────────────────────
export async function uploadProductImage(
  file: File,
  productSlug: string
): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `products/${productSlug}/${Date.now()}.${ext}`

  const { data, error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type })

  if (error) throw new Error(`Upload falhou: ${error.message}`)

  const { data: urlData } = supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(data.path)

  return urlData.publicUrl
}

// ─── Deletar imagem ──────────────────────────────────────────────────────────
export async function deleteProductImage(url: string): Promise<void> {
  // Extrai o path a partir da URL pública
  const path = url.split(`${STORAGE_BUCKET}/`)[1]
  if (!path) return

  await supabaseAdmin.storage.from(STORAGE_BUCKET).remove([path])
}

// ─── Upload de imagem de categoria ───────────────────────────────────────────
export async function uploadCategoryImage(
  file: File,
  categorySlug: string
): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `categories/${categorySlug}/${Date.now()}.${ext}`

  const { data, error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type })

  if (error) throw new Error(`Upload falhou: ${error.message}`)

  const { data: urlData } = supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(data.path)

  return urlData.publicUrl
}

// ─── Deletar imagem de categoria ─────────────────────────────────────────────
export async function deleteCategoryImageFile(url: string): Promise<void> {
  const path = url.split(`${STORAGE_BUCKET}/`)[1]
  if (!path) return
  await supabaseAdmin.storage.from(STORAGE_BUCKET).remove([path])
}

// ─── Gerar URL assinada (para acesso temporário se bucket for privado) ───────
export async function getSignedUrl(path: string, expiresIn = 3600): Promise<string> {
  const { data, error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(path, expiresIn)

  if (error) throw error
  return data.signedUrl
}
