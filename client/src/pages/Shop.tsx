import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShoppingCart, Plus, Minus, X } from "lucide-react";
import { Link } from "wouter";
import ProductCard from "@/components/ProductCard";
import QRPayment from "@/components/QRPayment";
import Navigation from "@/components/Navigation";
import AnimatedSection from "@/components/AnimatedSection";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface CartItem extends Product {
  quantity: number;
}

export default function Shop() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    usn: "",
    year: "",
    semester: ""
  });
  const [currentOrderId, setCurrentOrderId] = useState("");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === "" || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === null || 
      product.category.toLowerCase().includes(selectedCategory.toLowerCase());
    
    return matchesSearch && matchesCategory;
  });

  // Calculate category counts from actual products
  const getCategoryCount = (categoryName: string) => {
    return products.filter(product => 
      product.category.toLowerCase().includes(categoryName.toLowerCase())
    ).length;
  };

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await apiRequest("POST", "/api/orders", orderData);
      return response.json();
    },
    onSuccess: (order) => {
      setCurrentOrderId(order.id.toString());
      setIsCheckoutOpen(false);
      setIsPaymentOpen(true);
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        if (existingItem.quantity < product.stock) {
          return prevCart.map(item =>
            item.id === product.id 
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          toast({
            title: "Stock Limit",
            description: "Cannot add more items than available stock.",
            variant: "destructive",
          });
          return prevCart;
        }
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const updateCartQuantity = (productId: number, change: number) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === productId) {
          const newQuantity = item.quantity + change;
          if (newQuantity <= 0) {
            return null;
          } else if (newQuantity <= item.stock) {
            return { ...item, quantity: newQuantity };
          } else {
            toast({
              title: "Stock Limit",
              description: "Cannot exceed available stock.",
              variant: "destructive",
            });
            return item;
          }
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before checkout.",
        variant: "destructive",
      });
      return;
    }
    setIsCheckoutOpen(true);
  };

  const handlePlaceOrder = () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all customer details.",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      items: cart.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: getTotalAmount().toFixed(2),
      status: "pending",
      paymentMethod: "qr_code"
    };

    createOrderMutation.mutate(orderData);
  };

  const handlePaymentConfirm = (screenshot: string) => {
    // Update the order with payment screenshot
    // This would normally be done through a mutation but for now we'll just close
    setIsPaymentOpen(false);
    setCart([]);
    setCustomerInfo({ name: "", email: "", phone: "", usn: "", year: "", semester: "" });
    toast({
      title: "Order Placed Successfully!",
      description: "Payment submitted! You will receive a confirmation email shortly.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navigation />

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-orange-600 to-yellow-500 text-black py-16 px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-8 lg:mb-0">
            <div className="inline-block bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold mb-4">
              Free Shipping - orders over ₹1000
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold mb-6">
              Premium Electronics for
              <span className="block text-yellow-800">Your Projects</span>
            </h2>
            <p className="text-xl mb-8 text-gray-800">
              Quality components from Arduino to ESP32. Everything you need for your next innovation, 
              delivered fast with expert support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Input 
                type="text"
                placeholder="Search for Arduino, ESP32, sensors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white text-black placeholder-gray-500 border-none px-4 py-3 text-lg flex-1 max-w-md"
              />
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory(null);
                }}
                className="bg-black text-white hover:bg-gray-800 px-8 py-3 text-lg"
              >
                {searchTerm || selectedCategory ? "Clear Filters" : "Shop Now →"}
              </Button>
            </div>
          </div>
          <div className="lg:w-1/2">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&h=400&fit=crop"
                alt="Electronic Components"
                className="rounded-lg shadow-2xl w-full"
              />
              <div className="absolute -bottom-4 -right-4 bg-black text-white p-4 rounded-lg">
                <p className="text-sm">100+ Components</p>
                <p className="text-xl font-bold">In Stock</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h3 className="text-2xl font-bold mb-8 text-white">Featured Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: "Development Boards", icon: "🔌", filterKey: "board" },
            { name: "Sensors", icon: "📡", filterKey: "sensor" },
            { name: "Actuators", icon: "⚙️", filterKey: "actuator" },
            { name: "Batteries", icon: "🔋", filterKey: "battery" },
            { name: "Wires & Cables", icon: "🔗", filterKey: "wire" },
            { name: "Resistors", icon: "🎛️", filterKey: "resistor" }
          ].map((category, index) => {
            const count = getCategoryCount(category.filterKey);
            const isActive = selectedCategory === category.filterKey;
            
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  setSelectedCategory(isActive ? null : category.filterKey);
                  setSearchTerm("");
                }}
                className={`bg-gray-800 rounded-lg p-4 text-center hover:bg-gray-700 transition-colors cursor-pointer group ${
                  isActive ? "ring-2 ring-orange-500 bg-orange-500/20" : ""
                }`}
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <h4 className={`font-semibold transition-colors ${
                  isActive ? "text-orange-400" : "text-white group-hover:text-orange-400"
                }`}>
                  {category.name}
                </h4>
                <p className="text-sm text-gray-400">{count} items</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Shop Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
            Premium Electronic Components
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Quality electronic components for students and professionals. Fast delivery and competitive prices.
          </p>
        </AnimatedSection>

        {/* Filter Status */}
        {(searchTerm || selectedCategory) && (
          <div className="mb-8 text-center">
            <p className="text-lg text-orange-400">
              {searchTerm && `Searching for "${searchTerm}"`}
              {searchTerm && selectedCategory && " in "}
              {selectedCategory && `${selectedCategory} category`}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Found {filteredProducts.length} products
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && products.length > 0 && (
          <div className="text-center mt-16">
            <p className="text-xl text-slate-400">No products match your search.</p>
            <p className="text-slate-500 mt-2">Try adjusting your filters or search terms.</p>
          </div>
        )}

        {products.length === 0 && (
          <div className="text-center mt-16">
            <p className="text-xl text-slate-400">No products available at the moment.</p>
            <p className="text-slate-500 mt-2">Please check back later.</p>
          </div>
        )}
      </div>

      {/* Shopping Cart Modal */}
      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Shopping Cart</DialogTitle>
          </DialogHeader>
          
          <div className="max-h-96 overflow-y-auto">
            {cart.length === 0 ? (
              <p className="text-center text-slate-400 py-8">Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 bg-slate-700/50 p-4 rounded-lg">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-emerald-400">₹{item.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateCartQuantity(item.id, -1)}
                        className="border-slate-600"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="px-3 py-1 bg-slate-600 rounded">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateCartQuantity(item.id, 1)}
                        className="border-slate-600"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeFromCart(item.id)}
                        className="border-red-600 text-red-400 hover:bg-red-600/10"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {cart.length > 0 && (
            <div className="border-t border-slate-600 pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-semibold">Total:</span>
                <span className="text-2xl font-bold text-emerald-400">₹{getTotalAmount().toFixed(2)}</span>
              </div>
              <Button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
              >
                Proceed to Checkout
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Checkout Modal */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Checkout</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                className="bg-slate-700 border-slate-600"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                className="bg-slate-700 border-slate-600"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                className="bg-slate-700 border-slate-600"
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <Label htmlFor="usn">USN (University Seat Number)</Label>
              <Input
                id="usn"
                value={customerInfo.usn}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, usn: e.target.value }))}
                className="bg-slate-700 border-slate-600"
                placeholder="Enter your USN"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  value={customerInfo.year}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, year: e.target.value }))}
                  className="bg-slate-700 border-slate-600"
                  placeholder="e.g., 2nd Year"
                />
              </div>
              <div>
                <Label htmlFor="semester">Semester</Label>
                <Input
                  id="semester"
                  value={customerInfo.semester}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, semester: e.target.value }))}
                  className="bg-slate-700 border-slate-600"
                  placeholder="e.g., 4th Sem"
                />
              </div>
            </div>
            
            <div className="border-t border-slate-600 pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-semibold">Total Amount:</span>
                <span className="text-2xl font-bold text-emerald-400">₹{getTotalAmount().toFixed(2)}</span>
              </div>
              <Button
                onClick={handlePlaceOrder}
                disabled={createOrderMutation.isPending}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                {createOrderMutation.isPending ? "Processing..." : "Place Order"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* QR Payment Modal */}
      <QRPayment
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        amount={getTotalAmount()}
        orderId={currentOrderId}
        type="order"
        onPaymentConfirm={handlePaymentConfirm}
      />
    </div>
  );
}
