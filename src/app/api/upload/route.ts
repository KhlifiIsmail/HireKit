import { NextRequest, NextResponse } from "next/server";
import { parseFile } from "@/lib/parsers";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size (5MB max)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];

    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF and DOCX are supported." },
        { status: 400 }
      );
    }

    // Parse the file (server-side)
    const result = await parseFile(file);

    if (!result.text || result.text.length < 100) {
      return NextResponse.json(
        {
          error:
            "Could not extract enough text from the file. Please ensure your resume contains readable text.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        text: result.text,
        filename: file.name,
        size: file.size,
        type: file.type,
        metadata: result.metadata,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to process file",
      },
      { status: 500 }
    );
  }
}
