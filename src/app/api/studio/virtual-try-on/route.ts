import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";

interface VirtualTryOnRequestBody {
  personImage: string; // base64 (data URL) or public URL
  productImage: string; // base64 (data URL) or public URL
}

function getGenAIClient() {
  const project = process.env.GOOGLE_CLOUD_PROJECT;
  if (!project) {
    throw new Error(
      "GOOGLE_CLOUD_PROJECT is not set. Please configure GOOGLE_CLOUD_PROJECT in your .env.local file."
    );
  }

  // Ensure enterprise mode is enabled for Vertex AI Virtual Try-On
  process.env.GOOGLE_GENAI_USE_ENTERPRISE = "true";

  // Handle stale or missing GOOGLE_APPLICATION_CREDENTIALS path
  const credsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (credsPath && !fsSync.existsSync(credsPath)) {
    const defaultAdc = path.join(
      process.env.APPDATA || "",
      "gcloud",
      "application_default_credentials.json"
    );
    if (fsSync.existsSync(defaultAdc)) {
      process.env.GOOGLE_APPLICATION_CREDENTIALS = defaultAdc;
    } else {
      delete process.env.GOOGLE_APPLICATION_CREDENTIALS;
    }
  }

  return new GoogleGenAI({
    vertexai: true,
    project,
    location: process.env.GOOGLE_CLOUD_LOCATION || "global",
  });
}

// Resolve data URL, remote URL, or local /public path into { data: base64, mimeType }
async function resolveImagePart(source: string): Promise<{ data: string; mimeType: string }> {
  if (source.startsWith("data:")) {
    const [meta, b64] = source.split(",");
    const mimeType = meta.match(/data:(.*?);base64/)?.[1] ?? "image/png";
    return { data: b64, mimeType };
  }

  if (source.startsWith("http://") || source.startsWith("https://")) {
    const res = await fetch(source);
    if (!res.ok) {
      throw new Error(`Failed to fetch image from ${source}: ${res.statusText}`);
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const mimeType = res.headers.get("content-type") ?? "image/png";
    return { data: buf.toString("base64"), mimeType };
  }

  // Local path under /public (strip leading slashes for safe cross-platform path resolution)
  const relativePath = source.replace(/^[/\\]+/, "");
  const filePath = path.join(process.cwd(), "public", relativePath);
  const buf = await fs.readFile(filePath);
  const ext = path.extname(relativePath).slice(1).toLowerCase();
  const mimeType =
    ext === "jpg" || ext === "jpeg"
      ? "image/jpeg"
      : ext === "png"
      ? "image/png"
      : ext === "webp"
      ? "image/webp"
      : `image/${ext}`;
  return { data: buf.toString("base64"), mimeType };
}

export async function POST(req: NextRequest) {
  try {
    const body: VirtualTryOnRequestBody = await req.json();

    if (!body.personImage) {
      return NextResponse.json(
        { error: "personImage is required for virtual try-on" },
        { status: 400 }
      );
    }

    if (!body.productImage) {
      return NextResponse.json(
        { error: "productImage is required for virtual try-on" },
        { status: 400 }
      );
    }

    const ai = getGenAIClient();

    // Resolve both person image and product image to base64
    const [personPart, productPart] = await Promise.all([
      resolveImagePart(body.personImage),
      resolveImagePart(body.productImage),
    ]);

    // Invoke Google virtual-try-on-001 model via recontextImage
    const response = await ai.models.recontextImage({
      model: "virtual-try-on-001",
      source: {
        personImage: {
          imageBytes: personPart.data,
          mimeType: personPart.mimeType,
        },
        productImages: [
          {
            productImage: {
              imageBytes: productPart.data,
              mimeType: productPart.mimeType,
            },
          },
        ],
      },
      config: {
        numberOfImages: 1,
      },
    });

    const generatedImage = response.generatedImages?.[0]?.image;
    if (!generatedImage?.imageBytes) {
      return NextResponse.json(
        {
          error: "No try-on image returned from virtual-try-on-001 model",
          raw: response,
        },
        { status: 502 }
      );
    }

    const mimeType = generatedImage.mimeType || "image/png";
    const dataUrl = `data:${mimeType};base64,${generatedImage.imageBytes}`;

    return NextResponse.json({
      success: true,
      image: dataUrl,
      model: "virtual-try-on-001",
    });
  } catch (err: unknown) {
    console.error("virtual-try-on error:", err);
    const errorMessage =
      err instanceof Error ? err.message : "Virtual try-on generation failed";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
