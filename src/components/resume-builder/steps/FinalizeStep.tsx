
"use client";

import { useFormContext } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ResumeFormValues } from '../ResumeBuilder';
import { Section } from './Section';
import { FileText, PlusCircle, Trash2 } from 'lucide-react';
import { useFieldArray } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { MonthYearPicker } from '../MonthYearPicker';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';


const templates = {
    'ats': [
        { id: 'ats-classic', name: 'Classic' },
        { id: 'ats-traditional', name: 'Traditional' },
        { id: 'ats-compact', name: 'Compact' },
    ],
    'modern': [
        { id: 'modern-stylish', name: 'Stylish' },
        { id: 'modern-creative', name: 'Creative' },
        { id: 'modern-minimalist', name: 'Minimalist' },
    ]
}


export default function FinalizeStep() {
    const { control, watch } = useFormContext<ResumeFormValues>();
    const isMobile = useIsMobile();

    const awardsArray = useFieldArray({ control, name: "awards" });
    const volunteeringArray = useFieldArray({ control, name: "volunteering" });
    const certificationsArray = useFieldArray({ control, name: "certifications" });

    const selectedTemplate = watch('template');

    return (
        <div className="space-y-6">
            {!isMobile && (
              <Section title="Template" icon={FileText}>
                  <FormField
                      control={control}
                      name="template"
                      render={({ field }) => (
                          <FormItem>
                              <Tabs defaultValue={field.value.startsWith('ats') ? 'ats' : 'modern'}>
                                  <TabsList className="grid w-full grid-cols-2">
                                      <TabsTrigger value="ats">ATS-Friendly</TabsTrigger>
                                      <TabsTrigger value="modern">Modern</TabsTrigger>
                                  </TabsList>
                                  <TabsContent value="ats" className="pt-4">
                                      <div className="grid grid-cols-2 gap-2">
                                          {templates.ats.map(t => (
                                              <Button key={t.id} variant={selectedTemplate === t.id ? 'primary' : 'outline'} onClick={() => field.onChange(t.id)}>
                                                  {t.name}
                                              </Button>
                                          ))}
                                      </div>
                                  </TabsContent>
                                  <TabsContent value="modern" className="pt-4">
                                      <div className="grid grid-cols-2 gap-2">
                                          {templates.modern.map(t => (
                                              <Button key={t.id} variant={selectedTemplate === t.id ? 'primary' : 'outline'} onClick={() => field.onChange(t.id)}>
                                                  {t.name}
                                              </Button>
                                          ))}
                                      </div>
                                  </TabsContent>
                              </Tabs>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
              </Section>
            )}

            <Section title="Awards & Honors" icon={FileText}>
                {awardsArray.fields.map((field, index) => (
                    <div key={field.id} className="space-y-3 p-4 border rounded-md mb-4 relative bg-muted/20">
                         <Button type="button" variant="ghost" size="icon" onClick={() => awardsArray.remove(index)} className="absolute top-2 right-2 h-7 w-7"><Trash2 className="h-4 w-4" /></Button>
                        <FormField control={control} name={`awards.${index}.name`} render={({ field }) => <FormItem><FormLabel>Award Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                        <FormField control={control} name={`awards.${index}.date`} render={({ field }) => <FormItem><FormLabel>Date</FormLabel><FormControl><MonthYearPicker field={field} /></FormControl><FormMessage /></FormItem>} />
                        <FormField control={control} name={`awards.${index}.description`} render={({ field }) => <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>} />
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={() => awardsArray.append({ name: "", date: null, description: "" })} className="w-full"><PlusCircle className="mr-2 h-4 w-4" />Add Award</Button>
            </Section>

            <Section title="Volunteer & Leadership" icon={FileText}>
                {volunteeringArray.fields.map((field, index) => (
                    <div key={field.id} className="space-y-3 p-4 border rounded-md mb-4 relative bg-muted/20">
                         <Button type="button" variant="ghost" size="icon" onClick={() => volunteeringArray.remove(index)} className="absolute top-2 right-2 h-7 w-7"><Trash2 className="h-4 w-4" /></Button>
                        <FormField control={control} name={`volunteering.${index}.role`} render={({ field }) => <FormItem><FormLabel>Role</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                        <FormField control={control} name={`volunteering.${index}.organization`} render={({ field }) => <FormItem><FormLabel>Organization</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                        <FormField control={control} name={`volunteering.${index}.dates`} render={({ field }) => <FormItem><FormLabel>Date</FormLabel><FormControl><MonthYearPicker field={field} /></FormControl><FormMessage /></FormItem>} />
                        <FormField control={control} name={`volunteering.${index}.description`} render={({ field }) => <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>} />
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={() => volunteeringArray.append({ role: "", organization: "", dates: null, description: "" })} className="w-full"><PlusCircle className="mr-2 h-4 w-4" />Add Activity</Button>
            </Section>

            <Section title="Certifications" icon={FileText}>
                {certificationsArray.fields.map((field, index) => (
                    <div key={field.id} className="space-y-3 p-4 border rounded-md mb-4 relative bg-muted/20">
                         <Button type="button" variant="ghost" size="icon" onClick={() => certificationsArray.remove(index)} className="absolute top-2 right-2 h-7 w-7"><Trash2 className="h-4 w-4" /></Button>
                        <FormField control={control} name={`certifications.${index}.name`} render={({ field }) => <FormItem><FormLabel>Certification Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                        <FormField control={control} name={`certifications.${index}.issuer`} render={({ field }) => <FormItem><FormLabel>Issuing Body</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                        <FormField control={control} name={`certifications.${index}.date`} render={({ field }) => <FormItem><FormLabel>Date</FormLabel><FormControl><MonthYearPicker field={field} /></FormControl><FormMessage /></FormItem>} />
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={() => certificationsArray.append({ name: "", issuer: "", date: null })} className="w-full"><PlusCircle className="mr-2 h-4 w-4" />Add Certification</Button>
            </Section>

            {isMobile && (
              <Section title="Template" icon={FileText}>
                  <FormField
                      control={control}
                      name="template"
                      render={({ field }) => (
                          <FormItem>
                              <Tabs defaultValue={field.value.startsWith('ats') ? 'ats' : 'modern'}>
                                  <TabsList className="grid w-full grid-cols-2">
                                      <TabsTrigger value="ats">ATS-Friendly</TabsTrigger>
                                      <TabsTrigger value="modern">Modern</TabsTrigger>
                                  </TabsList>
                                  <TabsContent value="ats" className="pt-4">
                                      <div className="grid grid-cols-2 gap-2">
                                          {templates.ats.map(t => (
                                              <Button key={t.id} variant={selectedTemplate === t.id ? 'primary' : 'outline'} onClick={() => field.onChange(t.id)}>
                                                  {t.name}
                                              </Button>
                                          ))}
                                      </div>
                                  </TabsContent>
                                  <TabsContent value="modern" className="pt-4">
                                      <div className="grid grid-cols-2 gap-2">
                                          {templates.modern.map(t => (
                                              <Button key={t.id} variant={selectedTemplate === t.id ? 'primary' : 'outline'} onClick={() => field.onChange(t.id)}>
                                                  {t.name}
                                              </Button>
                                          ))}
                                      </div>
                                  </TabsContent>
                              </Tabs>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
              </Section>
            )}
        </div>
    );
}
