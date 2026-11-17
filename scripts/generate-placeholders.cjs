const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function crc32(buf) {
  let table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[n] = c;
  }
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ (-1)) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type);
  const body = Buffer.concat([typeBuf, data]);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crcBuf]);
}

function createGradImage(w, h, c1, c2, c3) {
  // RGBA buffer
  const raw = Buffer.alloc((1 + w * 4) * h);
  for (let y = 0; y < h; y++) {
    const rowOffset = y * (1 + w * 4);
    raw[rowOffset] = 0; // Filter: none
    const ty = y / h;
    for (let x = 0; x < w; x++) {
      const tx = x / w;
      const px = rowOffset + 1 + x * 4;
      
      // Calculate pastel gradient
      const r = Math.round(c1[0] * (1 - tx) * (1 - ty) + c2[0] * tx * (1 - ty) + c3[0] * ty);
      const g = Math.round(c1[1] * (1 - tx) * (1 - ty) + c2[1] * tx * (1 - ty) + c3[1] * ty);
      const b = Math.round(c1[2] * (1 - tx) * (1 - ty) + c2[2] * tx * (1 - ty) + c3[2] * ty);
      
      // Vignette & border
      const border = (x < 16 || x > w - 17 || y < 16 || y > h - 17);
      if (border) {
        raw[px] = 255;
        raw[px + 1] = 255;
        raw[px + 2] = 255;
        raw[px + 3] = 255;
      } else {
        // Subtle decorative noise or sparkle
        const centerDist = Math.hypot((x - w / 2) / (w / 2), (y - h / 2) / (h / 2));
        const glow = Math.max(0, 1 - centerDist * 0.6);
        raw[px] = Math.min(255, Math.round(r * glow + 40));
        raw[px + 1] = Math.min(255, Math.round(g * glow + 35));
        raw[px + 2] = Math.min(255, Math.round(b * glow + 45));
        raw[px + 3] = 255;
      }
    }
  }

  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr.writeUInt8(8, 8); // bit depth
  ihdr.writeUInt8(6, 9); // RGBA
  ihdr.writeUInt8(0, 10);
  ihdr.writeUInt8(0, 11);
  ihdr.writeUInt8(0, 12);

  const idat = zlib.deflateSync(raw);
  return Buffer.concat([
    header,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', idat),
    makeChunk('IEND', Buffer.alloc(0))
  ]);
}

const colors = [
  [[255, 182, 193], [244, 208, 63], [225, 190, 231]], // Pink to Lavender
  [[197, 219, 255], [255, 204, 229], [216, 180, 254]], // Sky to Soft Rose
  [[254, 215, 226], [253, 230, 138], [243, 232, 255]], // Peach to Pearl
  [[216, 180, 254], [167, 243, 208], [251, 207, 232]], // Lavender to Mint
  [[255, 192, 203], [255, 228, 225], [199, 210, 254]], // Rose to Misty
  [[253, 164, 175], [254, 240, 138], [196, 181, 253]], // Sunset Dream
];

const outDir = path.join(__dirname, '..', 'public', 'images');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

for (let i = 1; i <= 6; i++) {
  const c = colors[i - 1];
  const pngBuf = createGradImage(512, 512, c[0], c[1], c[2]);
  fs.writeFileSync(path.join(outDir, `memory${i}.jpg`), pngBuf);
  console.log(`Generated public/images/memory${i}.jpg`);
}
