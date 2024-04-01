import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://pnqnsatdkmzhfxnumybf.supabase.co/"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBucW5zYXRka216aGZ4bnVteWJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTE4MzQ3MDQsImV4cCI6MjAyNzQxMDcwNH0.DX3v7ZkqSmwhtpFokkhpvXB6JcarPBDaSYDDpk_vHAE"
const supabase = createClient(supabaseUrl, supabaseKey)
export default supabase