import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { listings } from "@/data/mockData";
import { toast } from "sonner";

interface CartItem {
  id: string;
  listing_id: string;
  quantity: number;
  listing: typeof listings[0];
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (listingId: string) => Promise<void>;
  removeFromCart: (listingId: string) => Promise<void>;
  updateQuantity: (listingId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch cart items when user changes
  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      setItems([]);
    }
  }, [user]);

  const fetchCartItems = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;

      // Map database items to cart items with listing data
      const cartItems: CartItem[] = (data || []).map((item) => {
        const listing = listings.find((l) => l.id === item.listing_id);
        return {
          id: item.id,
          listing_id: item.listing_id,
          quantity: item.quantity,
          listing: listing!,
        };
      }).filter((item) => item.listing);

      setItems(cartItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (listingId: string) => {
    if (!user) {
      toast.error("Please sign in to add items to cart");
      return;
    }

    try {
      // Check if item already exists
      const existingItem = items.find((item) => item.listing_id === listingId);

      if (existingItem) {
        // Update quantity
        const { error } = await supabase
          .from("cart_items")
          .update({ quantity: existingItem.quantity + 1 })
          .eq("id", existingItem.id);

        if (error) throw error;

        setItems((prev) =>
          prev.map((item) =>
            item.listing_id === listingId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
        toast.success("Quantity updated");
      } else {
        // Add new item
        const { data, error } = await supabase
          .from("cart_items")
          .insert({ user_id: user.id, listing_id: listingId, quantity: 1 })
          .select()
          .single();

        if (error) throw error;

        const listing = listings.find((l) => l.id === listingId);
        if (listing && data) {
          setItems((prev) => [
            ...prev,
            { id: data.id, listing_id: listingId, quantity: 1, listing },
          ]);
          toast.success("Added to cart");
        }
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  const removeFromCart = async (listingId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id)
        .eq("listing_id", listingId);

      if (error) throw error;

      setItems((prev) => prev.filter((item) => item.listing_id !== listingId));
      toast.success("Removed from cart");
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove from cart");
    }
  };

  const updateQuantity = async (listingId: string, quantity: number) => {
    if (!user) return;

    if (quantity <= 0) {
      await removeFromCart(listingId);
      return;
    }

    try {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity })
        .eq("user_id", user.id)
        .eq("listing_id", listingId);

      if (error) throw error;

      setItems((prev) =>
        prev.map((item) =>
          item.listing_id === listingId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;

      setItems([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.listing.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
