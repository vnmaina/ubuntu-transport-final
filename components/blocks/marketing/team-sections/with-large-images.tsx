import { Twitter, Github, Linkedin } from '@/components/ui/brand-icons';
import { Button } from '@/components/ui/button';
import Image from "next/image";

const team = [
  {
    name: 'David Forren',
    role: 'Founder / CEO',
    bio: 'I am an ambitious workaholic, but apart from that, pretty simple person.',
    image:
      'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80',
  },
  {
    name: 'Amil Evara',
    role: 'UI/UX Designer',
    bio: 'I am an ambitious workaholic, but apart from that, pretty simple person.',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80',
  },
  {
    name: 'Ebele Egbuna',
    role: 'Support Consultant',
    bio: 'I am an ambitious workaholic, but apart from that, pretty simple person.',
    image:
      'https://images.unsplash.com/photo-1548142813-c348350df52b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80',
  },
];

export default function WithLargeImages() {
  return (
    <div className="container mx-auto px-4 py-24 md:px-6 lg:py-32 2xl:max-w-[1400px]">
      {/* Title */}
      <div className="mx-auto mb-10 max-w-2xl text-center lg:mb-14">
        <h2 className="text-3xl font-bold md:text-4xl md:leading-tight">
          Our leadership
        </h2>
        <p className="text-muted-foreground mt-1 text-lg">
          The talented people behind the scenes
        </p>
      </div>
      {/* End Title */}

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {team.map((member) => (
          <div key={member.name} className="flex flex-col">
            <Image
              className="aspect-[4/3] rounded-xl object-cover"
              src={member.image}
              alt={member.name}
              width={320}
              height={320}
            />
            <div className="mt-4">
              <h3 className="text-lg font-medium">{member.name}</h3>
              <p className="text-muted-foreground mt-1 text-sm">
                {member.role}
              </p>
              <p className="text-muted-foreground mt-3 text-sm">{member.bio}</p>
            </div>
            <div className="mt-3 flex gap-2">
              <Button size="icon" variant="ghost">
                <Twitter className="size-4" />
              </Button>
              <Button size="icon" variant="ghost">
                <Github className="size-4" />
              </Button>
              <Button size="icon" variant="ghost">
                <Linkedin className="size-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      {/* End Grid */}
    </div>
  );
}
