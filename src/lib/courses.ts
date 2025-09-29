
import type { LucideIcon } from 'lucide-react';
import { Stethoscope, FileText, Banknote, FlaskConical, Handshake, BadgePercent, LayoutTemplate, Box } from 'lucide-react';

export type Course = {
  id: string;
  title: string;
  description: string;
  Icon: LucideIcon;
  category: 'Healthcare' | 'Finance & Banking' | 'Media & Tech';
  trainerInfo: string;
  fees: number;
  certification: 'RTMNU Certified' | 'AAPC Certified';
  details: {
    credits: string;
    duration: string;
    eligibility: string;
    objectives: string[];
    outcomes: string[];
    addOns: string[];
  }
};

export const courses: Course[] = [
  {
    id: 'c1',
    title: 'Medical Coding with AI',
    description: 'Translate medical records into standardized codes for healthcare billing and insurance.',
    Icon: Stethoscope,
    category: 'Healthcare',
    trainerInfo: 'Our trainers are industry-certified professionals with over 10 years of experience in healthcare information management and revenue cycle optimization. They bring extensive real-world knowledge from working with leading hospitals and insurance companies.',
    fees: 2000,
    certification: 'AAPC Certified',
    details: {
        credits: "2 Points",
        duration: "45 Hours (Online)",
        eligibility: "Diploma, Undergraduate and Graduate (Life Science, Pharmacy and Medical)",
        objectives: [
            "To introduce students to the fundamentals of medical coding systems (ICD, CPT, HCPCS).",
            "To develop skills in translating medical records into standardized codes.",
            "To prepare students for roles in healthcare billing and insurance processes.",
            "To ensure understanding of compliance with healthcare regulations.",
            "To equip students with career-oriented knowledge in the healthcare sector."
        ],
        outcomes: [
            "Understand and apply ICD, CPT, and HCPCS codes.",
            "Accurately translate medical records into codes for billing.",
            "Comprehend compliance requirements in healthcare documentation.",
            "Explore entry-level roles in hospitals, insurance firms, and medical billing companies."
        ],
        addOns: [
            "Scholarship Consulting Services.",
            "Campus To Corporate Program."
        ]
    }
  },
  {
    id: 'c2',
    title: 'Medical Billing',
    description: 'Learn the full medical billing cycle, from claims submission to denial management.',
    Icon: FileText,
    category: 'Healthcare',
    trainerInfo: 'Led by seasoned medical billing experts with a deep understanding of the healthcare revenue cycle. Our trainers have a proven track record of improving billing efficiency and reducing claim denials for major healthcare providers.',
    fees: 2000,
    certification: 'RTMNU Certified',
    details: {
        credits: "2 Points",
        duration: "45 Hours (Online)",
        eligibility: "12th and Above any Diploma/Degree",
        objectives: [
            "To provide students with knowledge of the medical billing process and cycle.",
            "To train students in insurance claim preparation, submission, and follow-up.",
            "To familiarize students with denial management, compliance, and regulations.",
            "To bridge skills in medical coding and billing integration.",
            "To prepare students for career opportunities in healthcare revenue cycle management (RCM)."
        ],
        outcomes: [
            "Understand the entire medical billing cycle from registration to payment posting.",
            "Accurately prepare and submit claims with proper coding.",
            "Handle claim denials, rejections, and AR follow-ups effectively.",
            "Maintain compliance with legal and ethical billing practices.",
            "Explore career opportunities in hospitals, insurance companies, and RCM firms."
        ],
        addOns: [
            "Scholarship Consulting Services.",
            "Campus To Corporate Program."
        ]
    }
  },
  {
    id: 'c3',
    title: 'Account Receivable',
    description: 'Master the Accounts Receivable (AR) process in medical billing and revenue cycle management.',
    Icon: Banknote,
    category: 'Healthcare',
    trainerInfo: 'Our instructors are AR management specialists with extensive experience in optimizing revenue cycles for healthcare organizations. They bring practical insights on denial management, appeals, and improving cash flow.',
    fees: 2000,
    certification: 'RTMNU Certified',
    details: {
        credits: "2 Points",
        duration: "45 Hours (Online)",
        eligibility: "12th and Above any Diploma/Degree",
        objectives: [
            "To introduce students to the Accounts Receivable (AR) process in medical coding and billing.",
            "To train students in claims follow-up, denial management, and payment posting.",
            "To provide knowledge of insurance processes, reimbursement cycles, and compliance.",
            "To develop practical skills for reducing claim denials and improving cash flow.",
            "To prepare students for career opportunities in Revenue Cycle Management (RCM) and healthcare outsourcing firms."
        ],
        outcomes: [
            "Understand the AR process in medical coding and billing.",
            "Perform insurance follow-ups, denial handling, and appeals.",
            "Post payments accurately and manage AR aging reports.",
            "Ensure compliance with HIPAA and healthcare regulations.",
            "Explore career opportunities as AR executives, RCM analysts, or billing specialists in hospitals and healthcare BPOs."
        ],
        addOns: [
            "Scholarship Consulting Services.",
            "Campus To Corporate Program."
        ]
    }
  },
  {
    id: 'c4',
    title: 'Clinical Research & Pharmacovigilance',
    description: 'Gain expertise in clinical trial processes, drug safety monitoring, and regulatory compliance.',
    Icon: FlaskConical,
    category: 'Healthcare',
    trainerInfo: 'This program is taught by experienced clinical research and pharmacovigilance professionals who have managed global clinical trials and implemented drug safety programs for leading pharmaceutical companies.',
    fees: 2000,
    certification: 'RTMNU Certified',
    details: {
        credits: "2 Points",
        duration: "60 Hours (Online)",
        eligibility: "Diploma, Undergraduate and Graduate (Life Science, Pharmacy and Medical)",
        objectives: [
            "To introduce students to clinical research processes, study designs, and protocols.",
            "To develop knowledge of drug safety monitoring and pharmacovigilance principles.",
            "To train students in regulatory compliance and ethical standards (ICH-GCP, FDA, CDSCO).",
            "To provide practical understanding of adverse event reporting and risk management.",
            "To prepare students for career opportunities in clinical research, pharma, and healthcare industries."
        ],
        outcomes: [
            "Understand clinical trial processes and phases.",
            "Conduct adverse event monitoring and pharmacovigilance activities.",
            "Ensure regulatory compliance and ethical practices in research.",
            "Use basic clinical data management tools.",
            "Pursue careers in clinical research organizations (CROs), pharmaceutical companies, and healthcare monitoring agencies."
        ],
        addOns: [
            "Scholarship Consulting Services.",
            "Campus To Corporate Program."
        ]
    }
  },
  {
    id: 'c5',
    title: 'Debt Recovery Agent (DRA)',
    description: 'Develop skills in ethical debt collection, negotiation, and communication. This course also opens up business opportunities like starting your own collection agency or becoming a freelance debt recovery consultant for financial institutions.',
    Icon: Handshake,
    category: 'Finance & Banking',
    trainerInfo: 'Our trainers are certified Debt Recovery Agents with years of experience in the banking and financial services industry. They specialize in ethical negotiation tactics and legal compliance in the collections process.',
    fees: 2000,
    certification: 'RTMNU Certified',
    details: {
        credits: "2 Points",
        duration: "30 Hours (Online)",
        eligibility: "12th and Above Any Diploma/Degree pursuing or passout",
        objectives: [
            "To introduce students to the role and responsibilities of a Debt Recovery Agent.",
            "To develop skills in debt collection, negotiation, and communication.",
            "To familiarize students with legal and regulatory guidelines in debt recovery.",
            "To train students in documentation, reporting, and ethical practices.",
            "To prepare students for career opportunities in banks, NBFCs, and financial services."
        ],
        outcomes: [
            "Understand the role and responsibilities of a Debt Recovery Agent.",
            "Perform effective debt collection and negotiation while maintaining ethics.",
            "Comply with legal and regulatory requirements in debt recovery.",
            "Maintain accurate documentation and reports of recovery activities.",
            "Explore career opportunities in banks, NBFCs, and financial institutions."
        ],
        addOns: [
            "Scholarship Consulting Services.",
            "Campus To Corporate Program."
        ]
    }
  },
  {
    id: 'c6',
    title: 'Certified Credit Professional (CCP)',
    description: 'Learn credit analysis, risk assessment, and lending practices. This opens up business opportunities like becoming a credit advisor for businesses or starting a financial consultancy.',
    Icon: BadgePercent,
    category: 'Finance & Banking',
    trainerInfo: 'This course is led by veteran banking professionals and Certified Credit Professionals who have managed large credit portfolios. They bring deep expertise in credit risk analysis, lending policies, and financial modeling.',
    fees: 2000,
    certification: 'RTMNU Certified',
    details: {
        credits: "2 Points",
        duration: "45 Hours (Online)",
        eligibility: "12th and Above Any Diploma/Degree pursuing or passout",
        objectives: [
            "To provide students with knowledge of credit management and lending practices.",
            "To develop skills in credit analysis, risk assessment, and financial decision-making.",
            "To train students in legal, regulatory, and ethical frameworks governing credit.",
            "To prepare students for career opportunities in banking, NBFCs, and financial services.",
            "To equip students with practical skills for portfolio management and collections."
        ],
        outcomes: [
            "Conduct credit analysis and risk assessment effectively.",
            "Apply credit policies and legal regulations in lending decisions.",
            "Handle collections and debt recovery processes professionally.",
            "Prepare accurate credit reports and documentation.",
            "Pursue careers as credit analysts, risk officers, or lending professionals in banks, NBFCs, and financial services firms."
        ],
        addOns: [
            "Scholarship Consulting Services.",
            "Campus To Corporate Program."
        ]
    }
  },
  {
    id: 'c7',
    title: 'UX/UI Design',
    description: 'Master design thinking, wireframing, and prototyping to create intuitive digital experiences through hands-on project experience.',
    Icon: LayoutTemplate,
    category: 'Media & Tech',
    trainerInfo: 'Learn from senior UX/UI designers who have worked on popular consumer apps and enterprise software. Our instructors are experts in design thinking, user research, and creating beautiful, user-centric digital products.',
    fees: 2000,
    certification: 'RTMNU Certified',
    details: {
        credits: "2 Points",
        duration: "45 Hours (Online)",
        eligibility: "12th and Above Any Diploma/Degree pursuing or passout",
        objectives: [
            "To introduce students to the principles of User Experience (UX) and User Interface (UI) design.",
            "To develop skills in design thinking, wireframing, and prototyping.",
            "To train students in creating intuitive and visually appealing digital interfaces.",
            "To provide practical knowledge of industry-standard tools and best practices.",
            "To prepare students for career opportunities in web and app design, product design, and digital agencies."
        ],
        outcomes: [
            "Apply UX principles to improve user satisfaction.",
            "Design intuitive and visually appealing interfaces.",
            "Use industry tools like Figma, Adobe XD, and Sketch.",
            "Conduct user research and usability testing effectively.",
            "Build a portfolio demonstrating their UX/UI design skills through hands-on project experience."
        ],
        addOns: [
            "Scholarship Consulting Services Campus To Corporate Program."
        ]
    }
  },
  {
    id: 'c8',
    title: '3D Animation',
    description: 'Learn 3D modeling, texturing, animation, and rendering for careers in gaming, VFX, and multimedia.',
    Icon: Box,
    category: 'Media & Tech',
    trainerInfo: 'Our trainers are professional 3D artists and animators from the gaming and visual effects industries. They bring production experience from major studios and are masters of tools like Blender, Maya, and ZBrush.',
    fees: 2000,
    certification: 'RTMNU Certified',
    details: {
        credits: "2 Points",
        duration: "60 Hours (Online)",
        eligibility: "12th and Above Any Diploma/Degree pursuing or passout",
        objectives: [
            "To introduce students to the principles of 3D animation and digital storytelling.",
            "To develop skills in modelling, texturing, lighting, and rendering.",
            "To train students in animation techniques and visual effects.",
            "To provide practical knowledge of industry-standard 3D software tools.",
            "To prepare students for career opportunities in animation, gaming, VFX, and multimedia industries."
        ],
        outcomes: [
            "Create 3D models, textures, and animated sequences.",
            "Apply animation principles and rigging techniques.",
            "Use industry-standard 3D software tools effectively.",
            "Produce a complete short animation project.",
            "Explore career opportunities in animation studios, VFX, gaming, and multimedia production."
        ],
        addOns: [
            "Scholarship Consulting Services.",
            "Campus To Corporate Program."
        ]
    }
  },
];

    
    

    
