
"use client";

import { useFormContext } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ResumeFormValues } from '../ResumeBuilder';
import { Section } from './Section';
import { Award } from 'lucide-react';
import { hasContent } from '../ResumeBuilder';

export default function SkillsStep() {
    const form = useFormContext<ResumeFormValues>();
    const isComplete = hasContent(form.getValues('skills'));

    return (
        <Section title="Skills" icon={Award} isComplete={isComplete}>
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

    