import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function trackVisitorIP() {
    try {
        // Récupérer l'IP du visiteur
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        const ipAddress = data.ip;

        // Récupérer les informations de localisation
        const geoResponse = await fetch(`https://ipapi.co/${ipAddress}/json/`);
        const geoData = await geoResponse.json();

        // Vérifier si l'utilisateur est connecté
        const { data: { user } } = await supabase.auth.getUser();
        const isLoggedIn = !!user;
        const username = user?.user_metadata?.username || user?.email || 'none';

        // Vérifier si une entrée existe déjà pour cette IP
        const { data: existingEntries, error: selectError } = await supabase
            .from('visitor_ips')
            .select('*')
            .eq('ip_address', ipAddress);

        if (selectError) {
            console.error('Erreur lors de la vérification de l\'IP:', selectError);
            return;
        }

        if (existingEntries && existingEntries.length > 0) {
            // Utiliser la première entrée trouvée
            const existingEntry = existingEntries[0];
            
            // Mettre à jour l'entrée existante
            const { error: updateError } = await supabase
                .from('visitor_ips')
                .update({
                    user_agent: navigator.userAgent,
                    page_visited: window.location.pathname,
                    country: geoData.country_name,
                    city: geoData.city,
                    username: username,
                    is_logged_in: isLoggedIn,
                    visited_at: new Date().toISOString(),
                    visit_count: existingEntry.visit_count + 1
                })
                .eq('id', existingEntry.id);

            if (updateError) {
                console.error('Erreur lors de la mise à jour de l\'IP:', updateError);
            }
        } else {
            // Créer une nouvelle entrée
            const { error: insertError } = await supabase
                .from('visitor_ips')
                .insert([
                    {
                        ip_address: ipAddress,
                        user_agent: navigator.userAgent,
                        page_visited: window.location.pathname,
                        country: geoData.country_name,
                        city: geoData.city,
                        username: username,
                        is_logged_in: isLoggedIn,
                        visit_count: 1
                    }
                ]);

            if (insertError) {
                console.error('Erreur lors de l\'enregistrement de l\'IP:', insertError);
            }
        }
    } catch (error) {
        console.error('Erreur lors du suivi de l\'IP:', error);
    }
} 