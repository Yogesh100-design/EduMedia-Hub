import React, { useReducer, useRef, useCallback, useState } from "react";

// Lucide Icons (inlining for single-file stability)
const Download = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>);
const Trash = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>);
const Plus = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>);
const Minus = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" x2="19" y1="12" y2="12"/></svg>);
const AlertTriangle = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.87 18a2 2 0 0 0 1.76 3H20.37a2 2 0 0 0 1.76-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>);
const Upload = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="15" y2="3"/></svg>);
const Award = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 18 17 23 15.79 13.88"/></svg>);


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
    certifications: [
        {
            id: 1,
            name: 'Certified ScrumMaster (CSM)',
            issuer: 'Scrum Alliance',
            year: '2022',
            details: 'Focused on Agile methodologies and team collaboration.'
        }
    ]
};

// --- Reducer for state management ---
const reducer = (state, action) => {
    switch (action.type) {
        case 'LOAD_STATE':
            // Overwrites the entire state with new data
            return action.payload;

        case 'UPDATE_FIELD':
            // Handles updates for personal, summary, and skills (flat fields)
            return {
                ...state,
                [action.section]: action.field ? {
                    ...state[action.section],
                    [action.field]: action.value
                } : action.value
            };
        
        case 'ADD_ITEM':
            // Adds a new item to a repeatable section
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
                    if (item.id === action.id && item.description) {
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
                    if (item.id === action.id && item.description) {
                        const newBullet = action.section === 'experience' 
                            ? 'Quantified achievement or key result.' 
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
                    if (item.id === action.id && item.description) {
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
    <div className="text-center pb-3 mb-3 border-b border-gray-300">
        <h1 className="text-3xl font-extrabold tracking-wider text-gray-900 uppercase">{personal.name}</h1>
        <p className="text-lg font-medium text-gray-700 mb-2">{personal.title}</p>
        <div className="flex justify-center flex-wrap gap-x-4 text-sm text-gray-600 font-mono">
            {personal.phone && <span>{personal.phone}</span>}
            {personal.email && <span>| {personal.email}</span>}
            {personal.linkedin && <a href={`https://${personal.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">| {personal.linkedin}</a>}
            {personal.github && <a href={`https://${personal.github}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">| {personal.github}</a>}
        </div>
    </div>
);

const Section = ({ title, children }) => (
    <div className="mb-4">
        <h2 className="text-base font-bold border-b-2 border-gray-800 pb-1 mb-2 uppercase text-gray-800 tracking-widest">{title}</h2>
        {children}
    </div>
);

const DetailEntry = ({ item, isCert = false }) => (
    <div className="mb-3">
        <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-gray-900 leading-tight">{item.title || item.degree || item.name}</h3>
                <p className="text-xs font-medium text-gray-700 leading-tight">
                    {item.company ? `${item.company} | ${item.location}` : ''}
                    {item.institution ? item.institution : ''}
                    {item.issuer ? item.issuer : ''}
                    {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline block truncate">{item.link}</a>}
                </p>
            </div>
            <span className="text-xs text-gray-600 font-medium whitespace-nowrap ml-4 pt-1">
                {item.year ? item.year : (item.startDate && item.endDate ? `${item.startDate} – ${item.endDate}` : '')}
            </span>
        </div>
        
        {item.details && <p className="text-xs italic text-gray-500 mt-1">{item.details}</p>}

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
        <div ref={ref} className="bg-white p-8 shadow-xl h-[297mm] w-[210mm] mx-auto text-inter print-area text-black">
            <Header personal={data.personal} />

            {/* Summary */}
            {data.summary && (
                <Section title="Professional Summary">
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
                <Section title="Key Projects">
                    {data.projects.map(item => (
                        <DetailEntry key={item.id} item={item} />
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
            
            {/* Certifications */}
            {data.certifications.length > 0 && (
                <Section title="Certifications & Awards">
                    {data.certifications.map(item => (
                        <DetailEntry key={item.id} item={item} isCert={true} />
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
            className="w-full rounded-md border border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-sm transition-colors"
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
            className="w-full rounded-md border border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-sm transition-colors"
        />
    </div>
);

const ArrayItemEditor = ({ config, item, dispatch }) => {
    const { section, titleField, hasDescriptions } = config;

    return (
        <div className="p-4 bg-gray-700 rounded-xl border border-gray-600 mb-4 transition-all duration-300 hover:border-blue-500">
            <div className="flex justify-between items-center mb-3">
                <h4 className="text-base font-bold text-blue-300">{item[titleField] || `New ${config.title.split(' ')[0]}`}</h4>
                <button
                    onClick={() => dispatch({ type: 'REMOVE_ITEM', section, id: item.id })}
                    className="text-red-400 hover:text-red-300 transition-colors p-1 rounded-full bg-gray-600 hover:bg-red-900"
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
                <div className="mt-4 pt-4 border-t border-gray-600">
                    <h5 className="text-sm font-medium text-gray-300 mb-2">Key Achievements (Quantified Bullet Points)</h5>
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
                                    className="flex-1 rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-sm resize-y"
                                />
                                <button
                                    onClick={() => dispatch({ type: 'REMOVE_BULLET_POINT', section, id: item.id, index })}
                                    className="text-red-400 hover:text-red-300 transition-colors mt-2 p-1 rounded-md"
                                    title="Remove bullet"
                                >
                                    <Minus className="w-4 h-4"/>
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => dispatch({ type: 'ADD_BULLET_POINT', section, id: item.id })}
                        className="mt-3 flex items-center gap-1 text-sm text-green-400 font-semibold hover:text-green-300 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Add Bullet Point
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
    const fileInputRef = useRef(null);
    const [statusMessage, setStatusMessage] = useState(null);

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
        certifications: {
            section: 'certifications',
            title: 'Certifications & Awards',
            titleField: 'name',
            hasDescriptions: false,
            fields: [
                { key: 'name', label: 'Certification/Award Name', fullWidth: true },
                { key: 'issuer', label: 'Issuing Body/Organization', fullWidth: true },
                { key: 'year', label: 'Year Earned', fullWidth: false },
                { key: 'details', label: 'Details (e.g., License #)', fullWidth: false },
            ],
            emptyPayload: { name: 'New Certification', issuer: '', year: '', details: '' }
        },
    };
    
    // --- UTILITY FUNCTIONS ---
    
    const showStatus = (message) => {
        setStatusMessage(message);
        setTimeout(() => setStatusMessage(null), 3000); // Clear message after 3 seconds
    };

    // --- DOWNLOAD HANDLERS ---
    
    const handleDownloadPDF = useCallback(() => {
        // Use browser print function to save the styled resume as PDF
        window.print();
    }, []);

    const generatePlainText = useCallback((resumeData) => {
        const p = resumeData.personal;
        let text = `${p.name.toUpperCase()}\n`;
        text += `${p.title}\n`;
        text += `${p.phone ? p.phone + ' | ' : ''}${p.email}`;
        text += `${p.linkedin ? ' | LinkedIn: ' + p.linkedin : ''}${p.github ? ' | GitHub: ' + p.github : ''}\n`;
        text += '================================================================================\n\n';

        if (resumeData.summary) {
            text += 'SUMMARY\n';
            text += '--------------------------------------------------------------------------------\n';
            text += `${resumeData.summary}\n\n`;
        }

        ['skills', 'experience', 'projects', 'education', 'certifications'].forEach(sectionKey => {
            if (sectionKey === 'skills') {
                if (resumeData.skills) {
                    text += 'TECHNICAL SKILLS\n';
                    text += '--------------------------------------------------------------------------------\n';
                    text += `${resumeData.skills}\n\n`;
                }
                return;
            }

            const sectionData = resumeData[sectionKey];
            if (sectionData.length > 0) {
                text += `${sectionConfigs[sectionKey].title.toUpperCase()}\n`;
                text += '--------------------------------------------------------------------------------\n';
                sectionData.forEach(item => {
                    const line1 = `${item.title || item.degree || item.name}${item.company ? ', ' + item.company : item.institution ? ', ' + item.institution : item.issuer ? ', ' + item.issuer : ''}`;
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
        // We strip Tailwind classes for Word compatibility and use inline CSS/styles.
        const content = previewRef.current.innerHTML
            .replace(/class="[^"]*"/g, '')
            .replace(/style="[^"]*"/g, '');
            
        const htmlContent = `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <title>${data.personal.name} Resume</title>
                    <style>
                        body { font-family: Calibri, sans-serif; max-width: 8.5in; margin: 1in; color: #333; }
                        h1 { font-size: 26pt; text-align: center; margin-bottom: 0; padding-bottom: 0; }
                        .subtitle { font-size: 14pt; text-align: center; margin-bottom: 10pt; }
                        .contact-info { text-align: center; font-size: 10pt; margin-bottom: 20pt; border-bottom: 1px solid #999; padding-bottom: 5pt; }
                        h2 { font-size: 14pt; border-bottom: 2px solid #333; padding-bottom: 2px; margin-top: 15pt; text-transform: uppercase; font-weight: bold; }
                        h3 { font-size: 12pt; font-weight: bold; margin-bottom: 0; }
                        p, ul, li { font-size: 10.5pt; line-height: 1.4; margin-bottom: 5pt; color: #333; }
                        ul { list-style-type: disc; margin-left: 20pt; }
                    </style>
                </head>
                <body>
                    <div class="resume-container">
                        <div class="header">
                            <h1 style="font-size: 26pt; margin-bottom: 0;">${data.personal.name.toUpperCase()}</h1>
                            <p class="subtitle" style="font-size: 14pt;">${data.personal.title}</p>
                            <div class="contact-info">
                                ${data.personal.phone ? data.personal.phone + ' | ' : ''}
                                ${data.personal.email ? data.personal.email + ' | ' : ''}
                                ${data.personal.linkedin ? `<a href="https://${data.personal.linkedin}">LinkedIn</a>` : ''}
                                ${data.personal.github ? (data.personal.linkedin ? ' | ' : '') + `<a href="https://${data.personal.github}">GitHub</a>` : ''}
                            </div>
                        </div>
                        ${previewRef.current.querySelector('.print-area').innerHTML.replace(/<div class="text-center pb-4 mb-4 border-b border-gray-300">[\s\S]*?<\/div>/, '')}
                    </div>
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

        URL.revokeObjectURL(a.href);
        showStatus('DOCX file generated and downloaded!');
    }, [data.personal]);


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
        showStatus('JSON data exported successfully!');
    }, [data]);

    // --- IMPORT HANDLER ---

    const handleImportJSON = useCallback((event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                // Simple validation check: must contain 'personal' and 'summary'
                if (importedData.personal && importedData.summary) {
                    dispatch({ type: 'LOAD_STATE', payload: importedData });
                    showStatus('Data loaded successfully!');
                } else {
                    showStatus('Invalid JSON structure. Please check the file.');
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
                showStatus('Error reading file: Invalid JSON format.');
            }
        };
        reader.onerror = () => {
            showStatus('Error reading file.');
        };
        reader.readAsText(file);
    }, []);

    const handleCopyPlainText = useCallback(() => {
        const plainTextContent = generatePlainText(data);
        navigator.clipboard.writeText(plainTextContent).then(() => {
            showStatus('Plain text copied to clipboard!');
        }).catch(err => {
            console.error('Could not copy text: ', err);
            showStatus('Could not copy text.');
        });
    }, [data, generatePlainText]);


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
                    /* Ensure list styles are visible and black */
                    .print-area ul { list-style-type: disc !important; color: black !important; }
                    .print-area li { color: black !important; }
                    .print-area a { color: #0000FF !important; text-decoration: underline !important; }
                }
            `}</style>

            {/* Status Message Modal */}
            {statusMessage && (
                <div className="fixed top-4 right-4 z-50 p-4 rounded-lg shadow-xl bg-blue-600 text-white font-semibold transition-opacity duration-300 animate-fadeInOut">
                    {statusMessage}
                </div>
            )}

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* --- Input Column (Editor) --- */}
                <div className="lg:order-1 space-y-8 max-h-[95vh] lg:max-h-full overflow-y-auto pr-3 custom-scrollbar print-hidden">
                    <h1 className="text-4xl font-extrabold text-blue-400 mb-6">Resume Editor Dashboard</h1>
                    
                    {/* Download/Export Controls */}
                    <div className="bg-gray-800 p-4 rounded-xl shadow-2xl border border-gray-700">
                        <div className="flex flex-wrap gap-3 mb-3">
                            {/* Download Buttons */}
                            <button
                                onClick={handleDownloadPDF}
                                className="flex-1 min-w-[120px] bg-blue-600 text-white font-extrabold text-sm py-3 rounded-lg hover:bg-blue-700 transition-all shadow-lg transform hover:scale-[1.01] flex items-center justify-center gap-2"
                            >
                                <Download className="w-5 h-5"/> Download PDF 
                            </button>
                            <button
                                onClick={handleDownloadDOCX}
                                className="flex-1 min-w-[120px] bg-cyan-600 text-white font-extrabold text-sm py-3 rounded-lg hover:bg-cyan-700 transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                <Download className="w-5 h-5"/> Download DOCX
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {/* Utility Buttons */}
                             <button
                                onClick={handleCopyPlainText}
                                className="flex-1 min-w-[120px] bg-gray-600 text-white font-extrabold text-sm py-3 rounded-lg hover:bg-gray-700 transition-all shadow-md flex items-center justify-center gap-2"
                            >
                                Copy TXT
                            </button>
                            <button
                                onClick={handleDownloadJSON}
                                className="flex-1 min-w-[120px] bg-gray-600 text-white font-extrabold text-sm py-3 rounded-lg hover:bg-gray-700 transition-all shadow-md flex items-center justify-center gap-2"
                            >
                                <Download className="w-5 h-5"/> Export JSON
                            </button>
                            
                            {/* Import Button */}
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="flex-1 min-w-[120px] bg-green-600 text-white font-extrabold text-sm py-3 rounded-lg hover:bg-green-700 transition-all shadow-md flex items-center justify-center gap-2"
                            >
                                <Upload className="w-5 h-5"/> Import JSON
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImportJSON}
                                accept=".json"
                                className="hidden"
                            />
                        </div>
                        <p className="text-xs text-yellow-400 mt-3 flex items-center gap-1">
                            <AlertTriangle className="w-4 h-4"/>
                            Tip: For high-fidelity PDF, use the Chrome/Edge print dialog, set layout to "Portrait", and choose "Save as PDF".
                        </p>
                    </div>

                    {/* Personal Info Section */}
                    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">Personal & Contact Details</h2>
                        <div className="grid grid-cols-2 gap-3">
                            <InputField label="Full Name" value={data.personal.name} onChange={(e) => dispatch({ type: 'UPDATE_FIELD', section: 'personal', field: 'name', value: e.target.value })} fullWidth={true}/>
                            <InputField label="Current Title" value={data.personal.title} onChange={(e) => dispatch({ type: 'UPDATE_FIELD', section: 'personal', field: 'title', value: e.target.value })} fullWidth={true}/>
                            <InputField label="Email" value={data.personal.email} onChange={(e) => dispatch({ type: 'UPDATE_FIELD', section: 'personal', field: 'email', value: e.target.value })} type="email"/>
                            <InputField label="Phone" value={data.personal.phone} onChange={(e) => dispatch({ type: 'UPDATE_FIELD', section: 'personal', field: 'phone', value: e.target.value })}/>
                            <InputField label="LinkedIn URL (without https://)" value={data.personal.linkedin} onChange={(e) => dispatch({ type: 'UPDATE_FIELD', section: 'personal', field: 'linkedin', value: e.target.value })}/>
                            <InputField label="GitHub URL (without https://)" value={data.personal.github} onChange={(e) => dispatch({ type: 'UPDATE_FIELD', section: 'personal', field: 'github', value: e.target.value })}/>
                        </div>
                    </div>
                    
                    {/* Summary and Skills Section */}
                    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
                        <h2 className="text-xl font-bold text-white mb-4">Summary & Skills</h2>
                        <TextAreaField label="Professional Summary (1-4 lines highly recommended)" value={data.summary} onChange={(e) => dispatch({ type: 'UPDATE_FIELD', section: 'summary', value: e.target.value })} rows={4} />
                        <div className="mt-4">
                            <TextAreaField label="Technical Skills (Comma Separated for clarity)" value={data.skills} onChange={(e) => dispatch({ type: 'UPDATE_FIELD', section: 'skills', value: e.target.value })} rows={2} />
                        </div>
                    </div>

                    {/* Dynamic Sections (Experience, Projects, Education, Certifications) */}
                    {Object.values(sectionConfigs).map(config => (
                        <div key={config.section} className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
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
                                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors mt-2 shadow-md flex items-center justify-center gap-1 transform hover:scale-[1.005]"
                            >
                                <Plus className="w-5 h-5"/> Add New {config.title.split(' ')[0]} Entry
                            </button>
                        </div>
                    ))}
                    
                    <div className="h-10"></div> {/* Spacer */}
                </div>

                {/* --- Preview Column --- */}
                <div className="lg:order-2 space-y-6 sticky top-8 h-[95vh] print-hidden">
                    <div className="p-4 bg-gray-100 rounded-xl shadow-2xl min-h-[500px] overflow-y-auto h-full flex flex-col items-center">
                        <h2 className="text-xl font-bold text-gray-800 mb-2">A4 Document Live Preview</h2>
                        <div className="flex-1 w-full flex justify-center">
                            <ResumePreview data={data} ref={previewRef} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeBuilder;
