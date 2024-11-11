//require('dotenv').config({ path: '../../.env' });
const { createClient } = require('@supabase/supabase-js');
// Load environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey)
module.exports = supabase;
