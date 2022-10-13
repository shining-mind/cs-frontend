// TODO: refactor WIP
import UintBitsReader from '../../lib/coursework-01/bits-reader/UintBitsReader';

/**
 * WEBP specs
 * @see https://developers.google.com/speed/webp/docs/riff_container?hl=ru-ru
 * @see https://developers.google.com/speed/webp/docs/webp_lossless_bitstream_specification
 * 
 * LibWEBP tests
 * @see https://chromium.googlesource.com/webm/libwebp/+/refs/heads/main/tests/
 * @see https://chromium.googlesource.com/webm/libwebp-test-data/+/refs/heads/main
 */

const RIFF = 1179011410;
const WEBP = 1346520407;
const VP8 = 540561494;
const VP8L = 1278758998;
const VP8X = 1480085590;
const VP8L_SIGNATURE = 0x2f;

const TransformType = {
  PREDICTOR_TRANSFORM: 0,
  COLOR_TRANSFORM: 1,
  SUBTRACT_GREEN: 2,
  COLOR_INDEXING_TRANSFORM: 3,
};

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

/**
 * @param {[number, number]} size 
 * @param {UintBitsReader} bitsReader 
 */
function renderLosslessImage(size, bitsReader) {
  /**
   * @type {HTMLCanvasElement}
   */
  const canvas = document.getElementById('canvas');
  canvas.setAttribute('width', size[0]);
  canvas.setAttribute('height', size[1]);

  // transform exist
  while (bitsReader.read(1)) {
    const transformType = bitsReader.read(2);
    switch (transformType) {
      case TransformType.PREDICTOR_TRANSFORM:
        console.log('predictor');
        break;
      case TransformType.COLOR_TRANSFORM:
        console.log('color transform');
        break;
      case TransformType.SUBTRACT_GREEN:
        console.log('subtract green');
        break;
      case TransformType.COLOR_INDEXING_TRANSFORM:
        console.log('cit');
        const colorTableSize = bitsReader.read(8) + 1;
        console.log(colorTableSize);
        const hasColorCacheInfo = bitsReader.read(1) === 1;
        console.log('has color cache', hasColorCacheInfo);
        if (hasColorCacheInfo) {
          const colorCacheSize = bitsReader.read(4);
          console.log(colorCacheSize);
        }
        
        break;
    }
  }
}

function resetCanvas() {
  /**
   * @type {HTMLCanvasElement}
   */
  const canvas = document.getElementById('canvas');
  canvas.setAttribute('width', 0);
  canvas.setAttribute('height', 0);
}

document.querySelector('input[type="file"]').addEventListener('change', (e) => {
  const fileList = e.target.files;
  if (!fileList.length) {
    document.getElementById('info').style.display = 'none';
    resetCanvas();
    return;
  }
  document.getElementById('info').style.display = 'block';
  const info = [];
  const reader = new FileReader();
  reader.addEventListener('load', (event) => {
    const buffer = event.target.result;
    const bitsReader = new UintBitsReader(buffer);
    // Handle WEBP
    const webpHeader = [
      bitsReader.read(32),
      bitsReader.read(32),
      bitsReader.read(32),
      bitsReader.read(32)
    ];
    if (webpHeader[0] === RIFF && webpHeader[2] === WEBP) {
      info.push(`File size in bytes: ${webpHeader[1]}`);
      info.push(`File format: ${webpFormat(webpHeader[3])}`);
      if (webpHeader[3] === VP8L) {
        const usefulBytes = bitsReader.read(32);
        const signature = bitsReader.read(8);
        info.push(`Data bytes: ${usefulBytes}, signature: ${signature.toString(16)}`);
        if (signature === VP8L_SIGNATURE) {
          const width = bitsReader.read(14) + 1;
          const height = bitsReader.read(14) + 1;
          const alphaIsUsed = bitsReader.read(1);
          const version = bitsReader.read(3);
          info.push(`Size: ${width} x ${height}`);
          info.push(`Alpha: ${alphaIsUsed}, version: ${version}`);
          renderLosslessImage([width, height], bitsReader);
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