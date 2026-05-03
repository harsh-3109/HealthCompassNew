import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Trophy, Star, ArrowLeft, History, Gift, Lock, CheckCircle2, AlertTriangle, Droplets, Shirt, Watch, Briefcase, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import config from "../config";

function Rewards() {
  const { user } = useAuth();
  const [totalPoints, setTotalPoints] = useState(0);
  const [rewards, setRewards] = useState([]);
  const navigate = useNavigate();

  // Redemption State
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({ fullName: "", phoneNumber: "", email: "", address: "", city: "", state: "", pinCode: "", landmark: "" });
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchRewards = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${config.API_URL}/api/rewards/${user.uid}`);
      const data = await res.json();
      setRewards(data.rewards);
      setTotalPoints(data.totalPoints);
    } catch (error) {
      console.error("Failed to fetch rewards", error);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, [user]);

  const handleRedeem = async (e) => {
    e.preventDefault();
    if (formData.phoneNumber.length !== 10) return setFormError("Phone number must be exactly 10 digits");
    if (formData.pinCode.length !== 6) return setFormError("PIN Code must be exactly 6 digits");
    setFormError("");
    setIsSubmitting(true);

    try {
      const res = await fetch(`${config.API_URL}/api/rewards/redeem`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          itemName: selectedItem.name,
          itemPoints: selectedItem.points,
          shippingDetails: formData
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      
      setSuccessMsg("Your reward request has been successfully placed. It will be delivered soon.");
      setTotalPoints(prev => prev - selectedItem.points);
      fetchRewards();
      setTimeout(() => {
        setSuccessMsg("");
        setSelectedItem(null);
        setFormData({ fullName: "", phoneNumber: "", email: "", address: "", city: "", state: "", pinCode: "", landmark: "" });
      }, 4000);
    } catch (err) {
      setFormError(err.message || "Failed to place order.");
    }
    setIsSubmitting(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300 } }
  };

  const catalog = [
    { id: 1, name: "HealthCompass Fitness Band", points: 5000, image: "/rewards/fitness_band.png" },
    { id: 2, name: "HealthCompass T-Shirt (Premium)", points: 2000, image: "/rewards/premium_tshirt.png" },
    { id: 3, name: "HealthCompass Gym Bag", points: 1500, image: "/rewards/gym_bag.png" },
    { id: 4, name: "HealthCompass Water Bottle", points: 800, image: "/rewards/water_bottle.png" },
  ];

  return (
    <div className="w-full relative">

      <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-slate-500 hover:text-purple-600 font-semibold mb-8 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
        </button>

        <div className="glass-panel p-8 md:p-12 mb-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500"></div>
          
          <motion.div 
            initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
            className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-100 to-fuchsia-100 rounded-full flex items-center justify-center mb-6 shadow-inner"
          >
            <Trophy className="w-12 h-12 text-purple-600" />
          </motion.div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
            Your Health Rewards
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto mb-10">
            Every step you take and every symptom you monitor adds up. Keep maintaining healthy habits to earn more points!
          </p>

          {/* Glowing Total Points */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white px-12 py-8 rounded-3xl border border-purple-100 shadow-xl">
              <p className="text-sm font-bold tracking-widest text-purple-500 uppercase mb-2">Total Balance</p>
              <div className="flex items-center justify-center gap-3">
                <Star className="w-10 h-10 text-yellow-500 fill-yellow-500" />
                <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-700 to-pink-600">
                  {totalPoints}
                </span>
                <span className="text-2xl font-bold text-slate-400 self-end mb-2">pts</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Rewards Catalog */}
        <div className="glass-panel p-8 md:p-10 mb-10">
          <div className="flex items-center gap-3 mb-8">
            <Gift className="text-purple-500 w-6 h-6" />
            <h2 className="text-2xl font-bold text-slate-900">Premium Rewards Catalog</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {catalog.map((item) => {
              const progress = Math.min((totalPoints / item.points) * 100, 100);
              const unlocked = totalPoints >= item.points;

              return (
                <motion.div 
                  key={item.id}
                  whileHover={{ y: -5 }}
                  className={`relative overflow-hidden bg-white border rounded-3xl p-6 shadow-sm transition-all ${unlocked ? 'border-emerald-200 ring-2 ring-emerald-500/20' : 'border-slate-200 opacity-90'}`}
                >
                  {unlocked ? (
                    <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-700 p-1.5 rounded-full shadow-md z-10">
                      <CheckCircle2 size={18} />
                    </div>
                  ) : (
                    <div className="absolute top-4 right-4 bg-slate-100/80 backdrop-blur-sm text-slate-500 p-1.5 rounded-full shadow-md z-10">
                      <Lock size={18} />
                    </div>
                  )}

                  <div className="w-full h-40 rounded-2xl flex items-center justify-center mb-5 border border-slate-100 shadow-inner overflow-hidden relative group bg-slate-50">
                     <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 mix-blend-multiply" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 mb-1">{item.name}</h3>
                  <div className="flex items-center gap-1.5 text-slate-500 font-semibold mb-6">
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                    <span>{item.points} pts required</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-bold">
                      <span className={unlocked ? "text-emerald-600" : "text-slate-500"}>
                        {unlocked ? 'Unlocked!' : `${Math.floor(progress)}% Complete`}
                      </span>
                      <span className="text-slate-400">{totalPoints} / {item.points}</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className={`h-full rounded-full ${unlocked ? 'bg-emerald-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'}`}
                      />
                    </div>
                  </div>
                  
                  {unlocked && (
                    <button 
                      onClick={() => setSelectedItem(item)}
                      className="w-full mt-6 bg-slate-900 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
                    >
                      <Gift size={18} /> Claim Reward
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* History Section */}
        <div className="glass-panel p-8 md:p-10">
          <div className="flex items-center gap-3 mb-8">
            <History className="text-purple-500 w-6 h-6" />
            <h2 className="text-2xl font-bold text-slate-900">Earning History</h2>
          </div>

          {rewards.length === 0 ? (
            <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-300">
              <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No rewards earned yet. Go take some steps!</p>
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              {rewards.map((item) => (
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.01, x: 4 }}
                  key={item._id}
                  className="bg-white border border-slate-100 rounded-2xl p-5 flex sm:flex-row flex-col sm:items-center justify-between shadow-sm hover:shadow-md transition-all gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-50 text-purple-600 p-3 rounded-xl mt-1 sm:mt-0">
                      <Star className="w-5 h-5 fill-purple-200" />
                    </div>
                    <div>
                      <p className="text-slate-900 font-bold text-lg">
                        {item.reason}
                      </p>
                      <p className="text-sm text-slate-500 mt-1 font-medium">
                        {new Date(item.createdAt).toLocaleDateString('en-US', { 
                          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-xl text-center self-start sm:self-auto border ${item.points > 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                    <span className={`font-extrabold text-xl ${item.points > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {item.points > 0 ? '+' : ''}{item.points}
                    </span>
                    <span className={`font-bold ml-1 text-sm ${item.points > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>pts</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Redemption Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]"
          >
            <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl"><Gift size={20} /></div>
                <div>
                  <h3 className="font-bold text-slate-900 leading-tight">Claim Reward</h3>
                  <p className="text-sm font-semibold text-slate-500">{selectedItem.name}</p>
                </div>
              </div>
              <button onClick={() => setSelectedItem(null)} className="text-slate-400 hover:text-slate-600 p-2 bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
              {successMsg ? (
                <div className="py-8 text-center flex flex-col items-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                    <CheckCircle2 size={64} className="text-emerald-500 mb-4" />
                  </motion.div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Order Confirmed!</h4>
                  <p className="text-slate-600 font-medium">{successMsg}</p>
                </div>
              ) : (
                <form onSubmit={handleRedeem} className="space-y-4">
                  <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl mb-6">
                    <p className="text-sm text-blue-800 font-semibold flex justify-between">
                      <span>Points to deduct:</span>
                      <span className="font-bold">{selectedItem.points} pts</span>
                    </p>
                  </div>
                  
                  {formError && <p className="text-rose-500 text-sm font-bold bg-rose-50 p-3 rounded-xl">{formError}</p>}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                      <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-medium transition-all" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</label>
                      <input required type="tel" maxLength="10" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-medium transition-all" value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value.replace(/\D/g, '')})} />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</label>
                      <input required type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-medium transition-all" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Address</label>
                      <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-medium transition-all" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">City</label>
                      <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-medium transition-all" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">State</label>
                      <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-medium transition-all" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">PIN Code</label>
                      <input required type="text" maxLength="6" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-medium transition-all" value={formData.pinCode} onChange={e => setFormData({...formData, pinCode: e.target.value.replace(/\D/g, '')})} />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Landmark (Opt)</label>
                      <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-medium transition-all" value={formData.landmark} onChange={e => setFormData({...formData, landmark: e.target.value})} />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full mt-8 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-bold py-3.5 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? "Processing..." : "Confirm & Place Order"}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Rewards;
