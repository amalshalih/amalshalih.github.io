import { google, drive_v3 } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];

function getAuth() {
  const credentials = process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY;
  if (!credentials) {
    throw new Error('GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY env var is not set');
  }
  return new google.auth.GoogleAuth({
    credentials: JSON.parse(credentials),
    scopes: SCOPES,
  });
}

function getDrive(): drive_v3.Drive {
  return google.drive({ version: 'v3', auth: getAuth() });
}

export interface DriveImage {
  id: string;
  name: string;
  mimeType: string;
  thumbnailUrl?: string;
  webContentLink?: string;
  createdTime?: string;
  width?: number;
  height?: number;
}

export interface DriveFolder {
  id: string;
  name: string;
  createdTime?: string;
  modifiedTime?: string;
}

export async function listImagesInFolder(folderId: string): Promise<DriveImage[]> {
  const drive = getDrive();
  const res = await drive.files.list({
    q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
    fields: 'files(id, name, mimeType, webContentLink, createdTime, imageMediaMetadata)',
    orderBy: 'name',
  });

  const files: drive_v3.Schema$File[] = res.data.files ?? [];
  return files.map((f) => ({
    id: f.id ?? '',
    name: f.name ?? 'unknown',
    mimeType: f.mimeType ?? 'image/jpeg',
    webContentLink: f.webContentLink ?? undefined,
    createdTime: f.createdTime ?? undefined,
    width: f.imageMediaMetadata?.width ? Number(f.imageMediaMetadata.width) : undefined,
    height: f.imageMediaMetadata?.height ? Number(f.imageMediaMetadata.height) : undefined,
  }));
}

export async function listSubfolders(parentFolderId: string): Promise<DriveFolder[]> {
  const drive = getDrive();
  const res = await drive.files.list({
    q: `'${parentFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: 'files(id, name, createdTime, modifiedTime)',
    orderBy: 'name',
  });

  const folders: drive_v3.Schema$File[] = res.data.files ?? [];
  return folders.map((f) => ({
    id: f.id ?? '',
    name: f.name ?? 'Untitled',
    createdTime: f.createdTime ?? undefined,
    modifiedTime: f.modifiedTime ?? undefined,
  }));
}

export function getThumbnailUrl(fileId: string, width = 400) {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${width}`;
}

export function getFullImageUrl(fileId: string, width = 1600) {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${width}`;
}

export function parseFolderName(folderName: string): {
  category: string;
  title: string;
  date: string;
  slug: string;
} | null {
  const patterns = [
    /^([^—-]+?)\s*[—-]\s*(.+?)\s*[—-]\s*(\d{1,2}\s+\w+\s+\d{4})\s*$/,
    /^([^—-]+?)\s*[—-]\s*(.+?)\s*[—-]\s*(\d{4}-\d{2}-\d{2})\s*$/,
    /^(.+?)\s*[—-]\s*(\d{1,2}\s+\w+\s+\d{4})\s*$/,
  ];

  for (const pattern of patterns) {
    const match = folderName.match(pattern);
    if (match) {
      if (match.length >= 4) {
        const category = match[1].trim();
        const title = match[2].trim();
        const dateStr = match[3].trim();
        const parsedDate = parseDate(dateStr);
        return {
          category: category,
          title: title,
          date: parsedDate,
          slug: generateSlug(category, title, parsedDate),
        };
      } else if (match.length === 3) {
        const title = match[1].trim();
        const dateStr = match[2].trim();
        const parsedDate = parseDate(dateStr);
        return {
          category: 'Umum',
          title: title,
          date: parsedDate,
          slug: generateSlug('Umum', title, parsedDate),
        };
      }
    }
  }

  const cleanName = folderName.replace(/^Galeri\s+/i, '').trim();
  return {
    category: 'Umum',
    title: cleanName,
    date: new Date().toISOString().split('T')[0],
    slug: generateSlug('Umum', cleanName, ''),
  };
}

function parseDate(dateStr: string): string {
  const months: Record<string, string> = {
    januari: '01', februari: '02', maret: '03', april: '04', mei: '05', juni: '06',
    juli: '07', agustus: '08', september: '09', oktober: '10', november: '11', desember: '12',
    january: '01', february: '02', march: '03', may: '05', june: '06',
    july: '07', august: '08', october: '10', december: '12',
  };

  const parts = dateStr.toLowerCase().split(/\s+/);
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const month = months[parts[1]] || '01';
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }

  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateStr;
  }

  return new Date().toISOString().split('T')[0];
}

function generateSlug(category: string, title: string, date: string): string {
  const categoryMap: Record<string, string> = {
    keagamaan: 'keagamaan',
    sosial: 'sosial',
    pendidikan: 'pendidikan',
    umum: 'umum',
  };

  const catKey = category.toLowerCase();
  const catSlug = categoryMap[catKey] || 'umum';

  const titleSlug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);

  const year = date.split('-')[0] || String(new Date().getFullYear());

  return `${catSlug}-${titleSlug}-${year}`;
}
