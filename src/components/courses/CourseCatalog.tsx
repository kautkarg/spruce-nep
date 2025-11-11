
"use client";

import { useState } from "react";
import Link from "next/link";
import { courses } from "@/lib/courses";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const categories = ["Healthcare", "Finance & Banking", "Media & Tech"];

export function CourseCatalog() {
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const filteredCourses = courses.filter((c) => c.category === activeCategory);

  return (
    <>
      <section id="courses" className="py-20 md:py-28 bg-muted/30 border-y">
        <div className="container">
          <div className="text-center mb-12">
              <h2 className="text-h2 font-serif">
                  Your Next Career Move Starts Here
              </h2>
              <p className="mt-6 text-body-lead text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Ready to launch your career? Explore our university-approved, credit-based programs. Each one is a launchpad designed to make you not just a graduate, but a job-ready pro.
              </p>
          </div>
          
          <div className="mt-12">
            <div className="md:hidden mb-8">
              <Select value={activeCategory} onValueChange={setActiveCategory}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Browse by Category" /></SelectTrigger>
                <SelectContent>{categories.map((category) => (<SelectItem key={category} value={category}>{category}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div className="hidden md:grid md:grid-cols-[240px_1fr] md:gap-12">
              <aside>
                <h3 className="text-h4 font-semibold mb-6">Course Categories</h3>
                <div className="flex flex-col items-start gap-2">
                  {categories.map((category) => (
                    <Button key={category} variant="ghost" onClick={() => setActiveCategory(category)} className={cn("w-full justify-start text-body-lead h-auto py-3 px-4 leading-relaxed", activeCategory === category && "bg-primary/10 text-primary font-semibold")}>{category}</Button>
                  ))}
                </div>
              </aside>
              <main>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredCourses.map((course) => (
                    <div key={course.id} className="flex flex-col text-left overflow-hidden h-full shadow-sm hover:shadow-lg transition-shadow bg-card rounded-xl">
                      <div className="p-8 flex flex-col flex-grow">
                        <div className="mb-6 flex-shrink-0"><course.Icon className="w-10 h-10 text-primary" /></div>
                        <h3 className="font-serif mb-3 flex-grow">{course.title}</h3>
                        <p className="text-body text-muted-foreground leading-relaxed mb-6">{course.description}</p>
                        <Button asChild={!!course.link} variant="link" className="p-0 h-auto justify-start text-primary font-semibold" disabled={!course.link}>
                          {course.link ? (
                            <Link href={course.link} target="_blank">
                              Dive into the Details
                            </Link>
                          ) : (
                            <span>Dive into the Details</span>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </main>
            </div>
            <div className="grid md:hidden grid-cols-1 sm:grid-cols-2 gap-8">
              {filteredCourses.map((course) => (
                <div key={course.id} className="flex flex-col text-left overflow-hidden h-full shadow-sm hover:shadow-lg transition-shadow bg-card rounded-xl">
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="mb-6 flex-shrink-0"><course.Icon className="w-10 h-10 text-primary" /></div>
                    <h3 className="font-serif mb-3 flex-grow">{course.title}</h3>
                    <p className="text-body text-muted-foreground leading-relaxed mb-6">{course.description}</p>
                    <Button asChild={!!course.link} variant="link" className="p-0 h-auto justify-start text-primary font-semibold" disabled={!course.link}>
                      {course.link ? (
                        <Link href={course.link} target="_blank">
                          Dive into the Details
                        </Link>
                      ) : (
                        <span>Dive into the Details</span>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
