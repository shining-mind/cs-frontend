import on from '../../lib/homework-10/on';

const btn = document.getElementById('click');
const info = document.getElementById('info');

(async () => {
  let i = 0;
  for await (const ev of on(btn, 'click')) {
    info.appendChild(document.createTextNode(`Offset x, y: ${ev.offsetX}, ${ev.offsetY}\n`));
    if (i > 10) {
      break;
    }
    i += 1;
  }
  info.appendChild(document.createTextNode(`Done! No more clicks will be handled`));
})();