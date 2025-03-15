import express, { Express } from "express";
import fs from "fs";
import path from "path";
import bodyParser from "body-parser";
import cors from "cors";

const app: Express = express();
const PORT: number = 3000;
const novelsFilePath: string = path.resolve(__dirname, "novels.json");

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Interface untuk struktur novel
interface Novel {
    title: string;
    author: string;
    year: number;
    genre: string;
    pages: number;
    rating: number;
    summary: string;
}

// Fungsi untuk membaca file JSON dengan validasi
const readNovels = (): Novel[] => {
    try {
        if (!fs.existsSync(novelsFilePath)) {
            fs.writeFileSync(novelsFilePath, JSON.stringify({ novels: [] }, null, 2));
        }
        const data: string = fs.readFileSync(novelsFilePath, "utf8");
        const parsedData = JSON.parse(data);

        return Array.isArray(parsedData.novels) ? parsedData.novels : [];
    } catch (error) {
        console.error("Gagal membaca file JSON:", error);
        return [];
    }
};

// Endpoint untuk mendapatkan daftar novel
app.get("/novels", (req, res) => {
    const novels = readNovels();
    res.json({ novels });
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
