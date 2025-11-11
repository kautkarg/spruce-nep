
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2, Printer, Mail, Phone, Linkedin, MapPin, GraduationCap, Briefcase, Star, User, FileText, Award, UserCheck, HeartHandshake } from "lucide-react";
import { cn } from '@/lib/utils';

// --- Type Definitions for Resume Data ---
type PersonalInfo = {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
};
type Education = {
  school: string;
  degree: string;
  date: string;
  gpa: string;
};
type Experience = {
  title: string;
  organization: string;
  dates: string;
  achievements: string[];
};
type AwardItem = {
    name: string;
    date: string;
    description: string;
};
type VolunteerItem = {
    role: string;
    organization: string;
    dates: string;
    description: string;
};
type Certification = {
    name: string;
    issuer: string;
    date: string;
};
type ResumeData = {
  personal: PersonalInfo;
  summary: string;
  education: Education[];
  experience: Experience[];
  skills: string[];
  awards: AwardItem[];
  volunteering: VolunteerItem[];
  certifications: Certification[];
};


// Initial state for a blank resume
const initialResumeData: ResumeData = {
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
  skills: ['React', 'Node.js', 'JavaScript', 'Tailwind CSS', 'SQL', 'Agile Methodologies'],
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

// Dynamic array section for education/experience etc.
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
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [template, setTemplate] = useState<'classic' | 'modern'>('classic');
  const [isClient, setIsClient] = useState(false);
  const resumePreviewRef = useRef<HTMLDivElement>(null);

  // --- Data Persistence with localStorage ---
  useEffect(() => {
    setIsClient(true);
    try {
      const savedData = localStorage.getItem('spruce-resume-data');
      if (savedData) {
        setResumeData(JSON.parse(savedData));
      }
    } catch (error) {
      console.error("Failed to parse resume data from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('spruce-resume-data', JSON.stringify(resumeData));
    }
  }, [resumeData, isClient]);

  const handlePersonalChange = (field: string, value: string) => {
    setResumeData(prev => ({ ...prev, personal: { ...prev.personal, [field]: value } }));
  };

  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResumeData(prev => ({ ...prev, summary: e.target.value }));
  }

  const handleSkillsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResumeData(prev => ({ ...prev, skills: e.target.value.split(',').map(s => s.trim()) }));
  };
  
  const hasContent = (arr: any[] | undefined, key?: string) => {
    if (!arr || arr.length === 0) return false;
    if (!key) return arr.some(item => item); // For simple arrays like skills
    return arr.some(item => item && item[key]);
  };

  const handleDownload = async () => {
    const element = resumePreviewRef.current;
    if (!element) return;
    
    // Dynamically import html2pdf.js only on the client-side
    const html2pdf = (await import('html2pdf.js')).default;

    const options = {
      margin:       [0.5, 0.5, 0.5, 0.5],
      filename:     `Resume-${resumeData.personal.name.replace(/\s+/g, '-') || 'Student'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(element).set(options).save();
  };
  
  
  const ResumeContent = (
      <>
        {template === 'classic' && (
            <>
                {/* --- Classic Template (Single Column) --- */}
                <div className="text-center mb-6 border-b border-gray-800 pb-4">
                  <h1 className="text-3xl font-bold tracking-tight text-gray-800">{resumeData.personal.name || 'Your Name'}</h1>
                   { (resumeData.personal.email || resumeData.personal.phone || resumeData.personal.linkedin) && (
                        <div className="flex justify-center items-center gap-x-4 gap-y-1 text-xs text-gray-600 mt-2 flex-wrap">
                            {resumeData.personal.email && <div className="flex items-center gap-1.5"><Mail className="h-3 w-3" />{resumeData.personal.email}</div>}
                            {resumeData.personal.phone && <div className="flex items-center gap-1.5"><Phone className="h-3 w-3" />{resumeData.personal.phone}</div>}
                            {resumeData.personal.linkedin && <div className="flex items-center gap-1.5"><Linkedin className="h-3 w-3" />{resumeData.personal.linkedin}</div>}
                        </div>
                   )}
                </div>

                {resumeData.summary && <div className="mb-6"><h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-b-2 border-gray-800 pb-1 mb-2">Summary</h2><p className="text-xs leading-relaxed">{resumeData.summary}</p></div>}
                
                {hasContent(resumeData.education, 'school') && <div className="mb-6"><h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-b-2 border-gray-800 pb-1 mb-2">Education</h2>{resumeData.education.filter(e => e.school).map((edu, index) => (
                    <div key={index} className="mb-2"><div className="flex justify-between items-baseline"><h3 className="text-sm font-semibold text-gray-800">{edu.school}</h3><p className="text-xs text-gray-500">{edu.date}</p></div><div className="flex justify-between items-baseline"><p className="text-sm italic">{edu.degree}</p>{edu.gpa && <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>}</div></div>
                ))}</div>}

                {hasContent(resumeData.experience, 'title') && <div className="mb-6"><h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-b-2 border-gray-800 pb-1 mb-2">Experience / Projects</h2>{resumeData.experience.filter(e=>e.title).map((exp, index) => (
                    <div key={index} className="mb-3"><div className="flex justify-between items-baseline"><h3 className="text-sm font-semibold text-gray-800">{exp.title}</h3><p className="text-xs text-gray-500">{exp.dates}</p></div><p className="text-sm italic mb-1">{exp.organization}</p>{hasContent(exp.achievements) && <ul className="list-disc list-outside pl-5 space-y-1">{exp.achievements.map((ach, i) => ach && <li key={i} className="text-xs leading-relaxed">{ach}</li>)}</ul>}</div>
                ))}</div>}
                
                {hasContent(resumeData.awards, 'name') && <div className="mb-6"><h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-b-2 border-gray-800 pb-1 mb-2">Awards & Honors</h2>{resumeData.awards.filter(a=>a.name).map((award, index) => (
                    <div key={index} className="mb-2"><div className="flex justify-between items-baseline"><h3 className="text-sm font-semibold text-gray-800">{award.name}</h3>{award.date && <p className="text-xs text-gray-500">{award.date}</p>}</div>{award.description && <p className="text-xs leading-relaxed">{award.description}</p>}</div>
                ))}</div>}

                {hasContent(resumeData.volunteering, 'role') && <div className="mb-6"><h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-b-2 border-gray-800 pb-1 mb-2">Volunteer & Leadership</h2>{resumeData.volunteering.filter(v=>v.role).map((item, index) => (
                    <div key={index} className="mb-3"><div className="flex justify-between items-baseline"><h3 className="text-sm font-semibold text-gray-800">{item.role}</h3><p className="text-xs text-gray-500">{item.dates}</p></div><p className="text-sm italic mb-1">{item.organization}</p>{item.description && <p className="text-xs leading-relaxed">{item.description}</p>}</div>
                ))}</div>}

                {hasContent(resumeData.certifications, 'name') && <div className="mb-6"><h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-b-2 border-gray-800 pb-1 mb-2">Certifications</h2>{resumeData.certifications.filter(c=>c.name).map((cert, index) => (
                    <div key={index} className="mb-2"><div className="flex justify-between items-baseline"><h3 className="text-sm font-semibold text-gray-800">{cert.name}</h3><p className="text-xs text-gray-500">{cert.date}</p></div><p className="text-sm italic">{cert.issuer}</p></div>
                ))}</div>}

                {hasContent(resumeData.skills) && <div><h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-b-2 border-gray-800 pb-1 mb-2">Skills</h2><div className="flex flex-wrap gap-2 mt-2">{resumeData.skills.map((skill, index) => skill && (<span key={index} className="bg-gray-200 text-gray-800 text-xs font-medium px-2 py-1 rounded">{skill}</span>))}</div></div>}
            </>
        )}
        
        {template === 'modern' && (
            <>
                {/* --- Modern Template (Two Column) --- */}
                <div className="flex gap-8 h-full">
                    {/* Left Column (Main Content) */}
                    <div className="w-2/3">
                        <h1 className="text-4xl font-bold tracking-tight mb-2 text-gray-800">{resumeData.personal.name}</h1>
                        {resumeData.summary && <p className="text-xs leading-relaxed mb-6">{resumeData.summary}</p>}
                        
                        {hasContent(resumeData.experience, 'title') && <div className="mb-6"><h2 className="text-base font-bold uppercase tracking-wider text-gray-700 border-b-2 border-gray-300 pb-1 mb-3">Experience / Projects</h2>{resumeData.experience.filter(e => e.title).map((exp, index) => (
                            <div key={index} className="mb-4"><div className="flex justify-between items-baseline"><h3 className="text-sm font-semibold text-gray-800">{exp.title}</h3><p className="text-xs text-gray-500">{exp.dates}</p></div><p className="text-sm italic mb-1">{exp.organization}</p>{hasContent(exp.achievements) && <ul className="list-disc list-outside pl-5 space-y-1">{exp.achievements.map((ach, i) => ach && <li key={i} className="text-xs leading-relaxed">{ach}</li>)}</ul>}</div>
                        ))}</div>}

                         {hasContent(resumeData.education, 'school') && <div className="mb-6"><h2 className="text-base font-bold uppercase tracking-wider text-gray-700 border-b-2 border-gray-300 pb-1 mb-3">Education</h2>{resumeData.education.filter(e=>e.school).map((edu, index) => (
                            <div key={index} className="mb-3"><div className="flex justify-between items-baseline"><h3 className="text-sm font-semibold text-gray-800">{edu.school}</h3><p className="text-xs text-gray-500">{edu.date}</p></div><div className="flex justify-between items-baseline"><p className="text-sm italic">{edu.degree}</p>{edu.gpa && <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>}</div></div>
                          ))}</div>}
                    </div>
                    {/* Right Column (Sidebar) */}
                    <div className="w-1/3 bg-gray-100 p-6 rounded-md -my-8 -mr-8">
                        {(resumeData.personal.email || resumeData.personal.phone || resumeData.personal.linkedin) && <div className="mb-6"><h2 className="text-sm font-bold uppercase tracking-wider text-gray-600 border-b border-gray-300 pb-1 mb-3">Contact</h2><div className="space-y-2 text-xs text-gray-700">
                                {resumeData.personal.email && <div className="flex items-center gap-2"><Mail className="h-3 w-3 shrink-0" /><span>{resumeData.personal.email}</span></div>}
                                {resumeData.personal.phone && <div className="flex items-center gap-2"><Phone className="h-3 w-3 shrink-0" /><span>{resumeData.personal.phone}</span></div>}
                                {resumeData.personal.linkedin && <div className="flex items-center gap-2"><Linkedin className="h-3 w-3 shrink-0" /><span>{resumeData.personal.linkedin}</span></div>}
                        </div></div>}

                        {hasContent(resumeData.skills) && <div className="mb-6"><h2 className="text-sm font-bold uppercase tracking-wider text-gray-600 border-b border-gray-300 pb-1 mb-3">Skills</h2><div className="flex flex-wrap gap-1.5 mt-2">{resumeData.skills.map((skill, index) => skill && (<span key={index} className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded">{skill}</span>))}</div></div>}
                        
                        {hasContent(resumeData.awards, 'name') && <div className="mb-6"><h2 className="text-sm font-bold uppercase tracking-wider text-gray-600 border-b border-gray-300 pb-1 mb-3">Awards</h2><div className="space-y-3 mt-2">{resumeData.awards.filter(a=>a.name).map((award, index) => (
                            <div key={index}><h3 className="text-xs font-semibold text-gray-800">{award.name}</h3>{award.date && <p className="text-xs text-gray-500">{award.date}</p>}</div>
                        ))}</div></div>}

                        {hasContent(resumeData.certifications, 'name') && <div className="mb-6"><h2 className="text-sm font-bold uppercase tracking-wider text-gray-600 border-b border-gray-300 pb-1 mb-3">Certifications</h2><div className="space-y-3 mt-2">{resumeData.certifications.filter(c=>c.name).map((cert, index) => (
                            <div key={index}><h3 className="text-xs font-semibold text-gray-800">{cert.name}</h3><p className="text-xs text-gray-500">{cert.issuer}</p></div>
                        ))}</div></div>}
                        
                        {hasContent(resumeData.volunteering, 'role') && <div className="mb-6"><h2 className="text-sm font-bold uppercase tracking-wider text-gray-600 border-b border-gray-300 pb-1 mb-3">Leadership</h2><div className="space-y-3 mt-2">{resumeData.volunteering.filter(v=>v.role).map((item, index) => (
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
          
          {/* Left Panel: Input Form */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">Resume Details</h2>
                 <Button onClick={handleDownload} className="w-full gap-2 bg-primary hover:bg-primary/90">
                    <Printer className="h-4 w-4" />
                    Download as PDF
                </Button>
            </div>
            
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

            <Section title="Personal Information" icon={User}>
              <Input placeholder="Full Name" value={resumeData.personal.name} onChange={(e) => handlePersonalChange('name', e.target.value)} />
              <Input placeholder="Email" value={resumeData.personal.email} onChange={(e) => handlePersonalChange('email', e.target.value)} />
              <Input placeholder="Phone" value={resumeData.personal.phone} onChange={(e) => handlePersonalChange('phone', e.target.value)} />
              <Input placeholder="LinkedIn Profile URL" value={resumeData.personal.linkedin} onChange={(e) => handlePersonalChange('linkedin', e.target.value)} />
            </Section>
            
            <Section title="Summary / Objective" icon={UserCheck}>
                <Textarea placeholder="A brief summary of your skills and career goals..." value={resumeData.summary} onChange={handleSummaryChange} rows={4} />
            </Section>

            <Section title="Education" icon={GraduationCap}>
              <DynamicSection name="education" items={resumeData.education} setData={setResumeData} placeholder="Education"
                fields={[
                  { key: 'school', label: 'School / University', placeholder: 'e.g., State University' },
                  { key: 'degree', label: 'Degree & Major', placeholder: 'e.g., B.S. in Computer Science' },
                  { key: 'date', label: 'Date', placeholder: 'e.g., Aug 2020 - May 2024' },
                  { key: 'gpa', label: 'GPA (Optional)', placeholder: 'e.g., 3.8/4.0' }
                ]}
              />
            </Section>

            <Section title="Experience / Projects" icon={Briefcase}>
              <DynamicSection name="experience" items={resumeData.experience} setData={setResumeData} placeholder="Experience"
                fields={[
                  { key: 'title', label: 'Title', placeholder: 'e.g., Software Engineer Intern' },
                  { key: 'organization', label: 'Organization', placeholder: 'e.g., Tech Company Inc.' },
                  { key: 'dates', label: 'Dates', placeholder: 'e.g., June 2023 - Aug 2023' },
                  { key: 'achievements', label: 'Achievements (one per line)', type: 'textarea', placeholder: 'Describe your responsibilities and achievements...' }
                ]}
              />
            </Section>

             <Section title="Awards & Honors" icon={Award}>
              <DynamicSection name="awards" items={resumeData.awards} setData={setResumeData} placeholder="Award"
                fields={[
                  { key: 'name', label: 'Award Name', placeholder: 'e.g., Dean\'s List' },
                  { key: 'date', label: 'Date', placeholder: 'e.g., Spring 2023' },
                  { key: 'description', label: 'Description', type: 'textarea', placeholder: 'e.g., Recognized for academic excellence.' }
                ]}
              />
            </Section>
            
            <Section title="Volunteer & Leadership" icon={HeartHandshake}>
              <DynamicSection name="volunteering" items={resumeData.volunteering} setData={setResumeData} placeholder="Activity"
                fields={[
                  { key: 'role', label: 'Role', placeholder: 'e.g., Team Lead' },
                  { key: 'organization', label: 'Organization', placeholder: 'e.g., Annual Tech Fest' },
                  { key: 'dates', label: 'Dates', placeholder: 'e.g., March 2023' },
                  { key: 'description', label: 'Description', type: 'textarea', placeholder: 'e.g., Led a team of 5 volunteers...' }
                ]}
              />
            </Section>

            <Section title="Certifications" icon={Award}>
              <DynamicSection name="certifications" items={resumeData.certifications} setData={setResumeData} placeholder="Certification"
                fields={[
                  { key: 'name', label: 'Certification Name', placeholder: 'e.g., Certified JavaScript Developer' },
                  { key: 'issuer', label: 'Issuing Organization', placeholder: 'e.g., Tech Certification Inc.' },
                  { key: 'date', label: 'Date', placeholder: 'e.g., June 2023' }
                ]}
              />
            </Section>

            <Section title="Skills" icon={Star}>
              <p className="text-sm text-gray-500">Enter skills separated by commas.</p>
              <Textarea
                placeholder="e.g., React, Python, Team Leadership, Agile Methodologies"
                value={resumeData.skills.join(', ')}
                onChange={handleSkillsChange}
                rows={3}
              />
            </Section>
          </div>

          {/* Right Panel: Resume Preview */}
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

    