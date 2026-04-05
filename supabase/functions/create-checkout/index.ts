import Stripe from "npm:stripe@14.0.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
});

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  // 👇 Handle OPTIONS preflight immediately
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    const { courseId, userId } = await req.json();

    if (!courseId || !userId) {
      return new Response(JSON.stringify({ error: "Missing courseId or userId" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // FIX - normalize origin to always use localhost
    const origin = req.headers.get("origin") || "http://localhost:5173";
    const fixedOrigin = origin.replace("127.0.0.1", "localhost");

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Course Purchase",
            },
            unit_amount: 50000,
          },
          quantity: 1,
        },
      ],
      success_url: `${fixedOrigin}/course/${courseId}?payment=success`,
      cancel_url: `${fixedOrigin}/course/${courseId}?payment=cancel`,
      metadata: {
        courseId,
        userId,
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Stripe error:", error);
    // @ts-ignore
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});