import express, { Request, Response } from "express";
import morgan from "morgan";
import "dotenv/config";

import path from "path";

import connectDatabase from "./utils/database/dbConnect";
import { checkUploadsDirExist } from "./utils/helpers/multer";
import cors from "cors";

import userRouter from "./controllers/user.controller";

import pdfRouter from "./controllers/pdf.controller";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDatabase();
checkUploadsDirExist();

app.use(morgan("tiny"));
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  const htmlContent = `
    <html>
      <head>
        <title>Ping Response</title>
      </head>
      <body>
        <h1>Affordable Luxury v0.0.7</h1>
      </body>
    </html>
  `;

  res.send(htmlContent);
});

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

const PORT = (process.env.PORT || 3000) as number;

app.listen(PORT, "0,0,0,0", () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use("/user/v1", userRouter);
app.use("/api/itinerary", pdfRouter);
