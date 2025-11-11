
"use client";

import { useFormContext } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ResumeFormValues } from '../ResumeBuilder';
import { Section } from './Section';
import { Award } from 'lucide-react';

export default function SkillsStep() {
    const form = useFormContext<ResumeFormValues>();

    return (
        <Section title="Skills" icon={Award}>
            <FormField control={form.control} name="skills" render={({ field }) => (
                <FormItem>
                    <FormLabel>Skills (comma-separated)</FormLabel>
                    <FormControl>
                        <Textarea placeholder="e.g., React, Python, Team Leadership, Public Speaking" {...field} rows={6} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )} />
        </Section>
    );
}
