import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";

const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = newsletterSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const { email } = result.data;

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Database not configured yet. Subscription could not be saved." },
        { status: 503 }
      );
    }

    const admin = getSupabaseAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "Database service unavailable." },
        { status: 500 }
      );
    }

    // Check if already subscribed
    const { data: existing } = await admin
      .from("newsletter_subscribers")
      .select("id, subscription_status")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (existing) {
      if (existing.subscription_status === "subscribed") {
        return NextResponse.json(
          { message: "You are already subscribed to CADO updates!" },
          { status: 200 }
        );
      } else {
        // Resubscribe
        await admin
          .from("newsletter_subscribers")
          .update({
            subscription_status: "subscribed",
            subscribed_at: new Date().toISOString(),
            unsubscribed_at: null,
          })
          .eq("id", existing.id);

        return NextResponse.json(
          { message: "Welcome back! Your subscription has been reactivated." },
          { status: 200 }
        );
      }
    }

    const { error: insertError } = await admin
      .from("newsletter_subscribers")
      .insert({
        email: email.toLowerCase(),
        subscription_status: "subscribed",
        subscribed_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error("Newsletter subscription error:", insertError);
      return NextResponse.json(
        { error: "Failed to record subscription. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Thank you for subscribing to CADO updates & special offers!" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Newsletter error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
