const fs = require('fs');
const path = require('path');

exports.unpack = function(asarPath, outputDir) {
  const fd = fs.openSync(asarPath, 'r');
  const sizeBuf = Buffer.alloc(8);
  if (fs.readSync(fd, sizeBuf, 0, 8, 0) !== 8) {
    throw new Error('Unable to read header size');
  }

  const headerSizePickle = sizeBuf.readUInt32LE(4);
  const headerPickleBuf = Buffer.alloc(headerSizePickle);
  if (fs.readSync(fd, headerPickleBuf, 0, headerSizePickle, 8) !== headerSizePickle) {
    throw new Error('Unable to read header pickle');
  }

  const jsonSize = headerPickleBuf.readUInt32LE(0);
  const jsonString = headerPickleBuf.slice(4, 4 + jsonSize).toString('utf8');
  const header = JSON.parse(jsonString);

  const baseOffset = 8 + headerSizePickle;

  function extractFile(node, p) {
    if (node.files) {
      if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
      for (const file in node.files) {
        extractFile(node.files[file], path.join(p, file));
      }
    } else {
      if (node.unpacked) return;
      const offset = parseInt(node.offset) + baseOffset;
      const size = node.size;
      const buf = Buffer.alloc(size);
      if (fs.readSync(fd, buf, 0, size, offset) !== size) {
         console.error(`Failed to read file: ${p}`);
      } else {
         fs.writeFileSync(p, buf);
         if (node.executable) fs.chmodSync(p, '755');
      }
    }
  }

  extractFile(header, outputDir);
  fs.closeSync(fd);
};
