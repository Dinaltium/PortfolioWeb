import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Clock, Handshake } from "lucide-react";
import { Link } from "wouter";
import AnimatedSection from "@/components/AnimatedSection";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { fadeInUp, slideInLeft, slideInRight } from "@/lib/animations";

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function Contact() {
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const { toast } = useToast();

  const submitMessageMutation = useMutation({
    mutationFn: async (data: ContactForm) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      setFormData({ name: "", email: "", subject: "", message: "" });
      toast({
        title: "Message Sent!",
        description: "Thank you for your message. We'll get back to you within 24 hours.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    submitMessageMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              <Link href="/">
                <h1 className="text-2xl font-bold gradient-text cursor-pointer">AAF11</h1>
              </Link>
              <div className="hidden md:flex space-x-8">
                <Link href="/shop" className="text-slate-300 hover:text-white transition-colors">SHOP</Link>
                <Link href="/help" className="text-slate-300 hover:text-white transition-colors">GET OUR HELP</Link>
                <Link href="/contact" className="text-white font-semibold">CONTACT US</Link>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Contact Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <AnimatedSection className="text-center mb-16">
          <motion.h2 {...fadeInUp} className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            Get In Touch
          </motion.h2>
          <motion.p {...fadeInUp} className="text-xl text-slate-300 max-w-3xl mx-auto">
            Ready to start your project? Have questions? We'd love to hear from you.
          </motion.p>
        </AnimatedSection>
        
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div {...slideInLeft} className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Mail className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Email Us</h3>
                <p className="text-slate-300">orneryraptor778@gmail.com</p>
                <p className="text-slate-300">mohammedjazeel73@gmail.com</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Clock className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Response Time</h3>
                <p className="text-slate-300">Within 24 hours</p>
                <p className="text-slate-400 text-sm">Usually much faster!</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                <Handshake className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Project Guarantee</h3>
                <p className="text-slate-300">100% completion or full refund</p>
                <p className="text-slate-400 text-sm">Your satisfaction is our priority</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div {...slideInRight}>
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-sm font-semibold text-slate-300 mb-2">Your Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="bg-slate-900/50 border-slate-600 focus:border-blue-500 focus:ring-blue-500 text-white placeholder-slate-400"
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-sm font-semibold text-slate-300 mb-2">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="bg-slate-900/50 border-slate-600 focus:border-blue-500 focus:ring-blue-500 text-white placeholder-slate-400"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="subject" className="text-sm font-semibold text-slate-300 mb-2">Subject</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      className="bg-slate-900/50 border-slate-600 focus:border-blue-500 focus:ring-blue-500 text-white placeholder-slate-400"
                      placeholder="What's this about?"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message" className="text-sm font-semibold text-slate-300 mb-2">Message</Label>
                    <Textarea
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      className="bg-slate-900/50 border-slate-600 focus:border-blue-500 focus:ring-blue-500 text-white placeholder-slate-400 resize-none"
                      placeholder="Tell us about your project or question..."
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={submitMessageMutation.isPending}
                    className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-lg py-4 transition-all duration-300 transform hover:scale-105"
                  >
                    {submitMessageMutation.isPending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
