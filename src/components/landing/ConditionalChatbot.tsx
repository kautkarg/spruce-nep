"use client";

import { usePathname } from 'next/navigation';
import { Chatbot } from './Chatbot';

export function ConditionalChatbot() {
    const pathname = usePathname();

    // Do not render the chatbot on the resume builder page
    if (pathname === '/resume-builder') {
        return null;
    }

    return <Chatbot />;
}
