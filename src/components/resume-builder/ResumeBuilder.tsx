
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2, Printer, Mail, Phone, Linkedin, MapPin, GraduationCap, Briefcase, Star, User, FileText } from "lucide-react";
import { cn } from '@/lib/utils';

// Initial state for a blank resume
const initialResumeData = {
  personal: {
    name: 'Your Name',
    email: 'your.email@example.com',
    phone: '123-456-7890',
    linkedin: 'linkedin.com/in/yourprofile',
  },
  education: [
    {
      school: 'University Name',
      degree: 'Degree & Major (e.g., B.S. in Computer Science)',
      date: 'Month Year - Month Year',
      gpa: '4.0',
    },
  ],
  experience: [
    {
      title: 'Project Title / Job Title',
      organization: 'Course Name / Company Name',
      dates: 'Month Year - Month Year',
      achievements: ['Developed a web application using React and Node.js that improved user engagement by 20%.', 'Collaborated with a team of 3 to design and implement a new feature for a mobile app.'],
    },
  ],
  skills: ['React', 'Node.js', 'JavaScript', 'Tailwind CSS', 'SQL'],
};

// --- Helper Components ---

// Section wrapper for styling consistency
const Section = ({ title, icon: Icon, children, ...props }: { title: string, icon: React.ElementType, children: React.ReactNode, [key: string]: any }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm" {...props}>
    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
      <Icon className="h-5 w-5" />
      {title}
    </h3>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

// Dynamic array section for education/experience
const DynamicSection = ({ name, items, setData, fields, placeholder }: any) => {
  const handleItemChange = (index: number, field: string, value: string | string[]) => {
    setData((prev: any) => {
      const newItems = [...prev[name]];
      if (field === 'achievements') {
        newItems[index][field] = Array.isArray(value) ? value : value.split('\n');
      } else {
        newItems[index][field] = value;
      }
      return { ...prev, [name]: newItems };
    });
  };

  const addNewItem = () => {
    const newItem = Object.fromEntries(fields.map((f: any) => [f.key, '']));
    if (fields.some((f: any) => f.key === 'achievements')) {
      newItem.achievements = [];
    }
    setData((prev: any) => ({ ...prev, [name]: [...prev[name], newItem] }));
  };

  const removeItem = (index: number) => {
    setData((prev: any) => ({ ...prev, [name]: prev[name].filter((_: any, i: number) => i !== index) }));
  };

  return (
    <div>
      {items.map((item: any, index: number) => (
        <div key={index} className="space-y-3 p-4 border rounded-md mb-4 relative bg-gray-50/50">
          {fields.map((field: any) => (
            <div key={field.key}>
              <label className="text-sm font-medium text-gray-600">{field.label}</label>
              {field.type === 'textarea' ? (
                <Textarea
                  placeholder={field.placeholder}
                  value={Array.isArray(item[field.key]) ? item[field.key].join('\n') : item[field.key]}
                  onChange={(e) => handleItemChange(index, field.key, e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              ) : (
                <Input
                  type="text"
                  placeholder={field.placeholder}
                  value={item[field.key]}
                  onChange={(e) => handleItemChange(index, field.key, e.target.value)}
                  className="mt-1"
                />
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-red-500 hover:bg-red-100 hover:text-red-600 h-7 w-7"
            onClick={() => removeItem(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={addNewItem} className="w-full">
        <PlusCircle className="mr-2 h-4 w-4" /> Add {placeholder}
      </Button>
    </div>
  );
};

// --- Main Resume Builder Component ---

export function ResumeBuilder() {
  const [resumeData, setResumeData] = useState(initialResumeData);
  const [template, setTemplate] = useState<'classic' | 'modern'>('classic');

  const handlePersonalChange = (field: string, value: string) => {
    setResumeData(prev => ({ ...prev, personal: { ...prev.personal, [field]: value } }));
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResumeData(prev => ({ ...prev, skills: e.target.value.split(',').map(s => s.trim()) }));
  };

  const ResumePreview = (
    <div id="resume-preview" className="w-full bg-white shadow-lg rounded-lg p-8 aspect-[8.5/11] overflow-y-auto text-gray-800 border">
        {template === 'classic' && (
            <>
                {/* --- Classic Template (Single Column) --- */}
                <div className="text-center mb-6 border-b pb-4">
                  <h1 className="text-3xl font-bold tracking-tight">{resumeData.personal.name}</h1>
                  <div className="flex justify-center items-center gap-x-4 gap-y-1 text-xs text-gray-600 mt-2 flex-wrap">
                    {resumeData.personal.email && <div className="flex items-center gap-1.5"><Mail className="h-3 w-3" />{resumeData.personal.email}</div>}
                    {resumeData.personal.phone && <div className="flex items-center gap-1.5"><Phone className="h-3 w-3" />{resumeData.personal.phone}</div>}
                    {resumeData.personal.linkedin && <div className="flex items-center gap-1.5"><Linkedin className="h-3 w-3" />{resumeData.personal.linkedin}</div>}
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-primary border-b-2 border-primary pb-1 mb-2">Education</h2>
                  {resumeData.education.map((edu, index) => (
                    <div key={index} className="mb-2">
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-sm font-semibold">{edu.school}</h3>
                        <p className="text-xs text-gray-500">{edu.date}</p>
                      </div>
                      <div className="flex justify-between items-baseline">
                         <p className="text-sm italic">{edu.degree}</p>
                         {edu.gpa && <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mb-6">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-primary border-b-2 border-primary pb-1 mb-2">Experience / Projects</h2>
                  {resumeData.experience.map((exp, index) => (
                    <div key={index} className="mb-3">
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-sm font-semibold">{exp.title}</h3>
                        <p className="text-xs text-gray-500">{exp.dates}</p>
                      </div>
                      <p className="text-sm italic mb-1">{exp.organization}</p>
                      <ul className="list-disc list-outside pl-5 space-y-1">
                        {exp.achievements.map((ach, i) => ach && <li key={i} className="text-xs leading-relaxed">{ach}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>

                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-primary border-b-2 border-primary pb-1 mb-2">Skills</h2>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {resumeData.skills.map((skill, index) => skill && (
                      <span key={index} className="bg-gray-200 text-gray-800 text-xs font-medium px-2 py-1 rounded">{skill}</span>
                    ))}
                  </div>
                </div>
            </>
        )}
        
        {template === 'modern' && (
            <>
                {/* --- Modern Template (Two Column) --- */}
                <div className="flex gap-8 h-full">
                    {/* Left Column (Main Content) */}
                    <div className="w-2/3">
                        <h1 className="text-4xl font-bold tracking-tight mb-8 text-primary">{resumeData.personal.name}</h1>
                        
                        <div className="mb-6">
                          <h2 className="text-base font-bold uppercase tracking-wider text-gray-700 border-b-2 border-gray-300 pb-1 mb-3">Experience / Projects</h2>
                          {resumeData.experience.map((exp, index) => (
                            <div key={index} className="mb-4">
                              <div className="flex justify-between items-baseline">
                                <h3 className="text-sm font-semibold">{exp.title}</h3>
                                <p className="text-xs text-gray-500">{exp.dates}</p>
                              </div>
                              <p className="text-sm italic mb-1">{exp.organization}</p>
                              <ul className="list-disc list-outside pl-5 space-y-1">
                                {exp.achievements.map((ach, i) => ach && <li key={i} className="text-xs leading-relaxed">{ach}</li>)}
                              </ul>
                            </div>
                          ))}
                        </div>

                         <div className="mb-6">
                          <h2 className="text-base font-bold uppercase tracking-wider text-gray-700 border-b-2 border-gray-300 pb-1 mb-3">Education</h2>
                          {resumeData.education.map((edu, index) => (
                            <div key={index} className="mb-3">
                              <div className="flex justify-between items-baseline">
                                <h3 className="text-sm font-semibold">{edu.school}</h3>
                                <p className="text-xs text-gray-500">{edu.date}</p>
                              </div>
                              <div className="flex justify-between items-baseline">
                                 <p className="text-sm italic">{edu.degree}</p>
                                 {edu.gpa && <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                    </div>
                    {/* Right Column (Sidebar) */}
                    <div className="w-1/3 bg-gray-100 p-6 rounded-md -my-8 -mr-8">
                        <div className="mb-6">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-600 border-b border-gray-300 pb-1 mb-3">Contact</h2>
                            <div className="space-y-2 text-xs text-gray-700">
                                {resumeData.personal.email && <div className="flex items-center gap-2"><Mail className="h-3 w-3 shrink-0" /><span>{resumeData.personal.email}</span></div>}
                                {resumeData.personal.phone && <div className="flex items-center gap-2"><Phone className="h-3 w-3 shrink-0" /><span>{resumeData.personal.phone}</span></div>}
                                {resumeData.personal.linkedin && <div className="flex items-center gap-2"><Linkedin className="h-3 w-3 shrink-0" /><span>{resumeData.personal.linkedin}</span></div>}
                            </div>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-600 border-b border-gray-300 pb-1 mb-3">Skills</h2>
                             <div className="flex flex-wrap gap-1.5 mt-2">
                                {resumeData.skills.map((skill, index) => skill && (
                                <span key={index} className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded">{skill}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )}
    </div>
  );


  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Panel: Input Form */}
          <div className="md:col-span-5 space-y-6">
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">Resume Details</h2>
                 <Button onClick={() => window.print()} className="w-full gap-2 print:hidden bg-primary hover:bg-primary/90">
                    <Printer className="h-4 w-4" />
                    Print / Download PDF
                </Button>
            </div>
            
            <Section title="Template" icon={FileText} data-html2canvas-ignore="true">
                <div className="flex gap-2">
                    <Button variant={template === 'classic' ? 'default' : 'outline'} onClick={() => setTemplate('classic')} className="flex-1">
                        Classic
                    </Button>
                    <Button variant={template === 'modern' ? 'default' : 'outline'} onClick={() => setTemplate('modern')} className="flex-1">
                        Modern
                    </Button>
                </div>
                 <p className="text-xs text-gray-500">The 'Classic' template is optimized for ATS (Applicant Tracking Systems) and is recommended for most applications.</p>
            </Section>

            <Section title="Personal Information" icon={User}>
              <Input placeholder="Full Name" value={resumeData.personal.name} onChange={(e) => handlePersonalChange('name', e.target.value)} />
              <Input placeholder="Email" value={resumeData.personal.email} onChange={(e) => handlePersonalChange('email', e.target.value)} />
              <Input placeholder="Phone" value={resumeData.personal.phone} onChange={(e) => handlePersonalChange('phone', e.target.value)} />
              <Input placeholder="LinkedIn Profile URL" value={resumeData.personal.linkedin} onChange={(e) => handlePersonalChange('linkedin', e.target.value)} />
            </Section>

            <Section title="Education" icon={GraduationCap}>
              <DynamicSection
                name="education"
                items={resumeData.education}
                setData={setResumeData}
                placeholder="Education"
                fields={[
                  { key: 'school', label: 'School / University', placeholder: 'e.g., State University' },
                  { key: 'degree', label: 'Degree & Major', placeholder: 'e.g., B.S. in Computer Science' },
                  { key: 'date', label: 'Date', placeholder: 'e.g., Aug 2020 - May 2024' },
                  { key: 'gpa', label: 'GPA (Optional)', placeholder: 'e.g., 3.8/4.0' }
                ]}
              />
            </Section>

            <Section title="Experience / Projects" icon={Briefcase}>
              <DynamicSection
                name="experience"
                items={resumeData.experience}
                setData={setResumeData}
                placeholder="Experience"
                fields={[
                  { key: 'title', label: 'Title', placeholder: 'e.g., Software Engineer Intern' },
                  { key: 'organization', label: 'Organization', placeholder: 'e.g., Tech Company Inc.' },
                  { key: 'dates', label: 'Dates', placeholder: 'e.g., June 2023 - Aug 2023' },
                  { key: 'achievements', label: 'Achievements (one per line)', type: 'textarea', placeholder: 'Describe your responsibilities and achievements...' }
                ]}
              />
            </Section>

            <Section title="Skills" icon={Star}>
              <p className="text-sm text-gray-500">Enter skills separated by commas.</p>
              <Input
                placeholder="e.g., React, Python, Team Leadership"
                value={resumeData.skills.join(', ')}
                onChange={handleSkillsChange}
              />
            </Section>
          </div>

          {/* Right Panel: Resume Preview */}
          <div className="md:col-span-7">
            <div className="sticky top-8 print:top-0">
              {ResumePreview}
            </div>
          </div>
        </div>
      </div>
      
      {/* Print-specific styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #resume-preview, #resume-preview * {
            visibility: visible;
          }
          #resume-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            border: none;
            box-shadow: none;
            border-radius: 0;
            overflow: hidden;
            font-size: 10px; /* Adjust font size for print */
          }
           #resume-preview h1 { font-size: 24px; }
           #resume-preview h2 { font-size: 12px; }
           #resume-preview h3 { font-size: 11px; }
           #resume-preview p, #resume-preview li, #resume-preview span, #resume-preview div { font-size: 10px; }
           #resume-preview .text-xs { font-size: 9px; }
           #resume-preview .text-sm { font-size: 10px; }
           #resume-preview .text-base { font-size: 11px; }
           #resume-preview .text-lg { font-size: 12px; }
           #resume-preview .text-xl { font-size: 14px; }
           #resume-preview .text-2xl { font-size: 16px; }
           #resume-preview .text-3xl { font-size: 20px; }
           #resume-preview .text-4xl { font-size: 24px; }

          .print\\:hidden {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

    

    