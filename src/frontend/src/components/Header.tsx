import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Settings, ShoppingCart, User } from "lucide-react";
import { useAdmin } from "../hooks/useAdmin";
import { useCart } from "../hooks/useCart";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function Header() {
  const { identity, login, clear } = useInternetIdentity();
  const { cartItemCount } = useCart();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-wellness-green">
              revAlife
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-sm font-medium hover:text-wellness-green transition-colors"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-sm font-medium hover:text-wellness-green transition-colors"
            >
              Products
            </Link>
            <Link
              to="/science"
              className="text-sm font-medium hover:text-wellness-green transition-colors"
            >
              Our Science
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium hover:text-wellness-green transition-colors"
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="text-sm font-medium hover:text-wellness-green transition-colors"
            >
              Contact
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                data-ocid="admin.nav_link"
                className="text-sm font-medium text-wellness-green border border-wellness-green rounded-md px-3 py-1 hover:bg-wellness-green hover:text-white transition-colors"
              >
                Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-wellness-green text-white text-xs flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    data-ocid="user.dropdown_menu"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() =>
                      navigate({ to: "/account", search: { tab: "profile" } })
                    }
                  >
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      navigate({ to: "/account", search: { tab: "orders" } })
                    }
                  >
                    Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      navigate({ to: "/account", search: { tab: "addresses" } })
                    }
                  >
                    Addresses
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        data-ocid="admin.dropdown_link"
                        onClick={() => navigate({ to: "/admin" })}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Admin Panel
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={login}
                className="bg-wellness-green hover:bg-wellness-green-dark"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
