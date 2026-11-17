import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  DollarSign,
  LineChart,
  PieChart,
  Target,
  Zap,
} from 'lucide-react';

type ImpactStat = {
  id: string;
  value: string;
  prefix?: string;
  suffix?: string;
  label: string;
  description: string;
  icon: React.ReactNode;
};

const impactStats: ImpactStat[] = [
  {
    id: 'roi',
    value: '437',
    prefix: '',
    suffix: '%',
    label: 'Average ROI',
    description: 'Return on investment for businesses using our platform',
    icon: <LineChart className="text-primary h-8 w-8" />,
  },
  {
    id: 'revenue',
    value: '2.4',
    prefix: '$',
    suffix: 'B+',
    label: 'Revenue Generated',
    description: 'Total revenue generated for our customers',
    icon: <DollarSign className="h-8 w-8 text-emerald-500" />,
  },
  {
    id: 'conversion',
    value: '89',
    suffix: '%',
    label: 'Conversion Increase',
    description: 'Average lift in conversion rates after implementation',
    icon: <PieChart className="h-8 w-8 text-blue-500" />,
  },
  {
    id: 'time',
    value: '60',
    suffix: '%',
    label: 'Time Saved',
    description: 'Average reduction in manual workload for marketing teams',
    icon: <Clock className="h-8 w-8 text-amber-500" />,
  },
  {
    id: 'growth',
    value: '3.7',
    suffix: 'x',
    label: 'Customer Growth',
    description: 'Average growth in customer base year-over-year',
    icon: <Target className="h-8 w-8 text-purple-500" />,
  },
  {
    id: 'efficiency',
    value: '83',
    suffix: '%',
    label: 'Marketing Efficiency',
    description: 'Improvement in marketing efficiency across channels',
    icon: <Zap className="h-8 w-8 text-rose-500" />,
  },
];

export default function ImpactNumbers() {
  return (
    <div className="relative container mx-auto overflow-hidden px-4 py-24 md:px-6 lg:py-32 2xl:max-w-[1400px]">
      {/* Background gradient */}
      <div className="from-primary/5 to-background pointer-events-none absolute inset-0 bg-gradient-to-br" />

      <div className="relative mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <Badge className="mb-4">Proven Results</Badge>
          <h2 className="mb-4 text-3xl font-bold md:text-5xl">
            Transforming Businesses <br className="hidden md:inline" />
            With Real Numbers
          </h2>
          <p className="text-muted-foreground mx-auto max-w-3xl text-lg">
            Our platform delivers measurable impact for businesses of all sizes.
            See the difference in black and white.
          </p>
        </div>

        {/* Impact Numbers Grid */}
        <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {impactStats.map((stat) => (
            <Card
              key={stat.id}
              className={cn('overflow-hidden p-0', 'bg-card border')}
            >
              <CardContent className="p-6 md:p-8">
                <div className="mb-6">{stat.icon}</div>

                <div className="mb-2 flex items-end">
                  {stat.prefix && (
                    <span className="mr-1 mb-1 text-2xl font-bold">
                      {stat.prefix}
                    </span>
                  )}
                  <h3 className="text-4xl font-bold tracking-tight md:text-5xl">
                    {stat.value}
                  </h3>
                  {stat.suffix && (
                    <span className="mb-1 ml-1 text-2xl font-bold">
                      {stat.suffix}
                    </span>
                  )}
                </div>

                <div className="mb-4 text-xl font-semibold">{stat.label}</div>
                <p className="text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Industry comparison */}
        <div className="bg-muted mb-16 rounded-xl p-8">
          <div className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
            <div>
              <h3 className="mb-4 text-2xl font-bold">
                How Does This Compare?
              </h3>
              <p className="text-muted-foreground mb-6">
                Our platform delivers results that are 4x better than industry
                averages across all key performance indicators.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-muted-foreground/20 h-2 w-full overflow-hidden rounded-full">
                    <div className="bg-muted-foreground h-full w-[24%]" />
                  </div>
                  <span className="min-w-[60px] text-sm font-medium">
                    Industry
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-primary/20 h-2 w-full overflow-hidden rounded-full">
                    <div className="bg-primary h-full w-[89%]" />
                  </div>
                  <span className="min-w-[60px] text-sm font-medium">
                    Our Platform
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 text-center md:border-l md:pl-16 md:text-left">
              <div>
                <div className="text-muted-foreground text-sm">
                  INDUSTRY AVERAGE
                </div>
                <div className="text-3xl font-bold">24%</div>
              </div>
              <div className="flex h-12 items-center justify-center md:justify-start">
                <ArrowUpRight className="text-primary h-8 w-8" />
              </div>
              <div>
                <div className="text-primary text-sm font-medium">
                  OUR PLATFORM
                </div>
                <div className="text-primary text-4xl font-bold">89%</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h3 className="mb-6 text-2xl font-bold">
            Ready to See These Results in Your Business?
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="#"
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-2 rounded-md px-8 py-3 text-sm font-medium shadow"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#"
              className="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center rounded-md border px-8 py-3 text-sm font-medium shadow-sm"
            >
              View Case Studies
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
