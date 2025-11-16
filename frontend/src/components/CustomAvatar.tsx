import { getAvatarColor, getInitials } from '../utils/avatar';

type CustomAvatarSize = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

interface CustomAvatarProps {
  name: string;
  avatarUrl?: string;
  size?: CustomAvatarSize;
  className?: string;
}

const sizeClasses: Record<CustomAvatarSize, { container: string; text: string }> = {
  sm: { container: 'w-8 h-8', text: 'text-xs' },
  md: { container: 'w-10 h-10', text: 'text-sm' },
  lg: { container: 'w-12 h-12', text: 'text-base' },
  xl: { container: 'w-16 h-16', text: 'text-xl' },
  xxl: { container: 'w-32 h-32', text: 'text-2xl' },
};

export function CustomAvatar({ name, avatarUrl, size = 'md', className = '' }: CustomAvatarProps) {
  const { container, text } = sizeClasses[size];

  if (avatarUrl) {
    return (
      <div
        className={`${container} rounded-full overflow-hidden flex-shrink-0 ${className}`}
      >
        <img
          src={avatarUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Fallback: show initials with colored background
  const initials = getInitials(name);
  const bgColor = getAvatarColor(name);

  return (
    <div
      className={`${container} rounded-full flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      <span className={`${text} font-semibold text-white`}>{initials}</span>
    </div>
  );
}
