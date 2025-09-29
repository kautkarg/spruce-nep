
import { Award } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';

export function TrustSection() {
  return (
    <section id="trust" className="bg-muted/30 border-y">
      <div className="container py-20 md:py-28">
        <div className="flex flex-col items-center gap-12 max-w-4xl mx-auto text-center">
          <div>
              <span className="text-caption font-semibold uppercase text-primary tracking-widest">WHY THIS MATTERS NOW</span>
              <h2 className="mt-4 font-serif">
                Bridge the NEP 2020 Credit Gap
              </h2>
              <p className="mt-6 text-body-lead text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                The National Education Policy has changed the rules. We provide the official, credit-based courses that make your degree truly future-proof.
              </p>
          </div>
          
          <div className="border-2 border-primary/10 bg-background/50 p-2 rounded-lg shadow-sm w-full max-w-2xl">
            <div className="border border-primary/20 p-8 rounded-md text-center">
              <div className="flex flex-col items-center gap-6">
                  <Award className="h-16 w-16 text-primary/80 flex-shrink-0" />
                  <div>
                    <h3 className="text-primary text-meta font-bold tracking-widest uppercase">Fulfilling the NEP 2020 Vision</h3>
                    <p className='mt-4 text-body text-foreground/80 leading-relaxed'>
                      According to New Education Policy 2020 all higher education students to earn a significant portion of their credits from sources outside their parent university, with a focus on skill-based learning. Our RTMNU-approved courses are designed to fulfill this exact requirement.
                    </p>
                      <Button variant="link" asChild className="p-0 h-auto mt-4 text-body">
                          <Link href="https://www.education.gov.in/sites/upload_files/mhrd/files/NEP_Final_English_0.pdf" target="_blank" rel="noopener noreferrer">Read the Official NEP 2020 Updates</Link>
                      </Button>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
