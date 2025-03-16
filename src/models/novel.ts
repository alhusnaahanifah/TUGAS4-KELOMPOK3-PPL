import fs from 'fs';
import path from 'path';

export interface Novel {
  title: string;
  year: number;
  author: string;
  genre: string;
  pages: number;
  rating: number;
  summary: string;
}

const novelsFilePath = path.join(__dirname, '../../novels.json');

// Fungsi untuk membaca data dari novels.json
const readNovels = (): Novel[] => {
  const data = fs.readFileSync(novelsFilePath, 'utf-8');
  return JSON.parse(data).novels; // Ambil array "novels" dari file JSON
};

// Fungsi untuk menulis data ke novels.json
const writeNovels = (novels: Novel[]) => {
  fs.writeFileSync(novelsFilePath, JSON.stringify({ novels }, null, 2), 'utf-8');
};

// 1. Lihat daftar novel
export const getNovels = (): Novel[] => readNovels();

// 2. Tambah novel
export const addNovel = (novel: Novel): void => {
  const novels = readNovels();
  novels.push(novel);
  writeNovels(novels);
};

// 6. Lihat novel dengan rating tertinggi
export const getHighestRatedNovel = (): Novel | undefined => {
    const novels = readNovels();
    if (novels.length === 0) return undefined;
    return novels.reduce((prev, current) => (prev.rating > current.rating ? prev : current));
  };
  
// 3. Lihat detail novel berdasarkan judul
export const getNovelsByTitle = (title: string): Novel[] => {
  const novels = readNovels();
  return novels.filter((novel) => novel.title.toLowerCase().includes(title.toLowerCase()));
};

// 4. Update novel berdasarkan judul
export const updateNovel = (title: string, updatedNovel: Partial<Novel>): boolean => {
  const novels = readNovels();
  const novelIndex = novels.findIndex((novel) => novel.title === title);
  if (novelIndex === -1) return false;
  novels[novelIndex] = { ...novels[novelIndex], ...updatedNovel };
  writeNovels(novels);
  return true;
};

// 5. Hapus novel berdasarkan judul
export const deleteNovel = (title: string): boolean => {
  const novels = readNovels();
  const novelIndex = novels.findIndex((novel) => novel.title === title);
  if (novelIndex === -1) return false;
  novels.splice(novelIndex, 1);
  writeNovels(novels);
  return true;
};