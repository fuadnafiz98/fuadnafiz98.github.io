import ejs from "ejs";
import path from "path";

const options = {
  // async: true,
};

const data = {
  projects: ["one", "two", "three"],
};

async function generate() {
  const result = await ejs.renderFile(
    path.resolve(".", "index.ejs"),
    data,
    options
  );
  console.log(result);
}

generate();
