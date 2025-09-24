import { useState } from 'react';

interface UserAvatarProps {
  user: {
    firstName?: string;
    lastName?: string;
    email: string;
    imageUrl?: string;
  };
  size?: 'sm' | 'md' | 'lg';
}

export function UserAvatar({ user, size = 'md' }: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg', 
    lg: 'w-20 h-20 text-2xl'
  };

  const getInitials = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    if (user.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    return user.email.charAt(0).toUpperCase();
  };

  const getAvatarUrl = () => {
    if (user.imageUrl && !imageError) {
      return user.imageUrl;
    }
    
    // Usar Gravatar como fallback
    const email = user.email.toLowerCase().trim();
    const hash = btoa(email).replace(/[^a-zA-Z0-9]/g, ''); // Simple hash
    return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=200`;
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 flex items-center justify-center relative`}>
      {user.imageUrl && !imageError ? (
        <img
          src={getAvatarUrl()}
          alt={`${user.firstName || user.email} avatar`}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-semibold">
          {getInitials()}
        </div>
      )}
    </div>
  );
}