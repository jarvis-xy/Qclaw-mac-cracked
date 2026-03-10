const fs = require('fs');
const path = require('path');

exports.pack = function(inputDir, asarPath) {
  function createHeader(dir) {
    const files = {};
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        files[entry] = { files: createHeader(fullPath) };
      } else {
        files[entry] = { size: stat.size, offset: "0" };
      }
    }
    return files;
  }

  const headerRoot = { files: createHeader(inputDir) };

  let currentOffset = 0;
  function walk(node) {
    if (node.files) {
      for (const f in node.files) walk(node.files[f]);
    } else {
      node.offset = currentOffset.toString();
      currentOffset += node.size;
    }
  }
  walk(headerRoot);

  const json = JSON.stringify(headerRoot);
  const jsonBuf = Buffer.from(json);
  const jsonSize = jsonBuf.length;
  
  // Create the header pickle structure
  // [Size2 (4 bytes)] [Size3 (4 bytes)] [JSON String]
  // Size3 = jsonSize
  // Size2 = jsonSize + 4
  const headerPickleBuf = Buffer.alloc(8 + jsonSize);
  headerPickleBuf.writeUInt32LE(jsonSize + 4, 0);
  headerPickleBuf.writeUInt32LE(jsonSize, 4);
  jsonBuf.copy(headerPickleBuf, 8);

  // Main header
  // [4 (4 bytes)] [Size1 (4 bytes)]
  // Size1 = headerPickleBuf.length (jsonSize + 8)
  const headerSizePickle = headerPickleBuf.length;
  const sizeBuf = Buffer.alloc(8);
  sizeBuf.writeUInt32LE(4, 0);
  sizeBuf.writeUInt32LE(headerSizePickle, 4);

  const out = fs.createWriteStream(asarPath);
  out.write(sizeBuf);
  out.write(headerPickleBuf);

  function writeFiles(node, dir) {
    if (node.files) {
      for (const f in node.files) writeFiles(node.files[f], path.join(dir, f));
    } else {
      out.write(fs.readFileSync(dir));
    }
  }
  writeFiles(headerRoot, inputDir);
  out.end();
};
