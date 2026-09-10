import { Icon } from '@iconify/react';
import * as React from 'react';

import { cn } from '@/utils/classname';

export interface SocialItem {
  icon: string;
  name: string;
  href: string;
}

export interface SocialLinksProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: SocialItem[];
}

const defaultSocials: SocialItem[] = [
  { icon: 'ri:whatsapp-fill', name: 'WhatsApp', href: 'https://wa.me' },
  {
    icon: 'ri:instagram-fill',
    name: 'Instagram',
    href: 'https://instagram.com',
  },
  { icon: 'ri:telegram-fill', name: 'Telegram', href: 'https://t.me' },
  { icon: 'ri:mail-fill', name: 'Email', href: 'mailto:support@educourse.id' },
];

export function SocialLinks({ items = defaultSocials, className, ...props }: SocialLinksProps) {
  return (
    <div className={cn('flex items-center gap-2 sm:gap-3', className)} {...props}>
      {items.map((item) => (
        <a
          key={item.name}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.name}
          className="flex items-center justify-center size-10 rounded-full bg-white border border-[#E5E7EB] text-[#546A72] hover:text-[#4CA7B1] hover:border-[#4CA7B1] hover:bg-[#E0F7FA]/40 shadow-sm transition-all duration-200 hover:-translate-y-1"
        >
          <Icon icon={item.icon} className="size-5" />
        </a>
      ))}
    </div>
  );
}
