

"use client";

import { useFormContext } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from '@/components/ui/form';
import { ResumeFormValues } from '../ResumeBuilder';
import { Section } from './Section';
import { Award, FileText, PlusCircle, Trash2, User } from 'lucide-react';
import { useFieldArray } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { MonthYearPicker } from '../MonthYearPicker';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';
import { cn } from '@/lib/utils';


const templates = [
    { id: 'ats-classic', name: 'Classic' },
    { id: 'ats-traditional', name: 'Traditional' },
    { id: 'ats-compact', name: 'Compact' },
    { id: 'modern-stylish', name: 'Stylish' },
    { id: 'modern-creative', name: 'Creative' },
    { id: 'modern-minimalist', name: 'Minimalist' },
];


export default function FinalizeStep() {
    const { control, watch, setValue } = useFormContext<ResumeFormValues>();
    
    const awardsArray = useFieldArray({ control, name: "awards" });
    const volunteeringArray = useFieldArray({ control, name: "volunteering" });
    const certificationsArray = useFieldArray({ control, name: "certifications" });

    const selectedTemplate = watch('template');

    return (
        <div className="space-y-6">
             <Section title="Choose Your Template" icon={FileText} isComplete={!!selectedTemplate}>
                <FormField
                    control={control}
                    name="template"
                    render={() => (
                        <FormItem>
                           <div className="flex flex-wrap gap-2">
                                {templates.map((template) => {
                                    const isSelected = selectedTemplate === template.id;
                                    return (
                                        <Button
                                            key={template.id}
                                            type="button"
                                            variant={isSelected ? 'primary' : 'outline'}
                                            onClick={() => setValue('template', template.id)}
                                        >
                                            {template.name}
                                        </Button>
                                    )
                                })}
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

