"use client";

import Link from "next/link";
import { hostFaqs } from "../../lib/productContent";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Button } from "../ui/button";
import { Section } from "../layout/Section";
import { Eyebrow } from "../layout/Eyebrow";
import { Ledger } from "../layout/Ledger";

const quickLinks = [
  {
    href: "/cars/list-car",
    title: "Review the listing flow",
    description: "See the exact host steps before you open the add-car form.",
  },
  {
    href: "/dashboard/add-car",
    title: "Jump to add car",
    description: "Already signed in? Move straight into listing creation.",
  },
  {
    href: "/dashboard/bookings",
    title: "Open bookings",
    description: "Switch to the host view to monitor reservations on your cars.",
  },
];

const HostFaq = () => {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: hostFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <Section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="space-y-8 lg:col-span-5">
          <div className="space-y-4">
            <Eyebrow>Host FAQ</Eyebrow>
            <h2 className="text-h1 text-foreground">Questions hosts ask before they publish</h2>
            <p className="type-lede text-[15px]">Account setup, listing fields, inventory control and reservation tracking.</p>
          </div>

          <Ledger>
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center justify-between gap-4 py-4 transition-colors duration-150 hover:text-primary"
              >
                <div>
                  <h3 className="text-sm font-medium text-foreground transition-colors duration-150 group-hover:text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
                <span
                  aria-hidden="true"
                  className="font-mono text-sm text-muted-foreground transition-transform duration-200 ease-out-quart group-hover:translate-x-0.5 group-hover:text-primary"
                >
                  →
                </span>
              </Link>
            ))}
          </Ledger>
        </div>

        <div className="space-y-10 lg:col-span-7">
          <Accordion type="single" collapsible defaultValue="faq-0">
            {hostFaqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`faq-${index}`}>
                <AccordionTrigger index={`0${index + 1}`}>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h3 className="text-h3 text-foreground">Ready to publish your first listing?</h3>
              <p className="text-sm text-muted-foreground">Create a host account, add a car, and manage the full lifecycle.</p>
            </div>
            <Button asChild variant="ink" size="lg" className="shrink-0">
              <Link href="/signup?role=host">Start hosting</Link>
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default HostFaq;
