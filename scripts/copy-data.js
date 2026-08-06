const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function copyFolderRecursiveSync(source, target) {
  if (!fs.existsSync(source)) return;
  if (!fs.existsSync(target)) fs.mkdirSync(target, { recursive: true });
  
  if (fs.lstatSync(source).isDirectory()) {
    const files = fs.readdirSync(source);
    files.forEach(function (file) {
      const curSource = path.join(source, file);
      const curTarget = path.join(target, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, curTarget);
      } else {
        fs.copyFileSync(curSource, curTarget);
      }
    });
  }
}

const outDir = path.join(process.cwd(), "out");
if (fs.existsSync(outDir)) {
  fs.rmSync(outDir, { recursive: true, force: true });
}
fs.mkdirSync(outDir, { recursive: true });

console.log("=== BUILDING STATIC PUBLISH DIRECTORY (out/) ===");

// 1. Copy public static assets
if (fs.existsSync("public")) {
  copyFolderRecursiveSync("public", outDir);
}

// 2. Copy Next.js static JS chunks
const nextStatic = path.join(process.cwd(), ".next", "static");
if (fs.existsSync(nextStatic)) {
  copyFolderRecursiveSync(nextStatic, path.join(outDir, "_next", "static"));
}

// 3. Copy full data directory (questions, konular, iller, matris, etc.)
copyFolderRecursiveSync("public/data", path.join(outDir, "data"));
copyFolderRecursiveSync("data", path.join(outDir, "data"));

// 4. Transform and copy prerendered HTML files from .next/server/app to out/
const appServerDir = path.join(process.cwd(), ".next", "server", "app");

function processAppDirectory(srcDir, targetRelPath) {
  if (!fs.existsSync(srcDir)) return;
  const items = fs.readdirSync(srcDir);

  for (const item of items) {
    const srcPath = path.join(srcDir, item);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      processAppDirectory(srcPath, path.join(targetRelPath, item));
    } else if (item.endsWith(".html")) {
      const baseName = item.slice(0, -5); // remove .html
      
      if (baseName === "index" && targetRelPath === "") {
        // Root index.html
        fs.copyFileSync(srcPath, path.join(outDir, "index.html"));
      } else if (baseName === "index") {
        const destFolder = path.join(outDir, targetRelPath);
        fs.mkdirSync(destFolder, { recursive: true });
        fs.copyFileSync(srcPath, path.join(destFolder, "index.html"));
      } else {
        // e.g. quiz.html -> out/quiz.html AND out/quiz/index.html
        const fileDest = path.join(outDir, targetRelPath, `${baseName}.html`);
        const folderDest = path.join(outDir, targetRelPath, baseName);
        
        fs.mkdirSync(path.dirname(fileDest), { recursive: true });
        fs.copyFileSync(srcPath, fileDest);

        fs.mkdirSync(folderDest, { recursive: true });
        fs.copyFileSync(srcPath, path.join(folderDest, "index.html"));
      }
    } else if (item.endsWith(".body")) {
      const cleanName = item.replace(".body", "");
      const dest = path.join(outDir, targetRelPath, cleanName);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(srcPath, dest);
    }
  }
}

if (fs.existsSync(appServerDir)) {
  processAppDirectory(appServerDir, "");
}

console.log("Static output directory (out/) created successfully!");

// 5. Build site.zip at Desktop and project root
try {
  const desktopZip = "/Users/umut/Desktop/site.zip";
  const projectZip = path.join(process.cwd(), "site.zip");
  
  if (fs.existsSync(desktopZip)) fs.unlinkSync(desktopZip);
  if (fs.existsSync(projectZip)) fs.unlinkSync(projectZip);

  execSync(`cd "${outDir}" && zip -r "${desktopZip}" . > /dev/null`);
  fs.copyFileSync(desktopZip, projectZip);

  const stats = fs.statSync(desktopZip);
  console.log(`\n🎉 FRESH site.zip CREATED AT MASAÜSTÜ: ${(stats.size / (1024 * 1024)).toFixed(1)} MB`);
} catch (err) {
  console.error("Zipping error:", err);
}
