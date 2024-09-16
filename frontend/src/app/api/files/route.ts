import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    const metadata = data.get("metadata") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const imageData = new FormData();
    imageData.append("file", file);
    imageData.append("pinataMetadata", JSON.stringify({ name: file.name }));

    const imageRes = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      body: imageData,
    });

    if (!imageRes.ok) {
      throw new Error(`Failed to upload image: ${imageRes.statusText}`);
    }

    const { IpfsHash: imageHash } = await imageRes.json();

    // Create and upload metadata
    const metadataJSON = JSON.parse(metadata);
    metadataJSON.image = `ipfs://${imageHash}`;

    const metadataData = new FormData();
    metadataData.append("file", new Blob([JSON.stringify(metadataJSON)], { type: "application/json" }), "metadata.json");
    metadataData.append("pinataMetadata", JSON.stringify({ name: "Metadata" }));

    const metadataRes = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      body: metadataData,
    });

    if (!metadataRes.ok) {
      throw new Error(`Failed to upload metadata: ${metadataRes.statusText}`);
    }

    const { IpfsHash: metadataHash } = await metadataRes.json();

    return NextResponse.json({ imageHash, metadataHash }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}