
"use client";

import { useFormContext, useFieldArray } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MonthYearPicker } from '../MonthYearPicker';
import { ResumeFormValues } from '../ResumeBuilder';
import { Section } from './Section';
import { Briefcase, PlusCircle, Trash2 } from 'lucide-react';
import { hasContent } from '../ResumeBuilder';

export default function ExperienceStep() {
    const { control, getValues } = useFormContext<ResumeFormValues>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "experience",
    });

    const isComplete = hasContent(getValues('experience'), 'title');

    return (
        <Section title="Experience / Projects" icon={Briefcase} isComplete={isComplete}>
            <div className="space-y-4">
                {fields.map((item, index) => (
                    <div key={item.id} className="space-y-3 p-4 border rounded-md mb-4 relative bg-muted/20">
                         <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 text-red-500 hover:bg-red-100 hover:text-red-600 h-7 w-7"
                            onClick={() => remove(index)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        <FormField control={control} name={`experience.${index}.title`} render={({ field }) => (<FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="e.g., Software Engineer Intern" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={control} name={`experience.${index}.organization`} render={({ field }) => (<FormItem><FormLabel>Organization</FormLabel><FormControl><Input placeholder="e.g., Tech Company Inc." {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={control} name={`experience.${index}.dates`} render={({ field }) => (<FormItem><FormLabel>Date</FormLabel><FormControl><MonthYearPicker field={field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={control} name={`experience.${index}.achievements`} render={({ field }) => (<FormItem><FormLabel>Achievements (one per line)</FormLabel><FormControl><Textarea placeholder="Describe your responsibilities and achievements..." {...field} rows={4} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={() => append({ title: "", organization: "", dates: null, achievements: "" })} className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Experience
                </Button>
            </div>
        </Section>
    );
}

    