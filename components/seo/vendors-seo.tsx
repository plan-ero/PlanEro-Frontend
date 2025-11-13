"use client";

import { useIsBot } from "@/hooks/use-is-bot";

interface VendorsSEOProps {
  vendors?: Array<{
    businessName: string;
    location: string;
    bio: string;
    phoneNumber?: string;
    email?: string;
  }>;
  totalCount?: number;
}

export function VendorsSEO({ vendors = [], totalCount }: VendorsSEOProps) {
  const isBot = useIsBot();

  if (!isBot) return null;

  return (
    <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }} aria-hidden="true">
      <header>
        <h1>Event Vendors - PlanEro</h1>
        <p>Browse our directory of verified event vendors. Find photographers, caterers, decorators, DJs, and more for your special event.</p>
      </header>

      <main>
        <section>
          <h2>About Our Vendors</h2>
          <p>
            PlanEro connects you with {totalCount ? `${totalCount}+` : 'trusted'} professional event vendors. 
            All vendors are verified and reviewed by our community. Find the perfect service providers 
            for weddings, corporate events, parties, and more.
          </p>
        </section>

        <section>
          <h2>Vendor Categories</h2>
          <ul>
            <li>Photographers and Videographers</li>
            <li>Caterers and Food Services</li>
            <li>Event Decorators</li>
            <li>DJs and Musicians</li>
            <li>Wedding Bands</li>
            <li>Event Hosts and Anchors</li>
            <li>Magicians and Entertainers</li>
            <li>Florists</li>
            <li>Bakers and Cake Designers</li>
            <li>Transportation Services</li>
            <li>Grooming and Styling</li>
          </ul>
        </section>

        {vendors.length > 0 && (
          <section>
            <h2>Featured Vendors</h2>
            <ul>
              {vendors.map((vendor, index) => (
                <li key={index}>
                  <article>
                    <h3>{vendor.businessName}</h3>
                    <address>{vendor.location}</address>
                    <p>{vendor.bio}</p>
                    {vendor.phoneNumber && <p>Phone: {vendor.phoneNumber}</p>}
                    {vendor.email && <p>Email: {vendor.email}</p>}
                  </article>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <h2>Why Book Through PlanEro?</h2>
          <ul>
            <li>All vendors are verified and approved</li>
            <li>Read genuine customer reviews and ratings</li>
            <li>Easy inquiry and booking process</li>
            <li>Compare multiple vendors at once</li>
            <li>Secure and reliable service</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
