import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { updateSubscriptionTier } from '@/lib/subscription';
import Stripe from 'stripe';

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const clerkUserId = session.metadata?.clerkUserId;
        const interval = session.metadata?.interval as 'monthly' | 'yearly';

        if (clerkUserId && session.subscription) {
          const subscriptionResponse = await stripe.subscriptions.retrieve(
            session.subscription as string
          );

          await updateSubscriptionTier(clerkUserId, 'pro', {
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: subscriptionResponse.id,
            stripePriceId: subscriptionResponse.items.data[0]?.price.id,
            interval,
            currentPeriodStart: new Date((subscriptionResponse as any).current_period_start * 1000),
            currentPeriodEnd: new Date((subscriptionResponse as any).current_period_end * 1000),
          });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const clerkUserId = subscription.metadata?.clerkUserId;

        if (clerkUserId) {
          const isActive = ['active', 'trialing'].includes(subscription.status);
          
          await updateSubscriptionTier(
            clerkUserId,
            isActive ? 'pro' : 'free',
            isActive
              ? {
                  stripeSubscriptionId: subscription.id,
                  stripePriceId: subscription.items.data[0]?.price.id,
                  currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
                  currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
                }
              : undefined
          );
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const clerkUserId = subscription.metadata?.clerkUserId;

        if (clerkUserId) {
          await updateSubscriptionTier(clerkUserId, 'free', {
            stripeSubscriptionId: undefined,
            stripePriceId: undefined,
            currentPeriodStart: undefined,
            currentPeriodEnd: undefined,
          });
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = (invoice as any).subscription;
        if (subscriptionId) {
          const subscriptionResponse = await stripe.subscriptions.retrieve(
            subscriptionId as string
          );
          const clerkUserId = subscriptionResponse.metadata?.clerkUserId;

          if (clerkUserId) {
            await updateSubscriptionTier(clerkUserId, 'pro', {
              currentPeriodStart: new Date((subscriptionResponse as any).current_period_start * 1000),
              currentPeriodEnd: new Date((subscriptionResponse as any).current_period_end * 1000),
            });
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        console.error('Payment failed for invoice:', invoice.id);
        // Could send notification email here
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
