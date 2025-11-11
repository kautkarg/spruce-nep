
"use client";

import { useFormContext } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ResumeFormValues } from '../ResumeBuilder';
import { Section } from './Section';
import { User } from 'lucide-react';

export default function PersonalInfoStep() {
    const form = useFormContext<ResumeFormValues>();

    return (
        <Section title="Personal Information" icon={User}>
            <div className="space-y-4">
                <FormField control={form.control} name="personal.name" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Full Name" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="personal.email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="Email" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="personal.phone" render={({ field }) => (<FormItem><FormLabel>Phone</FormLabel><FormControl><Input type="tel" placeholder="Phone" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="personal.linkedin" render={({ field }) => (<FormItem><FormLabel>LinkedIn Profile URL</FormLabel><FormControl><Input placeholder="LinkedIn Profile URL" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
        </Section>
    );
}
