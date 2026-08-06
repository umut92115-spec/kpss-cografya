const fs = require("fs");
const path = require("path");

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
  console.log("Copying data files to out/data for static hosting...");
  copyFolderRecursiveSync("public/data", path.join(outDir, "data"));
  copyFolderRecursiveSync("data", path.join(outDir, "data"));
  console.log("Data files copied successfully to out/data!");
}
