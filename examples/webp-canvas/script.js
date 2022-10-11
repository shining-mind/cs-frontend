// TODO: refactor WIP

const RIFF = 1179011410;
const WEBP = 1346520407;
const VP8 = 540561494;
const VP8L = 1278758998;
const VP8X = 1480085590;
const VP8L_SIGNATURE = 0x2f;

function webpFormat(format) {
  switch (format) {
    case VP8:
      return 'lossy';
    case VP8L:
      return 'lossless';
    case VP8X:
      return 'extended';
    default:
      throw new TypeError(`Unknown format: ${format}`);
  }
}

function toBitGroups(v) {
  return v.toString(2).padStart(32, '0').match(/.{8}/g);
}

function decodeWidth(byte1, byte2) {
  return (byte1 | (byte2 & 0b111111) << 8) + 1;
}

function decodeHeight(byte1, byte2, byte3) {
  return (
    (byte1 & 0b11000000) >> 6 // 2 bits
    | (byte2 << 2) // 8 bits
    | (byte3 & 0b1111) << 10 // 4 bits
  ) + 1
}

document.querySelector('input[type="file"]').addEventListener('change', (e) => {
  const fileList = e.target.files;
  if (!fileList.length) {
    document.getElementById('info').style.display = 'none';
    return;
  }
  document.getElementById('info').style.display = 'block';
  const info = [];
  const reader = new FileReader();
  reader.addEventListener('load', (event) => {
    const buffer = event.target.result;
    // Handle WEBP
    const webpHeader = new Uint32Array(buffer, 0, 16 / Uint32Array.BYTES_PER_ELEMENT);
    console.log(webpHeader);
    if (webpHeader[0] === RIFF && webpHeader[2] === WEBP) {
      info.push(`File size in bytes: ${webpHeader[1]}`);
      info.push(`File format: ${webpFormat(webpHeader[3])}`);
      if (webpHeader[3] === VP8L) {
        const usefulBytes = new Uint32Array(buffer, 16, 4 / Uint32Array.BYTES_PER_ELEMENT)[0];
        const signature = new Uint8Array(buffer, 20, 1 / Uint8Array.BYTES_PER_ELEMENT)[0];
        info.push(`Data bytes: ${usefulBytes}, signature: ${signature.toString(16)}`);
        if (signature === VP8L_SIGNATURE) {
          const options = new Uint8Array(buffer, 21, 4 / Uint8Array.BYTES_PER_ELEMENT);
          const width = decodeWidth(options[0], options[1]);
          const height = decodeHeight(options[1], options[2], options[3]);
          info.push(`Size: ${width} x ${height}`);
          const data = new Uint8Array(buffer, 21);
          let hexBuffer = '';
          data.forEach((byte) => {
            hexBuffer += byte.toString(16).padStart(2, '0') + ' ';
          });
          info.push('HEX Data:');
          info.push(hexBuffer);
        } else {
          alert('Invalid VP8L signature');
        }
      }
      document.getElementById('params').textContent = info.join('\n');
    } else {
      alert('Not a WEBP file!');
    }
  });
  reader.readAsArrayBuffer(fileList[0]);
});