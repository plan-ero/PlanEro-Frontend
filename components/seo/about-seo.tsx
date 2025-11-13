"use client";

import { useIsBot } from "@/hooks/use-is-bot";

interface AboutSEOProps {
  companyName?: string;
  foundedYear?: number;
  mission?: string;
}

export function AboutSEO({ 
  companyName = "PlanEro", 
  foundedYear = 2019,
  mission 
}: AboutSEOProps) {
  const isBot = useIsBot();

  if (!isBot) return null;

  return (
    <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }} aria-hidden="true">
      <header>
        <h1>About {companyName}</h1>
        <p>Learn about our mission to revolutionize event planning and connect people with perfect venues, vendors, and services.</p>
      </header>

      <main>
        <section>
          <h2>Our Story</h2>
          <p>
            Founded in {foundedYear}, {companyName} started with a simple mission: to make event planning 
            accessible, enjoyable, and stress-free for everyone. What began as a small team of passionate 
            event enthusiasts has grown into a comprehensive platform connecting event hosts with the best 
            vendors and venues.
          </p>
        </section>

        {mission && (
          <section>
            <h2>Our Mission</h2>
            <p>{mission}</p>
          </section>
        )}

        <section>
          <h2>What We Do</h2>
          <p>
            {companyName} brings together everything you need in one place—from stunning venues to 
            talented vendors, all vetted for quality. Our platform empowers you to discover, compare, 
            and book with confidence.
          </p>
        </section>

        <section>
          <h2>Why Choose {companyName}?</h2>
          <ul>
            <li>Passionate about creating memorable events</li>
            <li>Expert team with years of experience</li>
            <li>Award-winning customer service</li>
            <li>Punctual and reliable</li>
            <li>Verified and trusted vendors</li>
            <li>Transparent pricing</li>
            <li>Dedicated customer support</li>
          </ul>
        </section>

        <section>
          <h2>Our Values</h2>
          <ul>
            <li>Excellence in every detail</li>
            <li>Transparent and honest communication</li>
            <li>Creative and innovative solutions</li>
            <li>Personalized service for each client</li>
            <li>Sustainable and eco-friendly practices</li>
            <li>Building lasting relationships</li>
          </ul>
        </section>

        <section>
          <h2>Our Team</h2>
          <p>
            Our founders and team bring together expertise in event planning, technology, and creative 
            design to provide the best possible experience for our clients and vendors.
          </p>
        </section>

        <section>
          <h2>Contact Information</h2>
          <p>Get in touch with us to learn more about our services or to start planning your event.</p>
        </section>
      </main>
    </div>
  );
}
