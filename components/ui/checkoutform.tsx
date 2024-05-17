"use client"

import React, { useState } from 'react';
import Select from 'react-select';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button';
import toast from 'react-hot-toast';

interface CartItem {
    id: string;
  }

interface OrderDetails {
    email: string;
    phoneNumber: string;
    address: string;
    selectedCity: { value: string; label: string } | null;
    paymentMethod: string;
    items: CartItem[];
    totalPrice: number;
} 

interface CheckoutFormProps {
    items: CartItem[];
    totalPrice: number;
    onPlaceOrder: (orderDetails: OrderDetails) => void; // Assuming OrderDetails is defined elsewhere
  }

const CheckoutForm: React.FC<CheckoutFormProps> = ({ 
    items,
    totalPrice, 
    onPlaceOrder 
}) => {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [selectedCity, setSelectedCity] = useState<{ value: string; label: string } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('cod'); // Default to Cash on Delivery
  const router = useRouter();


  const cityOptions = [
    { value: 'karachi', label: 'Karachi' },
    { value: 'lahore', label: 'Lahore' },
    { value: 'islamabad', label: 'Islamabad' },
    // Add more cities as needed
  ];

  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      if (paymentMethod === 'card') {
        // Redirect to the card payment checkout page
        router.push(`${process.env.NEXT_PUBLIC_API_URL}/checkout`);
      } else {
        onPlaceOrder?.({ email, phoneNumber, address, selectedCity, paymentMethod, items, totalPrice });
      }
    } catch (error: any) {
      console.error("Error placing order:", error.message);
      toast.error('Failed to place the order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Address
        </label>
        <textarea
          id="address"
          name="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          rows={3}
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>

       <div className="mb-4">
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
          City
        </label>
        <Select
          id="city"
          name="city"
          value={selectedCity}
          onChange={(value) => setSelectedCity(value)}
          options={cityOptions}
          isSearchable
          placeholder="Select a city"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
          Payment Method
        </label>
        <select
          id="paymentMethod"
          name="paymentMethod"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md"
        >
          <option value="cod">Cash on Delivery</option>
          <option value="card">Card Payment</option>
        </select>

      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Placing Order...' : 'Place Order'}
                {isLoading && <span className="ml-2 spinner"></span>}
      </Button>
    </form>
  );
};

export default CheckoutForm;
