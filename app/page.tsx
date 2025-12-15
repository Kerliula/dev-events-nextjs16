import ExploreBtn from "@/components/ui/ExploreBtn";
import EventCard from "@/components/ui/EventCard";
import { IEvent } from "@/database";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Home = async () => {
  const response = await fetch(`${BASE_URL}/api/events`, { cache: "no-store" });
  const { events } = await response.json();

  return (
    <section>
      <h1 className="text-center">
        The Hub for Every Dev <br /> Events you can't miss
      </h1>
      <p className="text-center mt-5">
        Hackatrons, Meetups, and Conferences, All in one place
      </p>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>

        <ul className="events">
          {events &&
            events.length > 0 &&
            events.map((event: IEvent) => (
              <li key={event.title} style={{ listStyle: "none" }}>
                <EventCard {...event} />
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
};

export default Home;
