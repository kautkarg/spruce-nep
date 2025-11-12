
"use client";

import { useFormContext, useFieldArray } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ResumeFormValues } from '../ResumeBuilder';
import { Section } from './Section';
import { User, PlusCircle, Trash2 } from 'lucide-react';
import { hasContent } from '../ResumeBuilder';
import { Button } from '@/components/ui/button';

export default function PersonalInfoStep() {
    const form = useFormContext<ResumeFormValues>();
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "personal.profiles",
    });

    const isComplete = hasContent(form.getValues('personal.name'));

    return (
        <Section title="Personal Information" icon={User} isComplete={isComplete}>
            <div className="space-y-4">
                <FormField control={form.control} name="personal.name" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Full Name" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="personal.email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="Email" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="personal.phone" render={({ field }) => (<FormItem><FormLabel>Phone</FormLabel><FormControl><Input type="tel" placeholder="Phone" {...field} /></FormControl><FormMessage /></FormItem>)} />

                <div className="space-y-4">
                    <FormLabel>Online Profiles</FormLabel>
                    {fields.map((item, index) => (
                        <div key={item.id} className="space-y-2 p-3 border rounded-md relative bg-muted/20">
                             <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute top-1 right-1 text-red-500 hover:bg-red-100 hover:text-red-600 h-6 w-6"
                                onClick={() => remove(index)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            <FormField
                                control={form.control}
                                name={`personal.profiles.${index}.network`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-medium">Profile Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., LinkedIn, GitHub" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name={`personal.profiles.${index}.url`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-medium">URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    ))}
                     <Button type="button" variant="outline" onClick={() => append({ network: "", url: "" })} className="w-full">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Profile
                    </Button>
                </div>
            </div>
        </Section>
    );
}

    