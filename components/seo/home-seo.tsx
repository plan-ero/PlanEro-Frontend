"use client";

import { useIsBot } from "@/hooks/use-is-bot";

interface HomeSEOProps {
  featuredVenues?: Array<{
    name: string;
    location: string;
    description: string;
  }>;
  featuredServices?: Array<{ name: string; type: string; description: string }>;
  categories?: Array<{ name: string; description: string }>;
}

export function HomeSEO({
  featuredVenues = [],
  featuredServices = [],
  categories = [],
}: HomeSEOProps) {
  const isBot = useIsBot();

  if (!isBot) return null;

  return (
    <div
      style={{ position: "absolute", left: "-9999px", top: "-9999px" }}
      aria-hidden="true"
    >
      <header>
        <h1>PlanEro - Event Planning Platform</h1>
        <p>
          Find the perfect venues, services, and vendors for your events.
          Weddings, corporate events, birthdays, and more.
        </p>
      </header>

      <main>
        <section>
          <h2>About PlanEro</h2>
          <p>
            PlanEro is a comprehensive event planning platform connecting event
            hosts with trusted vendors, beautiful venues, and professional
            services. Whether you're planning a wedding, corporate event,
            birthday party, or any special occasion, we make it easy to find and
            book everything you need.
          </p>
        </section>

        {categories.length > 0 && (
          <section>
            <h2>Service Categories</h2>
            <ul>
              {categories.map((category, index) => (
                <li key={index}>
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {featuredVenues.length > 0 && (
          <section>
            <h2>Featured Venues</h2>
            <ul>
              {featuredVenues.map((venue, index) => (
                <li key={index}>
                  <article>
                    <h3>{venue.name}</h3>
                    <address>{venue.location}</address>
                    <p>{venue.description}</p>
                  </article>
                </li>
              ))}
            </ul>
          </section>
        )}

        {featuredServices.length > 0 && (
          <section>
            <h2>Featured Services</h2>
            <ul>
              {featuredServices.map((service, index) => (
                <li key={index}>
                  <article>
                    <h3>{service.name}</h3>
                    <p>Service Type: {service.type}</p>
                    <p>{service.description}</p>
                  </article>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <h2>Why Choose PlanEro?</h2>
          <ul>
            <li>Verified vendors and service providers</li>
            <li>Wide selection of venues across multiple locations</li>
            <li>Easy booking and inquiry system</li>
            <li>Customer reviews and ratings</li>
            <li>Professional event planning tools</li>
            <li>Dedicated customer support</li>
          </ul>
        </section>

        <section>
          <h2>Event Types We Support</h2>
          <ul>
            <li>Weddings and Engagements</li>
            <li>Corporate Events and Conferences</li>
            <li>Birthday Parties</li>
            <li>Anniversary Celebrations</li>
            <li>Baby Showers</li>
            <li>Graduations</li>
            <li>Holiday Parties</li>
            <li>And many more!</li>
          </ul>
        </section>
      </main>

      <footer>
        <p>
          Contact us for more information about planning your perfect event.
        </p>
      </footer>
    </div>
  );
}
