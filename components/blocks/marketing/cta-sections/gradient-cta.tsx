import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import Link from "next/link";

export default function GradientCTA() {
  return (
    <>
      {/* Gradient CTA Section */}
      <div className="relative overflow-hidden py-16 md:py-24">
        <div className="from-primary/20 via-primary/10 to-background absolute inset-0 bg-gradient-to-r"></div>
        <div className="relative z-10 container mx-auto px-4 md:px-6 2xl:max-w-[1400px]">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="bg-background/80 inline-block rounded-full border px-3 py-1 shadow-sm backdrop-blur-sm">
              <div className="flex items-center gap-1.5">
                <Sparkles className="text-primary h-3.5 w-3.5" />
                <span className="text-xs font-medium">
                  New Features Available
                </span>
              </div>
            </div>
            <div className="max-w-3xl space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Elevate your experience with our premium plan
              </h2>
              <p className="text-muted-foreground mx-auto max-w-[700px] md:text-xl">
                Get access to advanced features, priority support, and powerful
                integrations.
              </p>
            </div>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="shadow-md" >
                <Link href="#">Upgrade Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-background/80 shadow-sm backdrop-blur-sm" >
                <Link href="#">Compare Plans</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* End Gradient CTA Section */}
    </>
  );
}
