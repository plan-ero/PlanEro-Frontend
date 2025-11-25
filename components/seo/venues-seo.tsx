"use client";

import { useIsBot } from "@/hooks/use-is-bot";

interface VenuesSEOProps {
  venues?: Array<{
    name: string;
    location: string;
    description?: string;
    capacity?: number;
    amenities?: string[];
    eventTypes?: string[];
  }>;
  totalCount?: number;
}

export function VenuesSEO({ venues = [], totalCount }: VenuesSEOProps) {
  const isBot = useIsBot();

  if (!isBot) return null;

  return (
    <div
      style={{ position: "absolute", left: "-9999px", top: "-9999px" }}
      aria-hidden="true"
    >
      <header>
        <h1>Event Venues - PlanEro</h1>
        <p>
          Discover {totalCount ? `${totalCount}+` : "beautiful"} event venues
          for your special occasions. Wedding halls, banquet halls, outdoor
          spaces, and more.
        </p>
      </header>

      <main>
        <section>
          <h2>About Our Venues</h2>
          <p>
            Browse our curated selection of event venues perfect for weddings,
            corporate events, parties, and celebrations. Each venue is verified
            and features detailed information about capacity, amenities, and
            availability.
          </p>
        </section>

        <section>
          <h2>Venue Types</h2>
          <ul>
            <li>Wedding Venues and Banquet Halls</li>
            <li>Corporate Event Spaces and Conference Centers</li>
            <li>Outdoor Venues and Gardens</li>
            <li>Party Halls and Celebration Spaces</li>
            <li>Hotel Ballrooms</li>
            <li>Restaurant Event Spaces</li>
            <li>Historic and Unique Venues</li>
          </ul>
        </section>

        {venues.length > 0 && (
          <section>
            <h2>Featured Venues</h2>
            <ul>
              {venues.map((venue, index) => (
                <li key={index}>
                  <article>
                    <h3>{venue.name}</h3>
                    <address>{venue.location}</address>
                    {venue.description && <p>{venue.description}</p>}
                    {venue.capacity && (
                      <p>Capacity: Up to {venue.capacity} guests</p>
                    )}
                    {venue.amenities && venue.amenities.length > 0 && (
                      <>
                        <h4>Amenities:</h4>
                        <ul>
                          {venue.amenities.map((amenity, i) => (
                            <li key={i}>{amenity}</li>
                          ))}
                        </ul>
                      </>
                    )}
                    {venue.eventTypes && venue.eventTypes.length > 0 && (
                      <p>Suitable for: {venue.eventTypes.join(", ")}</p>
                    )}
                  </article>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <h2>Find the Perfect Venue</h2>
          <ul>
            <li>Search by location, capacity, and amenities</li>
            <li>View detailed photos and virtual tours</li>
            <li>Check real-time availability</li>
            <li>Read reviews from past events</li>
            <li>Compare pricing and packages</li>
            <li>Book directly through our platform</li>
          </ul>
        </section>

        <section>
          <h2>Popular Event Types</h2>
          <ul>
            <li>Weddings and Wedding Receptions</li>
            <li>Corporate Meetings and Conferences</li>
            <li>Birthday Parties</li>
            <li>Anniversary Celebrations</li>
            <li>Engagement Parties</li>
            <li>Baby Showers</li>
            <li>Graduation Celebrations</li>
            <li>Holiday Parties</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
