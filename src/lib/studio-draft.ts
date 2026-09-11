import { asFabricTreatments, type FabricTreatment } from '@/lib/design-studio';

const STUDIO_DRAFT_KEY = 'thy-studio-draft';

export interface StudioDraft {
  categoryId: string;
  fabricImage: string;
  fabricLabel: string;
  treatments: FabricTreatment[];
  bodyPhoto?: string;
  bodyPhotoLabel?: string;
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(reader.error ?? new Error('Could not read the image.'));
    reader.readAsDataURL(file);
  });
}

export function readStudioDraft(categoryId?: string | null): StudioDraft | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(STUDIO_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StudioDraft>;
    if (!parsed.categoryId || !parsed.fabricImage) return null;
    if (categoryId && parsed.categoryId !== categoryId) return null;
    return {
      categoryId: parsed.categoryId,
      fabricImage: parsed.fabricImage,
      fabricLabel: parsed.fabricLabel || 'Customer uploaded fabric',
      treatments: asFabricTreatments(parsed.treatments),
      bodyPhoto: parsed.bodyPhoto,
      bodyPhotoLabel: parsed.bodyPhotoLabel,
    };
  } catch {
    return null;
  }
}

export function writeStudioDraft(draft: StudioDraft) {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(STUDIO_DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // Ignore quota errors; in-memory page state still works for this visit.
  }
}

export function patchStudioDraft(categoryId: string, patch: Partial<StudioDraft>) {
  const current = readStudioDraft(categoryId);
  writeStudioDraft({
    categoryId,
    fabricImage: patch.fabricImage ?? current?.fabricImage ?? '',
    fabricLabel: patch.fabricLabel ?? current?.fabricLabel ?? 'Customer uploaded fabric',
    treatments: patch.treatments ?? current?.treatments ?? [],
    bodyPhoto: patch.bodyPhoto ?? current?.bodyPhoto,
    bodyPhotoLabel: patch.bodyPhotoLabel ?? current?.bodyPhotoLabel,
  });
}
