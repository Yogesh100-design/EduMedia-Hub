import React, { useState, useMemo, useCallback } from "react";
// Added BsSortUp and BsFilter for the new controls
import { BsStar, BsStarFill, BsPlus, BsDownload, BsFilter, BsSortDown, BsSortUp } from "react-icons/bs";

// NOTE: For the downloadPDF function to work in a real application, you would need
// to include the external libraries html2canvas and jspdf.
// For this single-file environment, we mock them to prevent immediate errors.
const html2canvas = window.html2canvas || ((element) => Promise.resolve({ toDataURL: () => 'data:image/png;base64,mock', height: 100, width: 100 }));
const jsPDF = window.jsPDF ? window.jsPDF.jsPDF : class MockJsPDF { addImage() {} save() { console.log("PDF Download Mock: Save called."); } };


const CompanyReview = () => {
    // ---- Dummy data - expanded with 3 more entries ----
    const initialReviews = [
        {
            id: 1,
            company: "Google",
            logo: "https://logo.clearbit.com/google.com",
            role: "Software Engineer",
            location: "Mountain View, CA",
            overall: 5, workLife: 5, culture: 5, salary: 5, benefits: 5,
            recommend: true,
            pros: "Great perks, smart colleagues, impactful projects, excellent career mobility.",
            cons: "Can be overwhelming for juniors, bureaucratic approval processes.",
            interview: "2 phone screens → 5 on-sites (coding, system design) → offer",
            date: "2025-06-20",
        },
        {
            id: 2,
            company: "Amazon",
            logo: "https://logo.clearbit.com/amazon.com",
            role: "SDE-1",
            location: "Seattle, WA",
            overall: 4, workLife: 3, culture: 4, salary: 5, benefits: 4,
            recommend: true,
            pros: "High ownership, fast promotions, stock upside, exposure to massive scale systems.",
            cons: "On-call load, frugal culture, stack ranking can be stressful.",
            interview: "OA → phone → 4 on-site (LP focus) → offer",
            date: "2025-06-18",
        },
        // NEW REVIEW DATA
        {
            id: 3,
            company: "Microsoft",
            logo: "https://logo.clearbit.com/microsoft.com",
            role: "Product Manager",
            location: "Redmond, WA",
            overall: 4, workLife: 4, culture: 4, salary: 4, benefits: 5,
            recommend: true,
            pros: "Solid work-life balance, huge product scope, very stable company, great benefits.",
            cons: "Legacy systems, slower pace of innovation in some departments.",
            interview: "3 rounds of behavioral and product design questions.",
            date: "2025-05-10",
        },
        {
            id: 4,
            company: "Meta",
            logo: "https://logo.clearbit.com/meta.com",
            role: "Data Scientist",
            location: "Menlo Park, CA",
            overall: 3, workLife: 2, culture: 3, salary: 5, benefits: 4,
            recommend: false,
            pros: "Top-tier compensation, cutting-edge data problems, high impact.",
            cons: "Intense pressure, culture can be chaotic, frequent reorgs.",
            interview: "2 statistics rounds → 2 coding/product sense rounds.",
            date: "2025-04-01",
        },
        {
            id: 5,
            company: "Apple",
            logo: "https://logo.clearbit.com/apple.com",
            role: "Hardware Engineer",
            location: "Cupertino, CA",
            overall: 5, workLife: 4, culture: 5, salary: 4, benefits: 5,
            recommend: true,
            pros: "Working on globally recognizable products, deep sense of mission, great leadership.",
            cons: "Extreme secrecy, siloed teams, high barrier to entry.",
            interview: "5 technical interviews focusing on domain knowledge.",
            date: "2025-03-25",
        },
    ];

    const [reviews, setReviews] = useState(initialReviews);

    // ---- Filtering and Sorting State ----
    const [showForm, setShowForm] = useState(false);
    const [sortBy, setSortBy] = useState("date"); // 'date', 'overall'
    const [sortOrder, setSortOrder] = useState("desc"); // 'asc', 'desc'
    const [filterRecommend, setFilterRecommend] = useState("all"); // 'all', 'yes', 'no'
    const [searchQuery, setSearchQuery] = useState("");

    // ---- Form state ----
    const [form, setForm] = useState({
        company: "", logo: "", role: "", location: "",
        overall: 0, workLife: 0, culture: 0, salary: 0, benefits: 0,
        recommend: true, pros: "", cons: "", interview: "",
    });

    // ---- Star rating component ----
    const StarRating = ({ value, setValue, readonly = false, size = "text-xl" }) => (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
                <button
                    key={i}
                    type="button"
                    onClick={() => !readonly && setValue(i)}
                    className={`${size} ${i <= value ? "text-yellow-400" : "text-slate-600"} ${!readonly && "hover:scale-110 transition"} transition`}
                    disabled={readonly}
                >
                    {i <= value ? <BsStarFill /> : <BsStar />}
                </button>
            ))}
        </div>
    );

    // ---- Data Processing: Filter, Sort, and Summarize (using useMemo for performance) ----
    const filteredAndSortedReviews = useMemo(() => {
        let sorted = [...reviews];

        // 1. Search Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            sorted = sorted.filter(r =>
                r.company.toLowerCase().includes(query) ||
                r.role.toLowerCase().includes(query) ||
                r.location.toLowerCase().includes(query) ||
                r.pros.toLowerCase().includes(query)
            );
        }

        // 2. Recommendation Filter
        if (filterRecommend !== "all") {
            const rec = filterRecommend === "yes";
            sorted = sorted.filter(r => r.recommend === rec);
        }

        // 3. Sorting
        sorted.sort((a, b) => {
            let comparison = 0;
            if (sortBy === "overall") {
                comparison = a.overall - b.overall;
            } else if (sortBy === "date") {
                comparison = new Date(a.date) - new Date(b.date);
            }

            return sortOrder === "asc" ? comparison : comparison * -1;
        });

        return sorted;
    }, [reviews, sortBy, sortOrder, filterRecommend, searchQuery]);

    // Summary calculation
    const summary = useMemo(() => {
        if (reviews.length === 0) return null;

        const categories = ["overall", "workLife", "culture", "salary", "benefits"];
        const totals = {};
        let recommendedCount = 0;

        categories.forEach(cat => totals[cat] = 0);

        reviews.forEach(r => {
            categories.forEach(cat => totals[cat] += r[cat]);
            if (r.recommend) recommendedCount++;
        });

        const averages = {};
        categories.forEach(cat => averages[cat] = (totals[cat] / reviews.length).toFixed(1));

        return {
            ...averages,
            totalReviews: reviews.length,
            recommendationRate: ((recommendedCount / reviews.length) * 100).toFixed(0) + "%"
        };
    }, [reviews]);


    // ---- Handle form ----
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Check for rating existence
        if (form.overall === 0 || form.workLife === 0 || form.culture === 0 || form.salary === 0 || form.benefits === 0) {
            console.error("Please ensure all rating categories (Overall, Work-Life, Culture, Salary, Benefits) are rated 1-5.");
            return;
        }

        const newReview = { ...form, id: Date.now(), date: new Date().toISOString().slice(0, 10) };
        setReviews([newReview, ...reviews]);
        setForm({
            company: "", logo: "", role: "", location: "",
            overall: 0, workLife: 0, culture: 0, salary: 0, benefits: 0,
            recommend: true, pros: "", cons: "", interview: "",
        });
        setShowForm(false);
    };

    // ---- Download PDF (requires external libs) ----
    const downloadPDF = async () => {
        try {
            const ele = document.getElementById("reviews-list");
            // Temporarily hide filter/sort controls for clean PDF
            const controls = document.getElementById("review-controls");
            if (controls) controls.style.display = 'none';

            // html2canvas is async
            const canvas = await html2canvas(ele, { backgroundColor: "#0f172a" });
            const imgData = canvas.toDataURL("image/png");

            // Restore controls
            if (controls) controls.style.display = 'flex';

            const pdf = new jsPDF("p", "mm", "a4");
            const w = 210;
            const h = (canvas.height * w) / canvas.width;
            
            // Multi-page PDF logic
            let position = 0;
            const pageHeight = 297; // A4 height in mm

            if (h > pageHeight) {
                for (let i = 0; i < Math.ceil(h/pageHeight); i++) {
                    if (i > 0) pdf.addPage();
                    pdf.addImage(imgData, "PNG", 0, -(i * pageHeight), w, h);
                }
            } else {
                 pdf.addImage(imgData, "PNG", 0, 0, w, h);
            }

            pdf.save("Career-Reviews.pdf");
        } catch (error) {
            console.error("PDF generation failed. Ensure html2canvas and jspdf scripts are loaded.", error);
        }
    };

    // Tailwind component styles
    const inputClasses = "w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500";
    
    // Sort control helper
    const handleSortChange = (newSortBy) => {
        if (sortBy === newSortBy) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(newSortBy);
            setSortOrder("desc"); // Default to descending when changing category
        }
    };

    const SortIcon = useCallback((field) => {
        if (sortBy !== field) return <BsSortDown className="w-4 h-4 text-slate-500" />;
        return sortOrder === "desc" 
            ? <BsSortDown className="w-4 h-4 text-cyan-400" />
            : <BsSortUp className="w-4 h-4 text-cyan-400" />;
    }, [sortBy, sortOrder]);


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-10 px-6 font-sans">
            <style jsx>{`
                .input { ${inputClasses} }
            `}</style>
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
                    <div>
                        <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">Career Reviews</h2>
                        <p className="text-slate-300 mt-1">Honest reviews from real employees – {reviews.length} total reviews.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowForm((s) => !s)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition shadow-lg shadow-cyan-900/50"
                        >
                            <BsPlus /> {showForm ? "Hide Form" : "Add Review"}
                        </button>
                    </div>
                </div>

                {/* Overall Summary Card (NEW) */}
                {summary && (
                    <div className="bg-white/10 border border-white/20 rounded-2xl p-6 mb-8 shadow-xl">
                        <h3 className="text-xl font-bold text-cyan-300 mb-4">Overall Averages ({summary.totalReviews} Reviews)</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                            {Object.entries(summary).filter(([key]) => key !== 'totalReviews' && key !== 'recommendationRate').map(([key, value]) => (
                                <div key={key} className="text-center p-3 rounded-xl bg-slate-800 border border-slate-700">
                                    <div className="text-slate-400 text-sm capitalize mb-1">
                                        {key === 'workLife' ? "W/L Balance" : key}
                                    </div>
                                    <div className="text-3xl font-bold text-white">
                                        {value}
                                    </div>
                                </div>
                            ))}
                            <div className="text-center p-3 rounded-xl bg-slate-800 border border-slate-700">
                                <div className="text-slate-400 text-sm mb-1">Recommended</div>
                                <div className="text-3xl font-bold text-green-400">{summary.recommendationRate}</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Review Form */}
                {showForm && (
                    <div className="p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md mb-8 shadow-xl">
                        <h3 className="text-xl font-semibold mb-4 text-white">Write a Review</h3>
                        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                            <input name="company" value={form.company} onChange={handleChange} placeholder="Company Name" required className="input" />
                            <input name="logo" value={form.logo} onChange={handleChange} placeholder="Company Logo URL (optional)" className="input" />
                            <input name="role" value={form.role} onChange={handleChange} placeholder="Your Role (e.g., SDE, PM)" required className="input" />
                            <input name="location" value={form.location} onChange={handleChange} placeholder="Office Location (e.g., Seattle, WA)" required className="input" />

                            {/* Ratings */}
                            {["overall", "workLife", "culture", "salary", "benefits"].map((cat) => (
                                <div key={cat} className="flex items-center justify-between bg-slate-800 p-3 rounded-lg md:col-span-1 border border-slate-700">
                                    <label className="capitalize text-sm text-slate-300">{cat === "workLife" ? "Work-Life Balance" : cat}</label>
                                    <StarRating 
                                        value={form[cat]} 
                                        setValue={(v) => setForm((f) => ({ ...f, [cat]: v }))} 
                                        size="text-2xl" 
                                    />
                                </div>
                            ))}
                            
                            <div className="flex items-center gap-4 bg-slate-800 p-3 rounded-lg border border-slate-700">
                                <input id="rec" type="checkbox" name="recommend" checked={form.recommend} onChange={handleChange} className="w-5 h-5 accent-cyan-500" />
                                <label htmlFor="rec" className="text-sm text-slate-300 font-medium">I recommend this company</label>
                            </div>

                            <textarea name="pros" value={form.pros} onChange={handleChange} placeholder="Pros (What do you love?)" required className="input md:col-span-2" rows={2} />
                            <textarea name="cons" value={form.cons} onChange={handleChange} placeholder="Cons (What are the downsides?)" required className="input md:col-span-2" rows={2} />
                            <textarea name="interview" value={form.interview} onChange={handleChange} placeholder="Interview Process (e.g. OA → Phone → On-site, what they focused on)" required className="input md:col-span-2" rows={2} />

                            <button type="submit" className="md:col-span-2 mt-2 px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:scale-105 transition shadow-lg shadow-blue-900/50">
                                Submit Review
                            </button>
                        </form>
                    </div>
                )}

                {/* Reviews Controls (Filter/Sort/Search) (NEW) */}
                <div id="review-controls" className="flex flex-wrap gap-3 items-center mb-6 p-4 rounded-xl bg-slate-800 border border-slate-700">
                    <BsFilter className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                    
                    {/* Search */}
                    <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by company, role, or keywords..."
                        className="input max-w-xs flex-grow"
                    />

                    {/* Filter */}
                    <select
                        value={filterRecommend}
                        onChange={(e) => setFilterRecommend(e.target.value)}
                        className="input max-w-[150px] bg-slate-700 flex-shrink-0"
                    >
                        <option value="all">All Recommendations</option>
                        <option value="yes">Recommended (Yes)</option>
                        <option value="no">Not Recommended (No)</option>
                    </select>

                    {/* Sort By */}
                    <div className="flex flex-wrap gap-2 ml-auto">
                        <button
                            onClick={() => handleSortChange('overall')}
                            className="flex items-center gap-1 px-3 py-1 text-sm rounded bg-slate-700 hover:bg-slate-600 border border-slate-600 transition"
                        >
                            Rating {SortIcon('overall')}
                        </button>
                        <button
                            onClick={() => handleSortChange('date')}
                            className="flex items-center gap-1 px-3 py-1 text-sm rounded bg-slate-700 hover:bg-slate-600 border border-slate-600 transition"
                        >
                            Date {SortIcon('date')}
                        </button>
                    </div>
                </div>


                {/* Reviews List */}
                <div id="reviews-list" className="space-y-6">
                    {filteredAndSortedReviews.length === 0 && (
                        <div className="text-center py-10 bg-white/10 rounded-xl border border-white/20">
                            <p className="text-2xl text-slate-400">No matching reviews found 😞</p>
                            <p className="text-slate-500 mt-2">Try adjusting your filters or search query.</p>
                        </div>
                    )}

                    {filteredAndSortedReviews.map((r) => (
                        <div key={r.id} className="rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md p-6 shadow-xl hover:shadow-cyan-500/10 transition">
                            <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                                <div className="flex items-center gap-4">
                                    <img 
                                        src={r.logo || `https://logo.clearbit.com/${r.company.toLowerCase().replace(/\s/g, "")}.com`} 
                                        alt={r.company} 
                                        className="w-16 h-16 rounded-xl object-cover bg-white p-1 flex-shrink-0" 
                                        onError={(e) => e.target.src = `https://placehold.co/64x64/0f172a/94a3b8?text=${r.company.charAt(0)}`}
                                    />
                                    <div>
                                        <h3 className="text-2xl font-bold text-cyan-300">{r.company}</h3>
                                        <p className="text-slate-300">
                                            {r.role} · {r.location}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right flex flex-col items-end">
                                    <div className="text-4xl font-extrabold text-white">{r.overall}</div>
                                    <div className="text-sm text-slate-400">Overall Rating</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 py-4 border-y border-slate-700 mb-4">
                                {["workLife", "culture", "salary", "benefits"].map((cat) => (
                                    <div key={cat} className="text-center">
                                        <div className="text-sm text-slate-400 mb-1">{cat === "workLife" ? "W-L Balance" : cat.charAt(0).toUpperCase() + cat.slice(1)}</div>
                                        <StarRating value={r[cat]} readonly size="text-lg" />
                                    </div>
                                ))}
                                <div className="text-center flex flex-col justify-center">
                                    <div className="text-sm text-slate-400 mb-1">Recommended?</div>
                                    <div className={`font-semibold text-lg ${r.recommend ? "text-green-400" : "text-rose-400"}`}>
                                        {r.recommend ? "Yes" : "No"}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 text-base">
                                <div className="rounded-lg border border-green-800/50 p-3 bg-green-900/20">
                                    <span className="text-green-400 font-semibold block mb-1">Pros:</span>
                                    <p className="text-slate-200">{r.pros}</p>
                                </div>
                                <div className="rounded-lg border border-rose-800/50 p-3 bg-rose-900/20">
                                    <span className="text-rose-400 font-semibold block mb-1">Cons:</span>
                                    <p className="text-slate-200">{r.cons}</p>
                                </div>
                                <div className="rounded-lg border border-cyan-800/50 p-3 bg-cyan-900/20">
                                    <span className="text-cyan-400 font-semibold block mb-1">Interview Process:</span>
                                    <p className="text-slate-200">{r.interview}</p>
                                </div>
                            </div>

                            <div className="mt-4 text-right text-xs text-slate-400">Reviewed on {r.date}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Default export is mandatory for the file
export default CompanyReview;
