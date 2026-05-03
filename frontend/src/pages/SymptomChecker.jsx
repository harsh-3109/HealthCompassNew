import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Stethoscope, AlertTriangle, Info, Shield, CheckCircle, Search, Sparkles, ArrowLeft, Image as ImageIcon, UploadCloud, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import config from "../config";

export default function SymptomChecker() {
  const [allSymptoms, setAllSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch all valid symptoms on mount
  useEffect(() => {
    fetch(`${config.API_URL}/api/symptoms-list`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAllSymptoms(data);
        } else {
          setErrorMsg("Data error: Symptoms fetched but is not an array format.");
        }
      })
      .catch(err => {
        console.error("Failed to load symptoms", err);
        setErrorMsg("System offline: Could not connect to Node.js backend. Are you sure it is running?");
      });
  }, []);

  const handleCheck = async () => {
    setErrorMsg("");
    setResult(null);

    if (selectedSymptoms.length === 0) return setErrorMsg("Please select at least one exact symptom.");
    let payload = { symptoms: selectedSymptoms };

    setLoading(true);

    try {
      const res = await fetch(`${config.API_URL}/api/ai/symptom-check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      
      if (!res.ok) {
        setErrorMsg(data.message || "Diagnostic Server Error");
      } else if (data.message) {
        setErrorMsg(data.message);
      } else {
        setResult(data);
        
        // Award points for symptom analysis
        if (user) {
          fetch(`${config.API_URL}/api/rewards`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uid: user.uid, type: "symptom_check", symptoms: selectedSymptoms })
          }).catch(console.error);
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Neural link failed. Is the AI backend fully spooled up?");
    }

    setLoading(false);
  };

  const toggleSymptom = (s) => {
    if (selectedSymptoms.includes(s)) {
      setSelectedSymptoms(selectedSymptoms.filter(item => item !== s));
    } else {
      setSelectedSymptoms([...selectedSymptoms, s]);
    }
  };

  const filteredSymptoms = allSymptoms.filter(s => 
    s.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 15);

  const getColor = (type) => {
    if (type === "Rule-Based") return "#f43f5e"; // rose
    if (type === "NLP") return "#10b981"; // emerald
    return "#3b82f6"; // blue
  };



  return (
    <div className="w-full relative">
      <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">
        
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-slate-500 hover:text-blue-600 font-semibold mb-8 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
        </button>

        {/* HEADER */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm shadow-blue-200/50 rotate-3"
          >
            <Activity className="h-10 w-10 text-blue-600 -rotate-3" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">AI Clinical Assistant</h1>
          <p className="mt-4 text-lg text-slate-600 font-medium max-w-2xl mx-auto">
            Leverage our advanced contextual engine to identify possible conditions instantly.
          </p>
        </div>

        <div className="glass-panel overflow-hidden border border-white/60 mb-10">
          <div className="p-8 md:p-10">
            
            <AnimatePresence mode="wait">
                <motion.div
                  key="manual"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-slate-400" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Search clinical symptoms..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 font-medium shadow-sm transition-all"
                    />
                  </div>

                  {/* Options */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {filteredSymptoms.map(s => (
                      <button
                        key={s}
                        onClick={() => toggleSymptom(s)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedSymptoms.includes(s) ? 'bg-indigo-500 text-white shadow-md shadow-indigo-200' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm'}`}
                      >
                        {s.replace(/_/g, " ")}
                      </button>
                    ))}
                  </div>

                  {/* Selected Tags */}
                  {selectedSymptoms.length > 0 && (
                     <motion.div 
                       initial={{ opacity: 0, height: 0 }} 
                       animate={{ opacity: 1, height: 'auto' }} 
                       className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100"
                     >
                       <p className="text-xs font-bold text-indigo-800 mb-3 uppercase tracking-wider flex items-center gap-2">
                         <CheckCircle size={14} /> Selected Payload ({selectedSymptoms.length})
                       </p>
                       <div className="flex flex-wrap gap-2">
                         {selectedSymptoms.map(s => (
                           <span key={s} className="px-3 py-1.5 bg-white border border-indigo-200 text-indigo-700 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 group cursor-pointer hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-colors" onClick={() => toggleSymptom(s)}>
                             {s.replace(/_/g, " ")} 
                             <span className="text-indigo-400 group-hover:text-red-500">×</span>
                           </span>
                         ))}
                       </div>
                     </motion.div>
                  )}

                </motion.div>
            </AnimatePresence>

            {errorMsg && (
               <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl flex items-center gap-3 font-semibold shadow-sm">
                 <AlertTriangle size={20} className="text-rose-500" /> {errorMsg}
               </motion.div>
            )}

            <button 
              onClick={handleCheck} 
              disabled={loading}
              className={`w-full mt-8 py-4 px-6 rounded-2xl text-lg font-bold text-white transition-all ${loading ? 'bg-slate-400 cursor-not-allowed hidden-pulse' : 'bg-slate-900 hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-200 focus:ring-4 focus:ring-blue-100 hover:-translate-y-1'}`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing via Neural Engine...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles size={20} /> Generate AI Diagnosis
                </span>
              )}
            </button>

          </div>
        </div>

        {/* RESULTS SECTION */}
        <AnimatePresence>
          {result && !errorMsg && (
            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ type: "spring", damping: 25, stiffness: 200 }}
               className="space-y-6"
            >
              {/* Primary Assessment Banner */}
              <div className="bg-white rounded-3xl shadow-xl border-0 overflow-hidden relative group">
                <div className={`absolute top-0 left-0 w-2 h-full ${result.risk === 'High' ? 'bg-rose-500' : 'bg-indigo-500'}`}></div>
                <div className="absolute -right-10 -top-10 opacity-5 transition-transform group-hover:scale-110 duration-700 pointer-events-none">
                  <Stethoscope size={200} />
                </div>
                
                <div className="p-8 md:p-10 pl-12 relative z-10">
                   <h2 className="text-sm font-bold text-slate-400 tracking-widest uppercase mb-3">Primary Assessment</h2>
                   <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                     {result.final_prediction}
                   </h3>
                   
                   <div className="flex flex-wrap items-center gap-3">
                      <span className={`px-4 py-2 rounded-xl text-sm font-bold shadow-sm flex items-center gap-2 border ${result.risk === 'High' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                         <AlertTriangle size={16} /> Severity Risk: {result.risk}
                      </span>
                      {result.symptoms_detected && result.symptoms_detected.length > 0 && (
                        <span className="px-4 py-2 rounded-xl text-sm font-bold bg-slate-50 text-slate-600 border border-slate-200">
                          Identified {result.symptoms_detected.length} Symptoms
                        </span>
                      )}
                      
                      {/* We show exact match type based on logic */}
                      {result.graph_data && (
                         <span className="px-4 py-2 rounded-xl text-sm font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-2">
                           <Activity size={16} /> 
                           Matched via {result.graph_data[result.graph_data.length - 1].type}
                         </span>
                      )}
                      
                      {result.image_analysis && (
                        <span className="px-4 py-2 rounded-xl text-sm font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-2">
                          <ImageIcon size={16} /> Image Analyzed
                        </span>
                      )}
                   </div>
                </div>
              </div>

              {/* Image Analysis Results */}
              {result.image_analysis && (
                 <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="glass-panel p-8 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                        <ImageIcon size={28} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-slate-900 mb-1">Radiology & Vision Report</h4>
                        <p className="text-blue-600 font-bold mb-4">Detected Scan Type: {result.image_analysis.scan_type}</p>
                        
                        <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm">
                          <h5 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">AI Findings</h5>
                          <p className="text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">
                            {result.image_analysis.findings}
                          </p>
                        </div>
                      </div>
                    </div>
                 </motion.div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                 {/* Description */}
                 <div className="glass-panel p-8">
                    <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                      <div className="bg-blue-100 p-1.5 rounded-lg text-blue-600"><Info size={18} /></div> Clinical Details
                    </h4>
                    <p className="text-slate-600 font-medium leading-relaxed">
                      {result.description || "No extensive clinical details available for this condition. Please consult a board-certified doctor."}
                    </p>
                 </div>

                 {/* Precautions */}
                 {result.precautions?.length > 0 && (
                   <div className="glass-panel p-8">
                      <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                        <div className="bg-emerald-100 p-1.5 rounded-lg text-emerald-600"><Shield size={18} /></div> Recommended Protocol
                      </h4>
                      <ul className="space-y-3">
                        {result.precautions.map((p, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center text-xs font-bold">{i+1}</span>
                            <span className="text-slate-700 font-medium capitalize pt-0.5">{p}</span>
                          </li>
                        ))}
                      </ul>
                   </div>
                 )}
              </div>

              {/* Confidence Graph */}
              {result.graph_data && result.graph_data.length > 0 && (
                <div className="glass-panel p-8">
                  <h4 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                     <Activity size={20} className="text-slate-400" /> Vector Confidence Analysis
                  </h4>
                  
                  {/* Legend */}
                  <div className="flex flex-wrap gap-4 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 font-semibold text-sm text-slate-600"><div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"></div> Rule-Based</div>
                    <div className="flex items-center gap-2 font-semibold text-sm text-slate-600"><div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div> Machine Learning</div>
                    <div className="flex items-center gap-2 font-semibold text-sm text-slate-600"><div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div> NLP Context</div>
                  </div>

                  <div style={{ width: "100%", height: 350 }}>
                    <ResponsiveContainer>
                      <BarChart data={result.graph_data} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="disease" tick={{fill: '#64748b', fontSize: 13, fontWeight: 600, fontFamily: 'Outfit'}} tickMargin={16} />
                        <YAxis tick={{fill: '#64748b', fontSize: 12, fontWeight: 600, fontFamily: 'Outfit'}} tickFormatter={(val) => `${(val*100).toFixed(0)}%`} domain={[0, 1]} />
                        <Tooltip 
                           cursor={{fill: 'rgba(241, 245, 249, 0.5)'}}
                           contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', padding: '16px', fontFamily: 'Outfit' }}
                           itemStyle={{ fontWeight: 'bold' }}
                           formatter={(value, name, props) => [`${(value*100).toFixed(1)}%`, `Engine: ${props.payload.type}`]}
                        />
                        <Bar 
                           dataKey="confidence" 
                           radius={[8, 8, 0, 0]} 
                           maxBarSize={70}
                           animationDuration={1500}
                        >
                          {result.graph_data.map((entry, index) => (
                            <Cell key={index} fill={getColor(entry.type)} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}