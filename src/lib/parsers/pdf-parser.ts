import { cleanText } from "@/lib/utils/text-processing";

export interface ParsedPDF {
  text: string;
  numPages: number;
  metadata?: {
    title?: string;
    author?: string;
    subject?: string;
    creator?: string;
  };
}

export async function parsePDF(file: File): Promise<ParsedPDF> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Server-side only - use dynamic require
    const parse = eval('require')('pdf-parse');
    
    const data = await parse(buffer);
    const cleanedText = cleanText(data.text);

    return {
      text: cleanedText,
      numPages: data.numpages,
      metadata: {
        title: data.info?.Title,
        author: data.info?.Author,
        subject: data.info?.Subject,
        creator: data.info?.Creator,
      },
    };
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error(
      `Failed to parse PDF: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export function validatePDF(file: File): { isValid: boolean; error?: string } {
  if (
    file.type !== "application/pdf" &&
    !file.name.toLowerCase().endsWith(".pdf")
  ) {
    return {
      isValid: false,
      error: "File is not a PDF",
    };
  }

  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: "File size exceeds 5MB limit",
    };
  }

  return { isValid: true };
}
