"use client";

import Link from "next/link";
import { hostFaqs } from "../../lib/productContent";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

const quickLinks = [
  {
    href: "/cars/list-car",
    title: "Review the listing flow",
    description: "See the exact host steps before you open the add-car form.",
  },
  {
    href: "/dashboard/add-car",
    title: "Jump to add car",
    description:
      "If you are already signed in, move straight into listing creation.",
  },
  {
    href: "/dashboard/bookings",
    title: "Open bookings",
    description:
      "Switch into the host view to monitor reservations on your cars.",
  },
];

const HostFaq = () => {
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24 text-foreground">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        <div className="lg:col-span-5 space-y-5">
          <Badge variant="emerald">Host FAQ</Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            Questions hosts usually ask before they publish
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Everything you need to know about account setup, listing fields, inventory control, and reservation tracking.
          </p>

          <div className="pt-2 divide-y divide-border/80 rounded-xl border border-border/80 bg-card shadow-surface overflow-hidden">
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group block p-4 transition-colors duration-150 ease-out-quart hover:bg-secondary/60"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-150">
                    {item.title}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="font-mono text-xs text-muted-foreground transition-transform duration-150 ease-out-quart group-hover:translate-x-0.5 group-hover:text-primary"
                  >
                    →
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 space-y-8">
          <div className="rounded-2xl border border-border/80 bg-card px-6 py-2 shadow-surface">
            <Accordion type="single" collapsible defaultValue="faq-0">
              {hostFaqs.map((faq, index) => (
                <AccordionItem key={faq.question} value={`faq-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="rounded-2xl border border-border/90 bg-secondary/50 p-6 md:p-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-xl font-bold tracking-[-0.02em]">
                Ready to publish your first listing?
              </h3>
              <p className="text-sm text-muted-foreground">
                Create your host account, add a car, and manage the full lifecycle from Izzac.
              </p>
            </div>
            <Button asChild variant="editorial" size="lg" className="shrink-0">
              <Link href="/signup?role=host">Start hosting</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HostFaq;
