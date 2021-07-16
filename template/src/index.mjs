import { readdir, lstat, writeFile } from "fs/promises";
import fs from "fs";
import ejs from "ejs";
import path from "path";

const options = {
  // async: true,
};

const isFolder = async folderPath => {
  try {
    const stat = await lstat(folderPath);
    return stat.isFile();
  } catch (err) {
    throw new Error(err.message);
  }
};

async function generate() {
  // read all the files
  const files = await readdir(path.resolve(".", "src/pages"));
  // const files = fs.readdirSync(path.resolve(".", "src/pages"));
  for await (const file of files) {
    const filePath = await path.resolve("./src/pages/", file);
    const isFile = await isFolder(filePath);
    if (isFile) {
      const fileName = file.slice(0, -4);
      const data = {
        css: fileName,
      };
      const html = await ejs.renderFile(filePath, data, options);
      writeFile(`${path.resolve(".", "src/public")}/${fileName}.html`, html);
      console.log(`[${fileName}] generated`);
    }
  }
}

generate();
