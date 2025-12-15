import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { Event } from "@/database";
import { parseEventFormData } from "@/lib/upload";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const formData = await request.formData();

    // Parse form data and handle image upload
    const { data: eventData, error } = await parseEventFormData(formData);

    if (error || !eventData) {
      return NextResponse.json(
        { message: error || "Invalid form data" },
        { status: 400 }
      );
    }

    // Sanitize input: only allow specific fields, prevent mass-assignment
    const allowedFields = [
      'title',
      'description',
      'overview',
      'image',
      'venue',
      'location',
      'date',
      'time',
      'mode',
      'audience',
      'agenda',
      'organizer',
      'tags',
    ];

    const sanitizedData: Record<string, any> = {};

    for (const field of allowedFields) {
      if (eventData[field] !== undefined) {
        sanitizedData[field] = eventData[field];
      }
    }

    // Validate required fields
    const requiredFields = [
      'title',
      'description',
      'overview',
      'image',
      'venue',
      'location',
      'date',
      'time',
      'mode',
      'audience',
      'agenda',
      'organizer',
      'tags',
    ];

    const missingFields = requiredFields.filter(field => !sanitizedData[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate mode enum
    if (!['online', 'offline', 'hybrid'].includes(sanitizedData.mode)) {
      return NextResponse.json(
        { message: 'Mode must be online, offline, or hybrid' },
        { status: 400 }
      );
    }

    // Validate arrays
    if (!Array.isArray(sanitizedData.agenda) || sanitizedData.agenda.length === 0) {
      return NextResponse.json(
        { message: 'Agenda must be a non-empty array' },
        { status: 400 }
      );
    }

    if (!Array.isArray(sanitizedData.tags) || sanitizedData.tags.length === 0) {
      return NextResponse.json(
        { message: 'Tags must be a non-empty array' },
        { status: 400 }
      );
    }

    // Explicitly exclude protected fields (slug, createdAt, updatedAt auto-generated)
    // Do not allow _id, slug, createdAt, updatedAt from client
    const createdEvent = await Event.create(sanitizedData);

    return NextResponse.json(
      {
        message: "Event created successfully",
        event: createdEvent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    // Handle Mongoose validation errors with 400 status
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        {
          message: "Validation failed",
          error: error.message,
        },
        { status: 400 }
      );
    }

    // Handle other errors with 500 status
    return NextResponse.json(
      {
        message: "Event creation failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const events = await Event.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      {
        message: "Events retrieved successfully",
        events,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Failed to retrieve events",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
