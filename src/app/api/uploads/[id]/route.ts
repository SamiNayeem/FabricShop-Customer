import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";

export const POST = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No file received or incorrect file type." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const filename = file.name.replace(/ /g, "_");

    // Create a directory based on the id parameter
    const uploadDir = path.join(process.cwd(), "public", "uploads", params.id);

    // Ensure the directory exists
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);

    // Save the file
    await writeFile(filePath, buffer);

    // Create the file URL
    const fileUrl = `/uploads/${params.id}/${filename}`;

    return NextResponse.json({ message: "Success", url: fileUrl }, { status: 201 });
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json({ message: "Failed", error: (error as Error).message }, { status: 500 });
  }
};
