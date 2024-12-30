import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingEmailRequest {
  startDate: string;
  endDate: string;
  email: string;
  name: string;
  phone?: string;
  comment?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { startDate, endDate, email, name, phone, comment }: BookingEmailRequest = await req.json();

    console.log(`Sending booking request email for ${name} (${email}) for dates: ${startDate} to ${endDate}`);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Gjedrem Rentals <onboarding@resend.dev>",
        to: [email],
        subject: "Booking Request Received",
        html: `
          <h1>Booking Request Received</h1>
          <p>Dear ${name},</p>
          <p>Your booking request has been received with the following details:</p>
          <ul>
            <li>Check-in: ${startDate}</li>
            <li>Check-out: ${endDate}</li>
            ${phone ? `<li>Phone: ${phone}</li>` : ''}
            ${comment ? `<li>Comment: ${comment}</li>` : ''}
          </ul>
          <p>You will be contacted by email/phone if the stay is confirmed.</p>
          <p>Best regards,<br>Karl Gjedrem</p>
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
  } catch (error) {
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