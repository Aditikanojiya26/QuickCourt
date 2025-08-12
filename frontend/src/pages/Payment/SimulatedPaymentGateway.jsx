import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaCreditCard, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'sonner';

const SimulatedPaymentGateway = ({ bookingDetails, onPaymentSuccess, onPaymentFailure, onCancel }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'success', 'failed'

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setPaymentStatus(null);

    // Simulate network delay for payment processing
    setTimeout(() => {
      setIsProcessing(false);
      // Simulate success 80% of the time, failure 20%
      const success = Math.random() < 0.8;
      setPaymentStatus(success ? 'success' : 'failed');

      if (success) {
        toast.success("Payment successful! Redirecting...");
        // Call the parent's success handler after a short delay
        setTimeout(() => {
          onPaymentSuccess(bookingDetails);
        }, 1000); // Give user time to see success message
      } else {
        toast.error("Payment failed. Please try again.");
        // Call the parent's failure handler
        onPaymentFailure();
      }
    }, 2500); // Simulate 2.5 seconds payment processing
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0, // No decimal for whole rupees
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculatedPrice = bookingDetails.duration * 500; // Example: ₹500 per hour

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg mx-auto w-full">
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <div className="flex items-center">
          <FaCreditCard className="text-3xl text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">Secure Payment</h2>
        </div>
        <Button variant="ghost" onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          Cancel
        </Button>
      </div>

      {paymentStatus === 'success' ? (
        <div className="text-center py-8">
          <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4 animate-pulse" />
          <h3 className="text-2xl font-semibold text-green-700">Payment Processed!</h3>
          <p className="text-gray-600 mt-2">Your payment was successful. We're finalizing your booking.</p>
        </div>
      ) : paymentStatus === 'failed' ? (
        <div className="text-center py-8">
          <FaTimesCircle className="text-red-500 text-6xl mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-red-700">Payment Failed!</h3>
          <p className="text-gray-600 mt-2">There was an issue with your payment. Please try again.</p>
          <Button onClick={() => setPaymentStatus(null)} className="mt-4">Try Again</Button>
        </div>
      ) : (
        <form onSubmit={handlePaymentSubmit} className="space-y-5">
          <div className="text-lg font-semibold text-gray-800 mb-4">
            Booking Summary:
            <p className="text-gray-600 font-normal text-base mt-1">
              Court: <span className="font-medium">{bookingDetails.courtName}</span>, Date: <span className="font-medium">{bookingDetails.date}</span>, Time: <span className="font-medium">{bookingDetails.startTime}:00</span> for <span className="font-medium">{bookingDetails.duration} hour(s)</span>
            </p>
            <p className="text-2xl font-bold text-blue-600 mt-3">Total: {formatPrice(calculatedPrice)}</p>
          </div>

          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              type="text"
              id="cardNumber"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="XXXX XXXX XXXX XXXX"
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="cardholderName">Cardholder Name</Label>
            <Input
              type="text"
              id="cardholderName"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              placeholder="John Doe"
              required
              className="mt-1"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="expiryDate">Expiry Date (MM/YY)</Label>
              <Input
                type="text"
                id="expiryDate"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="MM/YY"
                required
                className="mt-1"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                type="text"
                id="cvv"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                required
                className="mt-1"
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isProcessing}>
            {isProcessing ? 'Processing Payment...' : `Pay ${formatPrice(calculatedPrice)}`}
          </Button>
        </form>
      )}
    </div>
  );
};

export default SimulatedPaymentGateway;