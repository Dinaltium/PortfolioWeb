import { Button } from "@/components/ui/button";
import { Home, ShoppingCart, HelpCircle, Users } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/shop", label: "Shop", icon: ShoppingCart },
    { href: "/help", label: "Get Our Help", icon: HelpCircle },
    { href: "/about", label: "About Us", icon: Users },
  ];

  return (
    <nav className="fixed top-4 right-4 z-50">
      <div className="bg-black/80 backdrop-blur-sm border border-orange-500/30 rounded-lg p-2 flex gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className={`${
                  isActive 
                    ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-black hover:from-orange-600 hover:to-yellow-600" 
                    : "text-orange-300 hover:text-orange-400 hover:bg-orange-500/10"
                } transition-all duration-200`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}