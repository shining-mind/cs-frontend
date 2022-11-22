import once from '../../lib/homework-10/once';

const btn = document.getElementById('click');
const info = document.getElementById('info');

(async () => {
  for await (const ev of once(btn, 'click')) {
    info.appendChild(document.createTextNode(`Offset x, y: ${ev.offsetX}, ${ev.offsetY}\n`));
  }
  info.appendChild(document.createTextNode(`Done! No more clicks will be handled`));
})();