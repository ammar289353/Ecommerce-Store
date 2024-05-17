"use client";

import React, { useState } from 'react';
import CheckoutForm from '@/components/ui/checkoutform';
import Button from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { toast } from "react-hot-toast";
import axios from 'axios';

interface OrderDetails {
  email: string;
  phoneNumber: string;
  address: string;
  paymentMethod: string;
}

const Summary = () => {
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);

  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.price)
  }, 0);

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handlePlaceOrder = async (orderDetails: OrderDetails) => {
    try {
      setIsPlacingOrder(true);

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/place-order`, {
        orderDetails,
        productIds: items.map((item) => item.id)
      });

      // Assuming the server returns a success message
      toast.success(response.data.message);

      // Clear the cart after a successful order
      removeAll();
    } catch (error: any) {
      // Handle errors, display error message, etc.
      console.error("Error placing order:", error.message);
      toast.error('Failed to place the order. Please try again.');
    } finally {
    setIsPlacingOrder(false);
    }
  };

  return (
    <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <h2 className="text-lg font-medium text-gray-900">
        Order summary
      </h2>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-900">Order total</div>
          <Currency value={totalPrice} />
        </div>
      </div>
      {items.length > 0 ? (
        <CheckoutForm items={items} totalPrice={totalPrice} onPlaceOrder={handlePlaceOrder} />
      ) : (
        <p className="text-neutral-500">No items added to cart.</p>
      )}
    </div>
  );
}

export default Summary;
