document.addEventListener('DOMContentLoaded', () => {
    const courses = [
      {
        id: 'c1',
        title: 'Medical Coding with AI',
        description: 'Translate medical records into standardized codes for healthcare billing and insurance.',
        Icon: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="course-icon"><path d="M8 2v4"/><path d="M16 2v4"/><rect x="3" y="10" width="18" height="12" rx="2"/><path d="m3 10-1.2-1.2a2 2 0 0 1 0-2.8l2-2a2 2 0 0 1 2.8 0L8 5h8l1.2-1.2a2 2 0 0 1 2.8 0l2 2a2 2 0 0 1 0 2.8L21 10"/><path d="M8 22h8"/><path d="M12 15h.01"/></svg>',
        category: 'Healthcare',
      },
      {
        id: 'c2',
        title: 'Medical Billing',
        description: 'Learn the full medical billing cycle, from claims submission to denial management.',
        Icon: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="course-icon"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>',
        category: 'Healthcare',
      },
      {
        id: 'c3',
        title: 'Account Receivable',
        description: 'Master the Accounts Receivable (AR) process in medical billing and revenue cycle management.',
        Icon: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="course-icon"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
        category: 'Healthcare',
      },
      {
        id: 'c4',
        title: 'Clinical Research & Pharmacovigilance',
        description: 'Gain expertise in clinical trial processes, drug safety monitoring, and regulatory compliance.',
        Icon: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="course-icon"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M12.5 2.5 18 8"/><path d="M8 4v2"/><path d="M12 4v2"/><path d="M16 4v2"/><path d="M10 12h4"/><path d="M12 10v4"/><path d="m15 15.5 2.5 2.5"/><path d="m8.5 15.5-2.5 2.5"/></svg>',
        category: 'Healthcare',
      },
      {
        id: 'c5',
        title: 'Debt Recovery Agent (DRA)',
        description: 'Develop skills in ethical debt collection, negotiation, and communication. This course also opens up business opportunities like starting your own collection agency or becoming a freelance debt recovery consultant for financial institutions.',
        Icon: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="course-icon"><path d="M14 13a1 1 0 1 0-2 0 1 1 0 0 0 2 0"/><path d="M10.5 9.5a1 1 0 1 0-2 0 1 1 0 0 0 2 0"/><path d="M17.5 9.5a1 1 0 1 0-2 0 1 1 0 0 0 2 0"/><path d="m21.5 13.5-2-2-4 4-2-2-4 4-2-2-1.5 1.5"/><path d="M14 2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-8.5"/></svg>',
        category: 'Finance & Banking',
      },
      {
        id: 'c6',
        title: 'Certified Credit Professional (CCP)',
        description: 'Learn credit analysis, risk assessment, and lending practices. This opens up business opportunities like becoming a credit advisor for businesses or starting a financial consultancy.',
        Icon: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="course-icon"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2"/><path d="m9 12 2 2 4-4"/><path d="M12 6V2"/><path d="M12 22v-4"/><path d="M20 12h4"/><path d="M2 12h4"/></svg>',
        category: 'Finance & Banking',
      },
      {
        id: 'c7',
        title: 'UX/UI Design',
        description: 'Master design thinking, wireframing, and prototyping to create intuitive digital experiences through hands-on project experience.',
        Icon: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="course-icon"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>',
        category: 'Media & Tech',
      },
      {
        id: 'c8',
        title: '3D Animation',
        description: 'Learn 3D modeling, texturing, animation, and rendering for careers in gaming, VFX, and multimedia.',
        Icon: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="course-icon"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
        category: 'Media & Tech',
      }
    ];

    const courseListContainer = document.querySelector('.course-list');
    const categoryButtons = document.querySelectorAll('.category-button');

    function renderCourses(category) {
        courseListContainer.innerHTML = '';
        const filteredCourses = courses.filter(course => course.category === category);
        
        filteredCourses.forEach(course => {
            const courseCard = `
                <div class="course-card">
                    <div class="course-card-content">
                        <div class="course-icon-container">
                            ${course.Icon}
                        </div>
                        <h3 class="course-title">${course.title}</h3>
                        <p class="course-description">${course.description}</p>
                        <button class="course-link">Dive into the Details</button>
                    </div>
                </div>
            `;
            courseListContainer.insertAdjacentHTML('beforeend', courseCard);
        });
    }

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            renderCourses(button.dataset.category);
        });
    });

    // Initial render
    renderCourses('Healthcare');
});
