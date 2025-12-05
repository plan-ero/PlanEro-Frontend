import { TransitionLink } from "@/components/transition-link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t" style={{ viewTransitionName: "site-footer" }}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">PLANERO</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Find unique venues, vendors, and services for your special event.
            </p>
            <div className="flex space-x-4">
              <TransitionLink
                href="#"
                className="text-muted-foreground hover:text-primary"
              >
                <Facebook className="h-5 w-5" />
              </TransitionLink>
              <TransitionLink
                href="#"
                className="text-muted-foreground hover:text-primary"
              >
                <Twitter className="h-5 w-5" />
              </TransitionLink>
              <TransitionLink
                href="#"
                className="text-muted-foreground hover:text-primary"
              >
                <Instagram className="h-5 w-5" />
              </TransitionLink>
              <TransitionLink
                href="#"
                className="text-muted-foreground hover:text-primary"
              >
                <Linkedin className="h-5 w-5" />
              </TransitionLink>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Venues</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <TransitionLink
                  href="/venues/wedding"
                  className="text-muted-foreground hover:text-primary"
                >
                  Wedding Venues
                </TransitionLink>
              </li>
              <li>
                <TransitionLink
                  href="/venues/corporate"
                  className="text-muted-foreground hover:text-primary"
                >
                  Corporate Events
                </TransitionLink>
              </li>
              <li>
                <TransitionLink
                  href="/venues/birthday"
                  className="text-muted-foreground hover:text-primary"
                >
                  Birthday Parties
                </TransitionLink>
              </li>
              <li>
                <TransitionLink
                  href="/venues/baby-shower"
                  className="text-muted-foreground hover:text-primary"
                >
                  Baby Showers
                </TransitionLink>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <TransitionLink
                  href="/services/photographers"
                  className="text-muted-foreground hover:text-primary"
                >
                  Photographers
                </TransitionLink>
              </li>
              <li>
                <TransitionLink
                  href="/services/caterers"
                  className="text-muted-foreground hover:text-primary"
                >
                  Caterers
                </TransitionLink>
              </li>
              <li>
                <TransitionLink
                  href="/services/musicians"
                  className="text-muted-foreground hover:text-primary"
                >
                  Musicians
                </TransitionLink>
              </li>
              <li>
                <TransitionLink
                  href="/services/florists"
                  className="text-muted-foreground hover:text-primary"
                >
                  Florists
                </TransitionLink>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <TransitionLink
                  href="/about"
                  className="text-muted-foreground hover:text-primary"
                >
                  About Us
                </TransitionLink>
              </li>
              <li>
                <TransitionLink
                  href="/pwa"
                  className="text-muted-foreground hover:text-primary"
                >
                  Get Mobile App
                </TransitionLink>
              </li>
              <li>
                <TransitionLink
                  href="/contact"
                  className="text-muted-foreground hover:text-primary"
                >
                  Contact
                </TransitionLink>
              </li>
              <li>
                <TransitionLink
                  href="/privacy"
                  className="text-muted-foreground hover:text-primary"
                >
                  Privacy Policy
                </TransitionLink>
              </li>
              <li>
                <TransitionLink
                  href="/terms-and-conditions"
                  className="text-muted-foreground hover:text-primary"
                >
                  Terms and Conditions
                </TransitionLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 PlanEro All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
