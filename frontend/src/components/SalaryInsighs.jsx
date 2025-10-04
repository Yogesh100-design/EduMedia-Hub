import React, { useState, useMemo, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  ArcElement // Added for Pie Chart
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";

// Icons from lucide-react
import { 
    Search, Download, TrendingUp, DollarSign, Briefcase, MapPin, Gauge, Target, Sigma, Lightbulb, Zap, Users, Code 
} from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend, ArcElement);

// Configuration for Chart.js
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            labels: { color: "rgb(156 163 175)", boxWidth: 10, padding: 20 }
        },
        tooltip: {
            backgroundColor: 'rgba(51, 65, 85, 0.95)',
            titleColor: '#fff',
            bodyColor: 'rgb(203 213 225)',
            borderWidth: 1,
            borderColor: 'rgb(100 116 139)'
        }
    },
    scales: {
        x: { 
            ticks: { color: "rgb(156 163 175)" },
            grid: { color: "rgba(100, 116, 139, 0.1)", drawBorder: true }
        },
        y: { 
            ticks: { color: "rgb(156 163 175)" },
            grid: { color: "rgba(100, 116, 139, 0.1)", drawBorder: true }
        }
    }
};

// Career Tips Data (New Feature)
const careerTips = [
    { title: "Research is Key", icon: Search, text: "Always know the average compensation range for your role and location before entering negotiations." },
    { title: "Highlight Impact", icon: Zap, text: "Focus your pitch on the quantifiable impact you've had, not just your duties." },
    { title: "Beyond Base Salary", icon: DollarSign, text: "Evaluate the entire package: stock options, bonuses, healthcare, and flexible work arrangements." },
    { title: "Continuous Learning", icon: Code, text: "Salaries for roles requiring specialized, in-demand skills (AI/ML, DevOps) are often higher." },
];


// ----  dummy data  ----
const salaryDb = [
  { company: "Google", role: "SWE", industry: "Tech", yoe: 0, loc: "India", base: 22, stock: 15, bonus: 3 },
  { company: "Google", role: "SWE", industry: "Tech", yoe: 2, loc: "India", base: 32, stock: 20, bonus: 5 },
  { company: "Amazon", role: "SDE-1", industry: "E-commerce", yoe: 1, loc: "India", base: 18, stock: 12, bonus: 2 },
  { company: "Amazon", role: "SDE-2", industry: "E-commerce", yoe: 3, loc: "India", base: 28, stock: 18, bonus: 4 },
  { company: "Microsoft", role: "SWE", industry: "Tech", yoe: 1, loc: "India", base: 20, stock: 10, bonus: 3 },
  { company: "Microsoft", role: "SWE", industry: "Tech", yoe: 4, loc: "India", base: 35, stock: 18, bonus: 6 },
  { company: "JP Morgan", role: "Analyst", industry: "Finance", yoe: 1, loc: "USA", base: 100, stock: 10, bonus: 15 },
  { company: "Google", role: "SWE", industry: "Tech", yoe: 0, loc: "USA", base: 120, stock: 80, bonus: 20 },
  { company: "Google", role: "SWE", industry: "Tech", yoe: 3, loc: "USA", base: 160, stock: 120, bonus: 30 },
  { company: "Amazon", role: "SDE-1", industry: "E-commerce", yoe: 1, loc: "USA", base: 110, stock: 70, bonus: 18 },
  { company: "Amazon", role: "SDE-2", industry: "E-commerce", yoe: 4, loc: "USA", base: 150, stock: 110, bonus: 28 },
  { company: "Meta", role: "SWE", industry: "Social Media", yoe: 2, loc: "USA", base: 140, stock: 100, bonus: 25 },
];

