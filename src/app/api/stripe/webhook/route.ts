import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
// import { createSupabaseAdmin } from "@/lib/supabase"; // Uncomment when persisting subscription data
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // const supabase = createSupabaseAdmin(); // Used when persisting subscription data

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      // Update user's subscription in Supabase
      if (session.customer && session.metadata?.plan) {
        console.log(
          `Subscription created: customer=${session.customer}, plan=${session.metadata.plan}`
        );
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      console.log(`Subscription updated: ${subscription.id}, status=${subscription.status}`);
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      console.log(`Subscription canceled: ${subscription.id}`);
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      console.log(`Payment failed: ${invoice.id}`);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
