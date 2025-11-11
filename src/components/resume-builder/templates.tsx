
"use client";

import { getAchievements, hasContent, ResumeFormValues } from "./ResumeBuilder";

type TemplateProps = {
    resumeData: ResumeFormValues;
};

export const AtsClassicTemplate: React.FC<TemplateProps> = ({ resumeData }) => (
    <>
        <div className="text-center mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-gray-800">{resumeData.personal?.name}</h1>
            {(hasContent(resumeData.personal?.email) || hasContent(resumeData.personal?.phone) || hasContent(resumeData.personal?.linkedin)) && (
                 <div className="flex justify-center items-center gap-x-4 gap-y-1 text-xs text-gray-600 mt-2 flex-wrap">
                    {hasContent(resumeData.personal.email) && <div className="flex items-center gap-1.5">{resumeData.personal.email}</div>}
                    {hasContent(resumeData.personal.phone) && <div className="flex items-center gap-1.5">{resumeData.personal.phone}</div>}
                    {hasContent(resumeData.personal.linkedin) && <div className="flex items-center gap-1.5">{resumeData.personal.linkedin}</div>}
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

        {hasContent(resumeData.skills) && <div><h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-b-2 border-gray-800 pb-1 mb-2">Skills</h2><p className="text-xs">{resumeData.skills}</p></div>}
    </>
);

export const AtsTraditionalTemplate: React.FC<TemplateProps> = ({ resumeData }) => (
    <>
        <div className="text-center mb-6">
            <h1 className="text-2xl font-serif font-bold tracking-tight text-gray-800">{resumeData.personal?.name}</h1>
            {(hasContent(resumeData.personal?.email) || hasContent(resumeData.personal?.phone) || hasContent(resumeData.personal?.linkedin)) && (
                 <div className="flex justify-center items-center gap-x-3 gap-y-1 text-xs text-gray-500 mt-2 flex-wrap">
                    {hasContent(resumeData.personal.email) && <div className="flex items-center gap-1.5">{resumeData.personal.email}</div>}
                    {hasContent(resumeData.personal.phone) && <span>|</span>}
                    {hasContent(resumeData.personal.phone) && <div className="flex items-center gap-1.5">{resumeData.personal.phone}</div>}
                    {hasContent(resumeData.personal.linkedin) && <span>|</span>}
                    {hasContent(resumeData.personal.linkedin) && <div className="flex items-center gap-1.5">{resumeData.personal.linkedin}</div>}
                </div>
            )}
        </div>

        {hasContent(resumeData.summary) && <div className="mb-5"><h2 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-gray-300 pb-1 mb-2">Summary</h2><p className="text-xs leading-relaxed">{resumeData.summary}</p></div>}
        
        {hasContent(resumeData.education, 'school') && <div className="mb-5"><h2 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-gray-300 pb-1 mb-2">Education</h2>{resumeData.education?.map((edu, index) => edu.school && (
            <div key={index} className="mb-2"><div className="flex justify-between items-baseline"><h3 className="text-sm font-semibold text-gray-800">{edu.school}</h3><p className="text-xs text-gray-500">{edu.date}</p></div><div className="flex justify-between items-baseline"><p className="text-sm italic">{edu.degree}</p>{edu.scoreValue && edu.scoreType && <p className="text-xs text-gray-500">{edu.scoreType}: {edu.scoreValue}{edu.scoreType === 'Percentage' ? '%' : ''}</p>}</div></div>
        ))}</div>}

        {hasContent(resumeData.experience, 'title') && <div className="mb-5"><h2 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-gray-300 pb-1 mb-2">Experience / Projects</h2>{resumeData.experience?.map((exp, index) => exp.title && (
            <div key={index} className="mb-3"><div className="flex justify-between items-baseline"><h3 className="text-sm font-semibold text-gray-800">{exp.title}</h3><p className="text-xs text-gray-500">{exp.dates}</p></div><p className="text-sm italic mb-1">{exp.organization}</p>{hasContent(getAchievements(exp.achievements)) && <ul className="list-disc list-outside pl-5 space-y-1">{getAchievements(exp.achievements).map((ach, i) => ach && <li key={i} className="text-xs leading-relaxed">{ach}</li>)}</ul>}</div>
        ))}</div>}
        
        {hasContent(resumeData.skills) && <div className="mb-5"><h2 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-gray-300 pb-1 mb-2">Skills</h2><p className="text-xs leading-relaxed">{resumeData.skills}</p></div>}

        {hasContent(resumeData.certifications, 'name') && <div className="mb-5"><h2 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-gray-300 pb-1 mb-2">Certifications</h2>{resumeData.certifications?.map((cert, index) => cert.name && (
            <div key={index} className="mb-2"><h3 className="text-sm font-semibold text-gray-800 inline">{cert.name}</h3><span className="text-sm italic">, {cert.issuer}</span><span className="text-xs text-gray-500 float-right">{cert.date}</span></div>
        ))}</div>}

        {hasContent(resumeData.awards, 'name') && <div className="mb-5"><h2 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-gray-300 pb-1 mb-2">Awards & Honors</h2>{resumeData.awards?.map((award, index) => award.name && (
            <div key={index} className="mb-2"><div className="flex justify-between items-baseline"><h3 className="text-sm font-semibold text-gray-800">{award.name}</h3>{award.date && <p className="text-xs text-gray-500">{award.date}</p>}</div>{award.description && <p className="text-xs leading-relaxed">{award.description}</p>}</div>
        ))}</div>}

        {hasContent(resumeData.volunteering, 'role') && <div className="mb-5"><h2 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-gray-300 pb-1 mb-2">Volunteer & Leadership</h2>{resumeData.volunteering?.map((item, index) => item.role && (
            <div key={index} className="mb-3"><div className="flex justify-between items-baseline"><h3 className="text-sm font-semibold text-gray-800">{item.role}</h3><p className="text-xs text-gray-500">{item.dates}</p></div><p className="text-sm italic mb-1">{item.organization}</p>{item.description && <p className="text-xs leading-relaxed">{item.description}</p>}</div>
        ))}</div>}
    </>
);

