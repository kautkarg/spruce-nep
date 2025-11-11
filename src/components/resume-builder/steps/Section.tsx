
"use client";

import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';
import React from 'react';

export const Section = ({ title, icon: Icon, children, isComplete }: { title: string, icon: React.ElementType, children: React.ReactNode, isComplete?: boolean }) => (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-bold flex items-center gap-3 text-gray-800">
          <div className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-colors", isComplete ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500")}>
            {isComplete ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
          </div>
          {title}
        </h3>
      </div>
      <div>{children}</div>
    </div>
  );
