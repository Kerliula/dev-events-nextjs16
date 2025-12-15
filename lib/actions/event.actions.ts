"use server";

import { IEvent, Event } from "@/database";
import connectDB from "@/lib/mongodb";

export const getSimilarEventsBySlug = async (slug: string) => {
  try {
    await connectDB();

    const event = await Event.findOne({ slug }).lean<IEvent>();

    const similarEvents = await Event.find({
      tags: { $in: event?.tags || [] },
      _id: { $ne: event?._id },
    })
      .lean<IEvent[]>();

    return similarEvents;
  } catch (error) {
    console.error("Error fetching similar events:", error);
    return [];
  }
};
