import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { format } from "https://deno.land/x/date_fns@v2.22.1/index.js";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  startDate: string;
  endDate: string;
  email: string;
  name: string;
  phone?: string;
  comment?: string;
  language: string;
}

const dateFormats = {
  no: "dd.MM.yyyy",
  gb: "dd/MM/yyyy",
  de: "dd.MM.yyyy"
};

const translations = {
  no: {
    subject: "Forespørsel mottatt",
    greeting: "Kjære",
    message: "Din forespørsel er sendt. Du vil bli kontaktet på e-post/telefon hvis oppholdet blir bekreftet.",
    regards: "Med vennlig hilsen",
    signature: "Karl Gjedrem"
  },
  gb: {
    subject: "Request Received",
    greeting: "Dear",
    message: "Your request has been sent. You will be contacted by email/phone if the stay is confirmed.",
    regards: "Best regards",
    signature: "Karl Gjedrem"
  },
  de: {
    subject: "Anfrage erhalten",
    greeting: "Sehr geehrte(r)",
    message: "Ihre Anfrage wurde gesendet. Sie werden per E-Mail/Telefon kontaktiert, wenn der Aufenthalt bestätigt wird.",
    regards: "Mit freundlichen Grüßen",
    signature: "Karl Gjedrem"
  }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { startDate, endDate, email, name, phone, comment, language = 'no' }: EmailRequest = await req.json();
    
    const t = translations[language as keyof typeof translations];
    const dateFormat = dateFormats[language as keyof typeof dateFormats];
    
    const formattedStartDate = format(new Date(startDate), dateFormat);
    const formattedEndDate = format(new Date(endDate), dateFormat);

    console.log(`Sending booking request email to ${email} in ${language}`);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Gjedrem Rentals <onboarding@resend.dev>",
        to: [email],
        subject: t.subject,
        html: `
          <h1>${t.subject}</h1>
          <p>${t.greeting} ${name},</p>
          <p>${t.message}</p>
          <ul>
            <li>Check-in: ${formattedStartDate}</li>
            <li>Check-out: ${formattedEndDate}</li>
            ${phone ? `<li>Phone: ${phone}</li>` : ''}
            ${comment ? `<li>Comment: ${comment}</li>` : ''}
          </ul>
          <p>${t.regards},<br>${t.signature}</p>
        `,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Error sending email:", error);
      throw new Error(error);
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in send-booking-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);