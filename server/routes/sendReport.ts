import express, { Request, Response } from "express";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY as string);

router.post("/send", async (req: Request, res: Response) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Femora <onboarding@resend.dev>",
      to: [to],
      subject,
      text, // <- plain text body instead of HTML
    });

    if (error) {
      console.error("Resend error:", error);
      return res.status(400).json({ error });
    }

    return res.status(200).json({ success: true, data });
  } catch (err: any) {
    console.error("Server error:", err.message);
    return res.status(500).json({ error: "Failed to send email", message: err.message });
  }
});

export default router;
