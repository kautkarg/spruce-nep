import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { faqs } from "@/lib/faq";

export function Faq() {
  return (
    <section id="faq" className="py-20 md:py-28 bg-background">
      <div className="container max-w-4xl mx-auto">
        <div className="mb-16 text-center">
            <h2 className="text-h2 font-serif">
                Frequently Asked Questions
            </h2>
            <p className="mt-6 text-body-lead text-muted-foreground leading-relaxed">
                Find answers to common questions about our courses, NEP 2020 compliance, and career opportunities.
            </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left text-body-lead font-semibold leading-relaxed hover:no-underline">
                        {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-body-lead text-muted-foreground leading-relaxed pt-2">
                        {faq.answer}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
      </div>
    </section>
  )
}