export const AtsCompactTemplate: React.FC<TemplateProps> = ({ resumeData }) => (
    <div className="text-[10px] leading-snug">
        <div className="text-center mb-4">
            <h1 className="text-2xl font-bold tracking-tight text-gray-800">{resumeData.personal?.name}</h1>
            {(hasContent(resumeData.personal?.email) || hasContent(resumeData.personal?.phone) || hasContent(resumeData.personal?.linkedin)) && (
                 <div className="flex justify-center items-center gap-x-2 gap-y-1 text-[9px] text-gray-600 mt-1 flex-wrap">
                    {hasContent(resumeData.personal.email) && <div className="flex items-center gap-1.5">{resumeData.personal.email}</div>}
                    {hasContent(resumeData.personal.phone) && <span>•</span>}
                    {hasContent(resumeData.personal.phone) && <div className="flex items-center gap-1.5">{resumeData.personal.phone}</div>}
                    {hasContent(resumeData.personal.linkedin) && <span>•</span>}
                    {hasContent(resumeData.personal.linkedin) && <div className="flex items-center gap-1.5">{resumeData.personal.linkedin}</div>}
                </div>
            )}
        </div>

        {hasContent(resumeData.summary) && <div className="mb-3"><h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-700 border-b border-gray-300 pb-0.5 mb-1.5">Summary</h2><p>{resumeData.summary}</p></div>}
        
        {hasContent(resumeData.skills) && <div className="mb-3"><h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-700 border-b border-gray-300 pb-0.5 mb-1.5">Skills</h2><p>{resumeData.skills}</p></div>}
        
        {hasContent(resumeData.experience, 'title') && <div className="mb-3"><h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-700 border-b border-gray-300 pb-0.5 mb-1.5">Experience / Projects</h2>{resumeData.experience?.map((exp, index) => exp.title && (
            <div key={index} className="mb-2"><div className="flex justify-between items-baseline"><h3 className="font-semibold text-gray-800">{exp.title}</h3><p className="text-gray-500">{exp.dates}</p></div><p className="italic mb-0.5">{exp.organization}</p>{hasContent(getAchievements(exp.achievements)) && <ul className="list-disc list-outside pl-4 space-y-0.5">{getAchievements(exp.achievements).map((ach, i) => ach && <li key={i}>{ach}</li>)}</ul>}</div>
        ))}</div>}
        
        {hasContent(resumeData.education, 'school') && <div className="mb-3"><h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-700 border-b border-gray-300 pb-0.5 mb-1.5">Education</h2>{resumeData.education?.map((edu, index) => edu.school && (
            <div key={index} className="mb-1.5"><div className="flex justify-between items-baseline"><h3 className="font-semibold text-gray-800">{edu.school}</h3><p className="text-gray-500">{edu.date}</p></div><div className="flex justify-between items-baseline"><p className="italic">{edu.degree}</p>{edu.scoreValue && edu.scoreType && <p className="text-gray-500">{edu.scoreType}: {edu.scoreValue}{edu.scoreType === 'Percentage' ? '%' : ''}</p>}</div></div>
        ))}</div>}

        {hasContent(resumeData.certifications, 'name') && <div className="mb-3"><h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-700 border-b border-gray-300 pb-0.5 mb-1.5">Certifications</h2>{resumeData.certifications?.map((cert, index) => cert.name && (
            <div key={index} className="mb-1"><h3 className="font-semibold text-gray-800 inline">{cert.name}</h3><span className="italic">, {cert.issuer}</span><span className="float-right">{cert.date}</span></div>
        ))}</div>}

        {hasContent(resumeData.awards, 'name') && <div className="mb-3"><h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-700 border-b border-gray-300 pb-0.5 mb-1.5">Awards & Honors</h2>{resumeData.awards?.map((award, index) => award.name && (
            <div key={index} className="mb-1"><div className="flex justify-between items-baseline"><h3 className="font-semibold text-gray-800">{award.name}</h3>{award.date && <p className="text-gray-500">{award.date}</p>}</div>{award.description && <p>{award.description}</p>}</div>
        ))}</div>}
    </div>
);

