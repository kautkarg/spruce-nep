
"use client";

import { useFormContext } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormMessage } from '@/components/ui/form';
import { ResumeFormValues } from '../ResumeBuilder';
import { Section } from './Section';
import { FileText } from 'lucide-react';

const templates = [
    { id: 'ats-classic', name: 'Classic' },
    { id: 'ats-traditional', name: 'Traditional' },
    { id: 'ats-compact', name: 'Compact' },
    { id: 'modern-stylish', name: 'Stylish' },
    { id: 'modern-creative', name: 'Creative' },
    { id: 'modern-minimalist', name: 'Minimalist' },
];

export default function TemplateStep() {
    const { control, watch, setValue } = useFormContext<ResumeFormValues>();
    const selectedTemplate = watch('template');

    return (
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
    );
}
