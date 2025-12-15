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

    const createdEvent = await Event.create(eventData);

    return NextResponse.json(
      {
        message: "Event created successfully",
        event: createdEvent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Event creation failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
