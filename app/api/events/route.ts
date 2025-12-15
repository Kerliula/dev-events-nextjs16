import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { Event } from "@/database";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const formData = await request.formData();

    let event;

    try {
      event = Object.fromEntries(formData.entries());
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid form data" },
        { status: 400 }
      );
    }

    const createdEvent = await Event.create(event);

    return NextResponse.json(
      {
        message: "event created successfully",
        event: createdEvent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "event creation failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