export const ModernStylishTemplate: React.FC<TemplateProps> = ({ resumeData }) => (
    <>
        <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2">
                <h1 className="text-4xl font-bold tracking-tight mb-2 text-gray-800">{resumeData.personal?.name}</h1>
                {hasContent(resumeData.summary) && <p className="text-xs leading-relaxed mb-6">{resumeData.summary}</p>}
                
                {hasContent(resumeData.experience, 'title') && <div className="mb-6"><h2 className="text-base font-bold uppercase tracking-wider text-gray-700 border-b-2 border-gray-300 pb-1 mb-3">Experience / Projects</h2>{resumeData.experience?.map((exp, index) => exp.title && (
                    <div key={index} className="mb-4"><div className="flex justify-between items-baseline"><h3 className="text-sm font-semibold text-gray-800">{exp.title}</h3><p className="text-xs text-gray-500">{exp.dates}</p></div><p className="text-sm italic mb-1">{exp.organization}</p>{hasContent(getAchievements(exp.achievements)) && <ul className="list-disc list-outside pl-5 space-y-1">{getAchievements(exp.achievements).map((ach, i) => ach && <li key={i} className="text-xs leading-relaxed">{ach}</li>)}</ul>}</div>
                ))}</div>}

                 {hasContent(resumeData.education, 'school') && <div className="mb-6"><h2 className="text-base font-bold uppercase tracking-wider text-gray-700 border-b-2 border-gray-300 pb-1 mb-3">Education</h2>{resumeData.education?.map((edu, index) => edu.school && (
                    <div key={index} className="mb-3"><div className="flex justify-between items-baseline"><h3 className="text-sm font-semibold text-gray-800">{edu.school}</h3><p className="text-xs text-gray-500">{edu.date}</p></div><div className="flex justify-between items-baseline"><p className="text-sm italic">{edu.degree}</p>{edu.scoreValue && edu.scoreType && <p className="text-xs text-gray-500">{edu.scoreType}: {edu.scoreValue}{edu.scoreType === 'Percentage' ? '%' : ''}</p>}</div></div>
                  ))}</div>}
            </div>
            <div className="col-span-1 bg-gray-100 p-6 -my-8 -mr-8">
                {(hasContent(resumeData.personal?.email) || hasContent(resumeData.personal?.phone) || hasContent(resumeData.personal?.linkedin)) && <div className="mb-6"><h2 className="text-sm font-bold uppercase tracking-wider text-gray-600 border-b border-gray-300 pb-1 mb-3">Contact</h2><div className="space-y-2 text-xs text-gray-700">
                        {hasContent(resumeData.personal.email) && <div className="flex items-center gap-2"><span>{resumeData.personal.email}</span></div>}
                        {hasContent(resumeData.personal.phone) && <div className="flex items-center gap-2"><span>{resumeData.personal.phone}</span></div>}
                        {hasContent(resumeData.personal.linkedin) && <div className="flex items-center gap-2"><span>{resumeData.personal.linkedin}</span></div>}
                </div></div>}

                {hasContent(resumeData.skills) && <div className="mb-6"><h2 className="text-sm font-bold uppercase tracking-wider text-gray-600 border-b border-gray-300 pb-1 mb-3">Skills</h2><div className="flex flex-wrap gap-1.5 mt-2">{typeof resumeData.skills === 'string' && resumeData.skills.split(',').map((skill, index) => skill.trim() && (<span key={index} className="bg-primary/10 text-primary text-[10px] font-medium px-2 py-1 rounded">{skill.trim()}</span>))}</div></div>}
                
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
);

