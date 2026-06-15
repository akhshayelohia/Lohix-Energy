import fs from "fs";
import path from "path";

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith(".ts") || file.endsWith(".tsx")) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk("./src");
let changed = 0;

files.forEach((file) => {
  let content = fs.readFileSync(file, "utf8");
  if (content.includes("LOHIX 48")) {
    content = content.replace(/LOHIX 48/g, "Lohix Energy");
    fs.writeFileSync(file, content, "utf8");
    changed++;
    console.log(`Updated ${file}`);
  }
});

console.log(`Finished. Updated ${changed} files.`);
