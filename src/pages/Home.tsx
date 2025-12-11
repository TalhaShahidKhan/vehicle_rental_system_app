import { motion } from "framer-motion";
import { ArrowRight, Globe, ShieldCheck, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

export default function Home() {
  const features = [
    {
      icon: <Zap className="h-6 w-6 text-indigo-600" />,
      title: "Instant Booking",
      desc: "Book your ride in seconds with our seamless digital platform.",
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-indigo-600" />,
      title: "Fully Insured",
      desc: "Drive with peace of mind knowing you're fully covered.",
    },
    {
      icon: <Globe className="h-6 w-6 text-indigo-600" />,
      title: "Wide Availability",
      desc: "Pick up your car from hundreds of convenient locations.",
    },
  ];

  return (
    <div className="space-y-24">
      {/* Hero */}
      <section className="relative overflow-hidden pt-10 pb-20 lg:pt-20 lg:pb-28">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white"
            >
              Drive your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Dreams
              </span>{" "}
              today.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl"
            >
              Experience the freedom of the road with RentRide. Premium fleet,
              transparent pricing, and 24/7 support.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex gap-4"
            >
              <Link to="/vehicles">
                <Button size="lg" className="rounded-full px-8">
                  Browse Fleet <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 border-2"
                >
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </div>
          <div className="flex-1 relative">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative z-10"
            >
              <img
                src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop"
                alt="Luxury Car"
                className="rounded-2xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500"
              />
            </motion.div>
            <div className="absolute top-10 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute -bottom-8 -left-8 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why choose RentRide?</h2>
          <p className="text-gray-500">
            We make renting a car as easy as ordering a pizza.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="p-8 rounded-2xl bg-white dark:bg-gray-900 shadow-xl shadow-indigo-100/50 dark:shadow-none border border-gray-100 dark:border-gray-800 hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center mb-6">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-gray-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
