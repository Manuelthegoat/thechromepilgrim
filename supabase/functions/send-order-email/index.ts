import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Browsers send an OPTIONS preflight request before the real POST — must respond to it directly
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { customerEmail, customerName, items, total, reference } =
      await req.json();

    const itemsHtml = items
      .map(
        (item: any) =>
          `<li>${item.name} (${item.size || "—"}) × ${item.quantity} — ₦${item.price}</li>`,
      )
      .join("");

    const itemRows = items
      .map(
        (item: any) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #2a2a26; font-family: Georgia, serif; font-size: 13px; color: #e8e2d3;">
          ${item.name}${item.size ? ` <span style="color: #8c8577;">(${item.size})</span>` : ""}
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #2a2a26; font-family: Georgia, serif; font-size: 13px; color: #8c8577; text-align: center;">
          × ${item.quantity}
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #2a2a26; font-family: Georgia, serif; font-size: 13px; color: #e8e2d3; text-align: right;">
          ₦${Number(item.price).toLocaleString()}
        </td>
      </tr>`,
      )
      .join("");

    const emailBody = `
<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; background-color: #ede9de;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #ede9de; padding: 40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color: #0c0b09; border: 1px solid #2a2a26;">

          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 1px solid #2a2a26;">
              <div style="font-family: Georgia, 'Times New Roman', serif; font-size: 26px; color: #e8e2d3; letter-spacing: 1px;">
                The Chrome Pilgrim
              </div>
              <div style="margin-top: 8px; font-family: Georgia, serif; font-size: 11px; letter-spacing: 3px; color: #8a7238; text-transform: uppercase;">
                Order Confirmed
              </div>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 30px 40px 10px;">
              <p style="margin: 0; font-family: Georgia, serif; font-size: 14px; color: #e8e2d3; line-height: 1.6;">
                Thank you, ${customerName}.
              </p>
              <p style="margin: 10px 0 0; font-family: Georgia, serif; font-size: 13px; color: #8c8577; line-height: 1.6;">
                Your order has been received and is being prepared.
              </p>
            </td>
          </tr>

          <!-- Items -->
          <tr>
            <td style="padding: 20px 40px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${itemRows}
              </table>
            </td>
          </tr>

          <!-- Total -->
          <tr>
            <td style="padding: 20px 40px 30px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-top: 16px; border-top: 1px solid #2a2a26; font-family: Georgia, serif; font-size: 15px; color: #e8e2d3; font-weight: bold;">
                    Total
                  </td>
                  <td style="padding-top: 16px; border-top: 1px solid #2a2a26; font-family: Georgia, serif; font-size: 15px; color: #e8e2d3; font-weight: bold; text-align: right;">
                    ₦${Number(total).toLocaleString()}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Reference -->
          <tr>
            <td style="padding: 0 40px 40px; text-align: center;">
              <div style="display: inline-block; padding: 10px 20px; border: 1px solid #2a2a26; font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 1px; color: #8c8577;">
                REF: ${reference}
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; border-top: 1px solid #2a2a26; text-align: center;">
              <div style="font-family: Georgia, serif; font-size: 10px; letter-spacing: 1px; color: #443f38;">
                THE CHROME PILGRIM
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "The Messenger <support@danisveryown.com>",
        to: customerEmail,
        subject: "Your Chrome Pilgrim order confirmation",
        html: emailBody,
      }),
    });

    const data = await res.json();

    // Add customer to Resend Contacts (silently skip/ignore if it fails — shouldn't block the order)
    await fetch("https://api.resend.com/contacts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: customerEmail,
        first_name: customerName,
        unsubscribed: false,
      }),
    });

    // Notify you (the store owner) of the new order
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "The Messenger <support@danisveryown.com>",
        to: "support@danisveryown.com",
        subject: `New order — ₦${Number(total).toLocaleString()} from ${customerName}`,
        html: `
          <div style="font-family: monospace;">
            <h2>New order received</h2>
            <p><strong>${customerName}</strong> (${customerEmail})</p>
            <ul>${itemsHtml}</ul>
            <p><strong>Total: ₦${Number(total).toLocaleString()}</strong></p>
            <p>Reference: ${reference}</p>
          </div>
        `,
      }),
    });

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});