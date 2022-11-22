import on from '../../lib/homework-10/on';
import { take } from '../../lib/homework-10/async-iters';

const btn = document.getElementById('click');
const info = document.getElementById('info');

(async () => {
  for await (const ev of take(on(btn, 'click'), 5)) {
    info.appendChild(document.createTextNode(`Offset x, y: ${ev.offsetX}, ${ev.offsetY}\n`));
  }
  info.appendChild(document.createTextNode(`Done! No more clicks will be handled`));
})();