export const ModernCreativeTemplate: React.FC<TemplateProps> = ({ resumeData }) => (
    <div className="flex flex-col h-full font-serif text-gray-700">
        <header className="text-center p-6 bg-teal-50">
            <h1 className="text-4xl font-bold text-teal-800">{resumeData.personal?.name}</h1>
            <div className="flex justify-center items-center gap-x-4 gap-y-1 text-xs text-teal-700 mt-2 flex-wrap">
                {hasContent(resumeData.personal.email) && <div>{resumeData.personal.email}</div>}
                {hasContent(resumeData.personal.phone) && <div>{resumeData.personal.phone}</div>}
                {hasContent(resumeData.personal.linkedin) && <div>{resumeData.personal.linkedin}</div>}
            </div>
        </header>

        <main className="flex-grow p-6">
            {hasContent(resumeData.summary) && <section className="mb-6"><h2 className="text-lg font-bold text-teal-800 tracking-wider uppercase mb-2">Objective</h2><p className="text-sm">{resumeData.summary}</p></section>}
            
            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2">
                    {hasContent(resumeData.experience, 'title') && <section className="mb-6"><h2 className="text-lg font-bold text-teal-800 tracking-wider uppercase mb-2">Experience</h2>{resumeData.experience?.map((exp, index) => exp.title && (
                        <div key={index} className="mb-4"><h3 className="text-base font-bold">{exp.title} | <span className="font-normal italic">{exp.organization}</span></h3><p className="text-xs text-gray-500 mb-1">{exp.dates}</p>{hasContent(getAchievements(exp.achievements)) && <ul className="list-disc list-outside pl-5 space-y-1 text-sm">{getAchievements(exp.achievements).map((ach, i) => ach && <li key={i}>{ach}</li>)}</ul>}</div>
                    ))}</section>}
                </div>
                <div className="col-span-1">
                    {hasContent(resumeData.education, 'school') && <section className="mb-6"><h2 className="text-lg font-bold text-teal-800 tracking-wider uppercase mb-2">Education</h2>{resumeData.education?.map((edu, index) => edu.school && (
                        <div key={index} className="mb-3"><h3 className="text-base font-bold">{edu.school}</h3><p className="text-sm italic">{edu.degree}</p><p className="text-xs text-gray-500">{edu.date}</p>{edu.scoreValue && edu.scoreType && <p className="text-xs text-gray-500">{edu.scoreType}: {edu.scoreValue}{edu.scoreType === 'Percentage' ? '%' : ''}</p>}</div>
                    ))}</section>}
                    
                    {hasContent(resumeData.skills) && <section className="mb-6"><h2 className="text-lg font-bold text-teal-800 tracking-wider uppercase mb-2">Skills</h2><p className="text-sm">{resumeData.skills}</p></section>}
                    
                    {hasContent(resumeData.awards, 'name') && <section className="mb-6"><h2 className="text-lg font-bold text-teal-800 tracking-wider uppercase mb-2">Awards</h2>{resumeData.awards?.map((award, index) => award.name && (
                        <div key={index} className="mb-2"><h3 className="text-base font-bold">{award.name} <span className="text-xs text-gray-500">({award.date})</span></h3></div>
                    ))}</section>}
                </div>
            </div>
        </main>
    </div>
);

