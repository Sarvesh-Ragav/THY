import type { CustomerDesignSave, TailorSession } from '@/lib/tailor-session';
import { readStudioDraft } from '@/lib/studio-draft';

export function generatedDesignId(categoryId: string) {
  return `gen-${categoryId}`;
}

export function favoritedDesigns(session: TailorSession): CustomerDesignSave[] {
  return session.customerDesigns.filter((design) => design.favorite);
}

export function isDesignFavorited(session: TailorSession, id: string): boolean {
  return session.customerDesigns.some((design) => design.id === id && design.favorite);
}

export function toggleFavoriteDesign(
  designs: CustomerDesignSave[],
  entry: CustomerDesignSave
): CustomerDesignSave[] {
  const existing = designs.find((design) => design.id === entry.id);
  if (existing?.favorite) {
    return designs.filter((design) => design.id !== entry.id);
  }

  return [
    {
      ...entry,
      favorite: true,
      createdAt: entry.createdAt || new Date().toISOString(),
    },
    ...designs.filter((design) => design.id !== entry.id),
  ];
}

export function refreshFavoritedImage(
  designs: CustomerDesignSave[],
  id: string,
  image: string,
  extra?: Partial<CustomerDesignSave>
): CustomerDesignSave[] {
  return designs.map((design) =>
    design.id === id && design.favorite
      ? { ...design, ...extra, fabricImage: image, favorite: true }
      : design
  );
}

export function wishlistImageFor(design: CustomerDesignSave): string | undefined {
  if (design.fabricImage) return design.fabricImage;
  if (!design.categoryId) return undefined;
  const draft = readStudioDraft(design.categoryId);
  return draft?.aiRender || draft?.tryOnRender || draft?.fabricImage;
}
