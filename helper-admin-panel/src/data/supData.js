import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://hfhatwbczhtbbondeikd.supabase.co';
const supabaseKey = 'sb_publishable_Wcjg8BYaaQix_To9G5rHcQ_LNXRwN7p';
const supabase = createClient(supabaseUrl, supabaseKey);
export async function getSupData() {
    let { data, error } = await supabase
        .from('users')
        .select('*')
        if (error) {
            console.error("Error fetching support data:", error);
            return [];
        }
        return data;
    }