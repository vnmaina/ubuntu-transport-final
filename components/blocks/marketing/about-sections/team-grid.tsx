import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Github } from '@/components/ui/brand-icons';
import { Linkedin, Twitter } from '@/components/ui/brand-icons';

const teamMembers = [
  {
    name: 'Sarah Johnson',
    role: 'CEO & Founder',
    image:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800',
    bio: 'With over 15 years of industry experience, Sarah leads our company vision and strategy.',
    social: {
      twitter: '#',
      linkedin: '#',
      github: '#',
    },
  },
  {
    name: 'Michael Chen',
    role: 'CTO',
    image:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800',
    bio: 'Michael oversees our technical direction and ensures we stay at the cutting edge.',
    social: {
      twitter: '#',
      linkedin: '#',
      github: '#',
    },
  },
  {
    name: 'Jessica Rivera',
    role: 'Design Director',
    image:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800',
    bio: 'Jessica brings a decade of UX/UI expertise and leads our award-winning design team.',
    social: {
      twitter: '#',
      linkedin: '#',
    },
  },
  {
    name: 'David Kim',
    role: 'Lead Developer',
    image:
      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=800',
    bio: 'David is the technical mastermind behind our most complex and successful projects.',
    social: {
      linkedin: '#',
      github: '#',
    },
  },
  {
    name: 'Aisha Patel',
    role: 'Marketing Director',
    image:
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=800',
    bio: 'Aisha develops our marketing strategies and helps clients amplify their message.',
    social: {
      twitter: '#',
      linkedin: '#',
    },
  },
  {
    name: 'Robert Wilson',
    role: 'Project Manager',
    image:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800',
    bio: 'Robert ensures our projects run smoothly and are delivered on time and on budget.',
    social: {
      linkedin: '#',
    },
  },
];

export default function AboutSectionTeamGrid() {
  return (
    <section className="container mx-auto space-y-12 px-4 py-24 md:px-6 2xl:max-w-[1400px]">
      <div className="mx-auto max-w-3xl space-y-4 text-center">
        <h2 className="text-3xl font-bold">Meet Our Team</h2>
        <p className="text-muted-foreground">
          Our diverse team of talented professionals is passionate about
          creating exceptional digital experiences that help our clients
          succeed.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member) => (
          <Card key={member.name} className="overflow-hidden p-0">
            <div className="relative aspect-[4/3]">
              <Image
                src={member.image}
                alt={member.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover object-center"
              />
            </div>
            <CardContent className="space-y-4 p-6 pt-0">
              <div>
                <h3 className="text-lg font-bold">{member.name}</h3>
                <p className="text-primary text-sm font-medium">
                  {member.role}
                </p>
              </div>
              <p className="text-muted-foreground text-sm">{member.bio}</p>
              <div className="flex gap-4">
                {member.social.twitter && (
                  <a
                    href={member.social.twitter}
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Twitter className="h-4 w-4" />
                    <span className="sr-only">Twitter</span>
                  </a>
                )}
                {member.social.linkedin && (
                  <a
                    href={member.social.linkedin}
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Linkedin className="h-4 w-4" />
                    <span className="sr-only">LinkedIn</span>
                  </a>
                )}
                {member.social.github && (
                  <a
                    href={member.social.github}
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Github className="h-4 w-4" />
                    <span className="sr-only">GitHub</span>
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
