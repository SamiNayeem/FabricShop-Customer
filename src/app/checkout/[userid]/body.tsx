import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/app/context/auth-context';
import { useParams, useRouter } from 'next/navigation';

interface CartItem {
  cart_detail_id: number;
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
}

interface PaymentMethod {
  paymentmethod: string;
}

interface ShippingMethod {
  shippingmethod: string;
}

export default function CheckoutPage() {
  const { authState } = useAuth();
  const params = useParams();
  const router = useRouter();
  const userid = params.userid;

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const [couponCode, setCouponCode] = useState('');

  // User Information State
  const [address, setAddress] = useState('');
  const [shippingMethod, setShippingMethod] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  // Payment and Shipping Methods State
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);

  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      fetchCartItems();
      fetchPaymentMethods();
      fetchShippingMethods();
    }
  }, [authState.isAuthenticated, authState.user]);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get(`/api/cart?userid=${userid}`);
      setCartItems(response.data);
      calculateTotalPrice(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setError('Failed to load cart items');
      setLoading(false);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const response = await axios.get('/api/payment-method');
      setPaymentMethods(response.data);
      if (response.data.length > 0) {
        setPaymentMethod(response.data[0].paymentmethod); // Set default value
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      setError('Failed to load payment methods');
    }
  };

  const fetchShippingMethods = async () => {
    try {
      const response = await axios.get('/api/shipping-method');
      setShippingMethods(response.data);
      if (response.data.length > 0) {
        setShippingMethod(response.data[0].shippingmethod); // Set default value
      }
    } catch (error) {
      console.error('Error fetching shipping methods:', error);
      setError('Failed to load shipping methods');
    }
  };

  const calculateTotalPrice = (items: CartItem[]) => {
    const total = items.reduce((sum, item) => sum + item.TotalPrice, 0);
    setTotalPrice(total);
    setFinalTotal(total);  // Final total initially is the same as the total price
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) {
      setError('Please enter a coupon code');
      return;
    }

    try {
      const response = await axios.post('/api/discount-coupon', {
        userid,
        couponcode: couponCode,
      });

      if (response.data.discountpercentage) {
        setDiscountPercentage(response.data.discountpercentage);
        const discountAmount = totalPrice * (response.data.discountpercentage / 100);
        setTotalDiscount(discountAmount);
        setFinalTotal(totalPrice - discountAmount);
      } else {
        setError('Invalid coupon code');
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      setError('Failed to apply coupon');
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await axios.post('/api/order', {
        userId: userid,
        paymentMethodId: paymentMethod,
        shippingMethodId: shippingMethod,
      });

      if (response.status === 200) {
        alert('Checkout successful');
        router.push('/order-summary'); // Redirect to order summary or thank you page
      } else {
        alert('Failed to checkout');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to checkout');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  if (!authState.isAuthenticated || !authState.user) {
    return <div className="flex justify-center items-center h-screen">Please log in to view your cart.</div>;
  }

  if (cartItems.length === 0) {
    return <div className="flex justify-center items-center h-screen">Your cart is empty.</div>;
  }

  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping & Billing Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Order Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Shipping & Billing Info</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        readOnly
                        type="text"
                        value={authState.user?.username}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email Address</label>
                      <input
                        readOnly
                        type="email"
                        value={authState.user?.email}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Shipping Address</label>
                      <textarea
                        value={address}
                        required
                        onChange={(e) => setAddress(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Payment Method</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      >
                        {paymentMethods.map((method, index) => (
                          <option key={index} value={method.paymentmethod}>
                            {method.paymentmethod}
                          </option>
                        ))}
                      </select>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700">Shipping Method</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Shipping Method</label>
                      <select
                        value={shippingMethod}
                        onChange={(e) => setShippingMethod(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      >
                        {shippingMethods.map((method, index) => (
                          <option key={index} value={method.shippingmethod}>
                            {method.shippingmethod}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Items in your Shopping Cart */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Items in your Shopping Cart</h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.cart_detail_id} className="flex items-center space-x-4">
                    <img src={item.product_image} alt={item.product_name} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-700">{item.product_name}</h3>
                      <p className="text-sm text-gray-500">Size: {item.size} | Qty: {item.Quantity}</p>
                      <p className="text-sm font-bold text-blue-600">BDT {item.TotalPrice.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-right">
                <h3 className="text-xl font-semibold text-gray-700">Total Price:</h3>
                <p className="text-2xl font-bold text-blue-600">BDT {(totalPrice).toFixed(2)}</p>
                <h3 className="text-xl font-semibold text-gray-700">Total Discount:</h3>
                <p className="text-xl font-bold text-green-600">BDT {(totalDiscount).toFixed(2)}</p>
                <h3 className="text-xl font-semibold text-gray-700">Final Total:</h3>
                <p className="text-2xl font-bold text-blue-600">BDT {(finalTotal).toFixed(2)}</p>
              </div>
              <form onSubmit={handleApplyCoupon} className="mt-6">
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
              </form>
              <button
                className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                onClick={handleCheckout}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
