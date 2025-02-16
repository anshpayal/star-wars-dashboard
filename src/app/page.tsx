"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Ship,
  Search,
  Filter,
  Users,
  ArrowRight,
} from "lucide-react";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm z-50 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <Ship className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Star Wars Fleet
              </span>
            </motion.div>
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white 
                           bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all
                           focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Launch Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white dark:bg-gray-800">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"
        />
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold">
              <span className="text-indigo-600 dark:text-indigo-400">
                Explore the Galaxy&apos;s
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">Finest Ships</span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            >
              Your ultimate dashboard for managing and comparing Star Wars
              starships. Access detailed information, compare specifications,
              and explore the vast fleet.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-10"
            >
              <Link
                href="/dashboard"
                className="inline-flex items-center px-8 py-4 text-base font-medium text-white 
                         bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all
                         focus:outline-none focus:ring-2 focus:ring-indigo-500
                         shadow-lg shadow-indigo-500/30"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white"
          >
            Powerful Features
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 
                          bg-white dark:bg-gray-800 shadow-sm hover:shadow-md
                          transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-900/50 
                              flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Ship className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                Star Wars Fleet
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Built with ❤️ for Star Wars fans
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    title: "Advanced Search",
    description:
      "Quickly find starships by name, model, or manufacturer with our powerful search functionality.",
    icon: <Search className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
  },
  {
    title: "Smart Filtering",
    description:
      "Filter ships by hyperdrive rating, crew size, and more to find exactly what you're looking for.",
    icon: <Filter className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
  },
  {
    title: "Ship Comparison",
    description:
      "Compare multiple starships side by side to analyze their specifications and capabilities.",
    icon: <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
  },
];
