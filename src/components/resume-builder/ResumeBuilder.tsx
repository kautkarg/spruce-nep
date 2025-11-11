
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Stepper, Step } from './MultiStepResumeForm';
import PersonalInfoStep from './steps/PersonalInfoStep';
import SummaryStep from './steps/SummaryStep';
import EducationStep from './steps/EducationStep';
import ExperienceStep from './steps/ExperienceStep';
import SkillsStep from './steps/SkillsStep';
import FinalizeStep from './steps/FinalizeStep';
import { AtsClassicTemplate, AtsCompactTemplate, AtsTraditionalTemplate, ModernCreativeTemplate, ModernMinimalistTemplate, ModernStylishTemplate } from './templates';
import { Progress } from '../ui/progress';

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

export const resumeSchema = z.object({
  personal: personalInfoSchema,
  summary: z.string().optional(),
  education: z.array(educationSchema).optional(),
  experience: z.array(experienceSchema).optional(),
  skills: z.string().optional(),
  awards: z.array(awardSchema).optional(),
  volunteering: z.array(volunteerSchema).optional(),
  certifications: z.array(certificationSchema).optional(),
  template: z.string().default('ats-classic'),
});

export type ResumeFormValues = z.infer<typeof resumeSchema>;

// --- Default Values ---
export const defaultValues: ResumeFormValues = {
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
  ],
  template: 'ats-classic',
};


// --- Helper Functions ---
export const hasContent = (arr: any[] | undefined | string, key?: string) => {
    if (!arr) return false;
    if (typeof arr === 'string') return arr.trim() !== '';
    if (arr.length === 0) return false;
    if (!key) return arr.some(item => item);
    return arr.some(item => item && (typeof item[key] === 'string' && item[key].trim() !== ''));
};

export const getAchievements = (achievements: string | undefined | null) => {
  if (typeof achievements !== 'string') return [];
  return achievements.split('\n').filter(line => line.trim() !== '');
};


// --- Template Rendering ---
type TemplateProps = {
    resumeData: ResumeFormValues;
};

const renderTemplate = (resumeData: ResumeFormValues) => {
    const commonProps = { resumeData };
    switch(resumeData.template) {
        case 'ats-classic': return <AtsClassicTemplate {...commonProps} />;
        case 'ats-traditional': return <AtsTraditionalTemplate {...commonProps} />;
        case 'ats-compact': return <AtsCompactTemplate {...commonProps} />;
        case 'modern-stylish': return <ModernStylishTemplate {...commonProps} />;
        case 'modern-creative': return <ModernCreativeTemplate {...commonProps} />;
        case 'modern-minimalist': return <ModernMinimalistTemplate {...commonProps} />;
        default: return <AtsClassicTemplate {...commonProps} />;
    }
}


// --- Main Resume Builder Component ---
export function ResumeBuilder() {
    const resumePreviewRef = useRef<HTMLDivElement>(null);
    const isMobile = useIsMobile();
    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(0);
    
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
                const validatedData = {
                    ...defaultValues,
                    ...parsedData,
                    education: parsedData.education || [],
                    experience: parsedData.experience || [],
                    awards: parsedData.awards || [],
                    volunteering: parsedData.volunteering || [],
                    certifications: parsedData.certifications || [],
                    template: parsedData.template || 'ats-classic'
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
            
            // Calculate progress
            const totalFields = 5; // Personal, Summary, Education, Experience, Skills
            let completedFields = 0;
            if (hasContent(value.personal?.name)) completedFields++;
            if (hasContent(value.summary)) completedFields++;
            if (hasContent(value.education, 'school')) completedFields++;
            if (hasContent(value.experience, 'title')) completedFields++;
            if (hasContent(value.skills)) completedFields++;
            
            setProgress((completedFields / totalFields) * 100);
        });
        return () => subscription.unsubscribe();
    }, [form]);

    const handleDownload = async () => {
        const element = resumePreviewRef.current;
        if (!element) return;
        
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

    const steps: Step[] = [
      { name: 'Personal', fields: ['personal.name', 'personal.email'] },
      { name: 'Summary', fields: ['summary'] },
      { name: 'Education', fields: ['education'] },
      { name: 'Experience', fields: ['experience'] },
      { name: 'Skills', fields: ['skills'] },
      { name: 'Finalize' },
    ];

    const next = async () => {
      const fields = steps[currentStep].fields;
      const output = await form.trigger(fields as FieldPath<ResumeFormValues>[], { shouldFocus: true });

      if (!output) return;

      if (currentStep < steps.length - 1) {
        setCurrentStep(step => step + 1);
      }
    };

    const prev = () => {
      if (currentStep > 0) {
        setCurrentStep(step => step - 1);
      }
    };
    
    const showPreview = !isMobile || (isMobile && currentStep === steps.length - 1);

    return (
        <FormProvider {...form}>
            <div className={cn("grid grid-cols-1 gap-8", !isMobile && "lg:grid-cols-12")}>
                <div className={cn("space-y-6", !isMobile && "lg:col-span-5 xl:col-span-4")}>
                    <div className="bg-card p-6 rounded-lg shadow-sm">
                        <div className="mb-4">
                            <p className="text-sm font-semibold text-gray-700 mb-2">Resume Progress</p>
                            <Progress value={progress} />
                        </div>
                        <Stepper steps={steps} currentStep={currentStep} />
                    </div>
                    
                    <div className="bg-card p-6 rounded-lg shadow-sm">
                        {currentStep === 0 && <PersonalInfoStep />}
                        {currentStep === 1 && <SummaryStep />}
                        {currentStep === 2 && <EducationStep />}
                        {currentStep === 3 && <ExperienceStep />}
                        {currentStep === 4 && <SkillsStep />}
                        {currentStep === 5 && <FinalizeStep />}
                    </div>

                    <div className="flex justify-between">
                        <Button onClick={prev} disabled={currentStep === 0} variant="outline">
                            Back
                        </Button>
                        {currentStep < steps.length - 1 ? (
                          <Button onClick={next}>
                              Next
                          </Button>
                        ) : (
                          <Button onClick={handleDownload} type="button" className="gap-2">
                              <Printer className="h-4 w-4" />
                              Download PDF
                          </Button>
                        )}
                    </div>
                </div>
                
                {showPreview && (
                  <div className={cn(!isMobile && "lg:col-span-7 xl:col-span-8")}>
                      <div className="sticky top-8">
                          <div id="resume-preview" ref={resumePreviewRef} className="w-full bg-white shadow-lg rounded-lg p-8 aspect-[8.5/11] overflow-y-auto text-gray-800 border">
                              {renderTemplate(resumeData)}
                          </div>
                      </div>
                  </div>
                )}
            </div>
        </FormProvider>
    );
}

    