import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, HelpCircle } from "lucide-react";
import { Link } from "wouter";
import QRPayment from "@/components/QRPayment";
import Navigation from "@/components/Navigation";
import AnimatedSection from "@/components/AnimatedSection";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { fadeInUp } from "@/lib/animations";

interface HelpRequestForm {
  name: string;
  usn: string;
  year: string;
  semester: string;
  phone: string;
  email: string;
  projectDetails: string;
  depositAmount: string;
}

export default function Help() {
  const [formData, setFormData] = useState<HelpRequestForm>({
    name: "",
    usn: "",
    year: "",
    semester: "",
    phone: "",
    email: "",
    projectDetails: "",
    depositAmount: "250"
  });
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState("");

  const { toast } = useToast();

  const submitRequestMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/help-requests", data);
      return response.json();
    },
    onSuccess: (request) => {
      setCurrentRequestId(request.id.toString());
      setIsPaymentOpen(true);
      toast({
        title: "Request Submitted!",
        description: "Please complete the payment to confirm your request.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: keyof HelpRequestForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.usn || !formData.year || !formData.semester || !formData.phone || !formData.email || !formData.projectDetails) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(formData.depositAmount) < 200) {
      toast({
        title: "Invalid Deposit Amount",
        description: "Minimum deposit amount is ₹200.",
        variant: "destructive",
      });
      return;
    }

    submitRequestMutation.mutate({
      ...formData,
      depositAmount: parseFloat(formData.depositAmount).toFixed(2)
    });
  };

  const handlePaymentConfirm = (screenshot: string) => {
    // Update the help request with payment screenshot
    // This would normally be done through a mutation but for now we'll just close
    setIsPaymentOpen(false);
    setFormData({
      name: "",
      usn: "",
      year: "",
      semester: "",
      phone: "",
      email: "",
      projectDetails: "",
      depositAmount: "250"
    });
    toast({
      title: "Help Request Submitted!",
      description: "Payment submitted! We'll contact you within 24 hours to discuss your project.",
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navigation />

      {/* Help Request Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <AnimatedSection className="text-center mb-16">
          <motion.h2 
            {...fadeInUp}
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent"
          >
            Request Our Help
          </motion.h2>
          <motion.p {...fadeInUp} className="text-xl text-slate-300 max-w-3xl mx-auto">
            Get professional assistance with your projects. We guarantee completion or full refund.
          </motion.p>
        </AnimatedSection>

        <motion.div {...fadeInUp}>
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-sm font-semibold text-slate-300 mb-2">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="bg-slate-900/50 border-slate-600 focus:border-amber-500 focus:ring-amber-500 text-white placeholder-slate-400"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="usn" className="text-sm font-semibold text-slate-300 mb-2">USN *</Label>
                    <Input
                      id="usn"
                      value={formData.usn}
                      onChange={(e) => handleInputChange("usn", e.target.value)}
                      className="bg-slate-900/50 border-slate-600 focus:border-amber-500 focus:ring-amber-500 text-white placeholder-slate-400"
                      placeholder="University Seat Number"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="year" className="text-sm font-semibold text-slate-300 mb-2">Year *</Label>
                    <Select value={formData.year} onValueChange={(value) => handleInputChange("year", value)}>
                      <SelectTrigger className="bg-slate-900/50 border-slate-600 focus:border-amber-500 focus:ring-amber-500 text-white">
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="1st Year">1st Year</SelectItem>
                        <SelectItem value="2nd Year">2nd Year</SelectItem>
                        <SelectItem value="3rd Year">3rd Year</SelectItem>
                        <SelectItem value="4th Year">4th Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="semester" className="text-sm font-semibold text-slate-300 mb-2">Semester *</Label>
                    <Select value={formData.semester} onValueChange={(value) => handleInputChange("semester", value)}>
                      <SelectTrigger className="bg-slate-900/50 border-slate-600 focus:border-amber-500 focus:ring-amber-500 text-white">
                        <SelectValue placeholder="Select Semester" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="1st Sem">1st Semester</SelectItem>
                        <SelectItem value="2nd Sem">2nd Semester</SelectItem>
                        <SelectItem value="3rd Sem">3rd Semester</SelectItem>
                        <SelectItem value="4th Sem">4th Semester</SelectItem>
                        <SelectItem value="5th Sem">5th Semester</SelectItem>
                        <SelectItem value="6th Sem">6th Semester</SelectItem>
                        <SelectItem value="7th Sem">7th Semester</SelectItem>
                        <SelectItem value="8th Sem">8th Semester</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm font-semibold text-slate-300 mb-2">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="bg-slate-900/50 border-slate-600 focus:border-amber-500 focus:ring-amber-500 text-white placeholder-slate-400"
                      placeholder="+91 XXXXX XXXXX"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-sm font-semibold text-slate-300 mb-2">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="bg-slate-900/50 border-slate-600 focus:border-amber-500 focus:ring-amber-500 text-white placeholder-slate-400"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label htmlFor="projectDetails" className="text-sm font-semibold text-slate-300">Project Details *</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-4 h-4 text-slate-400 hover:text-orange-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-800 border-gray-600 text-white max-w-xs">
                          <p>Please provide detailed information about your project including technology requirements, timeline, specific features needed, and any other relevant details</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Textarea
                    id="projectDetails"
                    rows={5}
                    value={formData.projectDetails}
                    onChange={(e) => handleInputChange("projectDetails", e.target.value)}
                    className="bg-slate-900/50 border-slate-600 focus:border-amber-500 focus:ring-amber-500 text-white placeholder-slate-400 resize-none"
                    placeholder="Describe your project requirements, technology stack, timeline, and any specific needs..."
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label htmlFor="depositAmount" className="text-sm font-semibold text-slate-300">Deposit Amount (₹) *</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-4 h-4 text-slate-400 hover:text-orange-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-800 border-gray-600 text-white max-w-xs">
                          <p>Enter a deposit amount between ₹200-500. This amount is fully refundable if we cannot complete your project to your satisfaction.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="depositAmount"
                    type="number"
                    min="200"
                    max="500"
                    value={formData.depositAmount}
                    onChange={(e) => handleInputChange("depositAmount", e.target.value)}
                    className={`bg-slate-900/50 border-slate-600 focus:border-amber-500 focus:ring-amber-500 text-white placeholder-slate-400 ${
                      parseFloat(formData.depositAmount || "0") < 200 ? "border-red-500" : ""
                    }`}
                    placeholder="Minimum ₹200"
                    required
                  />
                  {parseFloat(formData.depositAmount || "0") < 200 && formData.depositAmount && (
                    <p className="text-red-400 text-sm mt-1">Minimum deposit amount is ₹200</p>
                  )}
                </div>
                
                <Alert className="bg-amber-500/10 border-amber-500/30">
                  <Info className="h-4 w-4 text-amber-500" />
                  <AlertDescription className="text-slate-300">
                    <strong className="text-amber-400">Payment Information:</strong> A minimum deposit of ₹200-300 is required to start your project. 
                    This amount is <strong className="text-amber-400">fully refundable</strong> if we cannot complete your project to your satisfaction. 
                    Payment is processed securely via UPI/QR code.
                  </AlertDescription>
                </Alert>
                
                <Button 
                  type="submit" 
                  disabled={submitRequestMutation.isPending || parseFloat(formData.depositAmount || "0") < 200}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-lg py-4 transition-all duration-300 transform hover:scale-105"
                >
                  {submitRequestMutation.isPending ? "Submitting..." : parseFloat(formData.depositAmount || "0") < 200 ? "Minimum ₹200 required" : "Submit Request & Proceed to Payment"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* QR Payment Modal */}
      <QRPayment
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        amount={parseFloat(formData.depositAmount)}
        orderId={currentRequestId}
        type="help"
        onPaymentConfirm={handlePaymentConfirm}
      />
    </div>
  );
}
