import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

/**
 * Minimal pure-Node script to generate valid PNG icons for Chrome & Firefox extensions
 * with a high-contrast futuristic AuraTab / BrowserTime clock & bookmark emblem.
 */

function createPNG(width, height) {
  // RGBA buffer
  const buffer = Buffer.alloc(width * height * 4);
  const cx = width / 2;
  const cy = height / 2;
  const r = width / 2 - 1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= r) {
        // Deep obsidian background with electric blue / cyan glow
        const t = dist / r;
        const bgR = Math.round(10 + (1 - t) * 20);
        const bgG = Math.round(18 + (1 - t) * 60);
        const bgB = Math.round(35 + (1 - t) * 120);

        // Center clock ring & needle
        const angle = Math.atan2(dy, dx);
        const ringDist = Math.abs(dist - r * 0.65);
        const isRing = ringDist < Math.max(1, width * 0.08);

        // Needle pointing at ~10:10 (angle ~ -2.1 rad)
        const needleAngle = -2.1;
        const diffAngle = Math.abs(Math.atan2(Math.sin(angle - needleAngle), Math.cos(angle - needleAngle)));
        const isNeedle = dist < r * 0.55 && diffAngle < 0.15;

        // Second needle pointing at ~2:00 (angle ~ -0.5 rad)
        const isSecNeedle = dist < r * 0.7 && Math.abs(angle - -0.5) < 0.1;

        if (isRing) {
          buffer[idx] = 56;      // Cyan
          buffer[idx + 1] = 189;
          buffer[idx + 2] = 248;
          buffer[idx + 3] = 255;
        } else if (isNeedle) {
          buffer[idx] = 255;     // White needle
          buffer[idx + 1] = 255;
          buffer[idx + 2] = 255;
          buffer[idx + 3] = 255;
        } else if (isSecNeedle) {
          buffer[idx] = 239;     // Racing red / cyan accent
          buffer[idx + 1] = 68;
          buffer[idx + 2] = 68;
          buffer[idx + 3] = 255;
        } else {
          buffer[idx] = bgR;
          buffer[idx + 1] = bgG;
          buffer[idx + 2] = bgB;
          buffer[idx + 3] = 255;
        }
      } else {
        // Transparent
        buffer[idx] = 0;
        buffer[idx + 1] = 0;
        buffer[idx + 2] = 0;
        buffer[idx + 3] = 0;
      }
    }
  }

  return encodeRawPNG(width, height, buffer);
}

function encodeRawPNG(width, height, rgbaBuffer) {
  // Scanlines with filter byte 0
  const scanlines = Buffer.alloc(height * (1 + width * 4));
  let scanlineOffset = 0;
  for (let y = 0; y < height; y++) {
    scanlines[scanlineOffset++] = 0; // Filter None
    const row = rgbaBuffer.subarray(y * width * 4, (y + 1) * width * 4);
    row.copy(scanlines, scanlineOffset);
    scanlineOffset += width * 4;
  }

  const compressedData = zlib.deflateSync(scanlines);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = data.length;
  const chunk = Buffer.alloc(12 + length);
  chunk.writeUInt32BE(length, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);

  const crc = crc32(chunk.subarray(4, 8 + length));
  chunk.writeUInt32BE(crc, 8 + length);
  return chunk;
}

// Standard CRC32 table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

export function generateAllIcons(outputDir) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const sizes = [16, 32, 48, 128];
  for (const size of sizes) {
    const png = createPNG(size, size);
    fs.writeFileSync(path.join(outputDir, `icon${size}.png`), png);
  }
  console.log(`Generated extension icons (${sizes.join(', ')}) in ${outputDir}`);
}

// Execute if run directly
const targetDir = path.resolve(process.cwd(), 'public/icons');
generateAllIcons(targetDir);
