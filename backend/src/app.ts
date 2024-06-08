import express, { Request, Response } from "express";
import cors from "cors";
import multer, { StorageEngine } from "multer";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Multer configuration for file upload
const storage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  const { fieldname, originalname, mimetype } = req.file;
  res.send({
    message: "File uploaded successfully.",
    fieldname,
    originalname,
    mimetype,
  });
});

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "Giga Transfer" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
