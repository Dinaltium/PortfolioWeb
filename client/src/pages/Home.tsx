import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Code, Cpu, HandHeart } from "lucide-react";
import { Link } from "wouter";
import AnimatedSection from "@/components/AnimatedSection";
import Header from "@/components/Navigation";
import {
  fadeInUp,
  staggerContainer,
  floatingAnimation,
} from "@/lib/animations";
import { useRef, useEffect, useState } from "react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const cursorX = useTransform(() => mousePosition.x);
  const cursorY = useTransform(() => mousePosition.y);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-black text-white overflow-hidden"
    >
      <Header />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-orange-900/20 to-yellow-900/20"
          style={{ y: yBg, opacity }}
        />

        {/* Interactive floating elements */}
        <motion.div
          className="absolute w-20 h-20 bg-orange-500/10 rounded-full"
          style={{
            x: useTransform(cursorX, [0, window.innerWidth], [20, 100]),
            y: useTransform(cursorY, [0, window.innerHeight], [20, 80]),
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-32 h-32 bg-yellow-500/10 rounded-full"
          style={{
            x: useTransform(cursorX, [0, window.innerWidth], [200, 300]),
            y: useTransform(cursorY, [0, window.innerHeight], [100, 200]),
          }}
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div {...fadeInUp}>
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 gradient-text"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Edging to our customers
              <br />
              <span className="text-4xl md:text-6xl">with our services</span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Submit your queries to get our help or buy parts from our website. Don't worry as we will edge you until you are satisfied.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Link href="/shop">
                <Button className="btn-primary glow-animation">
                  Shop
                </Button>
              </Link>
              <Link href="/help">
                <Button className="btn-secondary">Need our Help?</Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Team Introduction */}
          <motion.div
            className="mt-16 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeInUp}>
              <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700 hover:border-orange-500/50 transition-all duration-300 card-hover">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-semibold mb-2 text-orange-400">
                    Rafan Ahamad Sheik
                  </h3>
                  <p className="text-gray-300">
                    2nd Year CS
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700 hover:border-yellow-500/50 transition-all duration-300 card-hover">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-semibold mb-2 text-yellow-400">
                    T Mohammed Jazeel
                  </h3>
                  <p className="text-gray-300">
                    2nd Year CS
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-2xl text-slate-400">↓</div>
        </motion.div>
      </section>

      {/* Services Section */}
      <AnimatedSection className="py-20 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              Our Services
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Comprehensive solutions for students and professionals seeking
              excellence in technology and project development.
            </p>
          </div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeInUp}>
              <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700 hover:border-orange-500/50 transition-all duration-300 card-hover h-full">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6">
                    <Code className="text-2xl text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">
                    Web Development
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Custom web applications, responsive design, and modern
                    frontend/backend solutions tailored to your needs.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700 hover:border-yellow-500/50 transition-all duration-300 card-hover h-full">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-6">
                    <Cpu className="text-2xl text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">
                    Electronics Store
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Quality electronic components for students and
                    professionals. Affordable prices with reliable products.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700 hover:border-amber-500/50 transition-all duration-300 card-hover h-full">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mb-6">
                    <HandHeart className="text-2xl text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">
                    Project Assistance
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Professional guidance and hands-on help for your academic
                    and personal projects with guaranteed completion.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold gradient-text mb-4">AAF11</h3>
              <p className="text-gray-300 leading-relaxed max-w-md">
                Professional freelance services, electronic components, and
                project assistance for students and professionals.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/shop"
                    className="hover:text-orange-400 transition-colors duration-300"
                  >
                    Shop
                  </Link>
                </li>
                <li>
                  <Link
                    href="/help"
                    className="hover:text-orange-400 transition-colors duration-300"
                  >
                    Get Our Help
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-orange-400 transition-colors duration-300"
                  >
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Web Development</li>
                <li>Electronics Store</li>
                <li>Project Assistance</li>
                <li>Technical Consulting</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 AAF11. All rights reserved. Created by Rafan Ahamad Sheik &
              T Mohammed Jazeel
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
