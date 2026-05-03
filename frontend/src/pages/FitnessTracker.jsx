import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { motion } from "framer-motion";
import { Activity, Flame, ShieldCheck, ArrowLeft, Calendar, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import config from "../config";

export default function FitnessTracker() {
  const [steps, setSteps] = useState(0);
  const [stepWindow, setStepWindow] = useState(0);
  const [view, setView] = useState("daily"); // daily | weekly
  const [weeklyData, setWeeklyData] = useState([]);
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  /* ---------------- SENSOR FILTERING ---------------- */
  const lastFiltered = useRef(0);
  const lastStepTime = useRef(0);

  /* ---------------- CHART ---------------- */
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const calories = Math.round(steps * 0.04);
  const score = Math.min(Math.round((steps / 10000) * 100), 100);

  /* ================= STEP DETECTION (DAILY) ================= */
  useEffect(() => {
    const alpha = 0.85;
    const THRESHOLD = 1.2;
    const DEBOUNCE = 350;

    const onMotion = (e) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc) return;

      const magnitude = Math.sqrt(
        acc.x * acc.x + acc.y * acc.y + acc.z * acc.z
      );

      const filtered =
        alpha * magnitude + (1 - alpha) * lastFiltered.current;

      const diff = Math.abs(filtered - lastFiltered.current);
      const now = Date.now();

      if (diff > THRESHOLD && now - lastStepTime.current > DEBOUNCE) {
        setSteps((s) => s + 1);
        setStepWindow((w) => w + 1);
        lastStepTime.current = now;
      }

      lastFiltered.current = filtered;
    };

    if (
      typeof DeviceMotionEvent !== "undefined" &&
      typeof DeviceMotionEvent.requestPermission === "function"
    ) {
      DeviceMotionEvent.requestPermission().then((res) => {
        if (res === "granted") {
          window.addEventListener("devicemotion", onMotion);
        }
      });
    } else {
      window.addEventListener("devicemotion", onMotion);
    }

    return () => window.removeEventListener("devicemotion", onMotion);
  }, []);

  /* -------- RESET STEP WINDOW EVERY SECOND -------- */
  useEffect(() => {
    const t = setInterval(() => setStepWindow(0), 1000);
    return () => clearInterval(t);
  }, []);

  /* ================= FETCH WEEKLY REAL DATA ================= */
  useEffect(() => {
    if (view !== "weekly") return;

    fetch(`${config.API_URL}/api/fitness/weekly/demo-user`)
      .then((res) => res.json())
      .then((data) => setWeeklyData(data))
      .catch(console.error);
  }, [view]);

  /* ================= GRAPH ================= */
  useEffect(() => {
    if (!chartInstance.current) {
      chartInstance.current = new Chart(chartRef.current, {
        type: "line",
        data: {
          labels: [],
          datasets: [
            {
              label: "Steps",
              data: [],
              borderColor: "#10b981", // Emerald 500
              borderWidth: 4,
              tension: 0.4,
              yAxisID: "ySteps",
              pointRadius: 0,
              pointHoverRadius: 6,
            },
            {
              label: "Calories",
              data: [],
              borderColor: "#f59e0b", // Amber 500
              backgroundColor: "rgba(245, 158, 11, 0.15)",
              fill: true,
              borderWidth: 2,
              tension: 0.4,
              yAxisID: "yCalories",
              pointRadius: 0,
              pointHoverRadius: 6,
            }
          ]
        },
        options: {
          animation: { duration: 0 },
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: { 
              position: "top",
              labels: { font: { family: "'Outfit', sans-serif", weight: 'bold' }, usePointStyle: true, boxWidth: 8 }
            },
            tooltip: {
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              titleFont: { family: "'Outfit', sans-serif", size: 14 },
              bodyFont: { family: "'Outfit', sans-serif", size: 13 },
              padding: 12,
              cornerRadius: 8,
              displayColors: true
            }
          },
          scales: {
            x: { 
              display: view === "weekly",
              grid: { display: false },
              ticks: { font: { family: "'Outfit', sans-serif", weight: '500' } }
            },
            ySteps: {
              position: "left",
              beginAtZero: true,
              grid: { color: '#f1f5f9', drawBorder: false },
              ticks: { font: { family: "'Outfit', sans-serif" } },
              title: { display: true, text: "Steps", font: { weight: 'bold' } }
            },
            yCalories: {
              position: "right",
              beginAtZero: true,
              grid: { drawOnChartArea: false },
              ticks: { font: { family: "'Outfit', sans-serif" } },
              title: { display: true, text: "Calories (kcal)", font: { weight: 'bold' } }
            }
          }
        }
      });
    }

    const chart = chartInstance.current;

    /* ===== DAILY (EXISTING LOGIC) ===== */
    if (view === "daily") {
      chart.options.scales.x.display = false;
      chart.data.labels.push("");
      chart.data.datasets[0].data.push(stepWindow);
      chart.data.datasets[1].data.push(+(stepWindow * 0.04).toFixed(2));

      if (chart.data.labels.length > 30) {
        chart.data.labels.shift();
        chart.data.datasets.forEach((d) => d.data.shift());
      }
    }

    /* ===== WEEKLY (REAL BACKEND DATA) ===== */
    if (view === "weekly" && weeklyData.length) {
      chart.options.scales.x.display = true;
      chart.data.labels = weeklyData.map((d) =>
        new Date(d.date).toLocaleDateString("en-US", { weekday: "short" })
      );

      chart.data.datasets[0].data = weeklyData.map((d) => d.steps);
      chart.data.datasets[1].data = weeklyData.map((d) => d.calories);
    }

    chart.update();
  }, [stepWindow, view, weeklyData]);

  /* ================= SAVE ================= */
  const saveFitness = async () => {
    await fetch(`${config.API_URL}/api/fitness/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "demo-user",
        steps,
        calories,
        score
      })
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="w-full relative">

      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-slate-500 hover:text-emerald-600 font-semibold mb-8 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Fitness Tracker</h1>
            <p className="text-slate-600 font-medium mt-2 text-lg">Real-time activity tracking powered by device sensors.</p>
          </div>

          {/* DAILY / WEEKLY TOGGLE */}
          <div className="bg-white p-1.5 rounded-xl shadow-sm border border-slate-200 inline-flex">
            <button
              onClick={() => setView("daily")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold transition-all ${view === "daily" ? "bg-emerald-500 text-white shadow-md" : "text-slate-600 hover:bg-slate-50"}`}
            >
              <Clock size={18} /> Live Monitor
            </button>
            <button
              onClick={() => setView("weekly")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold transition-all ${view === "weekly" ? "bg-emerald-500 text-white shadow-md" : "text-slate-600 hover:bg-slate-50"}`}
            >
              <Calendar size={18} /> Weekly Base
            </button>
          </div>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card title="Total Steps" value={steps} icon={<Activity />} gradient="from-emerald-500 to-teal-600" />
          <Card title="Calories Burned" value={`${calories} kcal`} icon={<Flame />} gradient="from-amber-500 to-orange-600" />
          <Card title="Activity Score" value={`${score}%`} icon={<ShieldCheck />} gradient="from-blue-500 to-indigo-600" />
        </div>

        {/* GRAPH */}
        <div className="glass-panel p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">Activity Analytics</h3>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-wider rounded-lg border border-emerald-100">
              {view === "daily" ? "Live Stream" : "Aggregated Data"}
            </span>
          </div>
          <div className="w-full h-80 relative">
            <canvas ref={chartRef}></canvas>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <button 
            onClick={saveFitness}
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 hover:bg-slate-800 transition-all focus:ring-4 focus:ring-slate-300"
          >
            Save Session Activity
          </button>

          {saved && (
            <motion.p 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="text-emerald-600 font-bold bg-emerald-50 px-6 py-3 rounded-xl border border-emerald-100"
            >
              ✔ Activity successfully synced to database
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= METRIC CARD ================= */
function Card({ title, value, icon, gradient }) {
  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative overflow-hidden rounded-3xl p-8 text-white shadow-lg bg-gradient-to-br ${gradient}`}
    >
      {/* Decorative background element */}
      <div className="absolute -right-6 -top-6 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
      
      <div className="flex items-center gap-3 mb-6 opacity-90">
        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
          {icon}
        </div>
        <h3 className="text-lg font-bold tracking-wide">{title}</h3>
      </div>
      <p className="text-5xl font-black tracking-tight">{value}</p>
    </motion.div>
  );
}