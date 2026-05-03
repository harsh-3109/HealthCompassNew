import { Heart, Activity, TrendingUp, Award, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div className="w-full relative">
      <div className="relative z-10">
        {/* ================= HEADER ================= */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white/70 backdrop-blur-md border-b border-white/50 sticky top-0 z-50 shadow-sm"
        >
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl shadow-md">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-indigo-800">
                HealthCompass
              </span>
            </div>

            <div className="hidden md:flex items-center gap-10 text-slate-600 font-semibold">
              <span className="hover:text-blue-600 transition-colors cursor-pointer">Features</span>
              <span className="hover:text-blue-600 transition-colors cursor-pointer">About</span>
              <span className="hover:text-blue-600 transition-colors cursor-pointer">Contact</span>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/login" className="text-slate-600 font-bold hover:text-blue-600 transition-colors hidden sm:block">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary flex items-center gap-2 py-2.5 px-5">
                Get Started <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </motion.header>

        {/* ================= HERO ================= */}
        <section className="max-w-5xl mx-auto px-6 pt-32 pb-40 text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-medium mb-8 shadow-sm"
          >
            <Sparkles size={16} />
            <span>The future of personal health</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl md:text-7xl font-extrabold text-slate-900 leading-tight tracking-tight"
          >
            Your AI-Powered <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              Health Companion
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-8 text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-medium"
          >
            Track your fitness seamlessly, analyze symptoms with clinical-grade AI, and earn exciting rewards for maintaining healthy habits.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/register" className="btn-primary text-lg w-full sm:w-auto">
              Start Your Journey Free
            </Link>
            <Link to="/login" className="px-8 py-3 rounded-xl font-bold text-slate-700 bg-white border border-slate-200 shadow-sm hover:shadow-md hover:bg-slate-50 transition-all w-full sm:w-auto">
              View Live Demo
            </Link>
          </motion.div>
        </section>

        {/* ================= FEATURES ================= */}
        <section className="max-w-6xl mx-auto px-6 pb-40">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
            >
              <Link to="/login" className="glass-card p-10 block group hover:-translate-y-2 transition-all duration-300">
                <div className="bg-gradient-to-br from-blue-100 to-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  <Activity className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">AI Symptom Checker</h3>
                <p className="text-slate-600 leading-relaxed">
                  Analyze your symptoms in real-time. Our semantic medical context engine accurately maps complex conversational symptoms to possible conditions.
                </p>
              </Link>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Link to="/login" className="glass-card p-10 block group hover:-translate-y-2 transition-all duration-300">
                <div className="bg-gradient-to-br from-emerald-100 to-emerald-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Fitness Tracker</h3>
                <p className="text-slate-600 leading-relaxed">
                  Monitor your daily steps and calorie burn automatically using your device's motion sensors. View beautifully charted weekly analytics.
                </p>
              </Link>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link to="/login" className="glass-card p-10 block group hover:-translate-y-2 transition-all duration-300">
                <div className="bg-gradient-to-br from-purple-100 to-purple-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  <Award className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Rewards Program</h3>
                <p className="text-slate-600 leading-relaxed">
                  Consistency deserves recognition. Earn digital reward points directly to your account by maintaining healthy dietary and fitness habits.
                </p>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <footer className="bg-white/80 backdrop-blur-md border-t border-slate-200/60 mt-auto relative z-10">
          <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold text-slate-900">HealthCompass</span>
            </div>
            <p className="text-slate-500 font-medium">© {new Date().getFullYear()} HealthCompass. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