const SalaryInsights = () => {
  const [filters, setFilters] = useState({ company: "", role: "", yoe: "", loc: "", industry: "" });
  const chartRef = useRef(null);
  
  // Custom filter for YOE to handle ranges
  const filterByYoe = (record) => {
    if (!filters.yoe) return true;
    const yoeFilter = parseInt(filters.yoe, 10);
    // Simple logic: returns true if record's YOE is >= filter YOE
    return record.yoe >= yoeFilter;
  };

  // ----  filter logic  ----
  const filtered = useMemo(() => {
    return salaryDb.filter((r) =>
      // Check all string/exact filters
      ['company', 'role', 'loc', 'industry'].every((k) => 
        !filters[k] || r[k].toString().toLowerCase().includes(filters[k].toLowerCase())
      ) && filterByYoe(r) // Apply YOE filter separately
    );
  }, [filters]);

  // ----  computed stats  ----
  const stats = useMemo(() => {
    if (!filtered.length) return null;
    const tc = filtered.map((r) => r.base + r.stock + r.bonus);
    
    // Determine the unit dynamically
    const unit = filtered.some(r => r.loc.toLowerCase().includes('india')) ? 'LPA' : 'k USD';
    const unitSymbol = unit === 'LPA' ? 'L' : 'K';

    const sortedTc = [...tc].sort((a, b) => a - b);
    const medianIndex = Math.floor(sortedTc.length / 2);
    const medianValue = sortedTc.length % 2 === 0 
        ? (sortedTc[medianIndex - 1] + sortedTc[medianIndex]) / 2 
        : sortedTc[medianIndex];

    // Note: formatValue returns a string with the unit symbol appended (e.g., "150.0K")
    const formatValue = (value) => value.toFixed(1) + unitSymbol;

    return {
      avg: formatValue(tc.reduce((a, b) => a + b, 0) / tc.length),
      median: formatValue(medianValue),
      min: formatValue(Math.min(...tc)),
      max: formatValue(Math.max(...tc)),
      unit: unit,
      count: filtered.length
    };
  }, [filtered, filters.loc]);

  // ----  chart data - Grouped by Role for Bar Chart  ----
  const barChartData = useMemo(() => {
    const grouped = filtered.reduce((acc, r) => {
        const key = r.role;
        if (!acc[key]) {
            acc[key] = { base: [], stock: [], bonus: [] };
        }
        acc[key].base.push(r.base);
        acc[key].stock.push(r.stock);
        acc[key].bonus.push(r.bonus);
        return acc;
    }, {});

    const labels = Object.keys(grouped);
    const getAvg = (arr) => arr.length > 0 ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : 0;

    return {
      labels: labels,
      datasets: [
        {
          label: "Avg Base",
          data: labels.map(l => getAvg(grouped[l].base)),
          backgroundColor: "rgba(16, 185, 129, 0.9)", // Emerald
          borderRadius: 6,
        },
        {
          label: "Avg Stock",
          data: labels.map(l => getAvg(grouped[l].stock)),
          backgroundColor: "rgba(59, 130, 246, 0.8)", // Blue
          borderRadius: 6,
        },
        {
          label: "Avg Bonus",
          data: labels.map(l => getAvg(grouped[l].bonus)),
          backgroundColor: "rgba(251, 191, 36, 0.9)", // Amber/Yellow
          borderRadius: 6,
        },
      ],
    };
  }, [filtered]);

  // ----  chart data - Salary Distribution (Pie Chart)  ----
  const pieChartData = useMemo(() => {
      const industryCounts = filtered.reduce((acc, r) => {
          acc[r.industry] = (acc[r.industry] || 0) + 1;
          return acc;
      }, {});

      const labels = Object.keys(industryCounts);
      const data = labels.map(l => industryCounts[l]);
      
      const backgroundColors = [
        'rgba(16, 185, 129, 0.8)', // Emerald
        'rgba(59, 130, 246, 0.8)', // Blue
        'rgba(251, 191, 36, 0.8)', // Amber
        'rgba(244, 63, 94, 0.8)', // Rose
        'rgba(147, 51, 234, 0.8)', // Violet
        'rgba(6, 182, 212, 0.8)' // Cyan
      ];

      return {
          labels: labels,
          datasets: [{
              data: data,
              backgroundColor: backgroundColors.slice(0, labels.length),
              hoverBackgroundColor: backgroundColors.map(c => c.replace('0.8', '1')),
              borderColor: '#0f172a', // slate-900 border
              borderWidth: 2,
          }]
      };
  }, [filtered]);

  // ----  chart data - Salary Growth over Experience (Line Chart)  ----
  const lineData = useMemo(() => {
    const grouped = filtered.reduce((acc, r) => {
        const totalComp = r.base + r.stock + r.bonus;
        const key = r.yoe;
        if (!acc[key]) {
            acc[key] = { tc: [], count: 0 };
        }
        acc[key].tc.push(totalComp);
        acc[key].count++;
        return acc;
    }, {});

    // Get sorted years of experience (labels)
    const labels = Object.keys(grouped).map(Number).sort((a, b) => a - b);

    // Calculate average TC for each YOE
    const data = labels.map(yoe => {
        const group = grouped[yoe];
        // Calculate average TC for this YOE group
        return (group.tc.reduce((a, b) => a + b, 0) / group.count).toFixed(1);
    });

    return {
      labels: labels,
      datasets: [
        {
          label: `Avg Total Comp (${stats?.unit || 'Units'})`,
          data: data,
          borderColor: "rgb(251, 191, 36)", // Amber
          backgroundColor: "rgba(251, 191, 36, 0.5)",
          pointBackgroundColor: "rgb(251, 191, 36)",
          pointBorderColor: "#fff",
          tension: 0.3,
          borderWidth: 3,
        },
      ],
    };
  }, [filtered, stats]);
  // ------------------------------------------------------------------

  // ----  PDF export  ----
  const downloadPDF = async () => {
    if (typeof html2canvas === 'undefined' || typeof jsPDF === 'undefined') {
        console.error("PDF libraries (html2canvas, jsPDF) are not available globally. Cannot export.");
        return;
    }

    const ele = chartRef.current;
    if (!ele) return;

    const canvas = await html2canvas(ele, { 
        scale: 2,
        backgroundColor: "#0f172a" 
    }); 
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4"); 
    const w = 210;
    const h = (canvas.height * w) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, w, h);
    pdf.save("Salary-Insights-Report.pdf");
  };

  // --- Filter Input Component for reusability ---
  const FilterInput = ({ icon: Icon, k, placeholder, type = 'text' }) => (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 w-5 h-5 opacity-70" />
      <input
        type={type}
        value={filters[k]}
        onChange={(e) => setFilters((f) => ({ ...f, [k]: e.target.value }))}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-800/80 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white py-12 px-4 sm:px-6 font-[Inter]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header and Download Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-10 pb-6 border-b border-slate-800">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-green-500">
              Global Compensation Insights
            </h2>
            <p className="text-slate-400 mt-1">Compare earning potential across roles, industries, and experience levels.</p>
          </div>
          <button 
            onClick={downloadPDF} 
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-green-700 text-white font-bold shadow-lg shadow-emerald-600/30 hover:scale-[1.02] active:scale-[0.98] transition-transform"
            title="Download full report as PDF"
          >
            <Download className="w-5 h-5" /> Download Report
          </button>
        </div>


        {/* Salary Overview (Stats Cards) */}
        {stats ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
            {[
              { label: "Data Points", val: stats.count, color: "text-blue-400", Icon: TrendingUp, unit: "Records" },
              { label: "Average TC", val: stats.avg, color: "text-emerald-400", Icon: Sigma, unit: stats.unit },
              { label: "Median TC", val: stats.median, color: "text-yellow-400", Icon: DollarSign, unit: stats.unit },
              { label: "Minimum TC", val: stats.min, color: "text-rose-400", Icon: DollarSign, unit: stats.unit },
              { label: "Maximum TC", val: stats.max, color: "text-cyan-400", Icon: DollarSign, unit: stats.unit },
            ].map((s, index) => {
              // *** FIX: Ensure s.val is a string before calling string methods ***
              const displayValue = String(s.val); 
              // Extract numeric part (e.g., "150.0K" -> "150.0") or ("12" -> "12")
              const numericPart = displayValue.replace(/[A-Za-z]/g, '');
              // Extract unit part (e.g., "150.0K" -> "K") or ("12" -> "Records" from s.unit)
              const unitPart = displayValue.match(/[A-Za-z]+$/) ? displayValue.match(/[A-Za-z]+$/)[0] : s.unit;

              return (
              <div 
                key={s.label} 
                className="p-5 rounded-xl bg-slate-800 border border-slate-700 shadow-xl transition-all hover:border-emerald-500/50 flex flex-col justify-between h-full"
              >
                  <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">{s.label}</span>
                      <s.Icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <div className="flex items-end gap-1">
                      {/* Display the numeric part */}
                      <div className={`text-3xl font-extrabold ${s.color}`}>{numericPart}</div>
                      {/* Display the unit part */}
                      <span className="text-base text-slate-500 mb-0.5">{unitPart}</span>
                  </div>
              </div>
            )})}
          </div>
        ) : (
             <div className="p-10 rounded-2xl bg-slate-800/70 text-center text-slate-400 mb-12 border border-slate-700/50">
                <Search className="w-8 h-8 mx-auto mb-3 text-emerald-500" />
                No data points found matching your current filters.
            </div>
        )}

        {/* Charts Container - Ref used for PDF export (Experience & Skill Impact) */}
        <div ref={chartRef} className="space-y-8 p-6 sm:p-8 rounded-2xl bg-slate-800/70 border border-slate-700 shadow-2xl shadow-slate-900/50">
          <h3 className="text-3xl font-bold text-emerald-300 border-b border-slate-700 pb-4 mb-4">Visual Data Analysis & Trends</h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Bar Chart: Salary by Role/Industry */}
            <div className="lg:col-span-2 p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 h-96">
              <h4 className="text-xl font-semibold mb-4 text-slate-200">Avg Compensation Breakdown by Role ({stats?.unit || 'Units'})</h4>
              <Bar 
                  data={barChartData} 
                  options={{...chartOptions, scales: {...chartOptions.scales, x: {...chartOptions.scales.x, stacked: true}, y: {...chartOptions.scales.y, stacked: true}}}} 
              />
            </div>
            
            {/* Pie Chart: Salary Distribution by Industry */}
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 h-96 flex flex-col items-center">
              <h4 className="text-xl font-semibold mb-4 text-slate-200">Data Point Distribution by Industry</h4>
              <div className="w-full max-w-xs flex-grow flex items-center justify-center">
                <Pie data={pieChartData} options={{...chartOptions, scales: { x: { display: false }, y: { display: false }}}} />
              </div>
            </div>
          </div>


          {/* Line Chart: Salary Growth over Experience */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 h-96">
            <h4 className="text-xl font-semibold mb-4 text-slate-200">Total Compensation vs. Experience Trend (Industry Average)</h4>
            <Line data={lineData} options={{...chartOptions, scales: {...chartOptions.scales, y: {...chartOptions.scales.y, min: 0}}}} />
          </div>
        </div>

        {/* Tips Section (New Feature) */}
        <div className="mt-12">
            <h3 className="text-3xl font-bold text-emerald-300 border-b border-slate-700 pb-4 mb-4">Career & Negotiation Tips</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {careerTips.map((tip, index) => (
                    <div key={index} className="p-6 rounded-xl bg-slate-800/70 border border-slate-700 shadow-lg hover:shadow-emerald-500/20 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <tip.icon className="w-6 h-6 text-emerald-400" />
                            <h4 className="text-lg font-bold text-slate-200">{tip.title}</h4>
                        </div>
                        <p className="text-sm text-slate-400">{tip.text}</p>
                    </div>
                ))}
            </div> 
        </div>
        
        {/* Raw Table (Comparison Feature) */}
        <div className="mt-12 overflow-x-auto rounded-xl border border-slate-700/50 shadow-2xl shadow-slate-950/50">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-700/70 text-slate-300 uppercase tracking-wider sticky top-0">
              <tr>
                <th className="px-5 py-4 text-left whitespace-nowrap">Company</th>
                <th className="px-5 py-4 text-left whitespace-nowrap">Role</th>
                <th className="px-5 py-4 text-left whitespace-nowrap">Industry</th>
                <th className="px-5 py-4 text-left whitespace-nowrap">YoE</th>
                <th className="px-5 py-4 text-left whitespace-nowrap">Location</th>
                <th className="px-5 py-4 text-right whitespace-nowrap">Base</th>
                <th className="px-5 py-4 text-right whitespace-nowrap">Stock</th>
                <th className="px-5 py-4 text-right whitespace-nowrap">Bonus</th>
                <th className="px-5 py-4 text-right whitespace-nowrap">Total Comp ({stats?.unit || 'Units'})</th>
              </tr>
            </thead>
            <tbody className="bg-slate-800/80">
              {filtered.map((r, index) => {
                const total = r.base + r.stock + r.bonus;
                const isEven = index % 2 === 0;
                return (
                  <tr key={`${r.company}-${r.role}-${r.yoe}-${index}`} className={`border-b border-slate-700/50 transition-colors ${isEven ? 'bg-slate-800/70' : 'bg-slate-900/70'} hover:bg-slate-700/50`}>
                    <td className="px-5 py-3 flex items-center gap-2 font-medium text-emerald-300">
                      <img 
                          src={`https://logo.clearbit.com/${r.company.toLowerCase().replace(/\s/g, "")}.com`} 
                          alt={`${r.company} logo`} 
                          className="w-6 h-6 rounded-full" 
                          onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/24x24/10b981/ffffff?text=${r.company.charAt(0)}` }}
                      />
                      {r.company}
                    </td>
                    <td className="px-5 py-3 text-slate-300">{r.role}</td>
                    <td className="px-5 py-3 text-slate-300">{r.industry}</td>
                    <td className="px-5 py-3 text-slate-300">{r.yoe}</td>
                    <td className="px-5 py-3 text-slate-300">{r.loc}</td>
                    <td className="px-5 py-3 text-right text-yellow-300 font-mono">{r.base}</td>
                    <td className="px-5 py-3 text-right text-blue-300 font-mono">{r.stock}</td>
                    <td className="px-5 py-3 text-right text-rose-300 font-mono">{r.bonus}</td>
                    <td className="px-5 py-3 text-right font-extrabold text-emerald-400">{total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer CTA */}
        <div className="mt-16 text-center">
          <p className="text-slate-400 mb-4 text-lg">Help us refine these insights by securely contributing your compensation data.</p>
          <a
            href="/contribute-salary"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-extrabold text-lg shadow-2xl shadow-emerald-700/50 hover:scale-[1.05] transition-all duration-300"
          >
            <DollarSign className="w-6 h-6" /> Securely Contribute Data
          </a>
        </div>
      </div>
    </div>
  );
};

export default SalaryInsights;
 