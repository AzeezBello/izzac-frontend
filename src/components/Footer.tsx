import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { HiOutlineGlobe } from "react-icons/hi";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";

const footerSections = [
  {
    title: "Explore",
    links: [
      { href: "/cars", label: "Browse cars" },
      { href: "/host", label: "Become a host" },
      { href: "/cars/list-car", label: "List a car" },
      { href: "/signup", label: "Create account" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Log in" },
      { href: "/dashboard", label: "My garage" },
      { href: "/dashboard/bookings", label: "Bookings" },
      { href: "/dashboard/rider", label: "Rider dashboard" },
    ],
  },
  {
    title: "Host tools",
    links: [
      { href: "/signup?role=host", label: "Host sign up" },
      { href: "/dashboard/add-car", label: "Add a car" },
      { href: "/dashboard/host", label: "Host dashboard" },
      { href: "/", label: "Featured listings" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="border-t border-border/80 bg-secondary/40 text-foreground">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-10">
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="text-xl font-bold tracking-[-0.03em] text-foreground">
                Izzac
              </span>
              <Badge variant="emerald">Unified Mobility</Badge>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Peer-to-peer vehicle sharing engineered for seamless switching between booking rides and managing your own fleet.
            </p>
            <div className="flex items-center gap-3 pt-1 font-mono text-xs text-muted-foreground tabular-nums">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-card px-2.5 py-1">
                <HiOutlineGlobe className="text-primary" />
                <span>Nigeria (NG)</span>
              </span>
              <span className="inline-flex items-center rounded-md border border-border/80 bg-card px-2.5 py-1">
                ₦ NGN / $ USD
              </span>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {footerSections.map((section) => (
              <div key={section.title} className="space-y-3">
                <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                  {section.title}
                </h3>
                <ul className="space-y-2.5 text-sm">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-muted-foreground transition-colors duration-150 ease-out-quart hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-mono tabular-nums">© 2026 Izzac.</span>
            <span aria-hidden="true">·</span>
            <Link href="/" className="hover:text-foreground transition-colors duration-150">
              Home
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/cars" className="hover:text-foreground transition-colors duration-150">
              Browse cars
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/host" className="hover:text-foreground transition-colors duration-150">
              Host
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/login" className="hover:text-foreground transition-colors duration-150">
              Log in
            </Link>
          </div>

          <div className="flex items-center gap-4 text-muted-foreground">
            <a
              href="#facebook"
              aria-label="Facebook"
              className="hover:text-foreground transition-colors duration-150"
            >
              <FaFacebookF />
            </a>
            <a
              href="#twitter"
              aria-label="Twitter"
              className="hover:text-foreground transition-colors duration-150"
            >
              <FaTwitter />
            </a>
            <a
              href="#instagram"
              aria-label="Instagram"
              className="hover:text-foreground transition-colors duration-150"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
