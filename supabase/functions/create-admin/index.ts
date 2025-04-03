import express, { Request, Response, RequestHandler } from 'express';
import cors from 'cors';
import { createClient } from "@supabase/supabase-js";

const app = express();

app.use(cors({ origin: '*', allowedHeaders: ['authorization', 'x-client-info', 'apikey', 'content-type'] }));
app.use(express.json());

const createAdminHandler: RequestHandler = async (req: Request, res: Response) => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL || "";
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error("Les variables d'environnement SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requises.");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: user, error: createUserError } = await supabase.auth.admin.createUser({
      email: "admin@fhs.example",
      password: "admin",
      email_confirm: true,
    });

    if (createUserError) {
      if (createUserError.message.includes("already registered")) {
        res.status(200).json({
          message: "Admin user already exists",
          success: true
        });
        return;
      }
      throw createUserError;
    }

    res.status(200).json({
      message: "Admin user created successfully",
      userId: user.user.id,
      success: true
    });

  } catch (error: any) {
    console.error("Error:", error.message);
    res.status(500).json({
      error: error.message,
      success: false
    });
  }
};

app.post('/', createAdminHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
