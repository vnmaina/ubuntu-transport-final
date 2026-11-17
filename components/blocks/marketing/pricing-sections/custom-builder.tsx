"use client";

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckIcon, PlusIcon, MinusIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from "next/link";

// Base plans
const basePlans = [
  {
    name: 'Starter',
    basePrice: 29,
    description: 'Essential features for individuals',
    includedUsers: 1,
    includedStorage: 10,
    includedProjects: 5,
    features: ['Basic analytics', 'Email support', 'API access (100 req/day)'],
  },
  {
    name: 'Business',
    basePrice: 79,
    description: 'Advanced features for teams',
    includedUsers: 5,
    includedStorage: 50,
    includedProjects: 20,
    features: [
      'Advanced analytics',
      'Priority support',
      'API access (1,000 req/day)',
      'Team collaboration',
      'Custom domains',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    basePrice: 199,
    description: 'Complete solution for organizations',
    includedUsers: 20,
    includedStorage: 200,
    includedProjects: 100,
    features: [
      'Enterprise analytics',
      '24/7 phone support',
      'API access (10,000 req/day)',
      'Team collaboration',
      'Custom domains',
      'SSO authentication',
      'Custom integrations',
      'Dedicated account manager',
    ],
  },
];

// Add-ons
const addOns = [
  {
    id: 'additional-users',
    name: 'Additional Users',
    description: 'Add more users to your plan',
    pricePerUnit: 10,
    unit: 'user',
  },
  {
    id: 'additional-storage',
    name: 'Additional Storage',
    description: 'Add more storage to your plan',
    pricePerUnit: 5,
    unit: '10GB',
  },
  {
    id: 'premium-support',
    name: 'Premium Support',
    description: 'Get faster response times and dedicated support',
    price: 49,
  },
  {
    id: 'custom-training',
    name: 'Custom Training',
    description: 'Personalized training sessions for your team',
    price: 199,
  },
];

export default function PricingSectionCustomBuilder() {
  const [selectedPlan, setSelectedPlan] = useState(basePlans[1]!);
  const [additionalUsers, setAdditionalUsers] = useState(0);
  const [additionalStorage, setAdditionalStorage] = useState(0);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annually'>(
    'monthly'
  );

  // Calculate total price
  const calculateTotalPrice = () => {
    let total = selectedPlan.basePrice;

    // Add cost for additional users
    total += additionalUsers * 10;

    // Add cost for additional storage
    total += additionalStorage * 5;

    // Add cost for selected add-ons
    selectedAddOns.forEach((id) => {
      const addOn = addOns.find((a) => a.id === id);
      if (addOn && addOn.price) {
        total += addOn.price;
      }
    });

    // Apply annual discount
    if (billingPeriod === 'annually') {
      total = total * 12 * 0.8; // 20% discount
    }

    return total;
  };

  // Toggle add-on selection
  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Format price with commas
  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6 2xl:max-w-[1400px]">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Build Your Perfect Plan
            </h2>
            <p className="text-muted-foreground mx-auto max-w-[700px] md:text-xl/relaxed">
              Customize your plan to fit your exact needs. Only pay for what you
              use.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-6xl">
          <Tabs
            defaultValue="monthly"
            className="w-full"
            onValueChange={(value) =>
              setBillingPeriod(value as 'monthly' | 'annually')
            }
          >
            <div className="flex justify-center">
              <TabsList className="mb-8">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="annually">Annually (Save 20%)</TabsTrigger>
              </TabsList>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-8">
                <div>
                  <h3 className="mb-4 text-lg font-medium">
                    1. Choose your base plan
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {basePlans.map((plan) => (
                      <Card
                        key={plan.name}
                        className={cn(
                          'hover:border-primary cursor-pointer transition-all',
                          selectedPlan.name === plan.name &&
                            'border-primary bg-primary/5',
                          plan.popular && !selectedPlan && 'border-primary'
                        )}
                        onClick={() => setSelectedPlan(plan)}
                      >
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">{plan.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {formatPrice(plan.basePrice)}
                            <span className="text-muted-foreground text-sm font-normal">
                              /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                            </span>
                          </div>
                          <p className="text-muted-foreground mt-1 text-xs">
                            {plan.description}
                          </p>
                          <div className="mt-3 space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span>Users</span>
                              <span>{plan.includedUsers}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Storage</span>
                              <span>{plan.includedStorage}GB</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Projects</span>
                              <span>{plan.includedProjects}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-medium">
                    2. Customize your plan
                  </h3>
                  <Card className="p-0">
                    <CardContent className="space-y-6 py-6">
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <Label>Additional Users</Label>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() =>
                                setAdditionalUsers(
                                  Math.max(0, additionalUsers - 1)
                                )
                              }
                              disabled={additionalUsers === 0}
                            >
                              <MinusIcon className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">
                              {additionalUsers}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() =>
                                setAdditionalUsers(additionalUsers + 1)
                              }
                            >
                              <PlusIcon className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-muted-foreground text-xs">
                          ${addOns[0]!.pricePerUnit} per additional user per
                          month
                        </div>
                      </div>

                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <Label>Additional Storage</Label>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() =>
                                setAdditionalStorage(
                                  Math.max(0, additionalStorage - 1)
                                )
                              }
                              disabled={additionalStorage === 0}
                            >
                              <MinusIcon className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">
                              {additionalStorage}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() =>
                                setAdditionalStorage(additionalStorage + 1)
                              }
                            >
                              <PlusIcon className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-muted-foreground text-xs">
                          ${addOns[1]!.pricePerUnit} per additional 10GB per
                          month
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-medium">
                    3. Select add-ons
                  </h3>
                  <Card className="p-0">
                    <CardContent className="space-y-4 py-6">
                      {addOns.slice(2).map((addOn) => (
                        <div
                          key={addOn.id}
                          className="flex items-start space-x-3"
                        >
                          <Checkbox
                            id={addOn.id}
                            checked={selectedAddOns.includes(addOn.id)}
                            onCheckedChange={() => toggleAddOn(addOn.id)}
                          />
                          <div className="flex-1">
                            <Label
                              htmlFor={addOn.id}
                              className="cursor-pointer text-sm font-medium"
                            >
                              {addOn.name} - ${addOn.price}/month
                            </Label>
                            <p className="text-muted-foreground text-xs">
                              {addOn.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="space-y-8">
                <div className="sticky top-4">
                  <h3 className="mb-4 text-lg font-medium">Your Custom Plan</h3>
                  <Card>
                    <CardHeader>
                      <CardTitle>{selectedPlan.name} Plan</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Base Plan</span>
                          <span>{formatPrice(selectedPlan.basePrice)}</span>
                        </div>
                        {additionalUsers > 0 && (
                          <div className="flex justify-between">
                            <span>Additional Users ({additionalUsers})</span>
                            <span>{formatPrice(additionalUsers * 10)}</span>
                          </div>
                        )}
                        {additionalStorage > 0 && (
                          <div className="flex justify-between">
                            <span>
                              Additional Storage ({additionalStorage * 10}GB)
                            </span>
                            <span>{formatPrice(additionalStorage * 5)}</span>
                          </div>
                        )}
                        {selectedAddOns.map((id) => {
                          const addOn = addOns.find((a) => a.id === id);
                          if (addOn && addOn.price) {
                            return (
                              <div key={id} className="flex justify-between">
                                <span>{addOn.name}</span>
                                <span>{formatPrice(addOn.price)}</span>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex justify-between font-medium">
                          <span>
                            Total {billingPeriod === 'annually' && '(per year)'}
                          </span>
                          <span>{formatPrice(calculateTotalPrice())}</span>
                        </div>
                        {billingPeriod === 'annually' && (
                          <div className="text-muted-foreground mt-1 text-right text-xs">
                            Includes 20% annual discount
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium">Included Features:</h4>
                        <ul className="space-y-1 text-sm">
                          {selectedPlan.features.map((feature) => (
                            <li key={feature} className="flex items-center">
                              <CheckIcon className="text-primary mr-2 h-4 w-4" />
                              <span>{feature}</span>
                            </li>
                          ))}
                          {additionalUsers > 0 && (
                            <li className="flex items-center">
                              <CheckIcon className="text-primary mr-2 h-4 w-4" />
                              <span>
                                {selectedPlan.includedUsers + additionalUsers}{' '}
                                total users
                              </span>
                            </li>
                          )}
                          {additionalStorage > 0 && (
                            <li className="flex items-center">
                              <CheckIcon className="text-primary mr-2 h-4 w-4" />
                              <span>
                                {selectedPlan.includedStorage +
                                  additionalStorage * 10}
                                GB total storage
                              </span>
                            </li>
                          )}
                          {selectedAddOns.map((id) => {
                            const addOn = addOns.find((a) => a.id === id);
                            if (addOn) {
                              return (
                                <li key={id} className="flex items-center">
                                  <CheckIcon className="text-primary mr-2 h-4 w-4" />
                                  <span>{addOn.name}</span>
                                </li>
                              );
                            }
                            return null;
                          })}
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">
                        <Link href="#">Get Started</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </div>
          </Tabs>
        </div>

        <div className="bg-muted/30 mx-auto mt-16 max-w-3xl rounded-lg border p-8 text-center">
          <h3 className="text-xl font-medium">
            Need a more customized solution?
          </h3>
          <p className="text-muted-foreground mt-2">
            Contact our sales team for a personalized quote tailored to your
            specific requirements.
          </p>
          <Button className="mt-6" variant="outline" >
            <Link href="#">Contact Sales</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
