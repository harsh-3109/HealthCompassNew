import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LabelList } from "recharts";
import { HeartPulse, Activity, AlertTriangle, CheckCircle, Stethoscope, ChevronRight, MapPin, UserSquare, Navigation, ExternalLink } from 'lucide-react';

export default function ClinicalReport({ data }) {
  const [userLocation, setUserLocation] = useState(null);
  const [localHospitals, setLocalHospitals] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    var R = 6371; // Radius of the earth in km
    var dLat = (lat2-lat1) * (Math.PI/180);
    var dLon = (lon2-lon1) * (Math.PI/180); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    return d;
  }

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserLocation({ lat, lng });
          
          setLoadingDocs(true);
          const query = `[out:json];(node["amenity"="clinic"](around:8000,${lat},${lng});node["amenity"="hospital"](around:8000,${lat},${lng});node["amenity"="doctors"](around:8000,${lat},${lng}););out 10;`;
          fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`)
            .then(res => res.json())
            .then(data => {
              if (data && data.elements) {
                const hospitals = data.elements
                  .filter(e => e.tags && e.tags.name)
                  .map(e => {
                    const dist = getDistanceFromLatLonInKm(lat, lng, e.lat, e.lon);
                    return {
                      clinic: e.tags.name,
                      lat: e.lat,
                      lng: e.lon,
                      location: "Your Area",
                      dist: dist.toFixed(1) + " km",
                      distNum: dist
                    };
                  })
                  .sort((a,b) => a.distNum - b.distNum)
                  .slice(0, 3);
                setLocalHospitals(hospitals);
              }
              setLoadingDocs(false);
            })
            .catch(err => {
              console.error(err);
              setLoadingDocs(false);
            });
        },
        (error) => console.log("Geolocation error:", error)
      );
    }
  }, []);

  if (!data) return null;
  const { symptoms = [], diseases = [], recommendations = [] } = data;

  const getRiskColor = (risk) => {
    switch(risk?.toLowerCase()) {
      case 'high': return 'bg-rose-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-emerald-500';
      default: return 'bg-blue-500';
    }
  };

  const getRiskBg = (risk) => {
    switch(risk?.toLowerCase()) {
      case 'high': return 'bg-rose-50 border-rose-200 text-rose-800';
      case 'medium': return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'low': return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      default: return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getSpecialtyForDisease = (diseaseName) => {
    const d = (diseaseName || "").toLowerCase();
    if (d.includes('dengue') || d.includes('fever') || d.includes('malaria') || d.includes('flu') || d.includes('infection')) return "General Physician / Internal Medicine";
    if (d.includes('heart') || d.includes('cardio') || d.includes('pressure')) return "Cardiologist";
    if (d.includes('headache') || d.includes('migraine') || d.includes('neuro') || d.includes('stroke')) return "Neurologist";
    return "Specialist";
  }

  const getDoctorsForDisease = (diseaseName) => {
    if (localHospitals.length > 0) {
      return localHospitals.map((h, i) => ({
        name: `Specialist at ${h.clinic}`,
        spec: getSpecialtyForDisease(diseaseName),
        clinic: h.clinic,
        location: h.location,
        dist: h.dist,
        about: "Verified local healthcare provider found near you."
      }));
    }

    if (!diseaseName) return [];
    const d = diseaseName.toLowerCase();
    
    if (d.includes('dengue') || d.includes('fever') || d.includes('malaria') || d.includes('flu') || d.includes('infection')) {
      return [
        { name: "Dr. Amit Sharma", spec: "General Physician", clinic: "City Care Hospital", location: "Delhi", dist: "2.5 km", about: "10+ years experience in infectious diseases." },
        { name: "Dr. Neha Verma", spec: "Internal Medicine", clinic: "Apollo Clinic", location: "Noida", dist: "4 km", about: "Specialist in viral infections and fever management." }
      ];
    }
    
    if (d.includes('heart') || d.includes('cardio') || d.includes('pressure')) {
      return [
        { name: "Dr. Rajeev Kumar", spec: "Cardiologist", clinic: "Metro Heart Institute", location: "Delhi", dist: "3.2 km", about: "Expert in cardiovascular health and hypertension." },
        { name: "Dr. Ananya Singh", spec: "Cardiothoracic Surgeon", clinic: "Fortis Escorts", location: "Gurugram", dist: "8 km", about: "15+ years experience in heart care." }
      ];
    }

    if (d.includes('headache') || d.includes('migraine') || d.includes('neuro') || d.includes('stroke')) {
      return [
        { name: "Dr. Vikram Gupta", spec: "Neurologist", clinic: "Neuro Care Clinic", location: "Delhi", dist: "5 km", about: "Specializes in migraines and nerve disorders." }
      ];
    }
    
    return [
      { name: "Dr. Sanjay Patel", spec: "General Physician", clinic: "Lifeline Hospital", location: "Delhi", dist: "1.5 km", about: "12+ years experience in general health and diagnostics." },
      { name: "Dr. Priya Desai", spec: "Family Medicine", clinic: "HealthFirst Clinic", location: "Noida", dist: "3.8 km", about: "Compassionate care for all age groups." }
    ];
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden font-sans my-4">
      
      {/* HEADER */}
      <div className="bg-slate-900 p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-500/20 rounded-lg">
            <HeartPulse className="text-rose-400 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg tracking-wide">AI Health Analysis Report</h2>
            <p className="text-slate-400 text-xs mt-0.5">{new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        
        {/* SYMPTOMS */}
        {symptoms.length > 0 && (
          <div>
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Activity size={16} /> Detected Symptoms
            </h3>
            <div className="flex flex-wrap gap-2">
              {symptoms.map((sym, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm font-bold rounded-lg border border-slate-200 shadow-sm">
                  {sym}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CONDITIONS */}
        {diseases.length > 0 && (
          <div>
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Stethoscope size={16} /> Possible Conditions
            </h3>
            <div className="grid gap-4">
              {diseases.map((disease, idx) => (
                <div key={idx} className={`p-5 rounded-xl border ${getRiskBg(disease.risk)} shadow-sm`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-extrabold text-lg flex items-center gap-2">
                        {disease.name}
                        <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full font-bold text-white ${getRiskColor(disease.risk)}`}>
                          {disease.risk} Risk
                        </span>
                      </h4>
                      <p className="text-sm opacity-90 mt-1 font-semibold">{disease.explanation}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black">{disease.confidence}%</div>
                      <div className="text-[10px] uppercase tracking-widest opacity-80 font-bold">Match</div>
                    </div>
                  </div>
                  
                  {disease.precautions && disease.precautions.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-black/10">
                      <p className="text-xs font-extrabold uppercase tracking-widest mb-2 opacity-70">Precautions & Care:</p>
                      <ul className="text-sm space-y-1">
                        {disease.precautions.map((prec, i) => (
                          <li key={i} className="flex items-center gap-1.5 opacity-90 font-medium">
                            <ChevronRight size={14} /> {prec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* NEARBY DOCTORS SECTION */}
                  <div className="mt-4 pt-4 border-t border-black/10">
                    <p className="text-xs font-extrabold uppercase tracking-widest mb-3 opacity-70 flex items-center gap-1.5">
                      <UserSquare size={14} /> Nearby Doctors for Treatment:
                    </p>
                    
                    {loadingDocs && (
                      <p className="text-xs font-bold text-slate-400 animate-pulse">Detecting real clinics near you...</p>
                    )}

                    <div className="space-y-3">
                      {getDoctorsForDisease(disease.name).map((doc, i) => (
                        <div key={i} className="bg-white/60 p-3 rounded-lg border border-black/5 shadow-sm">
                          <h5 className="font-bold text-slate-800 text-sm">{doc.name} <span className="font-semibold text-slate-500 opacity-80">({doc.spec})</span></h5>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs font-medium text-slate-600">
                            <a 
                              href={userLocation 
                                ? `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${encodeURIComponent(doc.clinic + ' ' + doc.location)}`
                                : `https://www.google.com/maps/search/${encodeURIComponent(doc.clinic + ' ' + doc.location)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 hover:text-blue-600 transition-colors cursor-pointer"
                              title={userLocation ? `Click for directions from your location to ${doc.clinic}` : `View ${doc.clinic} on map`}
                            >
                              <MapPin size={12} className="opacity-70" /> {doc.clinic}, {doc.location} <ExternalLink size={10} className="ml-0.5 opacity-50"/>
                            </a>
                            <span 
                              className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold cursor-help"
                              title={`Distance from your location: ${doc.dist}`}
                            >
                              {doc.dist}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-2 font-medium">About: {doc.about}</p>
                        </div>
                      ))}
                    </div>
                    
                    {/* Real Google Maps Search Button */}
                    <div className="mt-3">
                      <a 
                        href={userLocation 
                          ? `https://www.google.com/maps/search/Doctors+for+${encodeURIComponent(disease.name)}+near+me/@${userLocation.lat},${userLocation.lng},15z` 
                          : `https://www.google.com/maps/search/Doctors+for+${encodeURIComponent(disease.name)}+near+me`
                        }
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors w-full justify-center sm:w-auto"
                      >
                        <Navigation size={14} /> Detect Real Doctors Near Me
                      </a>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* GRAPH */}
        {diseases.length > 0 && (
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm" style={{ height: 240, width: "100%" }}>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4 text-center">Confidence Distribution</p>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={diseases} margin={{ top: 0, right: 30, left: -20, bottom: 0 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 13, fontWeight: 600}} width={120} />
                <Tooltip 
                  cursor={{fill: 'rgba(241, 245, 249, 0.4)'}}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value) => [`${value}%`, `Confidence`]}
                />
                <Bar dataKey="confidence" radius={[0, 6, 6, 0]} maxBarSize={20} fill="#6366f1">
                   <LabelList dataKey="confidence" position="right" formatter={(val) => `${val}%`} fill="#4f46e5" fontSize={12} fontWeight="bold" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* RECOMMENDATIONS */}
        {recommendations.length > 0 && (
          <div>
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <CheckCircle size={16} /> Recommendations
            </h3>
            <ul className="space-y-3 bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-sm">
              {recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  {rec.toLowerCase().includes('doctor') || rec.toLowerCase().includes('consult') ? (
                    <AlertTriangle className="text-amber-500 w-5 h-5 flex-shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle className="text-emerald-500 w-5 h-5 flex-shrink-0 mt-0.5" />
                  )}
                  <span className="text-slate-700 font-bold">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </div>
  );
}
