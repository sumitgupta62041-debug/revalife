import { createContext, useCallback, useContext, useState } from "react";

export interface DrawerProduct {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

interface CartDrawerContextValue {
  isOpen: boolean;
  lastAddedProduct: DrawerProduct | null;
  openDrawer: (product: DrawerProduct) => void;
  closeDrawer: () => void;
}

const CartDrawerContext = createContext<CartDrawerContextValue>({
  isOpen: false,
  lastAddedProduct: null,
  openDrawer: () => {},
  closeDrawer: () => {},
});

export function CartDrawerProvider({
  children,
}: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [lastAddedProduct, setLastAddedProduct] =
    useState<DrawerProduct | null>(null);

  const openDrawer = useCallback((product: DrawerProduct) => {
    setLastAddedProduct(product);
    setIsOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <CartDrawerContext.Provider
      value={{ isOpen, lastAddedProduct, openDrawer, closeDrawer }}
    >
      {children}
    </CartDrawerContext.Provider>
  );
}

export function useCartDrawer() {
  return useContext(CartDrawerContext);
}
