import { motion } from "framer-motion";

function DashboardCard({ title, description, actionText, onClick }) {
    return (
      <motion.div 
        whileHover={{ scale: 1.05, y: -5 }} 
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="bg-white rounded-xl shadow hover:shadow-2xl transition-all duration-300 p-6 flex flex-col border border-gray-100"
      >
        <h3 className="text-xl font-semibold text-blue-700">
          {title}
        </h3>
  
        <p className="mt-3 text-gray-600 flex-grow">
          {description}
        </p>
  
        <button
          onClick={onClick}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition duration-300"
        >
          {actionText}
        </button>
      </motion.div>
    );
  }
  
  export default DashboardCard;