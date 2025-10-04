import React, { useReducer, useRef, useCallback } from "react";

// Lucide Icons (inlining for single-file stability)
const Download = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>);
const Trash = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>);
const Plus = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>);
const Minus = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" x2="19" y1="12" y2="12"/></svg>);
const AlertTriangle = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.87 18a2 2 0 0 0 1.76 3H20.37a2 2 0 0 0 1.76-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>);

// --- Default Data Structure and Initial State ---
const initialResumeData = {
    personal: {
        name: 'ELARA VANCE',
        title: 'Senior Product Manager & Technical Lead',
        email: 'elara.vance@innovate.co',
        phone: '(555) 987-6543',
        linkedin: 'linkedin.com/in/elaravance',
        github: 'github.com/elaradev'
    },
    summary: 'Seasoned and results-driven Product Leader with 8+ years of experience steering cross-functional teams to deliver high-impact SaaS solutions. Expertise in full product lifecycle management, technical architecture, and market strategy. Recognized for driving a $10M ARR increase by launching a key API integration platform.',
    skills: 'Product Strategy, Agile (Scrum/Kanban), Technical Architecture, SQL, Python, JIRA, Figma, Cloud (AWS/Azure), User Research, GTM Strategy',
    experience: [
        {
            id: 1,
            title: 'Senior Product Manager',
            company: 'NexusTech Solutions',
            location: 'Austin, TX',
            startDate: 'Jan 2021',
            endDate: 'Present',
            description: [
                'Managed product roadmap for a core data platform serving 500k+ users, leading to a 25% increase in weekly active usage.',
                'Collaborated with engineering to define technical specs, resulting in a 40% reduction in platform latency through optimization of database queries.',
                'Oversaw a team of 5 engineers and 2 designers, implementing OKR framework that improved team delivery predictability by 35%.'
            ]
        }
    ],
    projects: [
        {
            id: 1,
            title: 'AI-Powered Resume Grader',
            link: 'github.com/resumegrader',
            year: '2023',
            description: [
                'Developed a Python/TensorFlow model to score resumes against job descriptions, achieving 92% accuracy.',
                'Built a simple React frontend for data visualization and user interaction.'
            ]
        }
    ],
    education: [
        {
            id: 1,
            degree: 'M.B.A., Technology Management',
            institution: 'University of Texas at Austin',
            year: '2019',
            details: 'Dean\'s List | Thesis on AI Ethics in Business.'
        }
    ],
};

// --- Reducer for state management ---
const reducer = (state, action) => {
    switch (action.type) {
        case 'UPDATE_FIELD':
            // Handles updates for personal, summary, and skills (flat fields)
            return {
                ...state,
                [action.section]: action.field ? {
                    ...state[action.section],
                    [action.field]: action.value
                } : action.value // For top-level fields like 'skills' or 'summary'
            };
        
        case 'ADD_ITEM':
            // Adds a new item to a repeatable section (experience, education, projects)
            return {
                ...state,
                [action.section]: [
                    ...state[action.section],
                    { id: Date.now(), ...action.payload }
                ]
            };
        
        case 'UPDATE_ITEM':
            // Updates fields within an item (title, company, year, etc.)
            return {
                ...state,
                [action.section]: state[action.section].map(item =>
                    item.id === action.id ? { ...item, ...action.payload } : item
                )
            };
        
        case 'REMOVE_ITEM':
            return {
                ...state,
                [action.section]: state[action.section].filter(item => item.id !== action.id)
            };
        
        case 'UPDATE_BULLET_POINT':
            // Updates a specific achievement/bullet point
            return {
                ...state,
                [action.section]: state[action.section].map(item => {
                    if (item.id === action.id) {
                        const newDescription = [...item.description];
                        newDescription[action.index] = action.value;
                        return { ...item, description: newDescription };
                    }
                    return item;
                })
            };

        case 'ADD_BULLET_POINT':
            // Adds a new bullet point
            return {
                ...state,
                [action.section]: state[action.section].map(item => {
                    if (item.id === action.id) {
                        const newBullet = action.section === 'experience' 
                            ? 'New quantified achievement.' 
                            : 'New responsibility or detail.';
                        return { ...item, description: [...item.description, newBullet] };
                    }
                    return item;
                })
            };

        case 'REMOVE_BULLET_POINT':
            // Removes a bullet point
            return {
                ...state,
                [action.section]: state[action.section].map(item => {
                    if (item.id === action.id) {
                        return { ...item, description: item.description.filter((_, i) => i !== action.index) };
                    }
                    return item;
                })
            };
        default:
            return state;
    }
};


// --- Utility Components for the Resume Preview ---

