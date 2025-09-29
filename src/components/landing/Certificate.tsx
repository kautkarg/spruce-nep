
import Image from "next/image";

export function Certificate() {
    return (
        <section id="certificate" className="bg-muted/30 border-y">
            <div className="container py-20 md:py-28">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="mb-16">
                        <h2 className="text-h2 font-serif">
                            A Certificate That Actually Counts
                        </h2>
                        <p className="mt-6 text-body-lead text-muted-foreground leading-relaxed">
                            Upon completion, you will receive a verified certificate from RTMNU, a recognized Indian university. This is not just a course completion letter; it's an academic credential that adds weight to your resume.
                        </p>
                    </div>
                    <div className="max-w-3xl mx-auto relative">
                       <Image 
                         src="/images/rtmnu-certificate.png"
                         alt="RTMNU Official Certificate Sample"
                         width={1200}
                         height={800}
                         className="rounded-lg shadow-lg"
                         data-ai-hint="certificate document"
                       />
                    </div>
                </div>
            </div>
        </section>
    )
}
