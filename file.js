const fs = require("fs").promises;
const path = require("path");

const filePath = path.join(__dirname, "codes.txt");
async function add(code) {
  try {
    await fs.appendFile(filePath, code + "\n");
    console.log(`Code "${code}" added to file.`);
  } catch (err) {
    console.error("Error writing to file:", err);
  }
}
async function includes(code) {
  try {
    const data = await fs.readFile(filePath, "utf8");
    const codes = data.split("\n").map((line) => line.trim());
    return codes.includes(code);
  } catch (err) {
    console.error("Error reading file:", err);
    return false;
  }
}

module.exports = {
  add,
  includes,
};
