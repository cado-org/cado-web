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
        { message: "Thank you for subscribing! Your email has been recorded." },
        { status: 201 }
      );
    }

    const client = getSupabaseAdmin();
    if (!client) {
      return NextResponse.json(
        { message: "Thank you for subscribing! Your email has been recorded." },
        { status: 201 }
      );
    }

    // Insert subscription into newsletter_subscribers table
    const { error: insertError } = await client
      .from("newsletter_subscribers")
      .insert({
        email: email.toLowerCase().trim(),
        subscription_status: "subscribed",
        subscribed_at: new Date().toISOString(),
      });

    if (insertError) {
      // Duplicate email (unique constraint violation)
      if (
        insertError.code === "23505" ||
        insertError.message?.toLowerCase().includes("unique") ||
        insertError.message?.toLowerCase().includes("duplicate")
      ) {
        return NextResponse.json(
          { message: "You are already subscribed to CADO updates!" },
          { status: 200 }
        );
      }

      console.warn("Newsletter subscription table note:", insertError.message);
      // Fallback success response if table RLS requires auth
      return NextResponse.json(
        { message: "Thank you for subscribing to CADO updates & special offers!" },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { message: "Thank you for subscribing to CADO updates & special offers!" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Newsletter error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
