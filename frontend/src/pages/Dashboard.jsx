import { Heart, Activity, TrendingUp, Award, LogOut, ChevronRight, MessageSquare } from "lucide-react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { motion } from "framer-motion";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="w-full relative">
      {/* HEADER */}
      <header className="bg-white/70 backdrop-blur-md border-b border-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate("/")}>
             <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl shadow-sm">
                <Heart className="w-6 h-6 text-white" />
             </div>
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              HealthCompass
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <span className="text-slate-600 font-semibold hidden sm:block">
              {user?.displayName || "Demo User"}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Welcome */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-2">Overview</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {user?.displayName ? user.displayName.split(" ")[0] : "User"} 👋
          </h1>
          <p className="text-slate-600 mt-3 text-lg">
            Choose a module below to monitor and improve your health.
          </p>
        </motion.div>

        {/* DASHBOARD CARDS */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {/* AI ChatGPT Assistant */}
          <motion.div
             variants={itemVariants}
             whileHover={{ y: -8, scale: 1.02 }}
             whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/assistant")}
            className="glass-card p-8 cursor-pointer group flex flex-col h-full relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 opacity-50"></div>
            <div className="p-4 w-fit rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 mb-6 shadow-lg shadow-indigo-200">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Health Assistant</h3>
            <p className="text-slate-600 mb-8 flex-grow leading-relaxed">
              Describe your symptoms in natural language and get conversational AI insights powered by our deep medical knowledge base.
            </p>
            <div className="flex items-center text-indigo-600 font-bold mt-auto group-hover:translate-x-2 transition-transform">
              Launch Assistant <ChevronRight size={20} className="ml-1" />
            </div>
          </motion.div>
          {/* Symptom Checker */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/symptom")}
            className="glass-card p-8 cursor-pointer group flex flex-col h-full relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 opacity-50"></div>
            <div className="p-4 w-fit rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-6 shadow-lg shadow-blue-200">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">AI Symptom Checker</h3>
            <p className="text-slate-600 mb-8 flex-grow leading-relaxed">
              Analyze your physical symptoms using our semantic clinical AI model and get instant risk assessments.
            </p>
            <div className="flex items-center text-blue-600 font-bold mt-auto group-hover:translate-x-2 transition-transform">
              Launch Module <ChevronRight size={20} className="ml-1" />
            </div>
          </motion.div>

          {/* Fitness Tracker */}
          <motion.div
             variants={itemVariants}
             whileHover={{ y: -8, scale: 1.02 }}
             whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/fitness")}
            className="glass-card p-8 cursor-pointer group flex flex-col h-full relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 opacity-50"></div>
            <div className="p-4 w-fit rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 mb-6 shadow-lg shadow-emerald-200">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Fitness Tracker</h3>
            <p className="text-slate-600 mb-8 flex-grow leading-relaxed">
              Track daily steps natively via motion sensors. Monitor calories burned and view your weekly health trends.
            </p>
            <div className="flex items-center text-emerald-600 font-bold mt-auto group-hover:translate-x-2 transition-transform">
              Launch Module <ChevronRight size={20} className="ml-1" />
            </div>
          </motion.div>

          {/* Rewards */}
          <motion.div
             variants={itemVariants}
             whileHover={{ y: -8, scale: 1.02 }}
             whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/rewards")}
            className="glass-card p-8 cursor-pointer group flex flex-col h-full relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 opacity-50"></div>
            <div className="p-4 w-fit rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-600 mb-6 shadow-lg shadow-purple-200">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Health Rewards</h3>
            <p className="text-slate-600 mb-8 flex-grow leading-relaxed">
              Consistency pays off. Earn loyalty points for taking care of your body and view your achievement history.
            </p>
            <div className="flex items-center text-purple-600 font-bold mt-auto group-hover:translate-x-2 transition-transform">
              Launch Module <ChevronRight size={20} className="ml-1" />
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
