
"use client";

import { useFormContext, useFieldArray } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MonthYearPicker } from '../MonthYearPicker';
import { ResumeFormValues } from '../ResumeBuilder';
import { Section } from './Section';
import { GraduationCap, PlusCircle, Trash2 } from 'lucide-react';

export default function EducationStep() {
    const { control } = useFormContext<ResumeFormValues>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "education",
    });

    return (
        <Section title="Education" icon={GraduationCap}>
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
                        <FormField control={control} name={`education.${index}.school`} render={({ field }) => (<FormItem><FormLabel className="text-sm font-medium text-gray-600">School / University</FormLabel><FormControl><Input placeholder="e.g., State University" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={control} name={`education.${index}.degree`} render={({ field }) => (<FormItem><FormLabel className="text-sm font-medium text-gray-600">Degree & Major</FormLabel><FormControl><Input placeholder="e.g., B.S. in Computer Science" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={control} name={`education.${index}.date`} render={({ field }) => (<FormItem><FormLabel className="text-sm font-medium text-gray-600">End Date</FormLabel><FormControl><MonthYearPicker field={field} /></FormControl><FormMessage /></FormItem>)} />
                        <div className="grid grid-cols-2 gap-2">
                            <FormField control={control} name={`education.${index}.scoreType`} render={({ field }) => (<FormItem><FormLabel className="text-sm font-medium text-gray-600">Score Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl><SelectContent><SelectItem value="CGPA">CGPA</SelectItem><SelectItem value="Percentage">Percentage</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                            <FormField control={control} name={`education.${index}.scoreValue`} render={({ field }) => (<FormItem><FormLabel className="text-sm font-medium text-gray-600">Score</FormLabel><FormControl><Input type="number" step="0.1" placeholder="e.g., 8.5 or 85" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={() => append({ school: "", degree: "", date: null, scoreType: "CGPA", scoreValue: "" })} className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Education
                </Button>
            </div>
        </Section>
    );
}
