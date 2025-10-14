import React, { useState } from 'react';
import { ShoppingCart, X, Trash2, CreditCard, Mail, CheckCircle, Sparkles, Tag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { sendOrderConfirmation } from '../utils/emailService';
import { supabase } from '../lib/supabase';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { items, removeFromCart, clearCart, getTotalPrice } = useCart();
  const { user } = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);
  const [email, setEmail] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const applyCoupon = async () => {
    setCouponError('');

    const { data, error } = await supabase
      .from('coupon_codes')
      .select('*')
      .eq('code', couponCode.toUpperCase())
      .eq('active', true)
      .maybeSingle();

    if (error || !data) {
      setCouponError('Invalid coupon code');
      return;
    }

    if (data.max_uses && data.current_uses >= data.max_uses) {
      setCouponError('Coupon has reached maximum uses');
      return;
    }

    if (data.valid_until && new Date(data.valid_until) < new Date()) {
      setCouponError('Coupon has expired');
      return;
    }

    setAppliedCoupon(data);
    setCouponCode('');
  };

  const getDiscountAmount = () => {
    if (!appliedCoupon) return 0;

    const subtotal = getTotalPrice();
    if (appliedCoupon.discount_type === 'percentage') {
      return (subtotal * appliedCoupon.discount_value) / 100;
    }
    return appliedCoupon.discount_value;
  };

  const getFinalTotal = () => {
    return Math.max(0, getTotalPrice() - getDiscountAmount());
  };

  const handleCheckout = async () => {
    if (!email) {
      alert('Please enter your email address');
      return;
    }

    if (!user) {
      alert('Please sign in to complete your purchase');
      return;
    }

    setIsProcessing(true);

    try {
      const orderNumber = Math.random().toString(36).substr(2, 9).toUpperCase();
      const finalTotal = getFinalTotal();
      const discountAmount = getDiscountAmount();

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          email: email,
          total_amount: finalTotal,
          coupon_code: appliedCoupon?.code || null,
          discount_amount: discountAmount,
          status: 'completed',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map(item => ({
        order_id: orderData.id,
        product_id: item.id,
        quantity: 1,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      if (appliedCoupon) {
        await supabase
          .from('coupon_codes')
          .update({ current_uses: appliedCoupon.current_uses + 1 })
          .eq('id', appliedCoupon.id);
      }

      const orderDetails = {
        items: items,
        total: finalTotal,
        email: email,
        orderNumber: orderNumber,
      };

      await sendOrderConfirmation(orderDetails);

      setOrderComplete(true);
      clearCart();
      setAppliedCoupon(null);
    } catch (error) {
      console.error('Error processing order:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetCart = () => {
    setShowCheckout(false);
    setOrderComplete(false);
    setEmail('');
    setCouponCode('');
    setAppliedCoupon(null);
    setCouponError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-themed-primary rounded-2xl shadow-themed-lg max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-themed">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="w-6 h-6 text-accent-primary" />
            <h2 className="text-xl font-bold text-themed-primary">
              {orderComplete ? 'Order Complete!' : showCheckout ? 'Checkout' : 'Shopping Cart'}
            </h2>
          </div>
          <button
            onClick={resetCart}
            className="p-2 hover:bg-themed-tertiary rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-themed-secondary" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {orderComplete ? (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-themed-primary mb-2">Thank You!</h3>
                <p className="text-themed-secondary">
                  Your order has been processed successfully. A confirmation email has been sent to{' '}
                  <span className="font-semibold text-accent-primary">{email}</span>
                </p>
              </div>
              <div className="bg-themed-secondary p-4 rounded-lg">
                <p className="text-sm text-themed-secondary">
                  Order Number: <span className="font-mono font-bold text-themed-primary">
                    {Math.random().toString(36).substr(2, 9).toUpperCase()}
                  </span>
                </p>
              </div>
            </div>
          ) : showCheckout ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-themed-primary mb-4">Order Summary</h3>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b border-themed">
                      <div>
                        <p className="font-medium text-themed-primary">{item.title}</p>
                        <p className="text-sm text-themed-secondary">{item.category}</p>
                      </div>
                      <p className="font-semibold text-themed-primary">${item.price}</p>
                    </div>
                  ))}
                  <div className="border-t border-themed pt-3 space-y-2">
                    <div className="flex justify-between items-center text-themed-primary">
                      <span>Subtotal:</span>
                      <span>${getTotalPrice().toFixed(2)}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between items-center text-green-600">
                        <span>Discount ({appliedCoupon.code}):</span>
                        <span>-${getDiscountAmount().toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2 text-lg font-bold border-t border-themed">
                      <span className="text-themed-primary">Total:</span>
                      <span className="text-accent-primary">${getFinalTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-themed-primary mb-2">
                  Coupon Code
                </label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-themed-secondary" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="FALL2025"
                      className="w-full pl-10 pr-4 py-2 border border-themed bg-themed-secondary text-themed-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
                      disabled={!!appliedCoupon}
                    />
                  </div>
                  {appliedCoupon ? (
                    <button
                      onClick={() => setAppliedCoupon(null)}
                      className="px-4 py-2 bg-themed-tertiary text-themed-primary rounded-lg hover:bg-themed-secondary transition-colors"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      onClick={applyCoupon}
                      disabled={!couponCode}
                      className="px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Apply
                    </button>
                  )}
                </div>
                {couponError && (
                  <p className="text-xs text-red-600 mt-1">{couponError}</p>
                )}
                {appliedCoupon && (
                  <p className="text-xs text-green-600 mt-1">
                    Coupon applied! {appliedCoupon.discount_value}% off
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-themed-primary mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-themed-secondary" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 border border-themed bg-themed-secondary text-themed-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  />
                </div>
                <p className="text-xs text-themed-secondary mt-2">
                  We'll send your digital products and receipt to this email
                </p>
              </div>

              <div className="bg-themed-secondary p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="w-5 h-5 text-accent-primary" />
                  <span className="font-semibold text-themed-primary">Free Checkout (Testing)</span>
                </div>
                <p className="text-sm text-themed-secondary">
                  This is a demo checkout. No payment will be processed, but you'll receive a confirmation email.
                </p>
              </div>
            </div>
          ) : (
            <div>
              {items.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-16 h-16 text-themed-tertiary mx-auto mb-4" />
                  <p className="text-themed-secondary">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-themed-secondary rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-themed-primary">{item.title}</h3>
                        <p className="text-sm text-themed-secondary">{item.category}</p>
                        <p className="text-lg font-semibold text-accent-primary">${item.price}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {!orderComplete && (
          <div className="p-6 border-t border-themed">
            {showCheckout ? (
              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing || !email}
                  className="w-full bg-accent-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      <span>Complete Order (Free)</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="w-full bg-themed-tertiary text-themed-primary py-2 px-4 rounded-lg font-medium hover:bg-themed-secondary transition-colors"
                >
                  Back to Cart
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {items.length > 0 && (
                  <>
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span className="text-themed-primary">Total:</span>
                      <span className="text-accent-primary">${getTotalPrice().toFixed(2)}</span>
                    </div>
                    <div className="bg-themed-secondary p-3 rounded-lg">
                      <p className="text-xs text-themed-secondary text-center">
                        Have a coupon? Apply it at checkout!
                      </p>
                    </div>
                  </>
                )}
                <button
                  onClick={() => setShowCheckout(true)}
                  disabled={items.length === 0}
                  className="w-full bg-accent-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Proceed to Checkout</span>
                </button>
                {items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="w-full bg-themed-tertiary text-themed-primary py-2 px-4 rounded-lg font-medium hover:bg-themed-secondary transition-colors"
                  >
                    Clear Cart
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;