import { supabase } from '@/services/supabase'

export const deleteReview = async (id: string) => {
  const { error, data } = await supabase.from('reviews').delete().eq('id', id)

  if (error) throw new Error(error.message)
  return data
}
