import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

const primaryFAQs: FAQ[] = [
  {
    question: "Can I cancel my trial anytime?",
    answer: "Yes! Your 7-day trial is completely free. You can cancel at any point during the trial and you won't be charged a single cent.",
  },
  {
    question: "How does the yearly billing work?",
    answer: "The Yearly Elite plan is billed as a single payment of $199/year, which works out to about $16.58/month — saving you 43% compared to paying monthly.",
  },
  {
    question: "Can I switch plans later?",
    answer: "Absolutely. You can upgrade from Trial to Monthly or Yearly at any time. If you're on Monthly, you can switch to Yearly and we'll prorate the difference.",
  },
  {
    question: "What happens when my trial ends?",
    answer: "After 7 days, your trial expires and you'll need to choose a paid plan to continue. Your interview history and progress are saved so you can pick up right where you left off.",
  },
];

const allFAQs: FAQ[] = [
  ...primaryFAQs,
  {
    question: "Do you offer refunds?",
    answer: "Yes, we offer a 14-day money-back guarantee on all paid plans. If you're not satisfied, contact us within 14 days of purchase for a full refund.",
  },
  {
    question: "Is my payment information secure?",
    answer: "All payments are processed through Stripe, the industry-leading payment processor. We never store your credit card details on our servers.",
  },
  {
    question: "Can I use the platform for multiple technologies?",
    answer: "Yes! All plans let you practice across different technologies and roles. Monthly Pro and Yearly Elite give you access to all 70+ companies and all question domains.",
  },
  {
    question: "What's included in 'Priority AI Response Speed'?",
    answer: "Paid plan users get faster AI processing for interview questions and feedback, meaning shorter wait times between questions during mock interviews.",
  },
  {
    question: "Do you offer team or enterprise pricing?",
    answer: "Not yet, but we're working on it! If you're interested in team pricing, reach out to us and we'll keep you updated.",
  },
  {
    question: "What AI models power the interviews?",
    answer: "We use state-of-the-art AI models to generate questions, evaluate answers, and provide detailed feedback tailored to your target company and role.",
  },
];

const FAQAccordion = ({ faqs }: { faqs: FAQ[] }) => (
  <Accordion type="single" collapsible className="w-full">
    {faqs.map((faq, i) => (
      <AccordionItem key={i} value={`faq-${i}`} className="border-border/50">
        <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline">
          {faq.question}
        </AccordionTrigger>
        <AccordionContent className="text-sm text-muted-foreground">
          {faq.answer}
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
);

const PricingFAQ = () => (
  <div className="mt-24 max-w-3xl mx-auto">
    <h2 className="text-2xl font-display font-bold mb-8 text-center">Frequently Asked Questions</h2>
    <FAQAccordion faqs={primaryFAQs} />
    <div className="mt-6 text-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <HelpCircle className="h-4 w-4" />
            See All FAQs
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-display">All Pricing FAQs</DialogTitle>
          </DialogHeader>
          <FAQAccordion faqs={allFAQs} />
        </DialogContent>
      </Dialog>
    </div>
  </div>
);

export default PricingFAQ;
