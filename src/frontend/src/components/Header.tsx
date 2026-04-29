import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LogOut,
  MapPin,
  Menu,
  Package,
  Search,
  Settings,
  ShoppingCart,
  User,
  UserCircle,
  X,
} from "lucide-react";
import { useState } from "react";
import { useLoginModal } from "../App";
import { useAdmin } from "../hooks/useAdmin";
import { useCart } from "../hooks/useCart";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/science", label: "Our Science" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const { identity, clear } = useInternetIdentity();
  const { openLoginModal } = useLoginModal();
  const { cartItemCount } = useCart();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const isAuthenticated = !!identity;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: "/" });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: "/products", search: { q: searchQuery.trim() } });
      setSearchQuery("");
    }
  };

  const isActivePath = (to: string) => {
    if (to === "/") return currentPath === "/";
    return currentPath.startsWith(to);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-card/95 backdrop-blur-md supports-[backdrop-filter]:bg-card/90 shadow-subtle">
      {/* Top bar */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group shrink-0"
            data-ocid="header.logo_link"
          >
            <span className="text-2xl font-bold font-display text-wellness-green tracking-tight group-hover:opacity-85 transition-opacity">
              revAlife
            </span>
          </Link>

          {/* Search bar — desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md items-center relative"
          >
            <div
              className={`flex w-full items-center rounded-full border bg-muted/50 px-4 h-9 gap-2 transition-all duration-200 ${
                searchFocused
                  ? "border-wellness-green ring-2 ring-wellness-green/20 bg-card"
                  : "border-border/60 hover:border-border"
              }`}
            >
              <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <Input
                type="search"
                placeholder="Search wellness products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="h-auto border-0 bg-transparent p-0 text-sm focus-visible:ring-0 placeholder:text-muted-foreground/70"
                data-ocid="header.search_input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </form>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 whitespace-nowrap
                  ${
                    isActivePath(to)
                      ? "text-wellness-green"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                data-ocid={`nav.${label.toLowerCase().replace(/\s+/g, "_")}_link`}
              >
                {label}
                {isActivePath(to) && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-wellness-green" />
                )}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                data-ocid="admin.nav_link"
                className={`ml-1 px-3 py-1.5 text-sm font-semibold rounded-full border transition-all duration-200 whitespace-nowrap
                  ${
                    isActivePath("/admin")
                      ? "bg-wellness-green text-white border-wellness-green"
                      : "text-wellness-green border-wellness-green/50 hover:bg-wellness-green hover:text-white"
                  }`}
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Spacer for mobile */}
          <div className="flex-1 md:hidden" />

          {/* Right actions */}
          <div className="flex items-center gap-1">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative"
              aria-label={`Shopping cart${cartItemCount > 0 ? `, ${cartItemCount} items` : ""}`}
              data-ocid="header.cart_link"
            >
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-muted transition-colors"
                data-ocid="header.cart_button"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 min-w-[1.25rem] px-1 rounded-full bg-wellness-green text-white text-[10px] font-bold flex items-center justify-center leading-none">
                    {cartItemCount > 9 ? "9+" : cartItemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* User menu or login */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    data-ocid="user.dropdown_menu"
                    className="hover:bg-muted transition-colors"
                    aria-label="Account menu"
                  >
                    <UserCircle className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  side="bottom"
                  sideOffset={8}
                  className="w-52 shadow-elevated"
                >
                  <DropdownMenuItem
                    onClick={() =>
                      navigate({ to: "/account", search: { tab: "profile" } })
                    }
                    className="gap-2.5 py-2.5 cursor-pointer"
                    data-ocid="user.my_account_link"
                  >
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>My Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      navigate({ to: "/account", search: { tab: "orders" } })
                    }
                    className="gap-2.5 py-2.5 cursor-pointer"
                    data-ocid="user.orders_link"
                  >
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span>My Orders</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      navigate({
                        to: "/account",
                        search: { tab: "addresses" },
                      })
                    }
                    className="gap-2.5 py-2.5 cursor-pointer"
                    data-ocid="user.addresses_link"
                  >
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>Saved Addresses</span>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        data-ocid="admin.dropdown_link"
                        onClick={() => navigate({ to: "/admin" })}
                        className="gap-2.5 py-2.5 cursor-pointer text-wellness-green focus:text-wellness-green"
                      >
                        <Settings className="h-4 w-4" />
                        <span className="font-medium">Admin Panel</span>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    data-ocid="user.logout_button"
                    className="gap-2.5 py-2.5 cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={openLoginModal}
                data-ocid="header.login_button"
                size="sm"
                className="bg-wellness-green hover:bg-wellness-green-dark text-white rounded-full px-5 font-medium transition-all duration-200 shadow-xs hover:shadow-card"
              >
                Login
              </Button>
            )}

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-muted"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              data-ocid="header.mobile_menu_toggle"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch} className="relative">
            <div
              className={`flex items-center rounded-full border bg-muted/50 px-3 h-9 gap-2 transition-all duration-200 ${
                searchFocused
                  ? "border-wellness-green ring-2 ring-wellness-green/20 bg-card"
                  : "border-border/60"
              }`}
            >
              <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="h-auto border-0 bg-transparent p-0 text-sm focus-visible:ring-0"
                data-ocid="header.mobile_search_input"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden border-t border-border/60 bg-card/98 backdrop-blur-sm"
          data-ocid="header.mobile_menu"
        >
          <nav className="container mx-auto px-4 py-4 space-y-1">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActivePath(to)
                    ? "bg-wellness-green/10 text-wellness-green"
                    : "text-foreground/80 hover:bg-muted"
                }`}
                data-ocid={`nav.mobile_${label.toLowerCase().replace(/\s+/g, "_")}_link`}
              >
                {label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-wellness-green hover:bg-wellness-green/10 transition-colors"
                data-ocid="admin.mobile_nav_link"
              >
                Admin Panel
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