export const ModernMinimalistTemplate: React.FC<TemplateProps> = ({ resumeData }) => (
    <div className="font-sans text-xs">
        <header className="mb-6">
            <h1 className="text-3xl font-light tracking-widest uppercase text-center">{resumeData.personal?.name}</h1>
             <div className="flex justify-center items-center gap-x-3 gap-y-1 text-[10px] text-gray-500 mt-2 flex-wrap">
                {hasContent(resumeData.personal.email) && <div>{resumeData.personal.email}</div>}
                {hasContent(resumeData.personal.phone) && <div className='font-bold'>·</div>}
                {hasContent(resumeData.personal.phone) && <div>{resumeData.personal.phone}</div>}
                {hasContent(resumeData.personal.linkedin) && <div className='font-bold'>·</div>}
                {hasContent(resumeData.personal.linkedin) && <div>{resumeData.personal.linkedin}</div>}
            </div>
        </header>
        <hr className="my-4"/>
        
        {hasContent(resumeData.summary) && <section className="mb-4"><p className="text-center italic">{resumeData.summary}</p></section>}

        {hasContent(resumeData.experience, 'title') && <section className="mb-4"><h2 className="text-sm font-semibold tracking-wider uppercase mb-2">Experience</h2>{resumeData.experience?.map((exp, index) => exp.title && (
            <div key={index} className="mb-3 grid grid-cols-4 gap-2"><div className="col-span-1 text-gray-500"><p>{exp.dates}</p><p className='font-semibold'>{exp.organization}</p></div><div className="col-span-3"><h3 className="text-sm font-bold">{exp.title}</h3>{hasContent(getAchievements(exp.achievements)) && <ul className="list-disc list-outside pl-4 space-y-1">{getAchievements(exp.achievements).map((ach, i) => ach && <li key={i}>{ach}</li>)}</ul>}</div></div>
        ))}</section>}

        {hasContent(resumeData.education, 'school') && <section className="mb-4"><h2 className="text-sm font-semibold tracking-wider uppercase mb-2">Education</h2>{resumeData.education?.map((edu, index) => edu.school && (
            <div key={index} className="mb-2 grid grid-cols-4 gap-2"><div className="col-span-1 text-gray-500"><p>{edu.date}</p></div><div className="col-span-3"><h3 className="text-sm font-bold">{edu.school}</h3><p>{edu.degree}</p>{edu.scoreValue && edu.scoreType && <p className="text-xs">{edu.scoreType}: {edu.scoreValue}{edu.scoreType === 'Percentage' ? '%' : ''}</p>}</div></div>
        ))}</section>}
        
        {hasContent(resumeData.skills) && <section className="mb-4"><h2 className="text-sm font-semibold tracking-wider uppercase mb-2">Skills</h2><p>{resumeData.skills}</p></section>}
    </div>
);
