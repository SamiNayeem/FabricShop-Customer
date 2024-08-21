import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/app/context/auth-context';
import Preloader from '@/components/preloader/preloader';
import { useRouter } from 'next/navigation';

interface PaymentMethod {
  id: number;
  name: string;
}

interface ShippingMethod {
  id: number;
  name: string;
}

export default function CheckoutBody() {
  const { authState } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number | null>(null);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<number | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      fetchPaymentMethods();
      fetchShippingMethods();
      setLoading(false);
    }
  }, [authState.isAuthenticated, authState.user]);

  const fetchPaymentMethods = async () => {
    try {
      const response = await axios.get('/api/payment-method');
      console.log('Payment Methods:', response.data); // Debugging line
      setPaymentMethods(response.data);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      setError('Failed to load payment methods');
    }
  };
  
  const fetchShippingMethods = async () => {
    try {
      const response = await axios.get('/api/shipping-method');
      console.log('Shipping Methods:', response.data); // Debugging line
      setShippingMethods(response.data);
    } catch (error) {
      console.error('Error fetching shipping methods:', error);
      setError('Failed to load shipping methods');
    }
  };
  

  const handleApplyDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/discount-coupon', {
        userid: authState.user?.userid,
        couponcode: couponCode,
      });

      if (response.data && response.data.discountpercentage) {
        setDiscount(response.data.discountpercentage);
      } else {
        setDiscount(0);
        alert('Invalid coupon code');
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      alert('Failed to apply coupon');
    }
  };

  // Example checkout function in your frontend
const handleCheckout = async () => {
  try {
      const response = await fetch('/api/order', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              userId: authState.user?.userid,
              paymentMethodId: selectedPaymentMethod,
              shippingMethodId: selectedShippingMethod,
              address,
          }),
      });

      const result = await response.json();

      if (response.status === 200) {
          router.push(result.redirect); // Redirect to dashboard
      } else {
          alert(result.message || 'Checkout failed');
      }
  } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred during checkout');
  }
};

  if (loading) {
    return <div><Preloader /></div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!authState.isAuthenticated || !authState.user) {
    return <div>Please log in to proceed with the checkout.</div>;
  }

  return (
    <section className="bg-white py-8 antialiased">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">Checkout</h2>
        <div className="mt-6 space-y-6">
          {/* User Information */}
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="text-lg font-medium text-gray-800">User Information</h3>
            <p>Username: {authState.user?.username}</p>
            <p>Email: {authState.user?.email}</p>
          </div>

          {/* Address Input */}
          <div>
            <label htmlFor="address" className="block text-gray-700 font-medium">Shipping Address</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full mt-2 border rounded p-2"
              placeholder="Enter your shipping address"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label htmlFor="payment" className="block text-gray-700 font-medium">Payment Method</label>
            <select
              id="payment"
              value={selectedPaymentMethod || 'null'}
              onChange={(e) => setSelectedPaymentMethod(Number(e.target.value))}
              className="w-full mt-2 border rounded p-2"
            >
              <option value="">Select a payment method</option>
              {paymentMethods.map((method) => (
                <option key={method.id} value={method.id}>{method.name}</option>
              ))}
            </select>
          </div>

          {/* Shipping Method */}
          <div>
            <label htmlFor="shipping" className="block text-gray-700 font-medium">Shipping Method</label>
            <select
              id="shipping"
              value={selectedShippingMethod || ''}
              onChange={(e) => setSelectedShippingMethod(Number(e.target.value))}
              className="w-full mt-2 border rounded p-2"
            >
              <option value="">Select a shipping method</option>
              {shippingMethods.map((method) => (
                <option key={method.id} value={method.id}>{method.name}</option>
              ))}
            </select>
          </div>

          {/* Coupon Code */}
          <form onSubmit={handleApplyDiscount} className="mt-4">
            <label htmlFor="coupon" className="block text-gray-700 font-medium">Discount Coupon</label>
            <input
              type="text"
              id="coupon"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="w-full mt-2 border rounded p-2"
              placeholder="Enter coupon code"
            />
            <button
              type="submit"
              className="mt-2 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Apply Coupon
            </button>
          </form>

          {/* Checkout Button */}
          <button
            className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </section>
  );
}
