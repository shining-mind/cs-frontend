import on from '../../lib/homework-10/on';
import { filter } from '../../lib/homework-10/async-iters';

const btn = document.getElementById('click');
const info = document.getElementById('info');

(async () => {
  for await (const ev of filter(on(btn, 'click'), (e) => e.offsetX < btn.offsetWidth / 2)) {
    info.appendChild(document.createTextNode(`Offset x, y: ${ev.offsetX}, ${ev.offsetY}\n`));
  }
})();