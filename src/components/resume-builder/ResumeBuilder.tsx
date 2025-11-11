
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useForm, useFieldArray, FormProvider, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2, Printer, Mail, Phone, Linkedin, User, FileText, Award, UserCheck, HeartHandshake, GraduationCap, Briefcase } from "lucide-react";
import { cn } from '@/lib/utils';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MonthYearPicker } from './MonthYearPicker';

// --- Zod Schema for Validation ---
const personalInfoSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Invalid email address.").optional().or(z.literal('')),
  phone: z.string().regex(/^[0-9-()+ ]*$/, "Invalid phone number format.").optional().or(z.literal('')),
  linkedin: z.string().optional(),
});

const educationSchema = z.object({
  school: z.string().min(1, "School name is required."),
  degree: z.string().min(1, "Degree is required."),
  date: z.string().nullable().optional(),
  scoreType: z.enum(['CGPA', 'Percentage']).optional(),
  scoreValue: z.string().optional(),
}).refine(data => {
    if (data.scoreValue && data.scoreType) {
        const score = parseFloat(data.scoreValue);
        if (isNaN(score)) return true; // Let other string validations handle it if it's not a number
        if (data.scoreType === 'CGPA') {
            return score >= 0 && score <= 10;
        }
        if (data.scoreType === 'Percentage') {
            return score >= 0 && score <= 100;
        }
    }
    return true;
}, {
    message: "Invalid score. CGPA <= 10, Percentage <= 100.",
    path: ["scoreValue"],
});

const experienceSchema = z.object({
  title: z.string().min(1, "Title is required."),
  organization: z.string().min(1, "Organization is required."),
  dates: z.string().nullable().optional(),
  achievements: z.string().optional(),
});

const awardSchema = z.object({
  name: z.string().min(1, "Award name is required."),
  date: z.string().nullable().optional(),
  description: z.string().optional(),
});

const volunteerSchema = z.object({
  role: z.string().min(1, "Role is required."),
  organization: z.string().min(1, "Organization is required."),
  dates: z.string().nullable().optional(),
  description: z.string().optional(),
});

const certificationSchema = z.object({
  name: z.string().min(1, "Certification name is required."),
  issuer: z.string().optional(),
  date: z.string().nullable().optional(),
});

const resumeSchema = z.object({
  personal: personalInfoSchema,
  summary: z.string().optional(),
  education: z.array(educationSchema).optional(),
  experience: z.array(experienceSchema).optional(),
  skills: z.string().optional(),
  awards: z.array(awardSchema).optional(),
  volunteering: z.array(volunteerSchema).optional(),
  certifications: z.array(certificationSchema).optional(),
});

type ResumeFormValues = z.infer<typeof resumeSchema>;

// --- Default Values ---
const defaultValues: ResumeFormValues = {
  personal: {
    name: 'Your Name',
    email: 'your.email@example.com',
    phone: '123-456-7890',
    linkedin: 'linkedin.com/in/yourprofile',
  },
  summary: 'A brief 3-4 sentence professional summary or objective statement. For entry-level candidates, focus on your career goals and key skills.',
  education: [
    {
      school: 'University Name',
      degree: 'Degree & Major (e.g., B.S. in Computer Science)',
      date: 'May 2024',
      scoreType: 'CGPA',
      scoreValue: '8.5',
    },
  ],
  experience: [
    {
      title: 'Project Title / Job Title',
      organization: 'Course Name / Company Name',
      dates: 'August 2023',
      achievements: 'Developed a web application using React and Node.js that improved user engagement by 20%.\nCollaborated with a team of 3 to design and implement a new feature for a mobile app.',
    },
  ],
  skills: 'React, Node.js, JavaScript, Tailwind CSS, SQL, Agile Methodologies',
  awards: [
      { name: 'Dean\'s List', date: 'Spring 2023', description: 'Achieved a GPA of 3.9, placing in the top 10% of the faculty.'}
  ],
  volunteering: [
      { role: 'Team Lead', organization: 'Annual Tech Fest', dates: 'March 2023', description: 'Led a team of 5 volunteers to organize the coding competition, managing logistics for over 100 participants.'}
  ],
  certifications: [
      { name: 'Certified JavaScript Developer', issuer: 'Tech Certification Inc.', date: 'June 2023'}
  ]
};

// --- Reusable Components ---

