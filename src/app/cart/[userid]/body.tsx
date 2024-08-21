import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/app/context/auth-context";
import Preloader from "@/components/preloader/preloader";
import Router, { useRouter } from "next/navigation";

interface CartItem {
  cart_detail_id: number;
  product_master_id: number;
  product_name: string;
  product_image: string;
  product_code: string;
  product_description: string;
  category: string;
  color: string;
  size: string;
  brand: string;
  Quantity: number;
  TotalPrice: number;
  CreatedAt: string;
}

export default function Body() {
  const { authState } = useAuth();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState('');

  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      fetchCartItems();
    }
  }, [authState.isAuthenticated, authState.user]);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get(`/api/cart?userid=${authState.user?.userid}`);
      setCartItems(response.data);
      calculateSubtotal(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setError("Failed to load cart items");
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    router.push(`/checkout/${authState.user?.userid}`);
  };

  const calculateSubtotal = (items: CartItem[]) => {
    const total = items.reduce((sum, item) => sum + item.TotalPrice, 0);
    setSubtotal(total);
    setTotalPrice(total - totalDiscount); // Apply any existing discount
  };

  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      await axios.put("/api/cart", {
        userid: authState.user?.userid,
        cartDetailId: itemId,
        newQuantity,
      });

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.cart_detail_id === itemId
            ? { ...item, Quantity: newQuantity, TotalPrice: (item.TotalPrice / item.Quantity) * newQuantity }
            : item
        )
      );
      calculateSubtotal(cartItems);
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
      setError("Failed to update cart item quantity");
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await axios.delete("/api/cart", {
        data: { userid: authState.user?.userid, cartDetailId: itemId },
      });

      const updatedCartItems = cartItems.filter((item) => item.cart_detail_id !== itemId);
      setCartItems(updatedCartItems);
      calculateSubtotal(updatedCartItems);
    } catch (error) {
      console.error("Error removing item from cart:", error);
      setError("Failed to remove item from cart");
    }
  };

  // const handleApplyDiscount = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post('/api/discount-coupon', {
  //       userid: authState.user?.userid,
  //       couponcode: couponCode,
  //     });

  //     if (response.data && response.data.discountpercentage) {
  //       setDiscount(response.data.discountpercentage);
  //       const discountAmount = subtotal * (response.data.discountpercentage / 100);
  //       setTotalDiscount(discountAmount);
  //       setTotalPrice(subtotal - discountAmount);
  //     } else {
  //       setDiscount(0);
  //       setTotalDiscount(0);
  //       alert('Invalid coupon code');
  //     }
  //   } catch (error) {
  //     console.error('Error applying coupon:', error);
  //     alert('Failed to apply coupon');
  //   }
  // };

  if (loading) {
    return <div><Preloader/></div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!authState.isAuthenticated || !authState.user) {
    return <div>Please log in to view your cart.</div>;
  }

  if (cartItems.length === 0) {
    return <div className="h-screen w-full">Your cart is empty.</div>;
  }

  return (
    <section className="bg-white py-8 antialiased">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">Shopping Cart</h2>
        <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
          <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.cart_detail_id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg md:p-6">
                  <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                    <a href="#" className="shrink-0 md:order-1">
                      <img className="h-60 object-contain" src={item.product_image} alt={item.product_name} />
                    </a>
                    <div className="text-end md:order-4 md:w-32">
                      <p className="text-base font-bold text-gray-900">BDT: {item.TotalPrice}</p>
                    </div>
                    <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                      <a href="#" className="text-base font-medium text-gray-900 hover:underline">
                        {item.product_name}
                      </a>
                      <p className="text-sm text-gray-500">{item.product_description}</p>
                      <p className="text-sm text-gray-500">Category: {item.category}</p>
                      <p className="text-sm text-gray-500">Color: {item.color}</p>
                      <p className="text-sm text-gray-500">Size: {item.size}</p>
                      <p className="text-sm text-gray-500">Brand: {item.brand}</p>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={item.Quantity}
                          onChange={(e) => handleQuantityChange(item.cart_detail_id, parseInt(e.target.value))}
                          className="w-16 h-10 text-center border rounded"
                        />
                        <button
                          onClick={() => handleRemoveItem(item.cart_detail_id)}
                          className="text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Checkout section */}
          <div className="lg:w-1/3 xl:w-1/4 mt-8 lg:mt-0 lg:ml-8">
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">Order Summary</h2>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-700">Subtotal</span>
                  <span className="text-gray-900 font-bold">BDT: {subtotal}</span>
                </div>
                
                {/* <div className="flex justify-between">
                  <span className="text-gray-700">Total Discount</span>
                  <span className="text-green-600 font-bold">-BDT: {totalDiscount}</span>
                </div> */}
                <div className="flex justify-between border-t border-gray-200 pt-2">
                  <span className="text-gray-900 font-bold">Total</span>
                  <span className="text-gray-900 font-bold">BDT: {totalPrice}</span>
                </div>
              </div>
              {/* <form onSubmit={handleApplyDiscount} className="mt-6">
                <label htmlFor="discount" className="block text-gray-700 font-medium">
                  Discount Coupon
                </label>
                <input
                  type="text"
                  id="discount"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full mt-2 border rounded p-2"
                  placeholder="Enter coupon code"
                />
                <button
                  type="submit"
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Apply Coupon
                </button>
              </form> */}
              <button
                className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
