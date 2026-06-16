import crypto from 'crypto'
import type { SupabaseClient } from '@supabase/supabase-js'

const ALG = 'aes-256-cbc'

function getKey() {
  const secret = process.env.ENCRYPTION_SECRET ?? ''
  return Buffer.from(secret, 'hex')
}

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(ALG, getKey(), iv)
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()])
  return iv.toString('hex') + ':' + encrypted.toString('hex')
}

export function decrypt(encrypted: string): string {
  const [ivHex, dataHex] = encrypted.split(':')
  const iv = Buffer.from(ivHex, 'hex')
  const data = Buffer.from(dataHex, 'hex')
  const decipher = crypto.createDecipheriv(ALG, getKey(), iv)
  return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8')
}

export async function getApiKey(
  supabase: SupabaseClient,
  provider: 'claude' | 'openai'
): Promise<string | null> {
  const { data } = await supabase
    .from('api_keys')
    .select('encrypted_key')
    .eq('provider', provider)
    .single()
  if (!data) return null
  return decrypt(data.encrypted_key as string)
}