const Section = ({ title, icon: Icon, children }: { title: string, icon: React.ElementType, children: React.ReactNode }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
      <Icon className="h-5 w-5" />
      {title}
    </h3>
    <div className="space-y-4">{children}</div>
  </div>
);

type FieldConfig = {
    key: string;
    label: string;
    placeholder: string;
    type?: 'input' | 'textarea' | 'date';
};

interface DynamicSectionProps {
    name: "education" | "experience" | "awards" | "volunteering" | "certifications";
    title: string;
    newItem: object;
}

const EducationSection: React.FC = () => {
    const { control } = useFormContext<ResumeFormValues>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "education",
    });

    return (
        <div>
            {fields.map((item, index) => (
                <div key={item.id} className="space-y-3 p-4 border rounded-md mb-4 relative bg-gray-50/50">
                    <FormField control={control} name={`education.${index}.school`} render={({ field }) => (<FormItem><FormLabel className="text-sm font-medium text-gray-600">School / University</FormLabel><FormControl><Input placeholder="e.g., State University" {...field} className="mt-1" /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={control} name={`education.${index}.degree`} render={({ field }) => (<FormItem><FormLabel className="text-sm font-medium text-gray-600">Degree & Major</FormLabel><FormControl><Input placeholder="e.g., B.S. in Computer Science" {...field} className="mt-1" /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={control} name={`education.${index}.date`} render={({ field }) => (<FormItem><FormLabel className="text-sm font-medium text-gray-600">End Date</FormLabel><FormControl><MonthYearPicker field={field} /></FormControl><FormMessage /></FormItem>)} />
                    <div className="grid grid-cols-2 gap-2">
                        <FormField control={control} name={`education.${index}.scoreType`} render={({ field }) => (<FormItem><FormLabel className="text-sm font-medium text-gray-600">Score Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl><SelectContent><SelectItem value="CGPA">CGPA</SelectItem><SelectItem value="Percentage">Percentage</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                        <FormField control={control} name={`education.${index}.scoreValue`} render={({ field }) => (<FormItem><FormLabel className="text-sm font-medium text-gray-600">Score</FormLabel><FormControl><Input type="number" step="0.1" placeholder="e.g., 8.5 or 85" {...field} className="mt-1" /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-red-500 hover:bg-red-100 hover:text-red-600 h-7 w-7"
                        onClick={() => remove(index)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ))}
            <Button type="button" variant="outline" onClick={() => append({ school: "", degree: "", date: null, scoreType: "CGPA", scoreValue: "" })} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Education
            </Button>
        </div>
    );
};


const DynamicSection: React.FC<DynamicSectionProps> = ({ name, title, newItem }) => {
    const { control } = useFormContext<ResumeFormValues>();
    const { fields, append, remove } = useFieldArray({
        control,
        name,
    });
    
    const getFieldsConfig = (name: DynamicSectionProps["name"]): FieldConfig[] => {
        switch (name) {
            case 'experience': return [
                { key: 'title', label: 'Title', placeholder: 'e.g., Software Engineer Intern' },
                { key: 'organization', label: 'Organization', placeholder: 'e.g., Tech Company Inc.' },
                { key: 'dates', label: 'Date', placeholder: 'e.g., June 2023 - Aug 2023', type: 'date' },
                { key: 'achievements', label: 'Achievements (one per line)', type: 'textarea', placeholder: 'Describe your responsibilities and achievements...' }
            ];
            case 'awards': return [
                { key: 'name', label: 'Award Name', placeholder: 'e.g., Dean\'s List' },
                { key: 'date', label: 'Date', placeholder: 'e.g., Spring 2023', type: 'date' },
                { key: 'description', label: 'Description', type: 'textarea', placeholder: 'e.g., Recognized for academic excellence.' }
            ];
            case 'volunteering': return [
                { key: 'role', label: 'Role', placeholder: 'e.g., Team Lead' },
                { key: 'organization', label: 'Organization', placeholder: 'e.g., Annual Tech Fest' },
                { key: 'dates', label: 'Date', placeholder: 'e.g., March 2023', type: 'date' },
                { key: 'description', label: 'Description', type: 'textarea', placeholder: 'e.g., Led a team of 5 volunteers...' }
            ];
            case 'certifications': return [
                { key: 'name', label: 'Certification Name', placeholder: 'e.g., Certified JavaScript Developer' },
                { key: 'issuer', label: 'Issuing Organization', placeholder: 'e.g., Tech Certification Inc.' },
                { key: 'date', label: 'Date', placeholder: 'e.g., June 2023', type: 'date' }
            ];
            default: return [];
        }
    }

    const fieldsConfig = getFieldsConfig(name);

    return (
        <div>
            {fields.map((item, index) => (
                <div key={item.id} className="space-y-3 p-4 border rounded-md mb-4 relative bg-gray-50/50">
                    {fieldsConfig.map(fieldConfig => (
                         <FormField
                            key={fieldConfig.key}
                            control={control}
                            name={`${name}.${index}.${fieldConfig.key as any}`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-600">{fieldConfig.label}</FormLabel>
                                    <FormControl>
                                        {fieldConfig.type === 'textarea' ? (
                                            <Textarea placeholder={fieldConfig.placeholder} {...field} className="mt-1" rows={3} />
                                        ) : fieldConfig.type === 'date' ? (
                                            <MonthYearPicker field={field} />
                                        ) : (
                                            <Input placeholder={fieldConfig.placeholder} {...field} className="mt-1" />
                                        )}
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-red-500 hover:bg-red-100 hover:text-red-600 h-7 w-7"
                        onClick={() => remove(index)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ))}
            <Button type="button" variant="outline" onClick={() => append(newItem as any)} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" /> Add {title}
            </Button>
        </div>
    );
};

// --- Main Resume Builder Component ---
export function ResumeBuilder() {
    const [template, setTemplate] = useState<'classic' | 'modern'>('classic');
    const resumePreviewRef = useRef<HTMLDivElement>(null);
    
    const form = useForm<ResumeFormValues>({
        resolver: zodResolver(resumeSchema),
        defaultValues,
        mode: "onChange",
    });
    
    const resumeData = form.watch();

    useEffect(() => {
        try {
            const savedData = localStorage.getItem('spruce-resume-data');
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                // Ensure array fields are not undefined
                const validatedData = {
                    ...defaultValues,
                    ...parsedData,
                    education: parsedData.education || [],
                    experience: parsedData.experience || [],
                    awards: parsedData.awards || [],
                    volunteering: parsedData.volunteering || [],
                    certifications: parsedData.certifications || [],
                };
                form.reset(validatedData);
            }
        } catch (error) {
            console.error("Failed to parse resume data from localStorage", error);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const subscription = form.watch((value) => {
            localStorage.setItem('spruce-resume-data', JSON.stringify(value));
        });
        return () => subscription.unsubscribe();
    }, [form]);

    const handleDownload = async () => {
        const element = resumePreviewRef.current;
        if (!element) return;
        
        // Dynamically import html2pdf.js only on the client-side
        const html2pdf = (await import('html2pdf.js')).default;

        const options = {
            margin: [0.5, 0.5, 0.5, 0.5],
            filename: `Resume-${resumeData.personal?.name?.replace(/\s+/g, '-') || 'Student'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().from(element).set(options).save();
    };

    const hasContent = (arr: any[] | undefined | string, key?: string) => {
        if (!arr) return false;
        if (typeof arr === 'string') return arr.trim() !== '';
        if (arr.length === 0) return false;
        if (!key) return arr.some(item => item);
        return arr.some(item => item && (typeof item[key] === 'string' && item[key].trim() !== ''));
    };

    const getAchievements = (achievements: string | undefined | null) => {
      if (typeof achievements !== 'string') return [];
      return achievements.split('\n').filter(line => line.trim() !== '');
    }

    const ResumeContent = (
        <>
            {template === 'classic' && (
                <>
                    <div className="text-center mb-6 border-b border-gray-800 pb-4">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-800">{resumeData.personal?.name}</h1>
                        {(hasContent(resumeData.personal?.email) || hasContent(resumeData.personal?.phone) || hasContent(resumeData.personal?.linkedin)) && (
                            <div className="flex justify-center items-baseline gap-x-4 gap-y-1 text-xs text-gray-600 mt-2 flex-wrap">
                                {hasContent(resumeData.personal.email) && <div className="flex items-baseline gap-1.5"><Mail className="h-3 w-3" />{resumeData.personal.email}</div>}
                                {hasContent(resumeData.personal.phone) && <div className="flex items-baseline gap-1.5"><Phone className="h-3 w-3" />{resumeData.personal.phone}</div>}
                                {hasContent(resumeData.personal.linkedin) && <div className="flex items-baseline gap-1.5"><Linkedin className="h-3 w-3" />{resumeData.personal.linkedin}</div>}
                            </div>
                        )}
                    </div>

                    {hasContent(resumeData.summary) && <div className="mb-6"><h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-b-2 border-gray-800 pb-1 mb-2">Summary</h2><p className="text-xs leading-relaxed">{resumeData.summary}</p></div>}
                    
                    {hasContent(resumeData.education, 'school') && <div className="mb-6"><h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-b-2 border-gray-800 pb-1 mb-2">Education</h2>{resumeData.education?.map((edu, index) => edu.school && (
                        <div key={index} className="mb-2"><div className="flex justify-between items-baseline"><h3 className="text-sm font-semibold text-gray-800">{edu.school}</h3><p className="text-xs text-gray-500">{edu.date}</p></div><div className="flex justify-between items-baseline"><p className="text-sm italic">{edu.degree}</p>{edu.scoreValue && edu.scoreType && <p className="text-xs text-gray-500">{edu.scoreType}: {edu.scoreValue}{edu.scoreType === 'Percentage' ? '%' : ''}</p>}</div></div>
                    ))}</div>}

                    {hasContent(resumeData.experience, 'title') && <div className="mb-6"><h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-b-2 border-gray-800 pb-1 mb-2">Experience / Projects</h2>{resumeData.experience?.map((exp, index) => exp.title && (
                        <div key={index} className="mb-3"><div className="flex justify-between items-baseline"><h3 className="text-sm font-semibold text-gray-800">{exp.title}</h3><p className="text-xs text-gray-500">{exp.dates}</p></div><p className="text-sm italic mb-1">{exp.organization}</p>{hasContent(getAchievements(exp.achievements)) && <ul className="list-disc list-outside pl-5 space-y-1">{getAchievements(exp.achievements).map((ach, i) => ach && <li key={i} className="text-xs leading-relaxed">{ach}</li>)}</ul>}</div>
                    ))}</div>}
                    
                    {hasContent(resumeData.awards, 'name') && <div className="mb-6"><h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-b-2 border-gray-800 pb-1 mb-2">Awards & Honors</h2>{resumeData.awards?.map((award, index) => award.name && (
                        <div key={index} className="mb-2"><div className="flex justify-between items-baseline"><h3 className="text-sm font-semibold text-gray-800">{award.name}</h3>{award.date && <p className="text-xs text-gray-500">{award.date}</p>}</div>{award.description && <p className="text-xs leading-relaxed">{award.description}</p>}</div>
                    ))}</div>}

                    {hasContent(resumeData.volunteering, 'role') && <div className="mb-6"><h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-b-2 border-gray-800 pb-1 mb-2">Volunteer & Leadership</h2>{resumeData.volunteering?.map((item, index) => item.role && (
                        <div key={index} className="mb-3"><div className="flex justify-between items-baseline"><h3 className="text-sm font-semibold text-gray-800">{item.role}</h3><p className="text-xs text-gray-500">{item.dates}</p></div><p className="text-sm italic mb-1">{item.organization}</p>{item.description && <p className="text-xs leading-relaxed">{item.description}</p>}</div>
                    ))}</div>}

                    {hasContent(resumeData.certifications, 'name') && <div className="mb-6"><h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-b-2 border-gray-800 pb-1 mb-2">Certifications</h2>{resumeData.certifications?.map((cert, index) => cert.name && (
                        <div key={index} className="mb-2"><div className="flex justify-between items-baseline"><h3 className="text-sm font-semibold text-gray-800">{cert.name}</h3><p className="text-xs text-gray-500">{cert.date}</p></div><p className="text-sm italic">{cert.issuer}</p></div>
                    ))}</div>}

                    {hasContent(resumeData.skills) && <div><h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-b-2 border-gray-800 pb-1 mb-2">Skills</h2><div className="flex flex-wrap gap-2 mt-2">{typeof resumeData.skills === 'string' && resumeData.skills.split(',').map((skill, index) => skill.trim() && (<span key={index} className="bg-gray-200 text-gray-800 text-xs font-medium px-2 py-1 rounded">{skill.trim()}</span>))}</div></div>}
                </>
            )}
            
            {template === 'modern' && (
                <>
                    <div className="flex gap-8 h-full">
                        <div className="w-2/3">
                            <h1 className="text-4xl font-bold tracking-tight mb-2 text-gray-800">{resumeData.personal?.name}</h1>
                            {hasContent(resumeData.summary) && <p className="text-xs leading-relaxed mb-6">{resumeData.summary}</p>}
                            
                            {hasContent(resumeData.experience, 'title') && <div className="mb-6"><h2 className="text-base font-bold uppercase tracking-wider text-gray-700 border-b-2 border-gray-300 pb-1 mb-3">Experience / Projects</h2>{resumeData.experience?.map((exp, index) => exp.title && (
                                <div key={index} className="mb-4"><div className="flex justify-between items-baseline"><h3 className="text-sm font-semibold text-gray-800">{exp.title}</h3><p className="text-xs text-gray-500">{exp.dates}</p></div><p className="text-sm italic mb-1">{exp.organization}</p>{hasContent(getAchievements(exp.achievements)) && <ul className="list-disc list-outside pl-5 space-y-1">{getAchievements(exp.achievements).map((ach, i) => ach && <li key={i} className="text-xs leading-relaxed">{ach}</li>)}</ul>}</div>
                            ))}</div>}

                             {hasContent(resumeData.education, 'school') && <div className="mb-6"><h2 className="text-base font-bold uppercase tracking-wider text-gray-700 border-b-2 border-gray-300 pb-1 mb-3">Education</h2>{resumeData.education?.map((edu, index) => edu.school && (
                                <div key={index} className="mb-3"><div className="flex justify-between items-baseline"><h3 className="text-sm font-semibold text-gray-800">{edu.school}</h3><p className="text-xs text-gray-500">{edu.date}</p></div><div className="flex justify-between items-baseline"><p className="text-sm italic">{edu.degree}</p>{edu.scoreValue && edu.scoreType && <p className="text-xs text-gray-500">{edu.scoreType}: {edu.scoreValue}{edu.scoreType === 'Percentage' ? '%' : ''}</p>}</div></div>
                              ))}</div>}
                        </div>
                        <div className="w-1/3 bg-gray-100 p-6 rounded-md -my-8 -mr-8">
                            {(hasContent(resumeData.personal?.email) || hasContent(resumeData.personal?.phone) || hasContent(resumeData.personal?.linkedin)) && <div className="mb-6"><h2 className="text-sm font-bold uppercase tracking-wider text-gray-600 border-b border-gray-300 pb-1 mb-3">Contact</h2><div className="space-y-2 text-xs text-gray-700">
                                    {hasContent(resumeData.personal.email) && <div className="flex items-baseline gap-2"><Mail className="h-3 w-3 shrink-0" /><span>{resumeData.personal.email}</span></div>}
                                    {hasContent(resumeData.personal.phone) && <div className="flex items-baseline gap-2"><Phone className="h-3 w-3 shrink-0" /><span>{resumeData.personal.phone}</span></div>}
                                    {hasContent(resumeData.personal.linkedin) && <div className="flex items-baseline gap-2"><Linkedin className="h-3 w-3 shrink-0" /><span>{resumeData.personal.linkedin}</span></div>}
                            </div></div>}

                            {hasContent(resumeData.skills) && <div className="mb-6"><h2 className="text-sm font-bold uppercase tracking-wider text-gray-600 border-b border-gray-300 pb-1 mb-3">Skills</h2><div className="flex flex-wrap gap-1.5 mt-2">{typeof resumeData.skills === 'string' && resumeData.skills.split(',').map((skill, index) => skill.trim() && (<span key={index} className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded">{skill.trim()}</span>))}</div></div>}
                            
                            {hasContent(resumeData.awards, 'name') && <div className="mb-6"><h2 className="text-sm font-bold uppercase tracking-wider text-gray-600 border-b border-gray-300 pb-1 mb-3">Awards</h2><div className="space-y-3 mt-2">{resumeData.awards?.map((award, index) => award.name && (
                                <div key={index}><h3 className="text-xs font-semibold text-gray-800">{award.name}</h3>{award.date && <p className="text-xs text-gray-500">{award.date}</p>}</div>
                            ))}</div></div>}

                            {hasContent(resumeData.certifications, 'name') && <div className="mb-6"><h2 className="text-sm font-bold uppercase tracking-wider text-gray-600 border-b border-gray-300 pb-1 mb-3">Certifications</h2><div className="space-y-3 mt-2">{resumeData.certifications?.map((cert, index) => cert.name && (
                                <div key={index}><h3 className="text-xs font-semibold text-gray-800">{cert.name}</h3><p className="text-xs text-gray-500">{cert.issuer}</p></div>
                            ))}</div></div>}
                            
                            {hasContent(resumeData.volunteering, 'role') && <div className="mb-6"><h2 className="text-sm font-bold uppercase tracking-wider text-gray-600 border-b border-gray-300 pb-1 mb-3">Leadership</h2><div className="space-y-3 mt-2">{resumeData.volunteering?.map((item, index) => item.role && (
                                <div key={index}><h3 className="text-xs font-semibold text-gray-800">{item.role}</h3><p className="text-xs text-gray-500">{item.organization}</p></div>
                            ))}</div></div>}
                        </div>
                    </div>
                </>
            )}
        </>
    );

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <div className="max-w-screen-2xl mx-auto p-4 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-5 xl:col-span-4 space-y-6">
                        
                        <Section title="Template" icon={FileText}>
                            <div className="flex gap-2">
                                <Button variant={template === 'classic' ? 'default' : 'outline'} onClick={() => setTemplate('classic')} className="flex-1">
                                    Classic (ATS-Friendly)
                                </Button>
                                <Button variant={template === 'modern' ? 'default' : 'outline'} onClick={() => setTemplate('modern')} className="flex-1">
                                    Modern
                                </Button>
                            </div>
                        </Section>

                        <FormProvider {...form}>
                            <Form {...form}>
                                <form className="space-y-6">
                                    <Section title="Personal Information" icon={User}>
                                        <FormField control={form.control} name="personal.name" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Full Name" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="personal.email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="Email" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="personal.phone" render={({ field }) => (<FormItem><FormLabel>Phone</FormLabel><FormControl><Input type="tel" placeholder="Phone" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="personal.linkedin" render={({ field }) => (<FormItem><FormLabel>LinkedIn Profile URL</FormLabel><FormControl><Input placeholder="LinkedIn Profile URL" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    </Section>
                                    
                                    <Section title="Summary / Objective" icon={UserCheck}>
                                        <FormField control={form.control} name="summary" render={({ field }) => (<FormItem><FormControl><Textarea placeholder="A brief summary of your skills and career goals..." {...field} rows={4} /></FormControl><FormMessage /></FormItem>)} />
                                    </Section>

                                    <Section title="Education" icon={GraduationCap}>
                                        <EducationSection />
                                    </Section>

                                    <Section title="Experience / Projects" icon={Briefcase}>
                                        <DynamicSection name="experience" title="Experience" newItem={{ title: "", organization: "", dates: null, achievements: "" }} />
                                    </Section>

                                    <Section title="Awards & Honors" icon={Award}>
                                        <DynamicSection name="awards" title="Award" newItem={{ name: "", date: null, description: "" }} />
                                    </Section>
                                    
                                    <Section title="Volunteer & Leadership" icon={HeartHandshake}>
                                        <DynamicSection name="volunteering" title="Activity" newItem={{ role: "", organization: "", dates: null, description: "" }} />
                                    </Section>

                                    <Section title="Certifications" icon={Award}>
                                         <DynamicSection name="certifications" title="Certification" newItem={{ name: "", issuer: "", date: null }} />
                                    </Section>

                                    <Section title="Skills" icon={Briefcase}>
                                        <FormField control={form.control} name="skills" render={({ field }) => (<FormItem>
                                            <FormLabel>Skills (comma-separated)</FormLabel>
                                            <FormControl><Textarea placeholder="e.g., React, Python, Team Leadership" {...field} rows={3} /></FormControl>
                                            <FormMessage />
                                        </FormItem>)} />
                                    </Section>
                                </form>
                            </Form>
                        </FormProvider>

                        <div className="space-y-4">
                             <h2 className="text-2xl font-bold text-gray-800 sr-only">Actions</h2>
                            <Button onClick={handleDownload} className="w-full gap-2 bg-primary hover:bg-primary/90">
                                <Printer className="h-4 w-4" />
                                Download as PDF
                            </Button>
                        </div>
                    </div>
                    <div className="lg:col-span-7 xl:col-span-8">
                        <div className="sticky top-8">
                            <div id="resume-preview" ref={resumePreviewRef} className="w-full bg-white shadow-lg rounded-lg p-8 aspect-[8.5/11] overflow-y-auto text-gray-800 border">
                                {ResumeContent}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

    

    

    