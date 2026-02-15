"use client";

import { useEffect, useState, useCallback } from "react";
import { getSessionId } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface CartItem {
  id: string;
  session_id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  quantity: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

const products = [
  { id: "1", name: "Wireless Headphones", price: 59.99 },
  { id: "2", name: "USB-C Hub", price: 34.99 },
  { id: "3", name: "Mechanical Keyboard", price: 89.99 },
  { id: "4", name: "Mouse Pad XL", price: 19.99 },
  { id: "5", name: "Webcam HD", price: 49.99 },
  { id: "6", name: "Monitor Stand", price: 29.99 },
  { id: "7", name: "Cable Organizer", price: 12.99 },
  { id: "8", name: "Desk Lamp", price: 24.99 },
];

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    const sessionId = getSessionId();
    if (!sessionId) return;
    const res = await fetch(`/api/cart?session_id=${sessionId}`);
    const data = await res.json();
    if (Array.isArray(data)) setCart(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (product: (typeof products)[0]) => {
    setAdding(product.id);
    const sessionId = getSessionId();
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        product_id: product.id,
        product_name: product.name,
        product_price: product.price,
      }),
    });
    await fetchCart();
    setAdding(null);
  };

  const removeItem = async (id: string) => {
    await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await fetchCart();
  };

  const clearCart = async () => {
    const sessionId = getSessionId();
    await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, clear: true }),
    });
    await fetchCart();
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.product_price * item.quantity,
    0,
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 bg-background z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Store</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="relative">
                Cart
                {totalItems > 0 && <Badge className="ml-2">{totalItems}</Badge>}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Cart ({totalItems})</SheetTitle>
              </SheetHeader>
              <div className="mt-4 flex flex-col gap-3 overflow-y-auto flex-1">
                {cart.length === 0 && (
                  <p className="text-muted-foreground text-sm">Cart is empty</p>
                )}
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border border-border rounded-md p-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.product_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ${item.product_price} x {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <span className="text-sm font-medium">
                        ${(item.product_price * item.quantity).toFixed(2)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                      >
                        ✕
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              {cart.length > 0 && (
                <div className="border-t border-border pt-4 mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium">Total</span>
                    <span className="font-bold text-lg">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="border border-border rounded-lg p-4 flex flex-col gap-3"
              >
                <div className="h-32 bg-muted rounded-md flex items-center justify-center text-muted-foreground text-3xl">
                  🛒
                </div>
                <h3 className="font-medium text-sm">{product.name}</h3>
                <p className="text-lg font-bold">${product.price}</p>
                <Button
                  onClick={() => addToCart(product)}
                  disabled={adding === product.id}
                  size="sm"
                >
                  {adding === product.id ? "Adding..." : "Add to Cart"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
