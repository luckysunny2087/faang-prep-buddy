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
    question: "Can I cancel my Basic trial anytime?",
    answer: "Yes! Your 7-day Basic trial is completely free. You can cancel at any point during the trial and you won't be charged a single cent.",
  },
  {
    question: "What's the difference between Pro and Elite?",
    answer: "Pro ($14.99/mo) gives you unlimited interviews, 70+ companies, timed simulations, detailed analytics, cover letter generator, and interview tracking. Elite ($19.99/mo) includes everything in Pro plus personalized learning roadmaps, AI resume review, voice practice, PDF reports, expert guides, early feature access, and priority email support.",
  },
  {
    question: "Can I upgrade from Basic to Pro or Elite?",
    answer: "Absolutely! You can upgrade at any time. Just go to the Pricing page or use the upgrade prompt in your Dashboard. Your interview history and progress are always preserved.",
  },
  {
    question: "What happens when my Basic trial ends?",
    answer: "After 7 days, your Basic trial expires and you'll need to choose Pro or Elite to continue. Your interview history and progress are saved so you can pick up right where you left off.",
  },
];

const allFAQs: FAQ[] = [
  ...primaryFAQs,
  {
    question: "How much can I save with Elite?",
    answer: "Elite is just $5/month more than Pro but includes personalized roadmaps, AI resume review, voice practice, PDF reports, and priority support — saving you $60/year compared to buying these features separately.",
  },
  {
    question: "Do you offer refunds?",
    answer: "Yes, we offer a 14-day money-back guarantee on both Pro and Elite plans. If you're not satisfied, contact us within 14 days of purchase for a full refund.",
  },
  {
    question: "Is my payment information secure?",
    answer: "All payments are processed through Stripe, the industry-leading payment processor. We never store your credit card details on our servers.",
  },
  {
    question: "Can I use the platform for multiple technologies?",
    answer: "Yes! All plans let you practice across different technologies and roles. Pro and Elite give you access to all 70+ companies and all question domains.",
  },
  {
    question: "Can I switch between Pro and Elite?",
    answer: "Yes, you can upgrade from Pro to Elite or downgrade from Elite to Pro at any time. Changes take effect immediately with prorated billing.",
  },
  {
    question: "What's included in 'Priority AI Response Speed'?",
    answer: "Pro and Elite users get faster AI processing for interview questions and feedback, meaning shorter wait times between questions during mock interviews.",
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
