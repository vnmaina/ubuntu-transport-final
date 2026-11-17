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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeftIcon,
  BookmarkIcon,
  BriefcaseIcon,
  Building2Icon,
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  DollarSignIcon,
  GlobeIcon,
  MailIcon,
  MapPinIcon,
  ShareIcon,
} from 'lucide-react';
import Link from "next/link";

type LocationType = 'remote' | 'hybrid' | 'onsite';
type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'internship';

interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  locationType: LocationType;
  employmentType: EmploymentType;
  postedDate: string;
  salaryRange: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  applicationDeadline?: string;
  teamSize: number;
  reportingTo: string;
}

export default function JobDetails() {
  // In a real implementation, this data would be fetched from an API
  // based on the job ID from URL params or props
  const job: JobPosition = {
    id: 'senior-frontend-dev-2023',
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    locationType: 'hybrid',
    employmentType: 'full-time',
    postedDate: '2023-06-15',
    salaryRange: '$120,000 - $150,000',
    description:
      'We are seeking a talented Senior Frontend Developer to join our engineering team. In this role, you will be responsible for developing and implementing user interface components using React.js and related technologies. You will work closely with designers, product managers, and backend developers to create seamless user experiences across our products.',
    responsibilities: [
      'Develop and implement highly responsive user interface components using React.js',
      'Work with product designers to translate UI/UX wireframes into responsive, interactive features',
      'Build reusable components and libraries for future use across our applications',
      'Optimize components for maximum performance across a vast array of web-capable devices',
      'Implement automated testing platforms and unit tests to ensure code quality',
      'Collaborate with backend developers on RESTful API integration',
      'Participate in code reviews and mentor junior developers',
      'Stay up-to-date with emerging technologies and industry trends',
    ],
    requirements: [
      '5+ years of experience with modern JavaScript frameworks (React, Vue, Angular)',
      'Strong proficiency in TypeScript, HTML5, and CSS3/SASS',
      'Experience with state management libraries (Redux, MobX, or Context API)',
      'Knowledge of modern frontend build pipelines and tools',
      'Understanding of server-side rendering and its benefits',
      'Familiarity with RESTful APIs and GraphQL',
      'Experience with responsive and adaptive design',
      'Strong problem-solving skills and attention to detail',
      'Excellent communication and teamwork skills',
      'BS/MS in Computer Science or equivalent practical experience',
    ],
    benefits: [
      'Competitive salary and equity package',
      'Health, dental, and vision insurance',
      '401(k) with company match',
      'Flexible working hours',
      'Remote work options (2 days/week in office required)',
      'Professional development budget',
      'Wellness stipend',
      'Generous PTO policy',
      'Parental leave',
      'Regular team events and offsites',
    ],
    applicationDeadline: '2023-07-31',
    teamSize: 8,
    reportingTo: 'Engineering Manager',
  };

  // Calculate days since posting
  const calculateDaysAgo = (dateString: string) => {
    const postedDate = new Date(dateString);
    const currentDate = new Date();
    const differenceInTime = currentDate.getTime() - postedDate.getTime();
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));

    if (differenceInDays === 0) {
      return 'Today';
    } else if (differenceInDays === 1) {
      return 'Yesterday';
    } else {
      return `${differenceInDays} days ago`;
    }
  };

  // Format date in a more readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Determine the badge color for location type
  const getLocationTypeBadge = (type: LocationType) => {
    switch (type) {
      case 'remote':
        return (
          <Badge
            variant="outline"
            className="rounded-full border-green-200 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
          >
            Remote
          </Badge>
        );
      case 'hybrid':
        return (
          <Badge
            variant="outline"
            className="rounded-full border-blue-200 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
          >
            Hybrid
          </Badge>
        );
      case 'onsite':
        return (
          <Badge
            variant="outline"
            className="rounded-full border-orange-200 bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
          >
            On-site
          </Badge>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="#"
          className="text-muted-foreground mb-4 inline-flex items-center text-sm font-medium hover:underline"
        >
          <ArrowLeftIcon className="mr-1 h-4 w-4" />
          Back to all jobs
        </Link>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">{job.title}</h1>
            <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-3 text-sm">
              <span className="flex items-center">
                <BriefcaseIcon className="mr-1 h-4 w-4" />
                {job.department}
              </span>
              <span className="flex items-center">
                <MapPinIcon className="mr-1 h-4 w-4" />
                {job.location}
              </span>
              <span className="flex items-center">
                <ClockIcon className="mr-1 h-4 w-4" />
                Posted {calculateDaysAgo(job.postedDate)}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {getLocationTypeBadge(job.locationType)}
            <Badge variant="outline" className="font-normal">
              {job.employmentType === 'full-time'
                ? 'Full-time'
                : job.employmentType === 'part-time'
                  ? 'Part-time'
                  : job.employmentType === 'contract'
                    ? 'Contract'
                    : 'Internship'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{job.description}</p>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-md border p-4">
                  <div className="flex items-center gap-2">
                    <DollarSignIcon className="text-muted-foreground h-5 w-5" />
                    <h3 className="font-medium">Salary Range</h3>
                  </div>
                  <p className="mt-1">{job.salaryRange}</p>
                </div>
                <div className="rounded-md border p-4">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="text-muted-foreground h-5 w-5" />
                    <h3 className="font-medium">Application Deadline</h3>
                  </div>
                  <p className="mt-1">
                    {job.applicationDeadline
                      ? formatDate(job.applicationDeadline)
                      : 'Open until filled'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="responsibilities" className="gap-0">
            <TabsList className="h-fit w-full flex-wrap">
              <TabsTrigger value="responsibilities">
                Responsibilities
              </TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
            </TabsList>
            <TabsContent value="responsibilities" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    {job.responsibilities.map((item, index) => (
                      <li key={index} className="flex gap-2">
                        <CheckIcon className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="requirements" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    {job.requirements.map((item, index) => (
                      <li key={index} className="flex gap-2">
                        <CheckIcon className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="benefits" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    {job.benefits.map((item, index) => (
                      <li key={index} className="flex gap-2">
                        <CheckIcon className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Apply Now</CardTitle>
              <CardDescription>
                Take the next step in your career
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" size="lg">
                Apply for this Position
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                <BookmarkIcon className="mr-2 h-4 w-4" />
                Save for Later
              </Button>
              <Button variant="ghost" className="w-full" size="lg">
                <ShareIcon className="mr-2 h-4 w-4" />
                Share Position
              </Button>
            </CardContent>
            <CardFooter className="flex flex-col items-start border-t">
              <p className="text-sm font-medium">Have questions?</p>
              <a
                href="mailto:careers@example.com"
                className="text-muted-foreground hover:text-foreground mt-1 flex items-center text-sm"
              >
                <MailIcon className="mr-2 h-4 w-4" />
                careers@example.com
              </a>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Building2Icon className="text-muted-foreground mt-0.5 h-5 w-5" />
                <div>
                  <p className="font-medium">Team Size</p>
                  <p className="text-muted-foreground text-sm">
                    {job.teamSize} members
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BriefcaseIcon className="text-muted-foreground mt-0.5 h-5 w-5" />
                <div>
                  <p className="font-medium">Reporting To</p>
                  <p className="text-muted-foreground text-sm">
                    {job.reportingTo}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <GlobeIcon className="text-muted-foreground mt-0.5 h-5 w-5" />
                <div>
                  <p className="font-medium">Company Website</p>
                  <Link href="#" className="text-primary text-sm hover:underline">
                    example.com
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
