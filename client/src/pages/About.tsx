import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Github, Linkedin, Instagram, FileText, X } from "lucide-react";
import Header from "@/components/Navigation";
import { fadeInUp } from "@/lib/animations";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  intro: string;
  year: string;
  college: string;
  goals: string;
  skills: string[];
  achievements: Array<{
    title: string;
    description: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    tech: string[];
  }>;
  social: {
    github: string;
    linkedin: string;
    instagram: string;
    resume: string;
  };
}

const teamMembers: TeamMember[] = [
  {
    id: "rafan",
    name: "Rafan Ahamad Sheik",
    role: "Student",
    image: "/RafanPic.jpg", // Updated path for production
    intro:
      "Enthusiastic Computer Science undergraduate passionate about building impactful software and hardware-integrated systems",
    year: "Third Year",
    college: "Engineering Student",
    goals:
      "To build technology that makes a meaningful impact and help fellow students succeed in their projects.",
    skills: [
      "React.js",
      "Python",
      "JavaScript",
      "TypeScript",
      "Machine Learning",
    ],
    achievements: [
      {
        title: "20+ Projects Completed",
        description:
          "Successfully delivered projects for students across multiple domains",
      },
      {
        title: "Runner-up at ADC2025 Innovation Challenge",
        description:
          "Awarded for building a machine learning-based screw sorting system using ESP32-CAM and ESP-NOW communication.",
      },
    ],
    projects: [
      {
        name: "Bee Behavior Detection System",
        description:
          "System for monitoring and analyzing bee behavior using computer vision",
        tech: ["Python", "OpenCV", "TensorFlow"],
      },
      {
        name: "Screw Sorting System using Machine Learning on ESP32-CAM",
        description:
          "Comprehensive system for sorting screws based on size and type using machine learning",
        tech: ["ESP32-CAM", "ESP32", "Edge Impulse", "Arduino", "ESP-NOW"],
      },
      {
        name: "Automated Feedback Form Filler",
        description:
          "Created a tool to automate college feedback form submissions using Python and Selenium.",
        tech: ["Python", "Selenium"],
      },
    ],
    social: {
      github: "https://github.com/Dinaltium",
      linkedin: "https://www.linkedin.com/in/rafanahamad/",
      instagram: "https://www.instagram.com/fakedinaltium/",
      resume:
        "https://drive.google.com/file/d/1eZ7ZTQlaI8E2HLdrqNr2usRX5L2GeQYh/view?usp=sharing",
    },
  },
  {
    id: "jazeel",
    name: "T Mohammed Jazeel",
    role: "Student",
    image: "/JazeelPic.jpeg", // Updated path for production
    intro:
      "Dedicated backend developer with expertise in creating scalable and efficient server-side solutions.",
    year: "Third Year",
    college: "Engineering Student",
    goals:
      "To master backend architecture and help students build robust, scalable applications.",
    skills: [
      "Node.js",
      "Python",
      "Express.js",
      "MongoDB",
      "PostgreSQL",
      "AWS",
      "Docker",
    ],
    achievements: [
      {
        title: "Database Optimization Expert",
        description:
          "Specialized in optimizing database performance and queries",
      },
      {
        title: "API Development",
        description: "Built 50+ RESTful APIs for various client projects",
      },
      {
        title: "Cloud Infrastructure",
        description: "Experience with AWS and cloud deployment strategies",
      },
    ],
    projects: [
      {
        name: "Real-time Chat Application",
        description: "Scalable chat app with WebSocket implementation",
        tech: ["Node.js", "Socket.io", "MongoDB", "Redis"],
      },
      {
        name: "Payment Gateway Integration",
        description: "Secure payment processing system for e-commerce",
        tech: ["Node.js", "Stripe API", "PostgreSQL", "Express"],
      },
      {
        name: "Task Management API",
        description: "RESTful API for project and task management",
        tech: ["Python", "FastAPI", "MongoDB", "JWT"],
      },
    ],
    social: {
      github: "https://github.com/jazeeljr",
      linkedin: "https://www.linkedin.com/in/mohammed-jazeel-43111a27b/",
      instagram: "https://www.instagram.com/mohammed_jazeel05/",
      resume:
        "https://drive.google.com/file/d/15kyD-IZwPdjGLeSq5tj5TbWT2e8xZqSS/view?usp=drive_link",
    },
  },
];

