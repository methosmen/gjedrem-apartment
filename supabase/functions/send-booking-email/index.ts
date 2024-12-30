import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { format } from "https://deno.land/std@0.168.0/datetime/mod.ts";

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

const translations = {
  no: {
    subject: "Bestillingsforespørsel mottatt",
    greeting: "Kjære",
    message: "Din forespørsel er sendt. Du vil bli kontaktet på e-post/telefon hvis oppholdet blir bekreftet.",
    checkIn: "Innsjekking",
    checkOut: "Utsjekking",
    phone: "Telefon",
    comment: "Kommentar",
    regards: "Med vennlig hilsen",
    signature: "Karl Gjedrem"
  },
  gb: {
    subject: "Booking Request Received",
    greeting: "Dear",
    message: "Your request has been sent. You will be contacted by email/phone if the stay is confirmed.",
    checkIn: "Check-in",
    checkOut: "Check-out",
    phone: "Phone",
    comment: "Comment",
    regards: "Best regards",
    signature: "Karl Gjedrem"
  },
  de: {
    subject: "Buchungsanfrage erhalten",
    greeting: "Sehr geehrte(r)",
    message: "Ihre Anfrage wurde gesendet. Sie werden per E-Mail/Telefon kontaktiert, wenn der Aufenthalt bestätigt wird.",
    checkIn: "Check-in",
    checkOut: "Check-out",
    phone: "Telefon",
    comment: "Kommentar",
    regards: "Mit freundlichen Grüßen",
    signature: "Karl Gjedrem"
  }
};

const formatDate = (dateString: string, language: string): string => {
  const date = new Date(dateString);
  switch (language) {
    case 'no':
    case 'de':
      return format(date, 'dd.MM.yyyy');
    default:
      return format(date, 'dd/MM/yyyy');
  }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { startDate, endDate, email, name, phone, comment, language }: EmailRequest = await req.json();
    
    const t = translations[language as keyof typeof translations] || translations.gb;
    
    const formattedStartDate = formatDate(startDate, language);
    const formattedEndDate = formatDate(endDate, language);

    console.log(`Sending booking confirmation email to ${email} in ${language}`);

    // Send confirmation email to the customer (temporarily sending to verified email)
    const customerRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Gjedrem Apartment <onboarding@resend.dev>",
        to: ["morten@gjedrem.net"], // Temporarily send to verified email
        reply_to: email, // Add customer's email as reply-to
        subject: t.subject,
        html: `
          <h1>${t.subject}</h1>
          <p>${t.greeting} ${name},</p>
          <p>${t.message}</p>
          <ul>
            <li>${t.checkIn}: ${formattedStartDate}</li>
            <li>${t.checkOut}: ${formattedEndDate}</li>
            ${phone ? `<li>${t.phone}: ${phone}</li>` : ''}
            ${comment ? `<li>${t.comment}: ${comment}</li>` : ''}
          </ul>
          <p>${t.regards},<br>${t.signature}</p>
          <p>Customer Email: ${email}</p>
        `,
      }),
    });

    if (!customerRes.ok) {
      const error = await customerRes.text();
      console.error("Error sending customer email:", error);
      throw new Error(error);
    }

    // Send notification email to the owner (using verified email)
    const ownerRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Gjedrem Apartment <onboarding@resend.dev>",
        to: ["morten@gjedrem.net"],
        subject: `New Booking Request: ${formattedStartDate} - ${formattedEndDate}`,
        html: `
          <h1>New Booking Request</h1>
          <p>A new booking request has been received:</p>
          <ul>
            <li>Name: ${name}</li>
            <li>Email: ${email}</li>
            <li>Check-in: ${formattedStartDate}</li>
            <li>Check-out: ${formattedEndDate}</li>
            ${phone ? `<li>Phone: ${phone}</li>` : ''}
            ${comment ? `<li>Comment: ${comment}</li>` : ''}
          </ul>
        `,
      }),
    });

    if (!ownerRes.ok) {
      const error = await ownerRes.text();
      console.error("Error sending owner notification:", error);
      throw new Error(error);
    }

    const data = await customerRes.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in send-booking-email function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);