import { Toaster } from "@/components/ui/sonner";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import {
  Suspense,
  createContext,
  lazy,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Layout from "./components/Layout";
import { LoginModal } from "./components/LoginModal";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Home from "./pages/Home";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderTracking from "./pages/OrderTracking";
import Privacy from "./pages/Privacy";
import Products from "./pages/Products";
import Returns from "./pages/Returns";
import Science from "./pages/Science";
import Shipping from "./pages/Shipping";
import Terms from "./pages/Terms";

// Heavy pages — lazy loaded for better initial bundle size
const Admin = lazy(() => import("./pages/Admin"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const MyAccount = lazy(() => import("./pages/MyAccount"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));

// ─── Pending Action Types ─────────────────────────────────────────────────────

export type PendingCartAction = {
  type: "addToCart";
  productId: string;
  quantity: bigint;
  /** Optional drawer data to show after item is added */
  drawerData?: { id: string; name: string; price: number; imageUrl: string };
};

// ─── Login Context ─────────────────────────────────────────────────────────────

interface LoginContextValue {
  openLoginModal: () => void;
  /** Opens login modal and queues a cart action to auto-execute after login */
  openLoginModalWithAction: (action: PendingCartAction) => void;
  /** Consume the pending action once (returns it and clears the queue) */
  consumePendingAction: () => PendingCartAction | null;
}

export const LoginContext = createContext<LoginContextValue>({
  openLoginModal: () => {},
  openLoginModalWithAction: () => {},
  consumePendingAction: () => null,
});

export function useLoginModal() {
  return useContext(LoginContext);
}

// ─── Page Loader ───────────────────────────────────────────────────────────────

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="h-8 w-8 rounded-full border-4 border-wellness-green border-t-transparent animate-spin" />
    </div>
  );
}

function withSuspense(Component: React.ComponentType) {
  return function SuspenseWrapped() {
    return (
      <Suspense fallback={<PageLoader />}>
        <Component />
      </Suspense>
    );
  };
}

// ─── Routes ───────────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/products",
  component: Products,
});

const productDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/products/$id",
  component: withSuspense(ProductDetail),
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: withSuspense(Cart),
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: withSuspense(Checkout),
});

const orderConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/order-confirmation/$orderId",
  component: OrderConfirmation,
});

const accountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/account",
  component: withSuspense(MyAccount),
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: About,
});

const scienceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/science",
  component: Science,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: Contact,
});

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy",
  component: Privacy,
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terms",
  component: Terms,
});

const faqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/faq",
  component: FAQ,
});

const shippingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shipping",
  component: Shipping,
});

const returnsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/returns",
  component: Returns,
});

const trackOrderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/track-order",
  component: OrderTracking,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: withSuspense(Admin),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  productsRoute,
  productDetailRoute,
  cartRoute,
  checkoutRoute,
  orderConfirmationRoute,
  accountRoute,
  aboutRoute,
  scienceRoute,
  contactRoute,
  privacyRoute,
  termsRoute,
  faqRoute,
  shippingRoute,
  returnsRoute,
  trackOrderRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// ─── Post-Login Action Replayer ───────────────────────────────────────────────
// Watches for the transition: unauthenticated → authenticated + actor ready,
// then dispatches the queued cart action so any mounted component can replay it.
// Two-phase design handles the race where identity arrives before actor is ready:
//   Phase 1 — on login: detect auth transition, capture pending action into localRef
//   Phase 2 — on actor ready: if localRef has an action, dispatch and clear

function PostLoginReplayer({
  consumePendingAction,
}: {
  consumePendingAction: () => PendingCartAction | null;
}) {
  const { identity } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();
  const wasAuthenticatedRef = useRef(false);
  // Holds an action that was captured at login time but not yet dispatched
  // (actor may still be initializing)
  const capturedActionRef = useRef<PendingCartAction | null>(null);

  // Phase 1: detect login transition and capture the pending action
  useEffect(() => {
    const isAuthenticated = !!identity;
    const justLoggedIn = !wasAuthenticatedRef.current && isAuthenticated;
    wasAuthenticatedRef.current = isAuthenticated;

    if (!justLoggedIn) return;

    // Capture now so the queue is cleared; dispatch happens in Phase 2
    const pending = consumePendingAction();
    if (pending) {
      capturedActionRef.current = pending;
    }
  }, [identity, consumePendingAction]);

  // Phase 2: once actor is ready after login, dispatch the captured action
  useEffect(() => {
    if (!identity || !actor || actorFetching) return;
    const pending = capturedActionRef.current;
    if (!pending) return;

    capturedActionRef.current = null;
    window.dispatchEvent(
      new CustomEvent("revalife:replayCartAction", { detail: pending }),
    );
  }, [identity, actor, actorFetching]);

  return null;
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const pendingActionRef = useRef<PendingCartAction | null>(null);

  const openLoginModal = useCallback(() => {
    setLoginModalOpen(true);
  }, []);

  const openLoginModalWithAction = useCallback((action: PendingCartAction) => {
    pendingActionRef.current = action;
    setLoginModalOpen(true);
  }, []);

  const consumePendingAction = useCallback((): PendingCartAction | null => {
    const action = pendingActionRef.current;
    pendingActionRef.current = null;
    return action;
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <LoginContext.Provider
        value={{
          openLoginModal,
          openLoginModalWithAction,
          consumePendingAction,
        }}
      >
        <RouterProvider router={router} />
        <PostLoginReplayer consumePendingAction={consumePendingAction} />
        <LoginModal
          open={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
        />
        <Toaster />
      </LoginContext.Provider>
    </ThemeProvider>
  );
}
