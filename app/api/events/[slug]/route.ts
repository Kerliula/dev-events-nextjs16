import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { Event, IEvent } from "@/database";

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * GET /api/events/[slug]
 * Fetches a single event by its unique slug
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    await connectDB();

    const { slug } = await params;

    // Validate slug parameter
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { message: "Invalid or missing slug parameter" },
        { status: 400 }
      );
    }

    // Sanitize slug (basic validation for URL-safe characters)
    const sanitizedSlug = slug.trim().toLowerCase();
    if (!/^[a-z0-9-]+$/.test(sanitizedSlug)) {
      return NextResponse.json(
        { message: "Slug must contain only lowercase letters, numbers, and hyphens" },
        { status: 400 }
      );
    }

    // Query event by slug
    const event = await Event.findOne({ slug: sanitizedSlug }).lean<IEvent>();

    // Handle event not found
    if (!event) {
      return NextResponse.json(
        { message: `Event with slug '${sanitizedSlug}' not found` },
        { status: 404 }
      );
    }

    // Return event data
    return NextResponse.json(
      {
        message: "Event retrieved successfully",
        event,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching event by slug:", error);

    // Handle Mongoose CastError or validation errors
    if (error instanceof Error && error.name === 'CastError') {
      return NextResponse.json(
        { message: "Invalid slug format" },
        { status: 400 }
      );
    }

    // Handle unexpected errors
    return NextResponse.json(
      {
        message: "Failed to retrieve event",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
