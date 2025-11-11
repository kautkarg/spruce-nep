
"use client";

import { useFormContext } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ResumeFormValues } from '../ResumeBuilder';
import { Section } from './Section';
import { UserCheck } from 'lucide-react';

export default function SummaryStep() {
    const form = useFormContext<ResumeFormValues>();

    return (
        <Section title="Summary / Objective" icon={UserCheck}>
            <FormField control={form.control} name="summary" render={({ field }) => (
                <FormItem>
                    <FormLabel>Professional Summary</FormLabel>
                    <FormControl>
                        <Textarea placeholder="A brief summary of your skills and career goals..." {...field} rows={6} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )} />
        </Section>
    );
}
