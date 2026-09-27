import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { parseKurtiFilename, type KurtiCatalogueDesign } from '@/lib/kurti-catalogue';

export const dynamic = 'force-dynamic';

function fromDatabaseItem(item: {
  designCode?: string;
  title?: string;
  imageUrl?: string;
  attributes?: Partial<KurtiCatalogueDesign['attributes']>;
}): KurtiCatalogueDesign | null {
  const attributes = item.attributes;
  if (!item.imageUrl || !attributes?.neckline || !attributes.sleeves || !attributes.silhouette || !attributes.length) {
    return null;
  }
  return {
    designCode: item.designCode || item.imageUrl,
    title: item.title || `${attributes.neckline} ${attributes.sleeves} ${attributes.silhouette} Kurti`,
    imageUrl: item.imageUrl,
    attributes: {
      neckline: attributes.neckline,
      sleeves: attributes.sleeves,
      silhouette: attributes.silhouette,
      length: attributes.length,
    },
  };
}

async function loadFromDatabase(): Promise<KurtiCatalogueDesign[] | null> {
  const base = process.env.NEXT_PUBLIC_AUTH_API_URL?.replace(/\/$/, '');
  if (!base) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 1200);
  try {
    const response = await fetch(`${base}/designs/kurtis?limit=100`, {
      signal: controller.signal,
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as { data?: { items?: unknown[] } };
    const items = payload.data?.items ?? [];
    const designs = items
      .map((item) => fromDatabaseItem(item as Parameters<typeof fromDatabaseItem>[0]))
      .filter((item): item is KurtiCatalogueDesign => Boolean(item));
    return designs.length > 0 ? designs : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function loadFromStylecraftFiles(): Promise<KurtiCatalogueDesign[]> {
  const dir = path.join(process.cwd(), 'public', 'stylecraftdb', 'Kurti');
  const files = await fs.readdir(dir);
  return files
    .map((file) => parseKurtiFilename(file))
    .filter((item): item is KurtiCatalogueDesign => Boolean(item));
}

export async function GET() {
  const fromDatabase = await loadFromDatabase();
  if (fromDatabase) {
    return NextResponse.json({ source: 'database', designs: fromDatabase });
  }
  try {
    const designs = await loadFromStylecraftFiles();
    return NextResponse.json({ source: 'stylecraft', designs });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not read the kurti catalogue';
    return NextResponse.json({ error: message, designs: [] }, { status: 500 });
  }
}
