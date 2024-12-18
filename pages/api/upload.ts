import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { AslanAPICreateMediaAdapter } from "@/Resources/API/ASLAN/adapters/AslanAPICreateMediaAdapter";
import fs from "fs";
import { IncomingForm } from "formidable";
import FormData from "form-data";

export const config = {
  api: {
    bodyParser: false,
  },
};

const { Readable } = require("stream");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Early checks before any processing
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Authenticate the user using Clerk before doing anything else
  const { userId } = getAuth(req);

  // Check if user is authenticated and has required role
  if (!userId) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "No user session found",
    });
  }

  // Wrap the entire file processing in a promise to handle errors more gracefully
  try {
    await new Promise((resolve, reject) => {
      const form = new IncomingForm();

      form.parse(req, async (err, fields, files) => {
        if (err) {
          reject(err);
          return;
        }

        if (!files.file) {
          reject(new Error("No file uploaded"));
          return;
        }

        try {
          const fileReadable = files.file[0];
          const fileBuffer = fs.readFileSync(fileReadable.filepath);
          const formData = new FormData();

          if (!fileBuffer || fileBuffer.length === 0) {
            reject(new Error("Error reading file"));
            return;
          }

          const readableStream = new Readable();
          readableStream.push(fileBuffer);
          readableStream.push(null);

          formData.append("file", readableStream, {
            filename: fileReadable.originalFilename || "test-image.png",
            contentType: req.headers["content-type"],
          });

          if (fields.title) formData.append("title", fields.title[0] || "");

          const result = await AslanAPICreateMediaAdapter.createMedia(formData);

          if (result.error) {
            reject(new Error(result.error));
            return;
          }

          res.status(200).json({
            message: "File uploaded successfully",
            result,
          });

          resolve(result);
        } catch (processingError) {
          reject(processingError);
        }
      });
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      error: "Error processing upload",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
