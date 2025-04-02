
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    // Create a Supabase client with the Auth admin API
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Create admin user
    const { data: user, error: createUserError } = await supabase.auth.admin.createUser({
      email: "admin@fhs.example",
      password: "admin",
      email_confirm: true,
    });
    
    if (createUserError) {
      // Check if error is because user already exists
      if (createUserError.message.includes("already registered")) {
        return new Response(
          JSON.stringify({ 
            message: "Admin user already exists", 
            success: true 
          }),
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200 
          }
        );
      }
      
      throw createUserError;
    }
    
    return new Response(
      JSON.stringify({ 
        message: "Admin user created successfully", 
        userId: user.user.id,
        success: true 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error:", error.message);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
})
