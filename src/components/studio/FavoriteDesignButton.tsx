'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import type { CustomerDesignSave } from '@/lib/tailor-session';
import { isDesignFavorited, toggleFavoriteDesign } from '@/lib/wishlist';

interface FavoriteDesignButtonProps {
  design: Omit<CustomerDesignSave, 'favorite' | 'createdAt'>;
  image: string | null;
  className?: string;
}

export function FavoriteDesignButton({ design, image, className }: FavoriteDesignButtonProps) {
  const { session, updateSession } = useTailorSession();
  const favorited = isDesignFavorited(session, design.id);
  const canSave = Boolean(image);

  const toggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!image) return;
    updateSession({
      customerDesigns: toggleFavoriteDesign(session.customerDesigns, {
        ...design,
        fabricImage: image,
        favorite: true,
      }),
    });
  };

  return (
    <button
      type="button"
      disabled={!canSave}
      onClick={toggle}
      aria-pressed={favorited}
      aria-label={favorited ? 'Remove from wishlist' : 'Add to wishlist'}
      title={favorited ? 'Remove from wishlist' : 'Save to wishlist'}
      className={className}
    >
      <Heart size={18} className={favorited ? 'fill-current' : undefined} />
    </button>
  );
}
