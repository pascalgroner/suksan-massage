import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const localeDir = path.join(process.cwd(), "messages");
    const dePath = path.join(localeDir, "de.json");
    const enPath = path.join(localeDir, "en.json");
    const configPath = path.join(process.cwd(), "src", "resources", "config.json");

    const deContent = JSON.parse(fs.readFileSync(dePath, "utf8"));
    const enContent = JSON.parse(fs.readFileSync(enPath, "utf8"));
    
    let configContent = {};
    if (fs.existsSync(configPath)) {
        configContent = JSON.parse(fs.readFileSync(configPath, "utf8"));
    }

    return NextResponse.json({ de: deContent, en: enContent, config: configContent });
  } catch (error) {
    console.error("Error reading translation files:", error);
    return NextResponse.json(
      { error: "Failed to read content" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { de, en, config } = await request.json();

    const localeDir = path.join(process.cwd(), "messages");
    const dePath = path.join(localeDir, "de.json");
    const enPath = path.join(localeDir, "en.json");
    const configPath = path.join(process.cwd(), "src", "resources", "config.json");

    fs.writeFileSync(dePath, JSON.stringify(de, null, 2), "utf8");
    fs.writeFileSync(enPath, JSON.stringify(en, null, 2), "utf8");
    
    if (config) {
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf8");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error writing translation files:", error);
    return NextResponse.json(
      { error: "Failed to save content" },
      { status: 500 }
    );
  }
}