const Header = ({ personal }) => (
    <div className="text-center pb-4 mb-4">
        <h1 className="text-4xl font-extrabold tracking-widest text-gray-800 uppercase">{personal.name}</h1>
        <p className="text-xl font-medium text-gray-600 mb-2">{personal.title}</p>
        <div className="flex justify-center flex-wrap gap-x-5 text-sm text-gray-600 font-mono">
            {personal.phone && <span>{personal.phone}</span>}
            {personal.email && <span>| {personal.email}</span>}
            {personal.linkedin && <span>| {personal.linkedin}</span>}
            {personal.github && <span>| {personal.github}</span>}
        </div>
    </div>
);

const Section = ({ title, children }) => (
    <div className="mb-4">
        <h2 className="text-lg font-bold border-b-2 border-gray-700 pb-1 mb-2 uppercase text-gray-800 tracking-wider">{title}</h2>
        {children}
    </div>
);

const DetailEntry = ({ item, isProject = false }) => (
    <div className="mb-3">
        <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-gray-800 leading-tight">{item.title}</h3>
                {item.company && <p className="text-sm font-medium text-gray-700 leading-tight">{item.company} | {item.location}</p>}
                {item.institution && <p className="text-sm font-medium text-gray-700 leading-tight">{item.institution}</p>}
                {isProject && item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline block truncate">{item.link}</a>}
            </div>
            <span className="text-sm text-gray-600 font-medium whitespace-nowrap ml-4">
                {item.year ? item.year : (item.startDate && item.endDate ? `${item.startDate} – ${item.endDate}` : '')}
            </span>
        </div>
        
        {item.details && <p className="text-xs italic text-gray-500 mt-0.5">{item.details}</p>}

        {item.description && item.description.length > 0 && (
            <ul className="list-disc ml-5 text-gray-700 text-sm mt-1 space-y-0.5">
                {item.description.map((point, index) => (
                    <li key={index} className="pl-1 leading-snug">{point}</li>
                ))}
            </ul>
        )}
    </div>
);

// --- Main Resume Preview Component ---

const ResumePreview = React.forwardRef(({ data }, ref) => {
    return (
        <div ref={ref} className="bg-white p-8 shadow-xl h-[297mm] w-[210mm] mx-auto text-inter print-area">
            <Header personal={data.personal} />

            {/* Summary */}
            {data.summary && (
                <Section title="Summary">
                    <p className="text-sm text-gray-700 leading-relaxed">{data.summary}</p>
                </Section>
            )}

            {/* Skills */}
            {data.skills && (
                <Section title="Technical Skills">
                    <p className="text-sm text-gray-700 leading-relaxed">{data.skills}</p>
                </Section>
            )}
            
            {/* Experience */}
            {data.experience.length > 0 && (
                <Section title="Professional Experience">
                    {data.experience.map(item => (
                        <DetailEntry key={item.id} item={item} />
                    ))}
                </Section>
            )}

            {/* Projects */}
            {data.projects.length > 0 && (
                <Section title="Projects">
                    {data.projects.map(item => (
                        <DetailEntry key={item.id} item={item} isProject={true} />
                    ))}
                </Section>
            )}

            {/* Education */}
            {data.education.length > 0 && (
                <Section title="Education">
                    {data.education.map(item => (
                        <DetailEntry key={item.id} item={item} />
                    ))}
                </Section>
            )}
        </div>
    );
});


// --- Input Form Components ---

const InputField = ({ label, value, onChange, type = 'text', fullWidth = false }) => (
    <div className={fullWidth ? "col-span-2" : "col-span-1"}>
        <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            className="w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-sm"
        />
    </div>
);

const TextAreaField = ({ label, value, onChange, rows = 3 }) => (
    <div className="col-span-2">
        <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
        <textarea
            rows={rows}
            value={value}
            onChange={onChange}
            className="w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-sm"
        />
    </div>
);

const ArrayItemEditor = ({ config, item, dispatch }) => {
    const { section, titleField, hasDescriptions } = config;

    return (
        <div className="p-4 bg-gray-700 rounded-lg border border-gray-600 mb-4 transition-all duration-300">
            <div className="flex justify-between items-center mb-3">
                <h4 className="text-base font-bold text-blue-300">{item[titleField] || `New ${section.slice(0, -1)}`}</h4>
                <button
                    onClick={() => dispatch({ type: 'REMOVE_ITEM', section, id: item.id })}
                    className="text-red-400 hover:text-red-300 transition-colors p-1"
                    title={`Remove ${section.slice(0, -1)}`}
                >
                    <Trash className="w-5 h-5"/>
                </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {config.fields.map(field => (
                    <InputField
                        key={field.key}
                        label={field.label}
                        value={item[field.key] || ''}
                        onChange={(e) => dispatch({
                            type: 'UPDATE_ITEM',
                            section,
                            id: item.id,
                            payload: { [field.key]: e.target.value }
                        })}
                        fullWidth={field.fullWidth}
                    />
                ))}
            </div>

            {hasDescriptions && (
                <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-300 mb-2">Key Bullet Points</h5>
                    <div className="space-y-2">
                        {item.description.map((bullet, index) => (
                            <div key={index} className="flex items-start space-x-2">
                                <span className="text-blue-400 text-lg mt-0.5">•</span>
                                <textarea
                                    rows={2}
                                    value={bullet}
                                    onChange={(e) => dispatch({
                                        type: 'UPDATE_BULLET_POINT',
                                        section,
                                        id: item.id,
                                        index,
                                        value: e.target.value
                                    })}
                                    className="flex-1 rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-sm"
                                />
                                <button
                                    onClick={() => dispatch({ type: 'REMOVE_BULLET_POINT', section, id: item.id, index })}
                                    className="text-red-400 hover:text-red-300 transition-colors mt-2"
                                    title="Remove bullet"
                                >
                                    <Minus className="w-4 h-4"/>
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => dispatch({ type: 'ADD_BULLET_POINT', section, id: item.id })}
                        className="mt-3 flex items-center gap-1 text-sm text-green-400 hover:text-green-300"
                    >
                        <Plus className="w-4 h-4" /> Add Achievement/Detail
                    </button>
                </div>
            )}
        </div>
    );
};

// --- Main Application Component ---

const ResumeBuilder = () => {
    // Initializing state with the reducer
    const [data, dispatch] = useReducer(reducer, initialResumeData);
    const previewRef = useRef(null);

    // Config for repeatable sections
    const sectionConfigs = {
        experience: {
            section: 'experience',
            title: 'Work Experience',
            titleField: 'title',
            hasDescriptions: true,
            fields: [
                { key: 'title', label: 'Job Title', fullWidth: false },
                { key: 'company', label: 'Company Name', fullWidth: false },
                { key: 'location', label: 'City, State', fullWidth: false },
                { key: 'startDate', label: 'Start Date (e.g., Jan 2020)', fullWidth: false },
                { key: 'endDate', label: 'End Date (e.g., Present or Dec 2023)', fullWidth: false },
            ],
            emptyPayload: { title: 'New Role', company: '', location: '', startDate: '', endDate: '', description: ['Quantified result 1.'] }
        },
        projects: {
            section: 'projects',
            title: 'Key Projects',
            titleField: 'title',
            hasDescriptions: true,
            fields: [
                { key: 'title', label: 'Project Name', fullWidth: false },
                { key: 'link', label: 'Link (GitHub/Live Demo)', fullWidth: false },
                { key: 'year', label: 'Year Completed (e.g., 2024)', fullWidth: false },
            ],
            emptyPayload: { title: 'New Project', link: '', year: '', description: ['Description of contribution and technology used.'] }
        },
        education: {
            section: 'education',
            title: 'Education',
            titleField: 'degree',
            hasDescriptions: false,
            fields: [
                { key: 'degree', label: 'Degree/Certification', fullWidth: true },
                { key: 'institution', label: 'Institution/University', fullWidth: true },
                { key: 'year', label: 'Year/Expected Graduation', fullWidth: false },
                { key: 'details', label: 'Details (e.g., GPA, Honors)', fullWidth: false },
            ],
            emptyPayload: { degree: 'New Degree', institution: '', year: '', details: '' }
        },
    };
    
    // --- DOWNLOAD HANDLERS ---
    
    const handleDownloadPDF = useCallback(() => {
        // Use browser print function to save the styled resume as PDF
        window.print();
        // The print CSS media query ensures only the resume area is visible and styled correctly.
    }, []);

    const generatePlainText = useCallback((resumeData) => {
        const p = resumeData.personal;
        let text = `${p.name.toUpperCase()}\n`;
        text += `${p.title}\n`;
        text += `${p.phone ? p.phone + ' | ' : ''}${p.email}\n`;
        text += `${p.linkedin ? 'LinkedIn: ' + p.linkedin : ''}${p.github ? ' | GitHub: ' + p.github : ''}\n`;
        text += '--------------------------------------------------------------------------------\n\n';

        if (resumeData.summary) {
            text += 'SUMMARY\n';
            text += '--------------------------------------------------------------------------------\n';
            text += `${resumeData.summary}\n\n`;
        }

        if (resumeData.skills) {
            text += 'TECHNICAL SKILLS\n';
            text += '--------------------------------------------------------------------------------\n';
            text += `${resumeData.skills}\n\n`;
        }

        ['experience', 'projects', 'education'].forEach(sectionKey => {
            const sectionData = resumeData[sectionKey];
            if (sectionData.length > 0) {
                text += `${sectionConfigs[sectionKey].title.toUpperCase()}\n`;
                text += '--------------------------------------------------------------------------------\n';
                sectionData.forEach(item => {
                    const line1 = `${item.title}${item.company ? ', ' + item.company : item.institution ? ', ' + item.institution : ''}`;
                    const line2 = `${item.location ? item.location + ' | ' : ''}${item.year ? item.year : (item.startDate && item.endDate ? item.startDate + ' - ' + item.endDate : '')}`;
                    text += `${line1}\n${line2}\n`;
                    if (item.details) text += `${item.details}\n`;

                    if (item.description && item.description.length > 0) {
                        item.description.forEach(bullet => {
                            text += `• ${bullet}\n`;
                        });
                    }
                    text += '\n';
                });
            }
        });
        
        return text;
    }, [sectionConfigs]);

    const handleDownloadDOCX = useCallback(() => {
        if (!previewRef.current) return;
        
        // Simple client-side HTML to DOCX conversion via Blob/MIME Type
        const content = previewRef.current.innerHTML;
        const htmlContent = `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <title>${data.personal.name} Resume</title>
                    <style>
                        body { font-family: sans-serif; max-width: 8.5in; margin: 1in; }
                        h1 { font-size: 24pt; text-align: center; border-bottom: none; }
                        h2 { font-size: 14pt; border-bottom: 2px solid #333; padding-bottom: 2px; margin-top: 15pt; text-transform: uppercase; }
                        h3 { font-size: 12pt; font-weight: bold; margin-bottom: 0; }
                        p, ul, li { font-size: 10pt; line-height: 1.5; margin-bottom: 5pt; }
                        ul { list-style-type: disc; margin-left: 20pt; }
                        .text-center { text-align: center; }
                        .flex, .justify-between, .items-start { display: block; } /* Simplify for Word */
                    </style>
                </head>
                <body>
                    ${content}
                </body>
            </html>
        `;

        const filename = `${data.personal.name.replace(/\s/g, '_')}_Resume.doc`;
        const blob = new Blob([htmlContent], {
            type: 'application/msword;charset=utf-8',
        });

        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Revoke the object URL to free up memory
        URL.revokeObjectURL(a.href);
    }, [data.personal.name]);


    const handleDownloadJSON = useCallback(() => {
        const filename = `${data.personal.name.replace(/\s/g, '_')}_data.json`;
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
    }, [data]);

    const plainTextContent = generatePlainText(data);


    return (
        <div className="min-h-screen bg-gray-900 font-sans p-4 sm:p-8">
            <style jsx global>{`
                /* Print styles: Ensure only the resume preview is printed */
                @media print {
                    body > * { display: none !important; }
                    .print-area { 
                        display: block !important; 
                        visibility: visible !important;
                        position: static !important;
                        margin: 0 !important;
                        padding: 20mm 15mm !important;
                        box-shadow: none !important;
                        background: white !important;
                        width: 100%;
                        max-width: none;
                        min-height: 100vh;
                        color: black !important;
                        font-family: 'Inter', sans-serif !important;
                    }
                    .print-area * {
                        color: inherit !important;
                        background: transparent !important;
                        box-shadow: none !important;
                    }
                    /* Ensure list styles are visible */
                    .print-area ul { list-style-type: disc !important; }
                }
            `}</style>
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* --- Input Column --- */}
                <div className="lg:order-1 space-y-8 max-h-[90vh] lg:max-h-full overflow-y-auto pr-3 print-hidden">
                    <h1 className="text-4xl font-extrabold text-blue-400 mb-6">Professional Resume Builder</h1>
                    
                    {/* Download Controls */}
                    <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700">
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={handleDownloadPDF}
                                className="flex-1 min-w-[120px] bg-blue-600 text-white font-extrabold text-sm py-3 rounded-lg hover:bg-blue-700 transition-all shadow-lg transform hover:scale-[1.01] flex items-center justify-center gap-2"
                            >
                                <Download className="w-5 h-5"/> PDF (High Quality)
                            </button>
                             <button
                                onClick={handleDownloadDOCX}
                                className="flex-1 min-w-[120px] bg-cyan-600 text-white font-extrabold text-sm py-3 rounded-lg hover:bg-cyan-700 transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                <Download className="w-5 h-5"/> DOCX (Word)
                            </button>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(plainTextContent).then(() => {
                                        console.log("Copied to clipboard!");
                                        // In a real app, you'd show a custom notification here
                                    }).catch(err => {
                                        console.error('Could not copy text: ', err);
                                    });
                                }}
                                className="flex-1 min-w-[120px] bg-gray-600 text-white font-extrabold text-sm py-3 rounded-lg hover:bg-gray-700 transition-all shadow-lg"
                            >
                                Copy TXT
                            </button>
                            <button
                                onClick={handleDownloadJSON}
                                className="flex-1 min-w-[120px] bg-gray-600 text-white font-extrabold text-sm py-3 rounded-lg hover:bg-gray-700 transition-all shadow-lg"
                            >
                                Export JSON
                            </button>
                        </div>
                        <p className="text-xs text-yellow-400 mt-3 flex items-center gap-1">
                            <AlertTriangle className="w-4 h-4"/>
                            For PDF, choose "Save as PDF" in the print dialogue. DOCX styling may vary.
                        </p>
                    </div>

                    {/* Personal Info Section */}
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
                        <h2 className="text-xl font-bold text-white mb-4">Personal & Contact</h2>
                        <div className="grid grid-cols-2 gap-3">
                            <InputField label="Full Name" value={data.personal.name} onChange={(e) => dispatch({ type: 'UPDATE_FIELD', section: 'personal', field: 'name', value: e.target.value })} fullWidth={true}/>
                            <InputField label="Current Title" value={data.personal.title} onChange={(e) => dispatch({ type: 'UPDATE_FIELD', section: 'personal', field: 'title', value: e.target.value })} fullWidth={true}/>
                            <InputField label="Email" value={data.personal.email} onChange={(e) => dispatch({ type: 'UPDATE_FIELD', section: 'personal', field: 'email', value: e.target.value })} type="email"/>
                            <InputField label="Phone" value={data.personal.phone} onChange={(e) => dispatch({ type: 'UPDATE_FIELD', section: 'personal', field: 'phone', value: e.target.value })}/>
                            <InputField label="LinkedIn URL" value={data.personal.linkedin} onChange={(e) => dispatch({ type: 'UPDATE_FIELD', section: 'personal', field: 'linkedin', value: e.target.value })}/>
                            <InputField label="GitHub URL" value={data.personal.github} onChange={(e) => dispatch({ type: 'UPDATE_FIELD', section: 'personal', field: 'github', value: e.target.value })}/>
                        </div>
                    </div>
                    
                    {/* Summary and Skills Section */}
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
                        <h2 className="text-xl font-bold text-white mb-4">Summary & Skills</h2>
                        <TextAreaField label="Professional Summary" value={data.summary} onChange={(e) => dispatch({ type: 'UPDATE_FIELD', section: 'summary', value: e.target.value })} rows={4} />
                        <div className="mt-4">
                            <TextAreaField label="Technical Skills (Comma Separated)" value={data.skills} onChange={(e) => dispatch({ type: 'UPDATE_FIELD', section: 'skills', value: e.target.value })} rows={2} />
                        </div>
                    </div>

                    {/* Dynamic Sections */}
                    {Object.values(sectionConfigs).map(config => (
                        <div key={config.section} className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
                            <h2 className="text-xl font-bold text-white mb-4">{config.title}</h2>
                            {data[config.section].map(item => (
                                <ArrayItemEditor
                                    key={item.id}
                                    config={config}
                                    item={item}
                                    dispatch={dispatch}
                                />
                            ))}
                            <button
                                onClick={() => dispatch({ type: 'ADD_ITEM', section: config.section, payload: config.emptyPayload })}
                                className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors mt-2 shadow-md flex items-center justify-center gap-1"
                            >
                                <Plus className="w-5 h-5"/> Add New {config.title.slice(0, -1)}
                            </button>
                        </div>
                    ))}
                    
                    <div className="h-10"></div> {/* Spacer */}
                </div>

                {/* --- Preview Column --- */}
                <div className="lg:order-2 space-y-6 sticky top-8 h-full print-hidden">
                    <div className="p-4 bg-gray-200 rounded-xl shadow-2xl min-h-[500px] overflow-hidden">
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Live Preview (A4 Format)</h2>
                        <div className="overflow-x-auto">
                            <ResumePreview data={data} ref={previewRef} />
                        </div>
                    </div>
                </div>

                {/* This div is specifically for printing and is normally hidden */}
                <div className="print-area">
                    <ResumePreview data={data} ref={previewRef} />
                </div>
            </div>
        </div>
    );
};

export default ResumeBuilder;
