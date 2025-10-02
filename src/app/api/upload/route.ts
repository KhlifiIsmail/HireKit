import { NextRequest, NextResponse } from "next/server";
import { parseFile, validateFile } from "@/lib/parsers";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    // Validate file type
    const validation = validateFile(file);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Parse the file
    const parsedFile = await parseFile(file);

    // Check if extracted text is meaningful
    if (parsedFile.text.length < 50) {
      return NextResponse.json(
        {
          error:
            "Unable to extract meaningful text from the file. Please ensure your resume contains readable text.",
        },
        { status: 400 }
      );
    }

    // Return parsed data
    return NextResponse.json({
      success: true,
      data: {
        text: parsedFile.text,
        filename: parsedFile.originalFilename,
        fileType: parsedFile.fileType,
        fileSize: parsedFile.fileSize,
        quality: parsedFile.quality,
        wordCount: parsedFile.text.split(/\s+/).length,
        characterCount: parsedFile.text.length,
      },
    });
  } catch (error) {
    console.error("File upload error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to process file",
      },
      { status: 500 }
    );
  }
}

// Handle GET requests (not allowed)
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

// Add CORS headers if needed
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
