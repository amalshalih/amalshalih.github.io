import generatedGalleries from './generated-galleries.json' with { type: 'json' };

export interface GalleryImage {
  id: string;
  name: string;
  thumbnailUrl: string;
  fullUrl: string;
  width?: number;
  height?: number;
  createdTime?: string;
}

export interface GalleryEntry {
  slug: string;
  title: string;
  description: string;
  folderId: string;
  category: 'pendidikan' | 'keagamaan' | 'sosial' | 'umum';
  eventDate: string;
  coverPhotoId?: string;
  published: boolean;
  totalImages: number;
  images: GalleryImage[];
}

export const GALLERIES: GalleryEntry[] = generatedGalleries as GalleryEntry[];

export function getGalleryBySlug(slug: string): GalleryEntry | undefined {
  return GALLERIES.find((g) => g.slug === slug);
}

export function getPublishedGalleries(): GalleryEntry[] {
  return GALLERIES.filter((g) => g.published);
}

export function getGalleriesByCategory(category: GalleryEntry['category']): GalleryEntry[] {
  return GALLERIES.filter((g) => g.category === category && g.published);
}
