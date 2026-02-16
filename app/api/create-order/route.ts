import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = 'INR', receipt } = await req.json();

    const instance = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const options = {
      amount: amount * 100, // amount in smallest currency unit
      currency,
      receipt,
      payment_capture: 1,
    };

    const order = await instance.orders.create(options);

    return NextResponse.json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: 'Could not create order' },
      { status: 500 }
    );
  }
}
