import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">PLANERO</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Find unique venues, vendors, and services for your special event.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Venues</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/venues/wedding"
                  className="text-muted-foreground hover:text-primary"
                >
                  Wedding Venues
                </Link>
              </li>
              <li>
                <Link
                  href="/venues/corporate"
                  className="text-muted-foreground hover:text-primary"
                >
                  Corporate Events
                </Link>
              </li>
              <li>
                <Link
                  href="/venues/birthday"
                  className="text-muted-foreground hover:text-primary"
                >
                  Birthday Parties
                </Link>
              </li>
              <li>
                <Link
                  href="/venues/baby-shower"
                  className="text-muted-foreground hover:text-primary"
                >
                  Baby Showers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/services/photographers"
                  className="text-muted-foreground hover:text-primary"
                >
                  Photographers
                </Link>
              </li>
              <li>
                <Link
                  href="/services/caterers"
                  className="text-muted-foreground hover:text-primary"
                >
                  Caterers
                </Link>
              </li>
              <li>
                <Link
                  href="/services/musicians"
                  className="text-muted-foreground hover:text-primary"
                >
                  Musicians
                </Link>
              </li>
              <li>
                <Link
                  href="/services/florists"
                  className="text-muted-foreground hover:text-primary"
                >
                  Florists
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/pwa"
                  className="text-muted-foreground hover:text-primary"
                >
                  Get Mobile App
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="text-muted-foreground hover:text-primary"
                >
                  Terms and Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 PlanEro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
