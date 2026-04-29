import { Outlet } from "@tanstack/react-router";
import { CartDrawerProvider } from "../contexts/CartDrawerContext";
import CartDrawer from "./CartDrawer";
import Chatbot from "./Chatbot";
import Footer from "./Footer";
import Header from "./Header";

export default function Layout() {
  return (
    <CartDrawerProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <Chatbot />
        <CartDrawer />
      </div>
    </CartDrawerProvider>
  );
}
