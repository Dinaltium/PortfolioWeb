import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Camera } from "lucide-react";
// QR code image
const qrCodeImage = "/qr-code.png";

interface QRPaymentProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  orderId: string;
  type: "order" | "help";
  onPaymentConfirm: (screenshot: string) => void;
}

export default function QRPayment({ isOpen, onClose, amount, orderId, type, onPaymentConfirm }: QRPaymentProps) {
  const [paymentScreenshot, setPaymentScreenshot] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setPaymentScreenshot(result);
          setFileName(file.name);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please upload an image file');
      }
    }
  };

  const handlePaymentSubmit = () => {
    if (!paymentScreenshot) {
      alert('Please upload a payment screenshot before submitting.');
      return;
    }
    onPaymentConfirm(paymentScreenshot);
    setPaymentScreenshot("");
    setFileName("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-orange-400">Secure Payment</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Amount Display */}
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-400 mb-2">₹{amount}</p>
            <p className="text-sm text-gray-400">
              {type === "help" ? "Refundable deposit for project assistance" : "Payment for order"}
            </p>
          </div>

          {/* QR Code */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-4 rounded-xl mx-auto w-fit"
          >
            <img src={qrCodeImage} alt="Payment QR Code" className="w-56 h-56" />
          </motion.div>
          
          {/* Payment Instructions */}
          <div className="text-center space-y-2">
            <p className="text-gray-300 font-semibold">Payment Instructions:</p>
            <p className="text-sm text-gray-400">1. Scan the QR code with your UPI app</p>
            <p className="text-sm text-gray-400">2. Pay the exact amount: ₹{amount}</p>
            <p className="text-sm text-gray-400">3. Take a screenshot of the payment confirmation</p>
            <p className="text-sm text-gray-400">4. Upload the screenshot below</p>
          </div>

          {/* Screenshot Upload */}
          <div className="space-y-3">
            <Label htmlFor="screenshot" className="text-sm font-semibold text-gray-300">
              Upload Payment Screenshot *
            </Label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="screenshot"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 mb-2"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Screenshot
              </Button>
              {fileName && (
                <p className="text-sm text-green-400 mt-2">✓ {fileName}</p>
              )}
              {!fileName && (
                <p className="text-xs text-gray-500 mt-2">Select an image file (JPG, PNG, etc.)</p>
              )}
            </div>
          </div>

          {/* Preview uploaded screenshot */}
          {paymentScreenshot && (
            <div className="border border-gray-600 rounded-lg p-2">
              <p className="text-sm text-gray-300 mb-2">Screenshot Preview:</p>
              <img 
                src={paymentScreenshot} 
                alt="Payment Screenshot" 
                className="max-h-32 mx-auto rounded"
              />
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button 
              onClick={onClose}
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePaymentSubmit}
              disabled={!paymentScreenshot}
              className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Payment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