export default function About() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

  useEffect(() => {
    if (selectedMember) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedMember]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            {...fadeInUp}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent"
          >
            Get to Know Us
          </motion.h1>
          <motion.p
            {...fadeInUp}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-16"
          >
            Meet the passionate developers behind AAF11 who are dedicated to
            helping students succeed
          </motion.p>
        </div>
      </section>

      {/* Team Photos Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" ref={containerRef}>
        <motion.div style={{ y, opacity }} className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.3 }}
                className="text-center group cursor-pointer"
                onClick={() => setSelectedMember(member)}
              >
                <div className="relative mb-6 mx-auto w-48 h-48 md:w-64 md:h-64">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <img
                    src={member.image}
                    alt={member.name}
                    className="relative w-full h-full object-cover rounded-full border-4 border-orange-500/30 group-hover:border-orange-500/60 transition-all duration-300 transform group-hover:scale-105"
                    onError={(e) => {
                      // Fallback to a placeholder if image fails to load
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${member.name}&size=256&background=f97316&color=000&bold=true`;
                    }}
                  />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-2 group-hover:text-orange-400 transition-colors">
                  {member.name}
                </h3>
                <p className="text-lg text-gray-400 group-hover:text-gray-300 transition-colors">
                  {member.role}
                </p>
                <p className="text-sm text-orange-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to learn more
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Detailed Profile Modal */}
      {selectedMember && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 overflow-y-auto"
        >
          <div className="min-h-screen py-8 px-4">
            <div className="max-w-4xl mx-auto">
              {/* Close Button */}
              <Button
                onClick={() => setSelectedMember(null)}
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 text-white hover:text-orange-400 z-10"
              >
                <X className="w-6 h-6" />
              </Button>

              {/* Profile Content */}
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-8"
              >
                {/* Header */}
                <div className="text-center pt-8">
                  <div className="w-32 h-32 mx-auto mb-6 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full blur-md opacity-50"></div>
                    <img
                      src={selectedMember.image}
                      alt={selectedMember.name}
                      className="relative w-full h-full object-cover rounded-full border-2 border-orange-500/50"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${selectedMember.name}&size=128&background=f97316&color=000&bold=true`;
                      }}
                    />
                  </div>
                  <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                    {selectedMember.name}
                  </h2>
                  <p className="text-xl text-gray-300 mb-4">
                    {selectedMember.role}
                  </p>
                  <p className="text-gray-400 max-w-2xl mx-auto">
                    {selectedMember.intro}
                  </p>
                </div>

                {/* Details Grid */}
                <div className="grid md:grid-cols-2 gap-5">
                  {/* About */}
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-4 text-orange-400">
                        About
                      </h3>
                      <div className="space-y-2 text-gray-300">
                        <p>
                          <span className="text-gray-400">Year:</span>{" "}
                          {selectedMember.year}
                        </p>
                        <p>
                          <span className="text-gray-400">College:</span>{" "}
                          {selectedMember.college}
                        </p>
                        <p>
                          <span className="text-gray-400">Goals:</span>{" "}
                          {selectedMember.goals}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Skills */}
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-4 text-orange-400">
                        Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedMember.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm border border-orange-500/30"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Achievements */}
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-4 text-orange-400">
                        Achievements
                      </h3>
                      <div className="space-y-4">
                        {selectedMember.achievements.map(
                          (achievement, index) => (
                            <div key={index}>
                              <h4 className="font-semibold text-gray-200">
                                {achievement.title}
                              </h4>
                              <p className="text-gray-400 text-sm">
                                {achievement.description}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Projects */}
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-4 text-orange-400">
                        Notable Projects
                      </h3>
                      <div className="space-y-4">
                        {selectedMember.projects.map((project, index) => (
                          <div key={index}>
                            <h4 className="font-semibold text-gray-200">
                              {project.name}
                            </h4>
                            <p className="text-gray-400 text-sm mb-2">
                              {project.description}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {project.tech.map((tech, techIndex) => (
                                <span
                                  key={techIndex}
                                  className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Social Links */}
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4 text-orange-400">
                    Connect
                  </h3>
                  <div className="flex justify-center space-x-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-300 hover:text-black"
                      onClick={() =>
                        window.open(selectedMember.social.github, "_blank")
                      }
                    >
                      <Github className="w-5 h-5 mr-2" />
                      GitHub
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-300 hover:text-black"
                      onClick={() =>
                        window.open(selectedMember.social.linkedin, "_blank")
                      }
                    >
                      <Linkedin className="w-5 h-5 mr-2" />
                      LinkedIn
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-300 hover:text-black"
                      onClick={() =>
                        window.open(selectedMember.social.instagram, "_blank")
                      }
                    >
                      <Instagram className="w-5 h-5 mr-2" />
                      Instagram
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-300 hover:text-black"
                      onClick={() =>
                        window.open(selectedMember.social.resume, "_blank")
                      }
                    >
                      <FileText className="w-5 h-5 mr-2" />
                      Resume
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
