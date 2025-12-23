import React, { useReducer, useRef, useState, useEffect, useCallback, useMemo } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// --- Icons ---
const Download = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>);
const Trash = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>);
const Plus = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>);
const Minus = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" x2="19" y1="12" y2="12"/></svg>);
const Upload = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="15" y2="3"/></svg>);
const Grip = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M9 5h2v2H9zm0 4h2v2H9zm0 4h2v2H9zm4-8h2v2h-2zm0 4h2v2h-2zm0 4h2v2h-2z"/></svg>);
const Check = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>);
const AlertCircle = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>);
const Image = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>);
const Code = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>);

// --- Initial Data ---
const initialResumeData = {
    personal: {
        name: 'ELARA VANCE',
        title: 'Senior Product Manager & Technical Lead',
        email: 'elara.vance@innovate.co',
        phone: '(555) 987-6543',
        linkedin: 'linkedin.com/in/elaravance',
        github: 'github.com/elaradev',
        website: 'elaravance.dev',
        location: 'Austin, TX',
        photo: null,
    },
    summary: 'Seasoned and results-driven Product Leader with 8+ years of experience steering cross-functional teams to deliver high-impact SaaS solutions that have generated over $50M in revenue. Expertise in product strategy, agile methodologies, and technical leadership.',
    skills: ['Product Strategy', 'Agile (Scrum/Kanban)', 'SQL', 'Python', 'JIRA', 'Figma', 'React', 'Node.js', 'Data Analytics', 'Team Leadership'],
    experience: [
        { id: 1, title: 'Senior Product Manager', company: 'NexusTech Solutions', location: 'Austin, TX', startDate: 'Jan 2021', endDate: 'Present', description: ['Led product strategy for a B2B SaaS platform serving 500k+ users, resulting in 40% YoY revenue growth', 'Managed a cross-functional team of 12 engineers, designers, and analysts using Agile methodology', 'Defined and executed product roadmap that reduced churn by 25% and increased NPS from 32 to 68'] },
        { id: 2, title: 'Product Manager', company: 'CloudFlow Inc', location: 'San Francisco, CA', startDate: 'Mar 2018', endDate: 'Dec 2020', description: ['Launched 3 major product features that increased user engagement by 60%', 'Conducted user research with 200+ customers to identify pain points and opportunities', 'Collaborated with engineering to reduce technical debt by 30% while maintaining feature velocity'] }
    ],
    projects: [
        { id: 1, title: 'AI-Powered Resume Grader', link: 'github.com/elaradev/resume-grader', year: '2023', description: ['Built full-stack React/Node.js application that provides real-time resume feedback using NLP', 'Implemented PDF parsing and analysis engine processing 1000+ documents daily', 'Achieved 95% accuracy in skill extraction and ATS compatibility scoring'] },
        { id: 2, title: 'Product Analytics Dashboard', link: 'github.com/elaradev/analytics-dash', year: '2022', description: ['Developed real-time analytics dashboard using D3.js and WebSockets', 'Reduced reporting time from 4 hours to 15 minutes for executive team', 'Implemented predictive analytics features that improved forecasting accuracy by 35%'] }
    ],
    education: [
        { id: 1, degree: 'Master of Business Administration (MBA)', institution: 'University of Texas at Austin', location: 'Austin, TX', year: '2019', details: 'Concentration: Technology Commercialization & AI Ethics. GPA: 3.8/4.0' },
        { id: 2, degree: 'Bachelor of Science in Computer Science', institution: 'Georgia Tech', location: 'Atlanta, GA', year: '2015', details: 'Minor: Cognitive Psychology. Dean\'s List (4 years), Summa Cum Laude' }
    ],
    certifications: [
        { id: 1, name: 'Certified ScrumMaster (CSM)', issuer: 'Scrum Alliance', year: '2022', details: 'Advanced agile methodologies and team facilitation' },
        { id: 2, name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', year: '2021', details: 'Cloud architecture and distributed systems design' }
    ],
    settings: {
        template: 'modern',
        primaryColor: '#1f2937',
        fontSize: 'text-sm',
        showPhoto: false,
        showProjects: true,
        showCertifications: true,
        showSummary: true,
        showSkills: true,
    }
};

// --- Reducer ---
const reducer = (state, action) => {
    switch (action.type) {
        case 'LOAD_STATE': return action.payload;
        case 'UPDATE_FIELD':
            return {
                ...state,
                [action.section]: action.field ? { ...state[action.section], [action.field]: action.value } : action.value
            };
        case 'ADD_ITEM':
            return { ...state, [action.section]: [...state[action.section], { id: Date.now(), ...action.payload }] };
        case 'UPDATE_ITEM':
            return { ...state, [action.section]: state[action.section].map(item => item.id === action.id ? { ...item, ...action.payload } : item) };
        case 'REMOVE_ITEM':
            return { ...state, [action.section]: state[action.section].filter(item => item.id !== action.id) };
        case 'MOVE_ITEM':
            const items = [...state[action.section]];
            const [movedItem] = items.splice(action.fromIndex, 1);
            items.splice(action.toIndex, 0, movedItem);
            return { ...state, [action.section]: items };
        case 'UPDATE_BULLET_POINT':
            return { ...state, [action.section]: state[action.section].map(item => {
                if (item.id === action.id) {
                    const newDesc = [...item.description];
                    newDesc[action.index] = action.value;
                    return { ...item, description: newDesc };
                }
                return item;
            })};
        case 'ADD_BULLET_POINT':
            return { ...state, [action.section]: state[action.section].map(item => item.id === action.id ? { ...item, description: [...item.description, ''] } : item) };
        case 'REMOVE_BULLET_POINT':
            return { ...state, [action.section]: state[action.section].map(item => item.id === action.id ? { ...item, description: item.description.filter((_, i) => i !== action.index) } : item) };
        case 'ADD_SKILL':
            return { ...state, skills: [...state.skills, action.payload] };
        case 'REMOVE_SKILL':
            return { ...state, skills: state.skills.filter((_, i) => i !== action.index) };
        case 'UPDATE_SKILL':
            const newSkills = [...state.skills];
            newSkills[action.index] = action.payload;
            return { ...state, skills: newSkills };
        case 'UPDATE_SETTINGS':
            return { ...state, settings: { ...state.settings, ...action.payload } };
        default: return state;
    }
};

// --- Utility Functions ---
const calculateResumeScore = (data) => {
    let score = 0;
    if (data.personal.name.length > 3) score += 10;
    if (data.personal.email.length > 5) score += 10;
    if (data.summary.length > 50) score += 15;
    if (data.skills.length >= 5) score += 15;
    if (data.experience.length > 0) score += 20;
    if (data.education.length > 0) score += 10;
    if (data.experience.some(exp => exp.description.length >= 2)) score += 10;
    if (data.personal.photo) score += 5;
    if (data.projects.length > 0) score += 5;
    return Math.min(score, 100);
};

// --- Preview Component Templates ---
const ModernHeader = ({ personal, settings }) => (
    <div className={`pb-6 mb-6 border-b-2 ${settings.primaryColor === '#1f2937' ? 'border-gray-800' : 'border-blue-600'}`}>
        <div className="flex items-start gap-6">
            {settings.showPhoto && personal.photo && (
                <img src={personal.photo} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-gray-200" />
            )}
            <div className="flex-1">
                <h1 className={`font-extrabold text-3xl mb-1 ${settings.primaryColor === '#1f2937' ? 'text-gray-900' : 'text-blue-900'}`}>{personal.name}</h1>
                <p className="text-xl text-gray-700 mb-2">{personal.title}</p>
                <div className="text-sm text-gray-600 flex flex-wrap gap-4">
                    <span>{personal.phone}</span>
                    <span>•</span>
                    <span>{personal.email}</span>
                    {personal.website && <><span>•</span><span>{personal.website}</span></>}
                    {personal.linkedin && <><span>•</span><span>{personal.linkedin}</span></>}
                    {personal.github && <><span>•</span><span>{personal.github}</span></>}
                </div>
            </div>
        </div>
    </div>
);

const ClassicHeader = ({ personal, settings }) => (
    <div className="text-center pb-5 mb-5 border-b-2 border-gray-800">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">{personal.name}</h1>
        <p className="text-lg text-gray-700 mb-3">{personal.title}</p>
        <div className="text-sm text-gray-600 flex justify-center flex-wrap gap-3">
            <span>{personal.phone}</span>
            <span>|</span>
            <span>{personal.email}</span>
            <span>|</span>
            <span>{personal.location}</span>
        </div>
        {(personal.website || personal.linkedin) && (
            <div className="text-sm text-gray-600 mt-1">
                {personal.website && <span>{personal.website}</span>}
                {personal.website && personal.linkedin && <span> | </span>}
                {personal.linkedin && <span>{personal.linkedin}</span>}
            </div>
        )}
    </div>
);

const MinimalistHeader = ({ personal, settings }) => (
    <div className="pb-4 mb-4 border-b border-gray-400">
        <h1 className="text-2xl font-light tracking-wide text-gray-900">{personal.name}</h1>
        <p className="text-sm text-gray-600 mt-1">{personal.title}</p>
        <div className="text-xs text-gray-500 mt-2 flex flex-wrap gap-2">
            <span>{personal.email}</span>
            <span>•</span>
            <span>{personal.phone}</span>
        </div>
    </div>
);

const Section = ({ title, children, settings }) => (
    <div className="mb-6">
        <h2 className={`text-sm font-bold border-b-2 ${settings.primaryColor === '#1f2937' ? 'border-gray-800' : 'border-blue-600'} pb-2 mb-3 uppercase tracking-widest ${settings.primaryColor === '#1f2937' ? 'text-gray-900' : 'text-blue-900'}`}>
            {title}
        </h2>
        {children}
    </div>
);

const ModernDetailEntry = ({ item }) => (
    <div className="mb-5 text-left">
        <div className="flex justify-between items-start mb-1">
            <div>
                <span className="font-bold text-base">{item.title || item.degree || item.name}</span>
                <span className="text-gray-700 ml-2">— {item.company || item.institution || item.issuer}</span>
            </div>
            <span className="text-sm text-gray-600 italic">{item.year || `${item.startDate} - ${item.endDate}`}</span>
        </div>
        {item.location && <div className="text-sm text-gray-600 mb-2">{item.location}</div>}
        {item.link && <div className="text-xs text-blue-600 mb-1">{item.link}</div>}
        {item.details && <div className="text-xs text-gray-600 mb-1 italic">{item.details}</div>}
        {item.description && (
            <ul className="list-disc ml-5 text-sm mt-1 space-y-1">
                {item.description.map((pt, i) => pt && <li key={i}>{pt}</li>)}
            </ul>
        )}
    </div>
);

const ClassicDetailEntry = ({ item }) => (
    <div className="mb-4 text-left">
        <div className="flex justify-between font-bold text-sm">
            <span>{item.title || item.degree || item.name}</span>
            <span>{item.year || `${item.startDate} - ${item.endDate}`}</span>
        </div>
        <div className="text-xs italic mb-1">
            {item.company || item.institution || item.issuer}
            {item.location && <span>, {item.location}</span>}
        </div>
        {item.link && <div className="text-xs text-blue-600 mb-1">{item.link}</div>}
        {item.details && <div className="text-xs text-gray-600 mb-1 italic">{item.details}</div>}
        {item.description && (
            <ul className="list-disc ml-4 text-xs mt-1">
                {item.description.map((pt, i) => pt && <li key={i}>{pt}</li>)}
            </ul>
        )}
    </div>
);

const MinimalistDetailEntry = ({ item }) => (
    <div className="mb-4 text-left">
        <div className="flex justify-between text-sm">
            <span className="font-medium">{item.title || item.degree || item.name}</span>
            <span className="text-gray-600">{item.year || `${item.startDate} - ${item.endDate}`}</span>
        </div>
        <div className="text-xs text-gray-600">
            {item.company || item.institution || item.issuer}
        </div>
        {item.description && (
            <ul className="list-none ml-0 text-xs mt-1 space-y-1">
                {item.description.map((pt, i) => pt && <li key={i}>— {pt}</li>)}
            </ul>
        )}
    </div>
);

const ResumePreview = React.forwardRef(({ data }, ref) => {
    const { settings } = data;
    const fontSize = settings.fontSize || 'text-sm';
    
    const HeaderComponent = {
        modern: ModernHeader,
        classic: ClassicHeader,
        minimalist: MinimalistHeader,
    }[settings.template] || ModernHeader;
    
    const DetailComponent = {
        modern: ModernDetailEntry,
        classic: ClassicDetailEntry,
        minimalist: MinimalistDetailEntry,
    }[settings.template] || ModernDetailEntry;

    return (
        <div 
            ref={ref} 
            id="resume-content" 
            className={`bg-white p-10 shadow-2xl w-[210mm] min-h-[297mm] mx-auto text-black ${fontSize} leading-relaxed`}
        >
            <HeaderComponent personal={data.personal} settings={settings} />
            
            {settings.showSummary && data.summary && (
                <Section title="Summary" settings={settings}>
                    <p className="text-sm text-gray-800">{data.summary}</p>
                </Section>
            )}
            
            {settings.showSkills && data.skills.length > 0 && (
                <Section title="Skills" settings={settings}>
                    <div className="flex flex-wrap gap-2">
                        {data.skills.map((skill, i) => (
                            <span key={i} className={`px-2 py-1 text-xs rounded ${settings.primaryColor === '#1f2937' ? 'bg-gray-100 text-gray-800' : 'bg-blue-50 text-blue-800'}`}>
                                {skill}
                            </span>
                        ))}
                    </div>
                </Section>
            )}
            
            {data.experience.length > 0 && (
                <Section title="Experience" settings={settings}>
                    {data.experience.map(exp => <DetailComponent key={exp.id} item={exp} />)}
                </Section>
            )}
            
            {data.education.length > 0 && (
                <Section title="Education" settings={settings}>
                    {data.education.map(edu => <DetailComponent key={edu.id} item={edu} />)}
                </Section>
            )}
            
            {settings.showProjects && data.projects.length > 0 && (
                <Section title="Projects" settings={settings}>
                    {data.projects.map(proj => <DetailComponent key={proj.id} item={proj} />)}
                </Section>
            )}
            
            {settings.showCertifications && data.certifications.length > 0 && (
                <Section title="Certifications" settings={settings}>
                    {data.certifications.map(cert => <DetailComponent key={cert.id} item={cert} />)}
                </Section>
            )}
        </div>
    );
});

// --- Editor Components ---
const InputField = ({ label, value, onChange, type = 'text', placeholder }) => (
    <div>
        <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">{label}</label>
        <input 
            type={type}
            className="w-full bg-gray-700 p-3 rounded-lg border border-gray-600 focus:border-blue-500 outline-none transition"
            value={value || ''} 
            onChange={onChange}
            placeholder={placeholder}
        />
    </div>
);

const TextAreaField = ({ label, value, onChange, rows = 3, placeholder }) => (
    <div>
        <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">{label}</label>
        <textarea 
            rows={rows}
            className="w-full bg-gray-700 p-3 rounded-lg border border-gray-600 focus:border-blue-500 outline-none transition resize-none"
            value={value || ''} 
            onChange={onChange}
            placeholder={placeholder}
        />
    </div>
);

const SkillTag = ({ skill, index, onUpdate, onRemove }) => {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(skill);
    
    const handleSave = () => {
        onUpdate(index, value);
        setEditing(false);
    };
    
    return (
        <div className="flex items-center gap-1 bg-blue-600 px-3 py-1 rounded-full text-sm">
            {editing ? (
                <>
                    <input 
                        type="text" 
                        value={value} 
                        onChange={(e) => setValue(e.target.value)}
                        className="bg-gray-700 px-2 py-0 rounded focus:outline-none"
                        autoFocus
                    />
                    <button onClick={handleSave} className="text-green-400 hover:text-green-300">
                        <Check className="w-4 h-4" />
                    </button>
                </>
            ) : (
                <>
                    <span onClick={() => setEditing(true)} className="cursor-pointer">{skill}</span>
                    <button onClick={() => onRemove(index)} className="text-gray-300 hover:text-white">
                        <Minus className="w-3 h-3" />
                    </button>
                </>
            )}
        </div>
    );
};

const CollapsibleSection = ({ title, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="bg-gray-800 rounded-xl overflow-hidden">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-700 transition"
            >
                <span className="font-semibold">{title}</span>
                <span className={`transform transition ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {isOpen && <div className="px-6 py-4 border-t border-gray-700">{children}</div>}
        </div>
    );
};

const DraggableItem = ({ item, index, onMove, children }) => {
    const [isDragging, setIsDragging] = useState(false);
    
    const handleDragStart = (e) => {
        e.dataTransfer.setData('text/plain', index);
        setIsDragging(true);
    };
    
    const handleDragOver = (e) => {
        e.preventDefault();
    };
    
    const handleDrop = (e) => {
        e.preventDefault();
        const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
        onMove(fromIndex, index);
        setIsDragging(false);
    };
    
    return (
        <div 
            draggable
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`mb-4 p-4 rounded-lg border-2 ${isDragging ? 'border-blue-500 bg-gray-700' : 'border-gray-600 bg-gray-750'} cursor-move`}
        >
            <div className="flex items-center gap-2 mb-2">
                <Grip className="w-5 h-5 text-gray-400" />
                <span className="text-xs text-gray-400">Drag to reorder</span>
            </div>
            {children}
        </div>
    );
};

// --- Main Application ---
const ResumeBuilder = () => {
    const [data, dispatch] = useReducer(reducer, initialResumeData);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [importOpen, setImportOpen] = useState(false);
    const [importData, setImportData] = useState('');
    const [activeTab, setActiveTab] = useState('personal');
    const previewRef = useRef(null);
    const fileInputRef = useRef(null);

    // Auto-save to localStorage
    useEffect(() => {
        const saved = localStorage.getItem('resumeBuilderData');
        if (saved) {
            try {
                dispatch({ type: 'LOAD_STATE', payload: JSON.parse(saved) });
                showToast('Previous resume loaded from browser storage', 'success');
            } catch (e) {
                console.error('Failed to load saved data', e);
            }
        }
    }, []);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            localStorage.setItem('resumeBuilderData', JSON.stringify(data));
        }, 1000);
        return () => clearTimeout(timer);
    }, [data]);

    // Toast notification
    const showToast = (message, type = 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // File upload handlers
    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                dispatch({ type: 'UPDATE_FIELD', section: 'personal', field: 'photo', value: e.target.result });
                showToast('Profile photo uploaded', 'success');
            };
            reader.readAsDataURL(file);
        }
    };

    // Import/Export
    const exportJSON = () => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${data.personal.name.replace(/\s/g, '_')}_Resume.json`;
        a.click();
        showToast('Resume exported as JSON', 'success');
    };

    const importJSON = () => {
        try {
            const parsed = JSON.parse(importData);
            dispatch({ type: 'LOAD_STATE', payload: parsed });
            setImportOpen(false);
            showToast('Resume imported successfully!', 'success');
        } catch (e) {
            showToast('Invalid JSON format', 'error');
        }
    };

    // Download functions
    const downloadPDF = async () => {
        setLoading(true);
        try {
            const element = previewRef.current;
            const canvas = await html2canvas(element, { 
                scale: 2,
                useCORS: true,
                allowTaint: true,
                logging: false
            });
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
            let heightLeft = pdfHeight;
            let position = 0;
            
            pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
            heightLeft -= pdf.internal.pageSize.getHeight();
            
            while (heightLeft >= 0) {
                position = heightLeft - pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
                heightLeft -= pdf.internal.pageSize.getHeight();
            }
            
            pdf.save(`${data.personal.name.replace(/\s/g, '_')}_Resume.pdf`);
            showToast('PDF downloaded successfully!', 'success');
        } catch (error) {
            showToast('Error generating PDF', 'error');
        } finally {
            setLoading(false);
        }
    };

    const downloadWord = () => {
        const content = previewRef.current.innerHTML;
        const html = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
            <head><meta charset="utf-8"><title>Resume</title></head>
            <body>${content}</body>
            </html>
        `;
        const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${data.personal.name.replace(/\s/g, '_')}_Resume.doc`;
        a.click();
        showToast('Word document downloaded (HTML format)', 'success');
    };

    // Add item handlers
    const addItem = (section, payload) => {
        dispatch({ type: 'ADD_ITEM', section, payload });
        showToast(`New ${section.slice(0, -1)} added`, 'success');
    };

    // Score calculation
    const score = useMemo(() => calculateResumeScore(data), [data]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
            <style jsx global>{`
                @media print { 
                    body { background: white !important; }
                    .no-print { display: none !important; } 
                }
                .custom-scrollbar::-webkit-scrollbar { width: 8px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #1f2937; border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4b5563; }
            `}</style>
            
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
                    toast.type === 'success' ? 'bg-green-600' : toast.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
                }`}>
                    {toast.type === 'success' ? <Check /> : <AlertCircle />}
                    <span>{toast.message}</span>
                </div>
            )}

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Editor Panel */}
                <div className="no-print space-y-6">
                    {/* Header */}
                    <div className="bg-gray-800 rounded-xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                Resume Builder Pro
                            </h2>
                            <div className="text-sm bg-gray-700 px-3 py-1 rounded-full">
                                Score: <span className={`font-bold ${score >= 80 ? 'text-green-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>{score}/100</span>
                            </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3">
                            {/* <button onClick={downloadPDF} disabled={loading} className="bg-green-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition disabled:opacity-50">
                                <Download className="w-5 h-5" /> {loading ? 'Generating...' : 'PDF'}
                            </button> */}
                            <button onClick={downloadWord} className="bg-blue-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
                                <Upload className="w-5 h-5 rotate-180" /> Word
                            </button>
                            <button onClick={exportJSON} className="bg-purple-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition">
                                <Code className="w-5 h-5" /> Export JSON
                            </button>
                            <button onClick={() => setImportOpen(true)} className="bg-yellow-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-yellow-700 transition">
                                <Upload className="w-5 h-5" /> Import
                            </button>
                            <button onClick={() => window.print()} className="bg-gray-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-700 transition">
                                <Download className="w-5 h-5 rotate-180" /> Print
                            </button>
                        </div>

                        {/* Import Modal */}
                        {importOpen && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 no-print">
                                <div className="bg-gray-800 p-6 rounded-xl max-w-md w-full mx-4">
                                    <h3 className="text-xl font-bold mb-4">Import Resume Data</h3>
                                    <textarea 
                                        rows="8"
                                        className="w-full bg-gray-700 p-3 rounded border border-gray-600 text-white"
                                        placeholder="Paste JSON data here..."
                                        value={importData}
                                        onChange={(e) => setImportData(e.target.value)}
                                    />
                                    <div className="flex gap-3 mt-4">
                                        <button onClick={importJSON} className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition flex-1">
                                            Import
                                        </button>
                                        <button onClick={() => setImportOpen(false)} className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700 transition flex-1">
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tabs */}
                    <div className="bg-gray-800 rounded-xl p-2 flex gap-2 overflow-x-auto">
                        {['personal', 'summary', 'skills', 'experience', 'education', 'projects', 'certifications', 'settings'].map(tab => (
                            <button 
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg capitalize whitespace-nowrap transition ${
                                    activeTab === tab ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Personal Tab */}
                    {activeTab === 'personal' && (
                        <CollapsibleSection title="Personal Information">
                            <div className="space-y-4">
                                <InputField label="Full Name" value={data.personal.name} onChange={(e) => dispatch({ type: 'UPDATE_FIELD', section: 'personal', field: 'name', value: e.target.value })} />
                                <InputField label="Professional Title" value={data.personal.title} onChange={(e) => dispatch({ type: 'UPDATE_FIELD', section: 'personal', field: 'title', value: e.target.value })} />
                                <InputField label="Email" type="email" value={data.personal.email} onChange={(e) => dispatch({ type: 'UPDATE_FIELD', section: 'personal', field: 'email', value: e.target.value })} />
                                <InputField label="Phone" value={data.personal.phone} onChange={(e) => dispatch({ type: 'UPDATE_FIELD', section: 'personal', field: 'phone', value: e.target.value })} />
                                <InputField label="Location" value={data.personal.location} onChange={(e) => dispatch({ type: 'UPDATE_FIELD', section: 'personal', field: 'location', value: e.target.value })} />
                                <InputField label="Website" value={data.personal.website} onChange={(e) => dispatch({ type: 'UPDATE_FIELD', section: 'personal', field: 'website', value: e.target.value })} />
                                <InputField label="LinkedIn" value={data.personal.linkedin} onChange={(e) => dispatch({ type: 'UPDATE_FIELD', section: 'personal', field: 'linkedin', value: e.target.value })} />
                                <InputField label="GitHub" value={data.personal.github} onChange={(e) => dispatch({ type: 'UPDATE_FIELD', section: 'personal', field: 'github', value: e.target.value })} />
                                
                                <div>
                                    <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2">Profile Photo</label>
                                    <div className="flex gap-4 items-center">
                                        {data.personal.photo ? (
                                            <img src={data.personal.photo} alt="Preview" className="w-24 h-24 rounded-full object-cover" />
                                        ) : (
                                            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center">
                                                <Image className="w-10 h-10 text-gray-500" />
                                            </div>
                                        )}
                                        <div>
                                            <input 
                                                ref={fileInputRef}
                                                type="file" 
                                                accept="image/*" 
                                                onChange={handlePhotoUpload}
                                                className="hidden"
                                            />
                                            <button 
                                                onClick={() => fileInputRef.current.click()}
                                                className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                            >
                                                Upload Photo
                                            </button>
                                            <p className="text-xs text-gray-400 mt-1">Optional: Adds professional touch</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CollapsibleSection>
                    )}

                    {/* Summary Tab */}
                    {activeTab === 'summary' && (
                        <CollapsibleSection title="Professional Summary">
                            <TextAreaField 
                                label="Summary" 
                                value={data.summary} 
                                onChange={(e) => dispatch({ type: 'UPDATE_FIELD', section: 'summary', value: e.target.value })}
                                rows={6}
                                placeholder="Write a compelling summary of your professional background..."
                            />
                            <div className="text-xs text-gray-400 mt-2">
                                Tips: Keep it 3-5 sentences. Focus on achievements and value proposition.
                            </div>
                        </CollapsibleSection>
                    )}

                    {/* Skills Tab */}
                    {activeTab === 'skills' && (
                        <CollapsibleSection title="Skills">
                            <div className="mb-4">
                                <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2">Manage Skills</label>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {data.skills.map((skill, index) => (
                                        <SkillTag 
                                            key={index}
                                            skill={skill}
                                            index={index}
                                            onUpdate={(i, val) => dispatch({ type: 'UPDATE_SKILL', index: i, payload: val })}
                                            onRemove={(i) => dispatch({ type: 'REMOVE_SKILL', index: i })}
                                        />
                                    ))}
                                </div>
                                <button 
                                    onClick={() => dispatch({ type: 'ADD_SKILL', payload: 'New Skill' })}
                                    className="bg-green-600 px-3 py-1 rounded-lg text-sm hover:bg-green-700 transition flex items-center gap-1"
                                >
                                    <Plus className="w-4 h-4" /> Add Skill
                                </button>
                            </div>
                        </CollapsibleSection>
                    )}

                    {/* Experience Tab */}
                    {activeTab === 'experience' && (
                        <CollapsibleSection title="Work Experience">
                            <div className="space-y-4">
                                {data.experience.map((item, index) => (
                                    <DraggableItem key={item.id} item={item} index={index} onMove={(from, to) => dispatch({ type: 'MOVE_ITEM', section: 'experience', fromIndex: from, toIndex: to })}>
                                        <InputField label="Job Title" value={item.title} onChange={(e) => dispatch({ type: 'UPDATE_ITEM', section: 'experience', id: item.id, payload: { title: e.target.value } })} />
                                        <InputField label="Company" value={item.company} onChange={(e) => dispatch({ type: 'UPDATE_ITEM', section: 'experience', id: item.id, payload: { company: e.target.value } })} />
                                        <div className="grid grid-cols-2 gap-4">
                                            <InputField label="Location" value={item.location} onChange={(e) => dispatch({ type: 'UPDATE_ITEM', section: 'experience', id: item.id, payload: { location: e.target.value } })} />
                                            <InputField label="Year/Date" value={item.year || `${item.startDate} - ${item.endDate}`} onChange={(e) => dispatch({ type: 'UPDATE_ITEM', section: 'experience', id: item.id, payload: { year: e.target.value } })} />
                                        </div>
                                        <div className="mt-3">
                                            <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2">Key Achievements</label>
                                            {item.description.map((point, i) => (
                                                <div key={i} className="flex gap-2 mb-2">
                                                    <textarea 
                                                        rows="2"
                                                        className="flex-1 bg-gray-700 p-2 rounded border border-gray-600 focus:border-blue-500 outline-none text-sm"
                                                        value={point}
                                                        onChange={(e) => dispatch({ type: 'UPDATE_BULLET_POINT', section: 'experience', id: item.id, index: i, value: e.target.value })}
                                                        placeholder="Describe a key achievement..."
                                                    />
                                                    <button onClick={() => dispatch({ type: 'REMOVE_BULLET_POINT', section: 'experience', id: item.id, index: i })} className="text-red-400 hover:text-red-300">
                                                        <Trash className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                            <button onClick={() => dispatch({ type: 'ADD_BULLET_POINT', section: 'experience', id: item.id })} className="text-blue-400 text-sm hover:text-blue-300 flex items-center gap-1">
                                                <Plus className="w-4 h-4" /> Add Achievement
                                            </button>
                                        </div>
                                        <button onClick={() => dispatch({ type: 'REMOVE_ITEM', section: 'experience', id: item.id })} className="text-red-400 hover:text-red-300 text-sm mt-2 flex items-center gap-1">
                                            <Trash className="w-4 h-4" /> Remove Position
                                        </button>
                                    </DraggableItem>
                                ))}
                                <button 
                                    onClick={() => addItem('experience', { 
                                        title: 'New Position', 
                                        company: 'Company Name', 
                                        location: 'City, State', 
                                        year: 'Start Date - End Date', 
                                        description: ['Describe your role and achievements...'] 
                                    })}
                                    className="w-full bg-green-600 px-4 py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 font-semibold"
                                >
                                    <Plus className="w-5 h-5" /> Add Experience
                                </button>
                            </div>
                        </CollapsibleSection>
                    )}

                    {/* Education Tab */}
                    {activeTab === 'education' && (
                        <CollapsibleSection title="Education">
                            <div className="space-y-4">
                                {data.education.map((item, index) => (
                                    <DraggableItem key={item.id} item={item} index={index} onMove={(from, to) => dispatch({ type: 'MOVE_ITEM', section: 'education', fromIndex: from, toIndex: to })}>
                                        <InputField label="Degree" value={item.degree} onChange={(e) => dispatch({ type: 'UPDATE_ITEM', section: 'education', id: item.id, payload: { degree: e.target.value } })} />
                                        <InputField label="Institution" value={item.institution} onChange={(e) => dispatch({ type: 'UPDATE_ITEM', section: 'education', id: item.id, payload: { institution: e.target.value } })} />
                                        <div className="grid grid-cols-2 gap-4">
                                            <InputField label="Location" value={item.location} onChange={(e) => dispatch({ type: 'UPDATE_ITEM', section: 'education', id: item.id, payload: { location: e.target.value } })} />
                                            <InputField label="Year" value={item.year} onChange={(e) => dispatch({ type: 'UPDATE_ITEM', section: 'education', id: item.id, payload: { year: e.target.value } })} />
                                        </div>
                                        <TextAreaField 
                                            label="Details (GPA, Honors, etc.)" 
                                            value={item.details}
                                            onChange={(e) => dispatch({ type: 'UPDATE_ITEM', section: 'education', id: item.id, payload: { details: e.target.value } })}
                                            rows={2}
                                        />
                                        <button onClick={() => dispatch({ type: 'REMOVE_ITEM', section: 'education', id: item.id })} className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1">
                                            <Trash className="w-4 h-4" /> Remove Education
                                        </button>
                                    </DraggableItem>
                                ))}
                                <button 
                                    onClick={() => addItem('education', { 
                                        degree: 'Degree Name', 
                                        institution: 'University Name', 
                                        location: 'City, State', 
                                        year: 'Year', 
                                        details: 'GPA, Honors, Relevant Coursework' 
                                    })}
                                    className="w-full bg-green-600 px-4 py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 font-semibold"
                                >
                                    <Plus className="w-5 h-5" /> Add Education
                                </button>
                            </div>
                        </CollapsibleSection>
                    )}

                    {/* Projects Tab */}
                    {activeTab === 'projects' && (
                        <CollapsibleSection title="Projects">
                            <div className="space-y-4">
                                {data.projects.map((item, index) => (
                                    <DraggableItem key={item.id} item={item} index={index} onMove={(from, to) => dispatch({ type: 'MOVE_ITEM', section: 'projects', fromIndex: from, toIndex: to })}>
                                        <InputField label="Project Title" value={item.title} onChange={(e) => dispatch({ type: 'UPDATE_ITEM', section: 'projects', id: item.id, payload: { title: e.target.value } })} />
                                        <InputField label="Link (GitHub, Live Demo)" value={item.link} onChange={(e) => dispatch({ type: 'UPDATE_ITEM', section: 'projects', id: item.id, payload: { link: e.target.value } })} />
                                        <InputField label="Year" value={item.year} onChange={(e) => dispatch({ type: 'UPDATE_ITEM', section: 'projects', id: item.id, payload: { year: e.target.value } })} />
                                        <div className="mt-3">
                                            <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2">Project Details</label>
                                            {item.description.map((point, i) => (
                                                <div key={i} className="flex gap-2 mb-2">
                                                    <textarea 
                                                        rows="2"
                                                        className="flex-1 bg-gray-700 p-2 rounded border border-gray-600 focus:border-blue-500 outline-none text-sm"
                                                        value={point}
                                                        onChange={(e) => dispatch({ type: 'UPDATE_BULLET_POINT', section: 'projects', id: item.id, index: i, value: e.target.value })}
                                                        placeholder="Describe the project..."
                                                    />
                                                    <button onClick={() => dispatch({ type: 'REMOVE_BULLET_POINT', section: 'projects', id: item.id, index: i })} className="text-red-400 hover:text-red-300">
                                                        <Trash className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                            <button onClick={() => dispatch({ type: 'ADD_BULLET_POINT', section: 'projects', id: item.id })} className="text-blue-400 text-sm hover:text-blue-300 flex items-center gap-1">
                                                <Plus className="w-4 h-4" /> Add Detail
                                            </button>
                                        </div>
                                        <button onClick={() => dispatch({ type: 'REMOVE_ITEM', section: 'projects', id: item.id })} className="text-red-400 hover:text-red-300 text-sm mt-2 flex items-center gap-1">
                                            <Trash className="w-4 h-4" /> Remove Project
                                        </button>
                                    </DraggableItem>
                                ))}
                                <button 
                                    onClick={() => addItem('projects', { 
                                        title: 'Project Name', 
                                        link: 'github.com/yourproject', 
                                        year: '2024', 
                                        description: ['Built something amazing...'] 
                                    })}
                                    className="w-full bg-green-600 px-4 py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 font-semibold"
                                >
                                    <Plus className="w-5 h-5" /> Add Project
                                </button>
                            </div>
                        </CollapsibleSection>
                    )}

                    {/* Certifications Tab */}
                    {activeTab === 'certifications' && (
                        <CollapsibleSection title="Certifications">
                            <div className="space-y-4">
                                {data.certifications.map((item, index) => (
                                    <DraggableItem key={item.id} item={item} index={index} onMove={(from, to) => dispatch({ type: 'MOVE_ITEM', section: 'certifications', fromIndex: from, toIndex: to })}>
                                        <InputField label="Certification Name" value={item.name} onChange={(e) => dispatch({ type: 'UPDATE_ITEM', section: 'certifications', id: item.id, payload: { name: e.target.value } })} />
                                        <InputField label="Issuing Organization" value={item.issuer} onChange={(e) => dispatch({ type: 'UPDATE_ITEM', section: 'certifications', id: item.id, payload: { issuer: e.target.value } })} />
                                        <div className="grid grid-cols-2 gap-4">
                                            <InputField label="Year" value={item.year} onChange={(e) => dispatch({ type: 'UPDATE_ITEM', section: 'certifications', id: item.id, payload: { year: e.target.value } })} />
                                            <InputField label="Credential ID (Optional)" value={item.credentialId} onChange={(e) => dispatch({ type: 'UPDATE_ITEM', section: 'certifications', id: item.id, payload: { credentialId: e.target.value } })} />
                                        </div>
                                        <TextAreaField 
                                            label="Details" 
                                            value={item.details}
                                            onChange={(e) => dispatch({ type: 'UPDATE_ITEM', section: 'certifications', id: item.id, payload: { details: e.target.value } })}
                                            rows={2}
                                        />
                                        <button onClick={() => dispatch({ type: 'REMOVE_ITEM', section: 'certifications', id: item.id })} className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1">
                                            <Trash className="w-4 h-4" /> Remove Certification
                                        </button>
                                    </DraggableItem>
                                ))}
                                <button 
                                    onClick={() => addItem('certifications', { 
                                        name: 'Certification Name', 
                                        issuer: 'Issuing Organization', 
                                        year: '2024', 
                                        details: 'Key skills demonstrated' 
                                    })}
                                    className="w-full bg-green-600 px-4 py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 font-semibold"
                                >
                                    <Plus className="w-5 h-5" /> Add Certification
                                </button>
                            </div>
                        </CollapsibleSection>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <CollapsibleSection title="Resume Settings">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2">Template Style</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['modern', 'classic', 'minimalist'].map(template => (
                                            <button 
                                                key={template}
                                                onClick={() => dispatch({ type: 'UPDATE_SETTINGS', payload: { template } })}
                                                className={`p-3 rounded-lg border-2 capitalize ${
                                                    data.settings.template === template 
                                                        ? 'border-blue-500 bg-gray-700' 
                                                        : 'border-gray-600 hover:border-gray-500'
                                                }`}
                                            >
                                                {template}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2">Primary Color</label>
                                    <div className="flex gap-3">
                                        {['#1f2937', '#2563eb', '#dc2626', '#059669', '#7c3aed'].map(color => (
                                            <button 
                                                key={color}
                                                onClick={() => dispatch({ type: 'UPDATE_SETTINGS', payload: { primaryColor: color } })}
                                                className={`w-10 h-10 rounded-lg border-2 ${
                                                    data.settings.primaryColor === color ? 'border-white' : 'border-gray-600'
                                                }`}
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2">Font Size</label>
                                    <select 
                                        value={data.settings.fontSize}
                                        onChange={(e) => dispatch({ type: 'UPDATE_SETTINGS', payload: { fontSize: e.target.value } })}
                                        className="w-full bg-gray-700 p-3 rounded border border-gray-600"
                                    >
                                        <option value="text-xs">Small</option>
                                        <option value="text-sm">Medium</option>
                                        <option value="text-base">Large</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs text-gray-400 uppercase tracking-wide">Section Visibility</label>
                                    {['showPhoto', 'showProjects', 'showCertifications', 'showSummary', 'showSkills'].map(setting => (
                                        <label key={setting} className="flex items-center gap-3">
                                            <input 
                                                type="checkbox" 
                                                checked={data.settings[setting]}
                                                onChange={(e) => dispatch({ type: 'UPDATE_SETTINGS', payload: { [setting]: e.target.checked } })}
                                                className="w-4 h-4"
                                            />
                                            <span className="capitalize text-sm">{setting.replace('show', '')}</span>
                                        </label>
                                    ))}
                                </div>

                                <div className="bg-gray-700 p-4 rounded-lg">
                                    <p className="text-xs text-gray-300">
                                        <strong>Pro Tip:</strong> Use the "Classic" template for traditional industries, 
                                        "Modern" for tech/creative roles, and "Minimalist" for clean, scannable resumes.
                                    </p>
                                </div>
                            </div>
                        </CollapsibleSection>
                    )}
                </div>

                {/* Preview Panel */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6">
                        <div className="bg-gray-800 rounded-xl p-4 mb-4 flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Live Preview</h3>
                            <span className="text-xs text-gray-400">A4 Format</span>
                        </div>
                        <div className="overflow-auto max-h-screen custom-scrollbar bg-gray-900 p-4 rounded-xl">
                            <ResumePreview data={data} ref={previewRef} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeBuilder;