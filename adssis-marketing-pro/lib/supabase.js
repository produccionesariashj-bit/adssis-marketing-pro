import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const saveBusinessData = async (businessData) => {
  const { data, error } = await supabase
    .from('businesses')
    .insert([businessData])
    .select()
  
  if (error) throw error
  return data[0]
}

export const saveGeneratedContent = async (businessId, content) => {
  const contentWithBusinessId = content.map(item => ({
    ...item,
    business_id: businessId,
    created_at: new Date().toISOString()
  }))
  
  const { data, error } = await supabase
    .from('generated_content')
    .insert(contentWithBusinessId)
    .select()
  
  if (error) throw error
  return data
}
