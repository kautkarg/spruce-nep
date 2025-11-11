
"use client";
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { FieldPath, FieldValues } from 'react-hook-form';
import { ResumeFormValues } from './ResumeBuilder';

export interface Step {
  name: string;
  fields?: FieldPath<ResumeFormValues>[];
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  setCurrentStep: (index: number) => void;
}

export function Stepper({ steps, currentStep, setCurrentStep }: StepperProps) {
  const { formState } = useFormContext<ResumeFormValues>();

  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {steps.map((step, index) => {
          const isCompleted = currentStep > index;
          const isCurrent = currentStep === index;
          
          // Check if all fields in the step are valid
          const stepFields = step.fields || [];
          const hasErrorInStep = stepFields.some(field => formState.errors[field as keyof typeof formState.errors]);
          const stepStatus = isCompleted ? 'complete' : isCurrent ? 'current' : 'upcoming';

          return (
            <li key={step.name} className="md:flex-1">
              <div
                onClick={() => setCurrentStep(index)}
                className={cn(
                    'group flex flex-col border-l-4 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4 cursor-pointer',
                    stepStatus === 'current' && 'border-primary',
                    stepStatus === 'complete' && 'border-primary hover:border-primary',
                    stepStatus === 'upcoming' && 'border-gray-200 hover:border-gray-300'
                )}
                aria-current={isCurrent ? 'step' : undefined}
              >
                <span className={cn(
                    'text-sm font-medium transition-colors',
                     stepStatus === 'current' && 'text-primary',
                     stepStatus === 'complete' && 'text-primary',
                     stepStatus === 'upcoming' && 'text-gray-500 group-hover:text-gray-700'
                )}>
                  {`Step ${index + 1}`}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
