
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
      <ol role="list" className="md:flex md:space-x-8 md:space-y-0 space-y-4">
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
                    'group flex flex-col border-l-4 md:border-l-0 md:border-t-4 py-2 pl-4 md:pt-4 md:pl-0 md:pb-0 border-gray-200 cursor-pointer transition-colors',
                    stepStatus === 'current' && 'border-primary',
                    stepStatus === 'complete' && 'border-primary hover:border-primary',
                    stepStatus === 'upcoming' && 'hover:border-gray-300'
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
