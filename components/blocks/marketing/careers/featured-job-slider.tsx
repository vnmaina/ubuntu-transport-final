"use client";

import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  BriefcaseIcon,
  BuildingIcon,
  MapPinIcon,
  DollarSignIcon,
  StarIcon,
  BookmarkIcon,
  TrendingUpIcon,
  BarChartIcon,
  UsersIcon,
  CalendarIcon,
} from 'lucide-react';
import Image from "next/image";
import Link from "next/link";

interface JobPosition {
  id: string;
  title: string;
  department: string;
  companyName: string;
  companyLogo: string;
  location: string;
  locationType: 'remote' | 'onsite' | 'hybrid';
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship';
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  postedDate: string;
  salary: string;
  description: string;
  featured: boolean;
  highlight: 'new' | 'trending' | 'competitive' | 'popular' | undefined;
  perks: string[];
}

export default function FeaturedJobSlider() {
  // Sample job position data
  const jobPositions: JobPosition[] = [
    {
      id: 'senior-frontend-engineer',
      title: 'Senior Frontend Engineer',
      department: 'Engineering',
      companyName: 'TechVision',
      companyLogo: 'https://cdn.worldvectorlogo.com/logos/react-2.svg',
      location: 'San Francisco, CA',
      locationType: 'hybrid',
      employmentType: 'full-time',
      experienceLevel: 'senior',
      postedDate: '2023-09-15',
      salary: '$130,000 - $160,000',
      description:
        'Lead the development of our flagship product using React, TypeScript, and modern web technologies. Join a talented team working on cutting-edge solutions.',
      featured: true,
      highlight: 'competitive',
      perks: [
        'Flexible hours',
        'Remote options',
        'Health insurance',
        '401(k) match',
        'Learning budget',
      ],
    },
    {
      id: 'product-manager',
      title: 'Product Manager',
      department: 'Product',
      companyName: 'InnovateCorp',
      companyLogo:
        'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg',
      location: 'New York, NY',
      locationType: 'hybrid',
      employmentType: 'full-time',
      experienceLevel: 'senior',
      postedDate: '2023-09-18',
      salary: '$120,000 - $150,000',
      description:
        'Define the product vision and strategy for our SaaS platform. Collaborate with cross-functional teams to deliver exceptional user experiences.',
      featured: true,
      highlight: 'new',
      perks: [
        'Unlimited PTO',
        'Health benefits',
        'Remote work options',
        'Stock options',
        'Catered lunches',
      ],
    },
    {
      id: 'senior-data-scientist',
      title: 'Senior Data Scientist',
      department: 'Data Science',
      companyName: 'DataDriven',
      companyLogo: 'https://cdn.worldvectorlogo.com/logos/python-5.svg',
      location: 'Remote',
      locationType: 'remote',
      employmentType: 'full-time',
      experienceLevel: 'senior',
      postedDate: '2023-09-16',
      salary: '$140,000 - $170,000',
      description:
        'Apply machine learning and statistical techniques to solve complex business problems. Work with large datasets to extract insights and drive decision-making.',
      featured: true,
      highlight: 'trending',
      perks: [
        'Remote-first culture',
        'Flexible schedule',
        'Quarterly team retreats',
        'Health & wellness stipend',
        'Home office budget',
      ],
    },
    {
      id: 'software-architect',
      title: 'Software Architect',
      department: 'Engineering',
      companyName: 'CloudNative',
      companyLogo: 'https://cdn.worldvectorlogo.com/logos/aws-2.svg',
      location: 'Seattle, WA',
      locationType: 'hybrid',
      employmentType: 'full-time',
      experienceLevel: 'lead',
      postedDate: '2023-09-14',
      salary: '$160,000 - $190,000',
      description:
        'Design and lead the development of scalable, cloud-native applications. Drive technical decisions and mentor junior engineers in best practices.',
      featured: true,
      highlight: 'competitive',
      perks: [
        'Competitive salary',
        'Stock options',
        '401(k) with 6% match',
        'Comprehensive healthcare',
        'Professional development budget',
      ],
    },
    {
      id: 'ux-design-lead',
      title: 'UX Design Lead',
      department: 'Design',
      companyName: 'CreativeMinds',
      companyLogo: 'https://cdn.worldvectorlogo.com/logos/adobe-2.svg',
      location: 'Los Angeles, CA',
      locationType: 'onsite',
      employmentType: 'full-time',
      experienceLevel: 'lead',
      postedDate: '2023-09-17',
      salary: '$130,000 - $160,000',
      description:
        'Lead a team of designers to create intuitive, engaging user experiences. Collaborate with product and engineering teams to deliver cohesive products.',
      featured: true,
      highlight: 'popular',
      perks: [
        'Creative studio environment',
        'Latest design tools',
        'Healthcare coverage',
        'Gym membership',
        'Casual dress code',
      ],
    },
    {
      id: 'backend-engineer',
      title: 'Backend Engineer',
      department: 'Engineering',
      companyName: 'ServerStack',
      companyLogo: 'https://cdn.worldvectorlogo.com/logos/nodejs-1.svg',
      location: 'Boston, MA',
      locationType: 'hybrid',
      employmentType: 'full-time',
      experienceLevel: 'mid',
      postedDate: '2023-09-20',
      salary: '$115,000 - $140,000',
      description:
        'Develop scalable backend services and APIs using modern technologies. Collaborate with frontend teams to integrate user interfaces.',
      featured: true,
      highlight: 'new',
      perks: [
        'Flexible working hours',
        'Remote options',
        'Healthcare',
        'Wellness program',
        'Professional development',
      ],
    },
  ];

  // Calculate days ago from date
  const getDaysAgo = (dateString: string) => {
    const postDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - postDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      return `${diffDays} days ago`;
    }
  };

  // Format location type for display
  const formatLocationType = (type: string) => {
    switch (type) {
      case 'remote':
        return 'Remote';
      case 'hybrid':
        return 'Hybrid';
      case 'onsite':
        return 'On-site';
      default:
        return type;
    }
  };

  // Format employment type for display
  const formatEmploymentType = (type: string) => {
    switch (type) {
      case 'full-time':
        return 'Full-time';
      case 'part-time':
        return 'Part-time';
      case 'contract':
        return 'Contract';
      case 'internship':
        return 'Internship';
      default:
        return type;
    }
  };

  // Get appropriate highlight icon and color
  const getHighlightDetails = (highlight: JobPosition['highlight']) => {
    switch (highlight) {
      case 'new':
        return {
          icon: <StarIcon className="h-4 w-4" />,
          label: 'New',
          color:
            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        };
      case 'trending':
        return {
          icon: <TrendingUpIcon className="h-4 w-4" />,
          label: 'Trending',
          color:
            'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
        };
      case 'competitive':
        return {
          icon: <BarChartIcon className="h-4 w-4" />,
          label: 'Competitive',
          color:
            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        };
      case 'popular':
        return {
          icon: <UsersIcon className="h-4 w-4" />,
          label: 'Popular',
          color:
            'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
        };
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight">
          Featured Opportunities
        </h2>
        <p className="text-muted-foreground mx-auto max-w-2xl">
          Discover our handpicked selection of top job opportunities from
          leading companies. These positions offer competitive salaries, great
          benefits, and exciting career growth.
        </p>
      </div>

      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {jobPositions.map((job) => {
            const highlightDetails = job.highlight
              ? getHighlightDetails(job.highlight)
              : null;

            return (
              <CarouselItem
                key={job.id}
                className="pl-2 sm:basis-1/2 md:pl-4 lg:basis-1/3"
              >
                <Card className="flex h-full flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="bg-card relative flex h-12 w-12 items-center justify-center rounded-md border">
                        <div className="absolute flex h-full w-full items-center justify-center">
                          {job.companyLogo ? (
                            <Image
                              src={job.companyLogo}
                              alt={job.companyName}
                              width={48}
                              height={48}
                              className="h-12 w-12 object-contain"
                            />
                          ) : (
                            <BuildingIcon className="text-muted-foreground h-6 w-6" />
                          )}
                        </div>
                      </div>
                      {highlightDetails && (
                        <Badge
                          variant="secondary"
                          className={`flex items-center gap-1 ${highlightDetails.color}`}
                        >
                          {highlightDetails.icon}
                          {highlightDetails.label}
                        </Badge>
                      )}
                    </div>
                    <div className="mt-3">
                      <CardTitle>{job.title}</CardTitle>
                      <div className="mt-1 flex items-center gap-1">
                        <BuildingIcon className="text-muted-foreground h-3.5 w-3.5" />
                        <CardDescription className="!mt-0">
                          {job.companyName}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-grow flex-col gap-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="text-muted-foreground h-4 w-4" />
                        <span className="text-sm">{job.location}</span>
                        <Badge variant="outline" className="ml-auto text-xs">
                          {formatLocationType(job.locationType)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <BriefcaseIcon className="text-muted-foreground h-4 w-4" />
                        <span className="text-sm">{job.department}</span>
                        <Badge variant="outline" className="ml-auto text-xs">
                          {formatEmploymentType(job.employmentType)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSignIcon className="text-muted-foreground h-4 w-4" />
                        <span className="text-sm">{job.salary}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="text-muted-foreground h-4 w-4" />
                        <span className="text-sm">
                          Posted {getDaysAgo(job.postedDate)}
                        </span>
                      </div>
                    </div>

                    <p className="text-muted-foreground mt-2 text-sm">
                      {job.description}
                    </p>

                    <div className="mt-auto">
                      <p className="text-muted-foreground mb-1.5 text-xs font-medium">
                        Perks & Benefits:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {job.perks.slice(0, 3).map((perk, index) => (
                          <Badge
                            variant="secondary"
                            key={index}
                            className="text-xs"
                          >
                            {perk}
                          </Badge>
                        ))}
                        {job.perks.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{job.perks.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-3 pt-2">
                    <Button variant="outline" size="sm" className="w-1/2">
                      <BookmarkIcon className="mr-1 h-4 w-4" />
                      Save
                    </Button>
                    <Button size="sm" className="w-1/2">
                      Apply Now
                    </Button>
                  </CardFooter>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <div className="mt-8 flex justify-center">
          <CarouselPrevious className="relative static mr-2 lg:absolute" />
          <CarouselNext className="relative static ml-2 lg:absolute" />
        </div>
      </Carousel>

      <div className="mt-12 text-center">
        <Button  variant="default" size="lg" className="px-8">
          <Link href="#">View All Positions</Link>
        </Button>
      </div>
    </div>
  );
}
