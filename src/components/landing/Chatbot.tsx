
"use client";

import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, ArrowLeft, RefreshCw, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { Form, FormControl, FormField, FormItem } from '../ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';

const faqData = {
  initial: [
    [
        {
          id: 'valuable',
          question: "Is my degree still valuable with NEP 2020?",
        },
        {
          id: 'official_credits',
          question: "Are these credits official & will my university accept them?",
        },
        {
          id: 'job_help',
          question: "How does the 'Campus to Corporate' program help me get a job?",
        },
        {
            id: 'different',
            question: "My friend did an online course and it didn't help. How is this different?",
        }
    ],
    [
        {
            id: 'eligibility',
            question: "What are the eligibility criteria for these courses?",
        },
        {
            id: 'duration',
            question: "How long does it take to complete a course?",
        },
        {
            id: 'instructors',
            question: "Who are the instructors for these programs?",
        },
        {
            id: 'placements',
            question: "What kind of placement support do you offer?",
        }
    ]
  ],
  responses: {
    valuable: {
      answer: "Yes, your degree needs to be supplemented. The National EducationPolicy (NEP 2020) now requires students to earn credits from skill-based courses. A traditional degree is no longer enough. Our programs provide these mandatory skills and official university credits to make your degree fully compliant and much more valuable to employers.",
      follow_ups: [
          {
            id: 'job_help',
            question: "How do you help me get a job?",
          },
          {
            id: 'different',
            question: "How is this different from other online courses?",
          }
      ]
    },
    official_credits: {
      answer: "Absolutely. All our programs are approved by RTMNU, a UGC-recognized public state university. The credits you earn are academically valid and designed to be part of your degree under the NEP framework. They are not just 'extra' courses; they are a formal part of your education.",
       follow_ups: [
          {
            id: 'valuable',
            question: "Why is my degree not enough anymore?",
          },
          {
            id: 'different',
            question: "Is this certificate better than others?",
          }
      ]
    },
    job_help: {
      answer: "We deliver 'Campus to corporate' program to all our students. It's a complete career launchpad. We don't just teach you; we prepare you for the real world with interview training, resume building, and soft skill workshops. Then, we connect you with companies for internships and job placements, giving you a direct path from your classroom to a corporate career.",
       follow_ups: [
           {
            id: 'official_credits',
            question: "Are the credits official?",
           },
           {
            id: 'valuable',
            question: "Why do I need extra credits?",
           }
       ]
    },
    different: {
      answer: "This is not just an online course; it's a university-approved academic program. The certificate you receive is from RTMNU, a public state university, and carries official academic weight. This is a real credential that you can add to your resume and that employers and universities will recognize.",
       follow_ups: [
            {
            id: 'job_help',
            question: "Will this actually help me get a job?",
            },
            {
            id: 'official_credits',
            question: "So the credits are officially recognized?",
            }
        ]
    },
    eligibility: {
      answer: "Eligibility varies by course, but most are open to 12th pass students, diploma holders, and undergraduates from any stream. Some specialized courses may have specific requirements, which you can find on the course details page.",
      follow_ups: [
        { id: 'job_help', question: "How do you help with jobs?" },
        { id: 'duration', question: "How long are the courses?" },
      ],
    },
    duration: {
      answer: "Our courses are designed to be flexible and range from 30 to 60 hours of learning. You can typically complete a course within a few weeks, depending on your pace.",
      follow_ups: [
        { id: 'official_credits', question: "Are the credits official?" },
        { id: 'instructors', question: "Who teaches the courses?" },
      ],
    },
    instructors: {
      answer: "Our instructors are industry professionals with years of real-world experience in their fields. They bring practical knowledge and insights that go beyond textbooks.",
      follow_ups: [
        { id: 'placements', question: "What about placements?" },
        { id: 'different', question: "How is this different from online courses?" },
      ],
    },
    placements: {
      answer: "Our 'Campus to Corporate' program offers comprehensive placement support, including resume building, interview preparation, and connecting you with our network of hiring partners for internships and job opportunities.",
      follow_ups: [
        { id: 'job_help', question: "How does it help me get a job?" },
        { id: 'valuable', question: "Why is my degree not enough?" },
      ],
    },
  }
};

const FormSchema = z.object({
  message: z.string().min(1, { message: 'Message cannot be empty.' }),
});

type Message = {
  role: 'user' | 'bot';
  content: string;
  time: Date;
};

