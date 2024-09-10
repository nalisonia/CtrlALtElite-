import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://rkiatsaydzzkrnysksdu.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJraWF0c2F5ZHp6a3JueXNrc2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU2MzY5MDgsImV4cCI6MjA0MTIxMjkwOH0.xNDcGBF6Bvua5wcV_5WsS4YI5njFW1mDuFjUEhG6_x8"
const supabase = createClient(supabaseUrl, supabaseKey)
export default supabase

