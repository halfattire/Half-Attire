import { server } from "../lib/server";

export class SecurePaymentHandler {
  constructor() {
    this.paymentGatewayUrl = process.env.PAYMENT_GATEWAY_URL || server;
    this.isTestMode = process.env.NEXT_PUBLIC_ENVIRONMENT === 'development';
  }

  async processPayment(paymentData) {
    try {
      const response = await fetch(`${this.paymentGatewayUrl}/api/payment/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.PAYMENT_GATEWAY_API_KEY}`,
        },
        body: JSON.stringify({
          amount: paymentData.amount,
          currency: paymentData.currency || 'PKR',
          customer: paymentData.customer,
          orderId: paymentData.orderId,
          // Let payment gateway handle secure card processing
          // Never include card details in your application code
        }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      throw new Error('Payment processing failed');
    }
  }

  async createPaymentIntent(orderData) {
    try {
      const response = await fetch(`${this.paymentGatewayUrl}/api/payment/intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.PAYMENT_GATEWAY_API_KEY}`,
        },
        body: JSON.stringify({
          amount: orderData.totalPrice,
          currency: 'PKR',
          orderId: orderData.orderId,
        }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      throw new Error('Payment intent creation failed');
    }
  }

  // Test mode payment (for development only)
  async processTestPayment(orderData) {
    if (!this.isTestMode) {
      throw new Error('Test payment only available in development mode');
    }

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
      success: true,
      paymentId: `test_${Date.now()}`,
      transactionId: `txn_${Math.random().toString(36).substr(2, 9)}`,
      amount: orderData.totalPrice,
      currency: 'PKR',
      status: 'completed',
      timestamp: new Date().toISOString(),
    };
  }
}

export default SecurePaymentHandler;
