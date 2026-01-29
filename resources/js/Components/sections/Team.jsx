/**
 * @fileoverview Team Section Component
 * @description Grid of team members / authors
 */

import { Twitter, Linkedin, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent } from '@/Components/ui/card';
import { MotionWrapper, StaggerContainer, StaggerItem, HoverScale } from '@/Components/motion/MotionWrapper';

/**
 * Avatar Fallback - generates initials from name
 */
function getInitials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Social Link Component
 */
function SocialLink({ href, icon: Icon, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'p-2 rounded-full bg-muted hover:bg-primary/10',
        'text-muted-foreground hover:text-primary',
        'transition-colors duration-200'
      )}
      aria-label={label}
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}

/**
 * Team Member Card Component
 */
function TeamMemberCard({ member }) {
  return (
    <HoverScale scale={1.02}>
      <Card
        className={cn(
          'group h-full border-border/50 hover:border-primary/50',
          'transition-all duration-300 hover:shadow-lg'
        )}
      >
        <CardContent className="p-6 text-center">
          {/* Avatar */}
          <div className="relative w-24 h-24 mx-auto mb-4">
            {member.avatar ? (
              <img
                src={member.avatar}
                alt={member.name}
                className="w-full h-full rounded-full object-cover ring-4 ring-background shadow-lg"
              />
            ) : (
              <div
                className={cn(
                  'w-full h-full rounded-full flex items-center justify-center',
                  'gradient-pandilla text-white text-2xl font-bold',
                  'ring-4 ring-background shadow-lg'
                )}
              >
                {getInitials(member.name)}
              </div>
            )}

            {/* Online indicator (decorative) */}
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-background" />
          </div>

          {/* Name */}
          <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
            {member.name}
          </h3>

          {/* Role */}
          <p className="text-sm text-primary font-medium mb-1">
            {member.role}
          </p>

          {/* Period (for presidentes from database) */}
          {member.period && (
            <p className="text-xs text-muted-foreground mb-3">
              {member.period}
            </p>
          )}

          {/* Bio */}
          {member.bio && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {member.bio}
            </p>
          )}

          {/* Social Links */}
          {member.social && (
            <div className="flex items-center justify-center gap-2">
              {member.social.twitter && (
                <SocialLink
                  href={member.social.twitter}
                  icon={Twitter}
                  label={`Twitter de ${member.name}`}
                />
              )}
              {member.social.linkedin && (
                <SocialLink
                  href={member.social.linkedin}
                  icon={Linkedin}
                  label={`LinkedIn de ${member.name}`}
                />
              )}
              {member.social.email && (
                <SocialLink
                  href={`mailto:${member.social.email}`}
                  icon={Mail}
                  label={`Email de ${member.name}`}
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </HoverScale>
  );
}

/**
 * Team Section Component
 *
 * @param {Object} props
 * @param {import('@/types/landing.types').TeamConfig} props.config
 * @param {string} [props.className]
 */
export function Team({ config, className }) {
  return (
    <section
      id="team"
      className={cn('py-16 md:py-24', className)}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <MotionWrapper direction="up" className="text-center mb-12">
          {config.badge && (
            <Badge variant="outline" className="mb-4">
              {config.badge}
            </Badge>
          )}
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {config.title}
          </h2>
          {config.subtitle && (
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {config.subtitle}
            </p>
          )}
        </MotionWrapper>

        {/* Team Grid */}
        <StaggerContainer
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          staggerDelay={0.1}
        >
          {config.members.map((member) => (
            <StaggerItem key={member.id}>
              <TeamMemberCard member={member} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

export default Team;
