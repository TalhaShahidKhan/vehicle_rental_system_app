import { motion } from "framer-motion";
import { Home, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative mb-8"
      >
        <div className="text-9xl font-extrabold text-indigo-100 dark:text-gray-900 select-none">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Search className="w-24 h-24 text-indigo-600 opacity-20" />
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
      >
        Lost in the Cloud?
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-gray-500 dark:text-gray-400 max-w-md mb-8"
      >
        The page you're looking for seems to have taken a detour. Let's get you
        back on the right track.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Link to="/">
          <Button size="lg" className="rounded-full px-8">
            <Home className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
