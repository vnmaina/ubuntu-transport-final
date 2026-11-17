import { Twitter, Github, Linkedin } from '@/components/ui/brand-icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import Image from "next/image";

const team = [
  {
    name: 'David Forren',
    role: 'Leadership',
    position: 'Founder / CEO',
    image:
      'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150&q=80',
  },
  {
    name: 'Amil Evara',
    role: 'Design',
    position: 'UI/UX Designer',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150&q=80',
  },
  {
    name: 'Ebele Egbuna',
    role: 'Support',
    position: 'Support Lead',
    image:
      'https://images.unsplash.com/photo-1548142813-c348350df52b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150&q=80',
  },
  {
    name: 'Maria Powers',
    role: 'Leadership',
    position: 'Director of Sales',
    image:
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150&q=80',
  },
];

const roles = ['All', 'Leadership', 'Design', 'Support'];

export default function WithFilters() {
  const [selectedRole, setSelectedRole] = useState('All');

  const filteredTeam = team.filter((member) =>
    selectedRole === 'All' ? true : member.role === selectedRole
  );

  return (
    <div className="container mx-auto px-4 py-24 md:px-6 lg:py-32 2xl:max-w-[1400px]">
      {/* Title */}
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h2 className="text-3xl font-bold md:text-4xl md:leading-tight">
          Our team
        </h2>
        <p className="text-muted-foreground mt-1 text-lg">
          The people behind the scenes
        </p>
      </div>
      {/* End Title */}

      {/* Filters */}
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {roles.map((role) => (
          <Button
            key={role}
            variant={selectedRole === role ? 'default' : 'outline'}
            onClick={() => setSelectedRole(role)}
            className="cursor-pointer"
          >
            {role}
          </Button>
        ))}
      </div>
      {/* End Filters */}

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filteredTeam.map((member) => (
          <Card key={member.name} className="pt-0 text-center">
            <CardContent className="pt-6">
              <div className="relative inline-block">
                <Image
                  className="size-24 rounded-full object-cover"
                  src={member.image}
                  alt={member.name}
                  width={96}
                  height={96}
                />
              </div>
              <div className="mt-4">
                <h3 className="font-medium">{member.name}</h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  {member.position}
                </p>
              </div>
              <div className="mt-3 flex justify-center gap-2">
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
            </CardContent>
          </Card>
        ))}
      </div>
      {/* End Grid */}
    </div>
  );
}
