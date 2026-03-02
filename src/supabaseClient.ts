import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gxtqgddmoklhoupmbega.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_6Mj-QHxoYTVbLUmTpCdHFw_V-fODQ7K';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
