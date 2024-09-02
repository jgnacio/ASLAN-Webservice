import type { NextApiRequest, NextApiResponse } from "next";
import { AslanAPICreateMediaAdapter } from "@/Resources/API/ASLAN/adapters/AslanAPICreateMediaAdapter";
import fs from "fs";
import { IncomingForm } from "formidable";
import FormData from "form-data";

export const config = {
  api: {
    bodyParser: false, // Desactivar el body parser por defecto
  },
};

const { Readable } = require("stream");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const form = new IncomingForm();

      form.parse(req, async (err, fields, files) => {
        if (err) {
          return res.status(500).json({ error: "Error parsing file" });
        }

        if (!files.file) {
          return res.status(400).json({ error: "No file uploaded" });
        }

        const fileReadable = files.file[0]; // Accede al archivo subido
        //   guardar el archivo

        const fileBuffer = fs.readFileSync(fileReadable.filepath);
        const formData = new FormData();

        if (!fileBuffer || fileBuffer.length === 0) {
          return res.status(500).json({ error: "Error reading file" });
        }

        const readableStream = new Readable();
        readableStream.push(fileBuffer);
        readableStream.push(null);

        formData.append("file", readableStream, {
          filename: fileReadable.originalFilename || "test-image.png",
          contentType: req.headers["content-type"],
        });
        if (fields.title) formData.append("title", fields.title[0] || "");

        console.log("archivo enviado.");
        const result = await AslanAPICreateMediaAdapter.createMedia(formData);

        if (result.error) {
          return res.status(500).json({ error: result.error });
        }

        return res.status(200).json({ message: "File uploaded successfully" });
      });
    } catch (error) {
      return res.status(500).json({ error: "Error uploading file" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
