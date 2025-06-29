import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:border-orange-500/50 transition-all duration-300 overflow-hidden group">
        <div className="relative">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.stock < 5 && product.stock > 0 && (
            <Badge className="absolute top-2 right-2 bg-amber-500 text-amber-900">
              Low Stock
            </Badge>
          )}
          {product.stock === 0 && (
            <Badge className="absolute top-2 right-2 bg-red-500 text-white">
              Out of Stock
            </Badge>
          )}
          {product.stock >= 5 && (
            <Badge className="absolute top-2 right-2 bg-green-500 text-white">
              In Stock
            </Badge>
          )}
        </div>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-orange-400 transition-colors">{product.name}</h3>
          <p className="text-gray-400 text-sm mb-4">{product.description}</p>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-gray-500">Stock Available</p>
              <p className="text-sm font-semibold text-orange-400">{product.stock} units</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Category</p>
              <p className="text-sm font-semibold text-gray-300">{product.category}</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-orange-400">₹{product.price}</span>
            <Button 
              onClick={() => onAddToCart(product)}
              disabled={product.stock === 0}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold"
            >
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