type ConversationState = 'idle' | 'awaiting_name' | 'awaiting_phone' | 'confirming_query' | 'collecting_query';

type Question = {
    id: string;
    question: string;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [questionPage, setQuestionPage] = useState(0);
  const [displayedQuestions, setDisplayedQuestions] = useState<Question[]>(faqData.initial[0]);
  const [conversationState, setConversationState] = useState<ConversationState>('idle');
  const [userData, setUserData] = useState({ name: '', phone: '', query: '' });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { message: '' },
  });

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
        setTimeout(() => {
             if (scrollAreaRef.current) {
                const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
                if (viewport) {
                    viewport.scrollTop = viewport.scrollHeight;
                }
            }
        }, 100);
    }
  }
  
  const addMessage = (role: 'user' | 'bot', content: string) => {
    setMessages(prev => [...prev, { role, content, time: new Date() }]);
  }

  const handleInitialOpen = () => {
     addMessage('bot', "Hello! I'm here to help. Ask me a question or choose from the options below.");
     setQuestionPage(0);
     setDisplayedQuestions(faqData.initial[0]);
     scrollToBottom();
  }

  const toggleChat = () => {
    const nextIsOpen = !isOpen;
    setIsOpen(nextIsOpen);
    if (nextIsOpen && messages.length === 0) {
      handleInitialOpen();
    }
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleQuestionSelect = (questionId: string, questionText: string) => {
    addMessage('user', questionText);
    
    const response = faqData.responses[questionId as keyof typeof faqData.responses];
    
    if (response) {
        addMessage('bot', response.answer);
        if(response.follow_ups) {
            setDisplayedQuestions(response.follow_ups);
        } else {
            setDisplayedQuestions([]);
        }
    } else {
        addMessage('bot', "Thank you for reaching out. I can connect you with a student counselor to discuss it.");
        setDisplayedQuestions([]);
    }

    setConversationState('collecting_query');
  };
  
  const handleFormSubmit = (data: z.infer<typeof FormSchema>) => {
    const userMessage = data.message;
    addMessage('user', userMessage);

    if (conversationState === 'awaiting_name') {
      setUserData(prev => ({ ...prev, name: userMessage }));
      addMessage('bot', `Thank you, ${userMessage}, please share your contact number and our team will reach out to you as soon as possible.`);
      setConversationState('awaiting_phone');
    } else if (conversationState === 'awaiting_phone') {
      const finalUserData = { ...userData, phone: userMessage };
      setUserData(finalUserData);
      console.log('Lead collected:', finalUserData);
      addMessage('bot', 'Thank you! A student counselor will get in touch with you shortly. Do you have any other questions I can help with?');
      setConversationState('confirming_query');
    } else if (conversationState === 'confirming_query') {
      const lowerCaseMessage = userMessage.toLowerCase();
      if (lowerCaseMessage.includes('no') || lowerCaseMessage.includes("that's all")) {
        addMessage('bot', "Thank you for your time! We're excited to help you on your career journey. For any further assistance, you can reach us at +91-XXXXXXXXXX or visit our website at www.sprucelifeskills.in. Have a wonderful day!");
        setConversationState('idle');
        setQuestionPage(0);
        setDisplayedQuestions(faqData.initial[0]);
      } else {
        setUserData(prev => ({...prev, query: userMessage}));
        addMessage('bot', 'Thank you for reaching out. I can have a counselor call you for discussion. What is your name?');
        setConversationState('awaiting_name');
        setDisplayedQuestions([]);
      }
    } else {
        setUserData(prev => ({...prev, query: userMessage}));
        addMessage('bot', 'Thank you for reaching out. I can have a counselor call you for discussion. What is your name?');
        setConversationState('awaiting_name');
        setDisplayedQuestions([]);
    }
    
    form.reset();
  };

  const handleBack = () => {
    setMessages(prev => prev.slice(0, -2)); // Remove last user and bot message
    if (conversationState === 'awaiting_phone') {
        setConversationState('awaiting_name');
        setUserData(prev => ({...prev, name: ''}));
        addMessage('bot', 'Thank you for reaching out. I can have a counselor call you for discussion. What is your name?');
    } else if (conversationState === 'confirming_query') {
        setConversationState('awaiting_phone');
        setUserData(prev => ({...prev, phone: ''}));
        addMessage('bot', `Thank you, ${userData.name}, please share your contact number and our team will reach out to you as soon as possible.`);
    } else if (conversationState === 'awaiting_name' || conversationState === 'collecting_query') {
        setConversationState('idle');
        setUserData({ name: '', phone: '', query: '' });
        setQuestionPage(0);
        setDisplayedQuestions(faqData.initial[0]);
        addMessage('bot', "Hello! I'm here to help. Ask me a question or choose from the options below.");
    }
  }

  const changeQuestions = () => {
    const newPage = (questionPage + 1) % faqData.initial.length;
    setQuestionPage(newPage);
    setDisplayedQuestions(faqData.initial[newPage]);
  }

  if (!isClient) {
    return null;
  }

  return (
    <>
      {!isOpen && (
        <div className="fixed bottom-20 right-6 z-40 md:bottom-6">
          <Button onClick={toggleChat} className="rounded-full w-16 h-16 shadow-lg bg-accent text-accent-foreground hover:bg-accent/90 p-0" aria-label="Toggle Chat">
              <MessageSquare className="w-8 h-8" />
          </Button>
        </div>
      )}

      <div 
        className={cn(
            "fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] max-w-md origin-bottom-right transition-all duration-300 ease-in-out md:bottom-28",
            isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0",
            "md:w-[400px] h-[572px]"
        )}
    >
        <Card className="h-full flex flex-col rounded-xl shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between border-b p-3">
            <CardTitle className="text-body font-semibold flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-accent" />
              </div>
              Career Buddy
            </CardTitle>
             <Button variant="ghost" size="icon" onClick={toggleChat} className="h-8 w-8">
              <X className="h-4 w-4" />
              <span className="sr-only">Close chat</span>
            </Button>
          </CardHeader>
          <CardContent className="flex-grow p-0 overflow-hidden">
             <ScrollArea className="h-full" ref={scrollAreaRef}>
                <div className="p-4 space-y-4">
                {messages.map((message, index) => (
                    <div
                      key={index}
                      className={cn(
                          "flex flex-col gap-1",
                          message.role === 'user' ? 'items-end' : 'items-start'
                      )}
                    >
                      <div
                          className={cn(
                          "p-3 rounded-lg max-w-[85%]",
                          message.role === 'user'
                              ? 'bg-primary text-primary-foreground rounded-br-none'
                              : 'bg-secondary rounded-bl-none'
                          )}
                      >
                          <p className="text-sm break-words">{message.content}</p>
                      </div>
                      <div className={cn("text-xs text-muted-foreground px-1", message.role === 'user' ? 'text-right' : 'text-left')}>
                          {message.role === 'user' ? 'You' : 'Bot'} • {format(message.time, 'h:mm a')}
                      </div>
                    </div>
                ))}
                </div>
            </ScrollArea>
          </CardContent>
          <div className="p-3 border-t bg-background">
            {displayedQuestions.length > 0 && (
                <div className="mb-2 pb-2">
                    <div className="md:grid md:grid-cols-2 md:gap-2">
                        <div className="flex flex-nowrap overflow-x-auto md:overflow-visible md:flex-wrap gap-2 md:contents [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            {displayedQuestions.slice(0, 4).map((q) => (
                                <Button key={q.id} variant="outline" className='h-auto whitespace-normal p-2 flex-shrink-0 md:flex-shrink' onClick={() => handleQuestionSelect(q.id, q.question)}>
                                    <p className='text-meta font-semibold text-left normal-case'>{q.question}</p>
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            <div className="flex items-center gap-2">
                {['awaiting_name', 'awaiting_phone', 'confirming_query', 'collecting_query'].includes(conversationState) && (
                    <Button type="button" variant="ghost" size="icon" onClick={handleBack} className="h-10 w-10 flex-shrink-0">
                        <ArrowLeft className="h-5 w-5" />
                        <span className="sr-only">Go back</span>
                    </Button>
                )}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex-grow flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem className="flex-grow">
                          <FormControl>
                            <Input placeholder="Type your message..." {...field} className="h-10 text-sm" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button type="submit" size="icon" className="h-10 w-10 flex-shrink-0 bg-accent text-accent-foreground">
                      <Send className="h-5 w-5" />
                      <span className="sr-only">Send</span>
                    </Button>
                  </form>
                </Form>
                 {faqData.initial.length > 1 && displayedQuestions.length > 0 && (
                    <Button type="button" variant="ghost" size="icon" onClick={changeQuestions} className="h-10 w-10 flex-shrink-0 hidden md:inline-flex">
                        <RefreshCw className="h-5 w-5" />
                        <span className="sr-only">More questions</span>
                    </Button>
                )}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

    
    
