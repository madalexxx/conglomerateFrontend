import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What communications protocols do you support?",
    answer:
      "We support end-to-end encrypted messaging, distributed relay protocols, and custom implementations. Our infrastructure is protocol-agnostic and continuously updated with the latest cryptographic standards.",
  },
  {
    question: "How is pricing calculated?",
    answer:
      "Pricing is based on message volume and network infrastructure usage. We offer transparent, pay-as-you-go pricing with no hidden fees. You can upgrade or downgrade your plan at any time.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. We use quantum-resistant encryption (AES-256 and beyond) for all communications. We're SOC 2 Type II certified and compliant with GDPR and other major data protection regulations. Paradigm Solutions cannot access your message content.",
  },
  {
    question: "Can I use this for commercial projects?",
    answer:
      "Absolutely. All our plans, including the free tier, can be used for commercial deployments. We encourage organizations of all sizes to build secure communications into their products. Enterprise plans offer custom terms and SLAs.",
  },
  {
    question: "What kind of support do you offer?",
    answer:
      "Free plans include documentation and community support. Pro plans get priority technical support with 24-hour response times. Enterprise customers receive 24/7 dedicated support with a dedicated account manager and custom SLAs.",
  },
  {
    question: "Do you offer a free trial?",
    answer:
      "Yes! We offer a generous free tier that includes 100,000 messages per month. Pro and Enterprise plans come with a 14-day free trial with no credit card required. You can cancel anytime.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-bold"
          >
            Frequently asked{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              questions
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Everything you need to know about our platform
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
