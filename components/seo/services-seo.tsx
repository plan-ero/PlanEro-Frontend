"use client";

import { useIsBot } from "@/hooks/use-is-bot";

interface ServicesSEOProps {
  services?: Array<{
    name: string;
    description?: string;
    serviceType: string;
    eventTypes?: string[];
    price?: string;
    location?: string;
  }>;
  totalCount?: number;
  category?: string;
}

export function ServicesSEO({
  services = [],
  totalCount,
  category,
}: ServicesSEOProps) {
  const isBot = useIsBot();

  if (!isBot) return null;

  return (
    <div
      style={{ position: "absolute", left: "-9999px", top: "-9999px" }}
      aria-hidden="true"
    >
      <header>
        <h1>
          {category ? `${category} Services` : "Event Services"} - PlanEro
        </h1>
        <p>
          Find professional event services for your special occasions.{" "}
          {totalCount ? `${totalCount}+` : "Browse"}
          verified service providers including venues, catering, photography,
          entertainment, and more.
        </p>
      </header>

      <main>
        <section>
          <h2>About Our Services</h2>
          <p>
            PlanEro offers a comprehensive directory of event services for all
            types of occasions. Whether you need a venue, catering, photography,
            entertainment, or decoration services, find verified and reviewed
            professionals ready to make your event unforgettable.
          </p>
        </section>

        <section>
          <h2>Service Types</h2>
          <ul>
            <li>Venues - Wedding halls, banquet halls, outdoor spaces</li>
            <li>Photography & Videography - Professional event coverage</li>
            <li>Catering - Food and beverage services</li>
            <li>Decoration - Event styling and decoration</li>
            <li>Entertainment - DJs, musicians, performers</li>
            <li>Florists - Floral arrangements and designs</li>
            <li>Bakers - Custom cakes and desserts</li>
            <li>Transportation - Event logistics and travel</li>
          </ul>
        </section>

        {services.length > 0 && (
          <section>
            <h2>{category ? `${category} Services` : "Available Services"}</h2>
            <ul>
              {services.map((service, index) => (
                <li key={index}>
                  <article>
                    <h3>{service.name}</h3>
                    <p>Service Type: {service.serviceType}</p>
                    {service.description && <p>{service.description}</p>}
                    {service.location && (
                      <address>Location: {service.location}</address>
                    )}
                    {service.price && <p>Price: {service.price}</p>}
                    {service.eventTypes && service.eventTypes.length > 0 && (
                      <p>Suitable for: {service.eventTypes.join(", ")}</p>
                    )}
                  </article>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <h2>Event Types We Serve</h2>
          <ul>
            <li>Weddings and Wedding Receptions</li>
            <li>Corporate Events and Conferences</li>
            <li>Birthday Celebrations</li>
            <li>Engagement Parties</li>
            <li>Anniversary Celebrations</li>
            <li>Baby Showers</li>
            <li>Graduation Parties</li>
            <li>Holiday Events</li>
          </ul>
        </section>

        <section>
          <h2>How It Works</h2>
          <ol>
            <li>Browse our directory of verified services</li>
            <li>Compare prices, reviews, and availability</li>
            <li>Send inquiries to your preferred providers</li>
            <li>Book and manage your event services</li>
          </ol>
        </section>
      </main>
    </div>
  );
}
