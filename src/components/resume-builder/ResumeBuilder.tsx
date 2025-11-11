
"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Trash2, Mail, Phone, Linkedin, MapPin } from "lucide-react";

const resumeSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Invalid phone number"),
  address: z.string().min(1, "Address is required"),
  linkedin: z.string().url("Invalid URL").optional().or(z.literal("")),
  summary: z.string().min(10, "Summary is too short").max(500, "Summary is too long"),
  experience: z.array(z.object({
    title: z.string().min(1, "Job title is required"),
    company: z.string().min(1, "Company name is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    description: z.string().min(1, "Description is required"),
  })),
  education: z.array(z.object({
    degree: z.string().min(1, "Degree is required"),
    school: z.string().min(1, "School name is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
  })),
  skills: z.array(z.object({
    name: z.string().min(1, "Skill cannot be empty"),
  })),
});

type ResumeFormValues = z.infer<typeof resumeSchema>;

export function ResumeBuilder() {
  const form = useForm<ResumeFormValues>({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      linkedin: "",
      summary: "",
      experience: [{ title: "", company: "", startDate: "", endDate: "", description: "" }],
      education: [{ degree: "", school: "", startDate: "", endDate: "" }],
      skills: [{ name: "" }],
    },
  });

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({ control: form.control, name: "experience" });
  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control: form.control, name: "education" });
  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({ control: form.control, name: "skills" });

  const formData = form.watch();

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <Card>
        <CardHeader>
          <CardTitle>Your Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => console.log(data))} className="space-y-8">
              {/* Personal Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                <FormField control={form.control} name="fullName" render={({ field }) => ( <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="email" render={({ field }) => ( <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="john.doe@email.com" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="phone" render={({ field }) => ( <FormItem><FormLabel>Phone</FormLabel><FormControl><Input placeholder="+1 234 567 890" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="address" render={({ field }) => ( <FormItem><FormLabel>Address</FormLabel><FormControl><Input placeholder="City, Country" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="linkedin" render={({ field }) => ( <FormItem><FormLabel>LinkedIn Profile</FormLabel><FormControl><Input placeholder="https://linkedin.com/in/johndoe" {...field} /></FormControl><FormMessage /></FormItem> )} />
              </div>

              <Separator />

              {/* Summary */}
              <div>
                <h3 className="text-lg font-semibold">Professional Summary</h3>
                <FormField control={form.control} name="summary" render={({ field }) => ( <FormItem><FormLabel>Summary</FormLabel><FormControl><Textarea placeholder="A brief summary of your professional background..." {...field} /></FormControl><FormMessage /></FormItem> )} />
              </div>

              <Separator />
              
              {/* Experience */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Work Experience</h3>
                {expFields.map((field, index) => (
                  <div key={field.id} className="space-y-4 p-4 border rounded-md mb-4 relative">
                    <FormField control={form.control} name={`experience.${index}.title`} render={({ field }) => ( <FormItem><FormLabel>Job Title</FormLabel><FormControl><Input placeholder="Software Engineer" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name={`experience.${index}.company`} render={({ field }) => ( <FormItem><FormLabel>Company</FormLabel><FormControl><Input placeholder="Tech Solutions Inc." {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name={`experience.${index}.startDate`} render={({ field }) => ( <FormItem><FormLabel>Start Date</FormLabel><FormControl><Input placeholder="Jan 2020" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name={`experience.${index}.endDate`} render={({ field }) => ( <FormItem><FormLabel>End Date</FormLabel><FormControl><Input placeholder="Present" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    </div>
                    <FormField control={form.control} name={`experience.${index}.description`} render={({ field }) => ( <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Describe your responsibilities and achievements..." {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive" onClick={() => removeExp(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={() => appendExp({ title: "", company: "", startDate: "", endDate: "", description: "" })}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Experience
                </Button>
              </div>

              <Separator />

              {/* Education */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Education</h3>
                {eduFields.map((field, index) => (
                  <div key={field.id} className="space-y-4 p-4 border rounded-md mb-4 relative">
                    <FormField control={form.control} name={`education.${index}.degree`} render={({ field }) => ( <FormItem><FormLabel>Degree / Certificate</FormLabel><FormControl><Input placeholder="B.S. in Computer Science" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name={`education.${index}.school`} render={({ field }) => ( <FormItem><FormLabel>School / University</FormLabel><FormControl><Input placeholder="State University" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name={`education.${index}.startDate`} render={({ field }) => ( <FormItem><FormLabel>Start Date</FormLabel><FormControl><Input placeholder="Aug 2016" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name={`education.${index}.endDate`} render={({ field }) => ( <FormItem><FormLabel>End Date</FormLabel><FormControl><Input placeholder="May 2020" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    </div>
                    <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive" onClick={() => removeEdu(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={() => appendEdu({ degree: "", school: "", startDate: "", endDate: "" })}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Education
                </Button>
              </div>

              <Separator />

              {/* Skills */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Skills</h3>
                {skillFields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2 mb-2">
                    <FormField control={form.control} name={`skills.${index}.name`} render={({ field }) => ( <FormItem className="flex-grow"><FormControl><Input placeholder="e.g., React" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => removeSkill(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={() => appendSkill({ name: "" })}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Skill
                </Button>
              </div>

              <Button type="submit" className="w-full" size="lg">Generate & Download</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {/* Resume Preview */}
      <Card className="sticky top-24">
        <CardHeader>
          <CardTitle>Live Preview</CardTitle>
        </CardHeader>
        <CardContent className="bg-white text-black p-8 rounded-b-xl aspect-[8.5/11]">
            <div className="space-y-6">
                {/* Header */}
                <div className="text-center border-b pb-4">
                    {formData.fullName && <h1 className="text-3xl font-bold tracking-tight">{formData.fullName}</h1>}
                    <div className="flex justify-center items-center gap-x-4 gap-y-1 text-xs text-gray-600 mt-2 flex-wrap">
                        {formData.email && <div className="flex items-center gap-1"><Mail className="h-3 w-3" /> {formData.email}</div>}
                        {formData.phone && <div className="flex items-center gap-1"><Phone className="h-3 w-3" /> {formData.phone}</div>}
                        {formData.address && <div className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {formData.address}</div>}
                        {formData.linkedin && <div className="flex items-center gap-1"><Linkedin className="h-3 w-3" /> {formData.linkedin.replace('https://', '')}</div>}
                    </div>
                </div>

                {/* Summary */}
                {formData.summary && (
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-widest border-b mb-2 pb-1">Summary</h2>
                        <p className="text-xs leading-relaxed">{formData.summary}</p>
                    </div>
                )}

                {/* Experience */}
                {formData.experience && formData.experience[0]?.title && (
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-widest border-b mb-2 pb-1">Work Experience</h2>
                        <div className="space-y-3">
                            {formData.experience.map((exp, index) => exp.title && (
                                <div key={index}>
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="text-sm font-semibold">{exp.title}</h3>
                                        <p className="text-xs text-gray-500">{exp.startDate} - {exp.endDate}</p>
                                    </div>
                                    <p className="text-xs font-medium italic">{exp.company}</p>
                                    <p className="text-xs mt-1 leading-relaxed">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Education */}
                {formData.education && formData.education[0]?.degree && (
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-widest border-b mb-2 pb-1">Education</h2>
                        <div className="space-y-3">
                             {formData.education.map((edu, index) => edu.degree && (
                                <div key={index}>
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="text-sm font-semibold">{edu.degree}</h3>
                                        <p className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</p>
                                    </div>
                                    <p className="text-xs font-medium italic">{edu.school}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Skills */}
                {formData.skills && formData.skills.length > 0 && formData.skills[0]?.name && (
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-widest border-b mb-2 pb-1">Skills</h2>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {formData.skills.map((skill, index) => skill.name && (
                                <span key={index} className="bg-gray-200 text-gray-800 text-xs font-medium px-2 py-1 rounded-full">{skill.name}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
