import express, { Request, Response } from 'express';
import {
  getNovels,
  getNovelByTitle,
  addNovel,
  updateNovel,
  deleteNovel,
  getHighestRatedNovel,
  Novel,
} from '../models/novel';

const router = express.Router();

// 1. Lihat daftar novel
router.get('/', (req: Request, res: Response) => {
  res.json(getNovels());
});

// 2. Tambah novel
router.post('/', (req: Request, res: Response) => {
  const novel: Novel = req.body;
  addNovel(novel);
  res.status(201).json({ message: 'Novel added successfully', novel });
});

// 6. Lihat novel dengan rating tertinggi
router.get('/highest-rated', (req: Request, res: Response) => {
    const highestRatedNovel = getHighestRatedNovel();
    if (highestRatedNovel) {
      res.json(highestRatedNovel);
    } else {
      res.status(404).json({ message: 'No novels found' });
    }
  });
  
// 3. Lihat detail novel berdasarkan judul
router.get('/:title', (req: Request, res: Response) => {
  const novelTitle = req.params.title;
  const novel = getNovelByTitle(novelTitle);
  if (novel) {
    res.json(novel);
  } else {
    res.status(404).json({ message: 'Novel not found' });
  }
});

// 4. Update novel berdasarkan judul
router.put('/:title', (req: Request, res: Response) => {
  const novelTitle = req.params.title;
  const updatedNovel: Partial<Novel> = req.body;
  if (updateNovel(novelTitle, updatedNovel)) {
    res.json({ message: 'Novel updated successfully' });
  } else {
    res.status(404).json({ message: 'Novel not found' });
  }
});

// 5. Hapus novel berdasarkan judul
router.delete('/:title', (req: Request, res: Response) => {
  const novelTitle = req.params.title;
  if (deleteNovel(novelTitle)) {
    res.json({ message: 'Novel deleted successfully' });
  } else {
    res.status(404).json({ message: 'Novel not found' });
  }
});

export default router;