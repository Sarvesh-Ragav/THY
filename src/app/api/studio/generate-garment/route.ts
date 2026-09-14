import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Modality } from "@google/genai";
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";

import { type GarmentCustomizationDetails } from "@/lib/studio-draft";

const DEFAULT_PATTERN = "/preview/Roundneck_sleeveless_A-line_calflength.png";

type SilhouetteType = "kurti" | "saree" | "sherwani" | "lehenga";

interface GenerateRequestBody {
  garment: string;
  silhouette: SilhouetteType;
  fabricImage: string; // base64 (data URL) or URL
  patternImage?: string; // base64 (data URL) or URL, defaults to DEFAULT_PATTERN
  treatments?: string[]; // e.g. ["Prints", "Embroidery"]
  customization?: GarmentCustomizationDetails;
  neckline?: string;
  sleeves?: string;
  sleeveLength?: string;
  length?: string;
  fit?: string;
  sideSlit?: string;
  hemStyle?: string;
  frontStyle?: string;
}

function getGenAIClient() {
  const project = process.env.GOOGLE_CLOUD_PROJECT;
  if (!project) {
    throw new Error(
      "GOOGLE_CLOUD_PROJECT is not set. Please configure GOOGLE_CLOUD_PROJECT in your .env.local file."
    );
  }

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

// Resolve either a data URL, remote URL, or local /public path into
// { data: base64, mimeType } for inlineData.
async function resolveImagePart(source: string) {
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

function capitalizeWords(str: string): string {
  return str
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function buildPrompt(body: GenerateRequestBody) {
  const cust = body.customization || {};

  const garmentType = (cust.garment || body.garment || "kurti").trim();
  const silhouette = (cust.silhouette || body.silhouette || "A-line").trim();
  const neckline = (cust.neckline || body.neckline || "round neck").trim();
  const sleeveType = (cust.sleeves || body.sleeves || "sleeveless").trim();
  const isSleeveless = sleeveType.toLowerCase().includes("sleeveless");
  const sleeveLength = (
    cust.sleeveLength ||
    body.sleeveLength ||
    (isSleeveless ? "N/A (sleeveless)" : sleeveType)
  ).trim();
  const garmentLength = (cust.length || body.length || "calf length").trim();
  const fit = (
    cust.fit ||
    body.fit ||
    "regular fit (fitted through bust and shoulders, gentle flare from waist)"
  ).trim();
  const hemline = (cust.hemStyle || body.hemStyle || "straight hem").trim();
  const frontStyle = (cust.frontStyle || body.frontStyle || "plain front, no placket").trim();
  const sideSlits = (cust.sideSlit || body.sideSlit || "none").trim();

  const headerDetails = `${capitalizeWords(neckline)} / ${capitalizeWords(sleeveType)} / ${capitalizeWords(silhouette)} / ${capitalizeWords(garmentLength)}`;

  const treatmentsText = body.treatments?.length
    ? `\nSURFACE TREATMENTS\nApply the following requested treatments: ${body.treatments.join(", ")}.`
    : "";

  return `Kurti Fabric-to-Image Visualization Prompt — ${headerDetails}

PRIME DIRECTIVE: The uploaded fabric image is the sole source of truth for color, print, motif, scale, and texture. Everything else in this prompt is secondary to fabric fidelity.

Create a high-quality, photorealistic fashion product visualization of a women's ${garmentType} using the provided fabric image as the exact fabric/material reference.

GARMENT SPECIFICATION
• Garment type: ${garmentType}
• Silhouette: ${silhouette}
• Neckline: ${neckline}
• Sleeve type: ${sleeveType}
• Sleeve length: ${sleeveLength}
• Garment length: ${garmentLength}
• Fit: ${fit}
• Hemline: ${hemline}
• Front style: ${frontStyle}
• Side slits: ${sideSlits}
If any field above is left blank, apply standard, tasteful defaults consistent with contemporary Indian ethnic wear.
${treatmentsText}

FABRIC REFERENCE
Use the uploaded fabric image as the primary and authoritative reference for the fabric:
• Preserve the fabric's original color as faithfully as possible. Do not reinterpret, beautify, brighten, darken, desaturate, or recolor it.
• Original print/pattern
• Motifs and their visual characteristics
• Pattern scale and density
• Texture and weave appearance
• Material characteristics
• Overall visual identity of the fabric

The fabric pattern must be naturally wrapped and mapped onto the generated garment. Do not redesign, simplify, replace, recolor, or invent a different textile pattern.
If the uploaded fabric contains a repeating pattern, intelligently repeat it across the garment while maintaining realistic scale, orientation, and continuity.

GARMENT CONSTRUCTION
Construct the garment accurately according to the specified attributes. The generated garment must have:
• Realistic seams and stitching
• Natural fabric folds and wrinkles, consistent with the fabric's apparent weight and stiffness
• Physically plausible draping
• Correct sleeve construction
• Correct neckline construction
• Realistic garment proportions
• Natural interaction between fabric and body
• Clean and believable hemline
• Consistent fabric behavior throughout the garment
Do not introduce design elements that were not specified.

MODEL / PRESENTATION
Present the garment on a professional fashion model with a natural, elegant pose.
• Model: adult woman, average build, neutral professional expression
• Framing: full-body (garment is ${garmentLength})
• Natural body proportions
• Minimal accessories, minimal makeup
• Clean hairstyle that does not obscure the garment
• The garment must remain the primary visual focus

CAMERA & OUTPUT
• Angle: eye-level, model facing camera straight-on or at a slight 3/4 turn
• Lens: 85mm fashion lens, f/4, sharp focus on garment
• Distance: garment fully framed within shot, centered, with consistent margin top and bottom
• Aspect ratio: 4:5
• Resolution: high-resolution commercial fashion catalog quality

BACKGROUND
• Background: seamless studio backdrop, pure white (#FFFFFF)
• Lighting: soft studio softbox lighting from front, 45° key light angle, minimal harsh shadow falloff
• Subtle natural contact shadow beneath the model only — no distracting props, textures, or set elements

PHOTOREALISM
Generate a highly realistic commercial fashion photograph. Ensure:
• Accurate fabric texture and high-detail textile rendering
• Realistic skin and anatomy
• Natural lighting and realistic shadows
• Accurate garment geometry
• Natural folds and draping
• Sharp garment details
• Professional fashion photography quality

IMPORTANT CONSTRAINTS
The output must represent the same fabric transformed into the specified garment design.
Do NOT:
• Change the fabric color
• Replace the fabric pattern or invent a different print
• Distort the fabric pattern
• Add embroidery, jewelry, or accessories unless explicitly requested
• Change the specified neckline, sleeve style, silhouette, or length
• Add a dupatta or extra garments unless requested
• Produce unrealistic folds
• Generate text, logos, watermarks, labels, or UI elements
• Generate anatomical distortion — no extra or missing fingers, no warped limbs, no asymmetric facial features

OUTPUT
Generate one complete, photorealistic ${garmentType} product visualization suitable for an online fashion catalog. The final image should look like a professionally photographed garment made from the uploaded fabric, not an illustration or digitally painted design.`;
}

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequestBody = await req.json();

    if (!body.garment || !body.silhouette || !body.fabricImage) {
      return NextResponse.json(
        { error: "garment, silhouette, and fabricImage are required" },
        { status: 400 }
      );
    }

    const ai = getGenAIClient();
    const patternSource = body.patternImage || DEFAULT_PATTERN;

    const [fabricPart, patternPart] = await Promise.all([
      resolveImagePart(body.fabricImage),
      resolveImagePart(patternSource),
    ]);

    const prompt = buildPrompt(body);

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-image",
      contents: [
        { text: prompt },
        { inlineData: { data: fabricPart.data, mimeType: fabricPart.mimeType } },
        { inlineData: { data: patternPart.data, mimeType: patternPart.mimeType } },
      ],
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
        imageConfig: { aspectRatio: "3:4" }, // portrait, suitable for garment shots
      },
    });

    const parts = response.candidates?.[0]?.content?.parts ?? [];
    const imagePart = parts.find((p) => p.inlineData);

    if (!imagePart?.inlineData) {
      return NextResponse.json(
        { error: "No image returned from model", raw: parts },
        { status: 502 }
      );
    }

    const mimeType = imagePart.inlineData.mimeType || "image/png";
    const dataUrl = `data:${mimeType};base64,${imagePart.inlineData.data}`;

    return NextResponse.json({
      success: true,
      image: dataUrl,
      model: "gemini-3.1-flash-lite-image",
    });
  } catch (err: unknown) {
    console.error("generate-garment error:", err);
    const errorMessage = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
