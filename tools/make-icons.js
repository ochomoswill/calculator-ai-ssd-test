// Generates the PWA icons as PNG files using only Node built-ins.
// The image is a solid accent square with a white equals-sign mark.
// Deterministic: the same size always yields identical bytes.
import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const ACCENT = [0x1e, 0x5a, 0x8f];
const MARK = [0xff, 0xff, 0xff];

const CRC_TABLE = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buf) {
  let crc = 0xffffffff;
  for (const byte of buf) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const typed = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typed));
  return Buffer.concat([length, typed, crc]);
}

/** True when pixel (x, y) is on one of the two bars of the equals sign. */
function onMark(x, y, size) {
  const barHeight = size * 0.11;
  const left = size * 0.24;
  const right = size * 0.76;
  const upper = size * 0.37;
  const lower = size * 0.63;
  if (x < left || x >= right) return false;
  return (y >= upper - barHeight / 2 && y < upper + barHeight / 2) || (y >= lower - barHeight / 2 && y < lower + barHeight / 2);
}

/** Encode a square RGB PNG of the given size. */
export function encodeIcon(size) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8; // bit depth
  header[9] = 2; // colour type: RGB
  const stride = size * 3 + 1;
  const raw = Buffer.alloc(stride * size);
  for (let y = 0; y < size; y++) {
    raw[y * stride] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      const [r, g, b] = onMark(x, y, size) ? MARK : ACCENT;
      const o = y * stride + 1 + x * 3;
      raw[o] = r; raw[o + 1] = g; raw[o + 2] = b;
    }
  }
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

export const ICON_SIZES = [192, 512];

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  for (const size of ICON_SIZES) {
    const path = new URL(`../src/icons/icon-${size}.png`, import.meta.url);
    writeFileSync(path, encodeIcon(size));
    console.log(`wrote ${fileURLToPath(path)}`);
  }
}
