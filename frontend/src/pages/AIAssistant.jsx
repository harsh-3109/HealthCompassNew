import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Heart, User, Sparkles, Loader2, ChevronLeft, ImagePlus, X, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ClinicalReport from '../components/ClinicalReport';
import config from "../config";

export default function AIAssistant() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hello! I am your AI Medical Assistant from HealthCompass. Please describe your symptoms in detail, and I'll find relevant health information for you." }
  ]);
  const [inputData, setInputData] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!inputData.trim() && !imageBase64) return;

    const userMessage = inputData.trim();
    // Add user message to UI (with image indicator if attached)
    setMessages(prev => [...prev, { 
       role: "user", 
       content: userMessage, 
       image: imagePreview 
    }]);
    
    setInputData("");
    const payloadImage = imageBase64; // Store locally before clearing state
    setImageBase64("");
    setImagePreview(null);
    setIsLoading(true);

    try {
      const response = await axios.post(`${config.API_URL}/api/chat`, { 
         query: userMessage,
         image: payloadImage
      });
      
      let rawResponse = response.data.response;
      let reportData = null;
      
      // Try to extract JSON payload
      const jsonMatch = rawResponse.match(/```json\s*([\s\S]*?)\s*```/) || rawResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
         try {
            reportData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
            rawResponse = rawResponse.replace(/```json\s*([\s\S]*?)\s*```/, '').trim();
         } catch(e) { console.error("Could not parse report data", e); }
      }
      
      setMessages(prev => [...prev, { role: "bot", content: rawResponse, report: reportData }]);

      // Post reward for AI consultation
      if (user) {
        axios.post(`${config.API_URL}/api/rewards`, {
          uid: user.uid,
          type: "ai_consultation",
          symptoms: reportData?.symptoms || []
        }).catch(err => console.error("Failed to log reward", err));
      }
      
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: "bot", 
        content: "⚠️ I'm having trouble connecting to the AI brain. Please ensure the backend services are running." 
      }]);
    }

    setIsLoading(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) return alert("Image size exceeds 10MB limit.");
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(URL.createObjectURL(file));
        setImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full flex flex-col relative flex-1 h-[100vh] py-6 px-4 md:px-8 bg-cover bg-center bg-fixed bg-no-repeat" style={{ backgroundImage: "url('/bg-doctor.png')" }}>
      {/* OVERLAY */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-0 pointer-events-none"></div>

      {/* HEADER */}
      <header className="max-w-5xl w-full mx-auto bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-3xl z-50 mb-6 flex items-center px-6 py-4 relative">
        <button onClick={() => navigate("/dashboard")} className="p-2.5 mr-4 bg-white border border-slate-200 shadow-sm text-slate-600 rounded-xl hover:bg-slate-50 transition hover:-translate-x-1 duration-300">
          <ChevronLeft size={20} />
        </button>
        <div className="flex items-center space-x-4">
           <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-blue-200/50">
              <Sparkles className="w-6 h-6 text-white" />
           </div>
          <div>
             <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">HealthCompass AI</h1>
             <p className="text-sm text-slate-500 font-semibold">Symptom & Medical Knowledge Assistant</p>
          </div>
        </div>
      </header>

      {/* CHAT CONTAINER */}
      <main className="flex-1 max-w-5xl w-full mx-auto flex flex-col relative z-10 glass-panel overflow-hidden mb-2">
        
        {/* MESSAGES AREA */}
        <div className="flex-1 overflow-y-auto space-y-6 pb-6 pt-6 px-4 md:px-8 scrollbar-hide bg-slate-50/30">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex items-end max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                
                {/* AVATAR */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md border-2 border-white 
                  ${message.role === "user" ? "ml-3 bg-slate-100 text-slate-600" : "mr-3 bg-gradient-to-br from-blue-500 to-indigo-600 text-white"}`}>
                  {message.role === "user" ? <User size={18} /> : <Heart size={18} className="animate-[pulse_3s_ease-in-out_infinite]" />}
                </div>

                {/* MESSAGE BUBBLE */}
                <div className={`p-5 rounded-[1.5rem] shadow-sm border ${
                  message.role === "user" 
                    ? "bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-br-sm border-indigo-400/50 shadow-indigo-200/50" 
                    : "glass-card bg-white/95 text-slate-800 rounded-bl-sm border-white/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
                }`}>
                  {message.image && (
                    <img src={message.image} alt="User Upload" className="max-w-xs rounded-xl mb-3 border border-white/20 shadow-sm" />
                  )}
                  {message.content && message.content.length > 0 && !message.report && (
                    <div className={`prose ${message.role === "user" ? "prose-invert" : "prose-slate"} max-w-none text-[15px] md:text-base prose-p:leading-relaxed prose-headings:font-bold prose-a:text-blue-500`}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  )}
                  {message.report && (
                    <div className="mt-2 w-full flex justify-center">
                      <ClinicalReport data={message.report} />
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          ))}
          
          {/* LOADING INDICATOR */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex items-end max-w-[85%] flex-row">
                <div className="mr-3 flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-sm">
                  <Heart size={16} />
                </div>
                <div className="px-5 py-4 rounded-2xl glass-card bg-white rounded-bl-none flex items-center space-x-2 text-slate-500 text-sm italic border border-slate-100 shadow-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                  <span>Analyzing symptoms...</span>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={scrollRef}></div>
        </div>

        {/* INPUT AREA */}
        <div className="w-full p-4 bg-white/40 backdrop-blur-md border-t border-white/60">
            
            {/* Image Preview Thumbnail */}
            {imagePreview && (
              <div className="mb-3 relative inline-block">
                <div className="bg-white p-1.5 rounded-2xl shadow-md border border-slate-200">
                  <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded-xl" />
                  <button 
                    onClick={() => { setImagePreview(null); setImageBase64(""); }}
                    className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 shadow-sm hover:bg-rose-600 transition"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            )}

            <div className="p-2 glass-panel bg-white/95 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-slate-200/80">
              <form onSubmit={handleSend} className="flex flex-row items-center relative">
                
                <label className="p-3 text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors bg-slate-50 hover:bg-indigo-50 rounded-xl ml-1">
                  <ImagePlus size={22} />
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isLoading} />
                </label>

                <input
                  type="text"
                  value={inputData}
                  onChange={(e) => setInputData(e.target.value)}
                  placeholder={imagePreview ? "Add a message about this image..." : "E.g. I have severe headache and high fever since yesterday..."}
                  className="flex-1 bg-transparent px-4 py-3 text-slate-800 focus:outline-none placeholder-slate-400 font-medium text-base"
                  disabled={isLoading}
                />
                
                <button
                  type="submit"
                  disabled={isLoading || (!inputData.trim() && !imageBase64)}
                  className="p-3 ml-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-md hover:shadow-[0_4px_15px_rgba(79,70,229,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 hover:-translate-y-0.5"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
            <p className="text-center text-[11px] text-slate-400 mt-3 font-semibold tracking-wide uppercase">⚠️ AI assistant, not a doctor. Consult a medical professional for serious conditions.</p>
        </div>

      </main>
    </div>
  );
}
