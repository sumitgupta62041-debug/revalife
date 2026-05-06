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
  ChevronDown,
  HelpCircle,
  LogOut,
  MapPin,
  Menu,
  Package,
  Search,
  Settings,
  ShoppingCart,
  Truck,
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
    <header className="sticky top-0 z-50 w-full">
      {/* ── Announcement Bar ─────────────────────────────────── */}
      <div className="bg-wellness-green text-white py-1.5 px-4">
        <div className="container mx-auto flex items-center justify-between">
          {/* Left: trust items — hidden on mobile */}
          <div className="hidden md:flex items-center gap-5 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5 opacity-90" />
              FREE Delivery on orders above ₹500
            </span>
            <span className="opacity-30">|</span>
            <span className="flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5 opacity-90" />7 Days Easy Returns
            </span>
            <span className="opacity-30">|</span>
            <span className="flex items-center gap-1.5">
              <ShoppingCart className="h-3.5 w-3.5 opacity-90" />
              Best Prices Guaranteed
            </span>
          </div>
          {/* Mobile: single short message */}
          <div className="md:hidden text-xs font-medium flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5 opacity-90" />
            FREE Delivery above ₹500
          </div>
          {/* Right: quick links */}
          <div className="flex items-center gap-4 text-xs font-medium">
            <Link
              to="/science"
              className="hover:underline underline-offset-2 opacity-90 hover:opacity-100 transition-opacity hidden sm:block"
              data-ocid="topbar.blog_link"
            >
              Our Blog
            </Link>
            <Link
              to="/faq"
              className="flex items-center gap-1 hover:underline underline-offset-2 opacity-90 hover:opacity-100 transition-opacity"
              data-ocid="topbar.help_link"
            >
              <HelpCircle className="h-3 w-3" />
              Help Center
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main Header Row ──────────────────────────────────── */}
      <div className="bg-card border-b border-border/60 shadow-subtle">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center gap-3 md:gap-5">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 group shrink-0"
              data-ocid="header.logo_link"
            >
              <div className="flex flex-col leading-none">
                <span className="text-xl md:text-2xl font-bold font-display text-wellness-green tracking-tight group-hover:opacity-85 transition-opacity">
                  revAlife
                </span>
                <span className="text-[9px] text-muted-foreground font-medium tracking-widest uppercase hidden md:block">
                  Wellness Redefined
                </span>
              </div>
            </Link>

            {/* Search bar — BIG, prominent, centered */}
            <form
              onSubmit={handleSearch}
              className="flex-1 max-w-2xl hidden md:flex items-center"
            >
              <div
                className={`flex w-full items-center rounded-md border-2 bg-background h-10 overflow-hidden transition-all duration-200 ${
                  searchFocused
                    ? "border-wellness-green shadow-[0_0_0_3px_oklch(var(--wellness-green)/0.12)]"
                    : "border-border hover:border-border/80"
                }`}
              >
                <Input
                  type="search"
                  placeholder="Search wellness products, supplements, ayurvedic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="flex-1 h-full border-0 bg-transparent px-4 text-sm focus-visible:ring-0 placeholder:text-muted-foreground/60 rounded-none"
                  data-ocid="header.search_input"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                    className="px-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="submit"
                  aria-label="Search"
                  className="h-full px-5 bg-wellness-green hover:bg-wellness-green-dark text-white flex items-center justify-center transition-colors shrink-0"
                  data-ocid="header.search_button"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>

            {/* Spacer — mobile */}
            <div className="flex-1 md:hidden" />

            {/* Right actions */}
            <div className="flex items-center gap-1">
              {/* Mobile search toggle */}
              <button
                type="button"
                className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
                aria-label="Search"
                onClick={() => setMobileMenuOpen((v) => !v)}
                data-ocid="header.mobile_search_toggle"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* User / Login */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-muted transition-colors group"
                      data-ocid="user.dropdown_menu"
                      aria-label="Account menu"
                    >
                      <div className="h-8 w-8 rounded-full bg-wellness-green/10 border border-wellness-green/30 flex items-center justify-center shrink-0">
                        <UserCircle className="h-4.5 w-4.5 text-wellness-green" />
                      </div>
                      <div className="hidden md:flex flex-col items-start leading-tight">
                        <span className="text-[10px] text-muted-foreground">
                          Hello, User
                        </span>
                        <span className="text-xs font-semibold text-foreground flex items-center gap-0.5">
                          My Account{" "}
                          <ChevronDown className="h-3 w-3 text-muted-foreground group-hover:text-foreground" />
                        </span>
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    side="bottom"
                    sideOffset={6}
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
                <button
                  type="button"
                  onClick={openLoginModal}
                  data-ocid="header.login_button"
                  className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 rounded-md hover:bg-muted transition-colors group"
                >
                  <div className="h-8 w-8 rounded-full bg-muted border border-border flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="hidden md:flex flex-col items-start leading-tight">
                    <span className="text-[10px] text-muted-foreground">
                      Hello, Guest
                    </span>
                    <span className="text-xs font-semibold text-wellness-green flex items-center gap-0.5">
                      Login / Register
                      <ChevronDown className="h-3 w-3" />
                    </span>
                  </div>
                </button>
              )}

              {/* Cart */}
              <Link
                to="/cart"
                className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 rounded-md hover:bg-muted transition-colors relative group"
                aria-label={`Shopping cart${cartItemCount > 0 ? `, ${cartItemCount} items` : ""}`}
                data-ocid="header.cart_link"
              >
                <div className="relative">
                  <ShoppingCart className="h-5 w-5 text-foreground" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 h-4.5 min-w-[18px] px-1 rounded-full bg-wellness-green text-white text-[9px] font-bold flex items-center justify-center leading-none">
                      {cartItemCount > 9 ? "9+" : cartItemCount}
                    </span>
                  )}
                </div>
                <div className="hidden md:flex flex-col items-start leading-tight">
                  <span className="text-[10px] text-muted-foreground">
                    Your
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    Cart
                  </span>
                </div>
              </Link>

              {/* Mobile hamburger */}
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

          {/* Mobile search bar */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-3 pt-1">
              <form onSubmit={handleSearch}>
                <div
                  className={`flex items-center rounded-md border-2 bg-background h-10 overflow-hidden transition-all duration-200 ${
                    searchFocused ? "border-wellness-green" : "border-border"
                  }`}
                >
                  <Input
                    type="search"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    className="flex-1 h-full border-0 bg-transparent px-3 text-sm focus-visible:ring-0"
                    data-ocid="header.mobile_search_input"
                  />
                  <button
                    type="submit"
                    aria-label="Search"
                    className="h-full px-4 bg-wellness-green text-white flex items-center shrink-0"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* ── Nav Row — desktop only ────────────────────────── */}
        <div className="hidden lg:block border-t border-border/40 bg-card">
          <div className="container mx-auto px-4">
            <nav className="flex items-center h-10 gap-0">
              {NAV_LINKS.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`relative px-4 h-full flex items-center text-sm font-medium transition-colors duration-150 whitespace-nowrap
                    ${
                      isActivePath(to)
                        ? "text-wellness-green after:absolute after:bottom-0 after:left-4 after:right-4 after:h-0.5 after:bg-wellness-green after:rounded-t-full"
                        : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                    }`}
                  data-ocid={`nav.${label.toLowerCase().replace(/\s+/g, "_")}_link`}
                >
                  {label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  data-ocid="admin.nav_link"
                  className={`ml-2 px-4 h-7 self-center flex items-center text-xs font-semibold rounded-full border transition-all duration-200 whitespace-nowrap
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
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden border-b border-border/60 bg-card/98 backdrop-blur-sm shadow-elevated"
          data-ocid="header.mobile_menu"
        >
          <nav className="container mx-auto px-4 py-3 space-y-0.5">
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
