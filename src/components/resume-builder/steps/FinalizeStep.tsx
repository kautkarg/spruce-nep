"use client";

import { useFormContext } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ResumeFormValues } from '../ResumeBuilder';
import { Section } from './Section';
import { Award, FileText, PlusCircle, Trash2, User } from 'lucide-react';
import { useFieldArray } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { MonthYearPicker } from '../MonthYearPicker';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import React from 'react';
import { cn } from '@/lib/utils';
import { FormControl } from '@/components/ui/form';


const templates = [
    { id: 'ats-classic', name: 'Classic', image: '/images/resume-templates/ats-classic.png' },
    { id: 'ats-traditional', name: 'Traditional', image: '/images/resume-templates/ats-traditional.png' },
    { id: 'ats-compact', name: 'Compact', image: '/images/resume-templates/ats-compact.png' },
    { id: 'modern-stylish', name: 'Stylish', image: '/images/resume-templates/modern-stylish.png' },
    { id: 'modern-creative', name: 'Creative', image: '/images/resume-templates/modern-creative.png' },
    { id: 'modern-minimalist', name: 'Minimalist', image: '/images/resume-templates/modern-minimalist.png' },
];


export default function FinalizeStep() {
    const { control, watch, setValue } = useFormContext<ResumeFormValues>();
    
    const awardsArray = useFieldArray({ control, name: "awards" });
    const volunteeringArray = useFieldArray({ control, name: "volunteering" });
    const certificationsArray = useFieldArray({ control, name: "certifications" });

    const selectedTemplate = watch('template');

    const [api, setApi] = React.useState<CarouselApi>()
    const [current, setCurrent] = React.useState(0)

    React.useEffect(() => {
        if (!api) return;

        const initialTemplateIndex = templates.findIndex(t => t.id === selectedTemplate);
        if (initialTemplateIndex !== -1) {
            api.scrollTo(initialTemplateIndex, true);
            setCurrent(initialTemplateIndex);
        }

        const handleSelect = () => {
            const selectedIndex = api.selectedScrollSnap();
            setCurrent(selectedIndex);
            setValue('template', templates[selectedIndex].id);
        };
        
        api.on("select", handleSelect);

        return () => {
            api.off("select", handleSelect);
        };
    }, [api, selectedTemplate, setValue]);


    return (
        <div className="space-y-6">
             <Section title="Choose Your Template" icon={FileText} isComplete={!!selectedTemplate}>
                <FormField
                    control={control}
                    name="template"
                    render={({ field }) => (
                        <FormItem>
                           <FormControl>
                                <Carousel setApi={setApi} className="w-full">
                                    <CarouselContent>
                                        {templates.map((template) => (
                                            <CarouselItem key={template.id}>
                                                <Card className='overflow-hidden'>
                                                    <CardContent className="p-0">
                                                        <Image
                                                            src={template.image}
                                                            alt={template.name}
                                                            width={400}
                                                            height={565}
                                                            className="w-full h-auto aspect-[8.5/11]"
                                                        />
                                                    </CardContent>
                                                </Card>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                </Carousel>
                           </FormControl>
                            <div className="py-2 text-center text-sm text-muted-foreground">
                                {templates[current]?.name}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </Section>

            <Section title="Awards & Honors" icon={Award}>
                {awardsArray.fields.map((field, index) => (
                    <div key={field.id} className="space-y-3 p-4 border rounded-md mb-4 relative bg-muted/20">
                         <Button type="button" variant="ghost" size="icon" onClick={() => awardsArray.remove(index)} className="absolute top-2 right-2 text-red-500 hover:bg-red-100 hover:text-red-600 h-7 w-7"><Trash2 className="h-4 w-4" /></Button>
                        <FormField control={control} name={`awards.${index}.name`} render={({ field }) => <FormItem><FormLabel>Award Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                        <FormField control={control} name={`awards.${index}.date`} render={({ field }) => <FormItem><FormLabel>Date</FormLabel><FormControl><MonthYearPicker field={field} /></FormControl><FormMessage /></FormItem>} />
                        <FormField control={control} name={`awards.${index}.description`} render={({ field }) => <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>} />
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={() => awardsArray.append({ name: "", date: null, description: "" })} className="w-full"><PlusCircle className="mr-2 h-4 w-4" />Add Award</Button>
            </Section>

            <Section title="Volunteer & Leadership" icon={User}>
                {volunteeringArray.fields.map((field, index) => (
                    <div key={field.id} className="space-y-3 p-4 border rounded-md mb-4 relative bg-muted/20">
                         <Button type="button" variant="ghost" size="icon" onClick={() => volunteeringArray.remove(index)} className="absolute top-2 right-2 text-red-500 hover:bg-red-100 hover:text-red-600 h-7 w-7"><Trash2 className="h-4 w-4" /></Button>
                        <FormField control={control} name={`volunteering.${index}.role`} render={({ field }) => <FormItem><FormLabel>Role</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                        <FormField control={control} name={`volunteering.${index}.organization`} render={({ field }) => <FormItem><FormLabel>Organization</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                        <FormField control={control} name={`volunteering.${index}.dates`} render={({ field }) => <FormItem><FormLabel>Date</FormLabel><FormControl><MonthYearPicker field={field} /></FormControl><FormMessage /></FormItem>} />
                        <FormField control={control} name={`volunteering.${index}.description`} render={({ field }) => <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>} />
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={() => volunteeringArray.append({ role: "", organization: "", dates: null, description: "" })} className="w-full"><PlusCircle className="mr-2 h-4 w-4" />Add Activity</Button>
            </Section>

            <Section title="Certifications" icon={FileText}>
                {certificationsArray.fields.map((field, index) => (
                    <div key={field.id} className="space-y-3 p-4 border rounded-md mb-4 relative bg-muted/20">
                         <Button type="button" variant="ghost" size="icon" onClick={() => certificationsArray.remove(index)} className="absolute top-2 right-2 text-red-500 hover:bg-red-100 hover:text-red-600 h-7 w-7"><Trash2 className="h-4 w-4" /></Button>
                        <FormField control={control} name={`certifications.${index}.name`} render={({ field }) => <FormItem><FormLabel>Certification Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                        <FormField control={control} name={`certifications.${index}.issuer`} render={({ field }) => <FormItem><FormLabel>Issuing Body</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                        <FormField control={control} name={`certifications.${index}.date`} render={({ field }) => <FormItem><FormLabel>Date</FormLabel><FormControl><MonthYearPicker field={field} /></FormControl><FormMessage /></FormItem>} />
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={() => certificationsArray.append({ name: "", issuer: "", date: null })} className="w-full"><PlusCircle className="mr-2 h-4 w-4" />Add Certification</Button>
            </Section>
        </div>
    );
}
