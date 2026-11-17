"use client";

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckIcon, ArrowRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from "next/link";

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'For personal projects and learning',
    features: [
      '1 user',
      '3 projects',
      'Community support',
      '1GB storage',
      'Basic analytics',
    ],
    cta: 'Get Started',
    popular: false,
    color: 'bg-muted/50',
  },
  {
    name: 'Pro',
    price: '$19',
    description: 'For professionals and freelancers',
    features: [
      '1 user',
      'Unlimited projects',
      'Priority support',
      '10GB storage',
      'Advanced analytics',
      'API access',
      'Custom domains',
    ],
    cta: 'Start Free Trial',
    popular: true,
    color: 'bg-primary/5',
  },
  {
    name: 'Team',
    price: '$49',
    description: 'For small teams and businesses',
    features: [
      'Up to 5 users',
      'Unlimited projects',
      'Priority support',
      '50GB storage',
      'Advanced analytics',
      'API access',
      'Custom domains',
      'Team collaboration',
    ],
    cta: 'Start Free Trial',
    popular: false,
    color: 'bg-muted/50',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations with custom needs',
    features: [
      'Unlimited users',
      'Unlimited projects',
      '24/7 phone support',
      'Unlimited storage',
      'Advanced analytics',
      'API access',
      'Custom domains',
      'Team collaboration',
      'SSO authentication',
      'Custom integrations',
      'Dedicated account manager',
    ],
    cta: 'Contact Sales',
    popular: false,
    color: 'bg-muted/50',
  },
];

export default function PricingSectionStacked() {
  return (
    <section className="w-full py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6 2xl:max-w-[1400px]">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Choose Your Plan
            </h2>
            <p className="text-muted-foreground mx-auto max-w-[700px] md:text-xl/relaxed">
              Select the perfect plan for your needs. All plans include a 14-day
              free trial.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-5xl space-y-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                'relative overflow-hidden rounded-xl border p-6 transition-all hover:shadow-md md:p-8',
                plan.popular ? 'border-primary' : 'border-border',
                plan.color
              )}
            >
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                    {plan.popular && (
                      <Badge variant="default">Most Popular</Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground">{plan.description}</p>
                </div>
                <div className="flex flex-col items-start gap-2 md:items-end">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.price !== 'Custom' && (
                      <span className="text-muted-foreground">/month</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <CheckIcon className="text-primary h-4 w-4" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <Button className="group" variant={plan.popular ? 'default' : 'outline'} >
                  <Link href="#">{plan.cta}<ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-muted-foreground mt-12 text-center text-sm">
          Need help choosing the right plan?{' '}
          <Link
            href="#"
            className="text-primary underline underline-offset-4"
          >
            Talk to our sales team
          </Link>
        </div>
      </div>
    </section>
  );
}
