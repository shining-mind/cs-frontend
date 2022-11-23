import on from '../../lib/homework-10/on';
import once from '../../lib/homework-10/once';
import onlyEvent from '../../lib/homework-10/onlyEvent';
import { filter, repeat, seq, any, every } from '../../lib/homework-10/async-iters';


function getCoords(element) {
  const box = element.getBoundingClientRect();
  return {
    top: box.top + window.scrollY,
    left: box.left + window.scrollX,
  };
}

const box = document.getElementById('box');
const container = document.getElementById('container');
const shiftX = box.offsetWidth / 2;
const shiftY = box.offsetHeight / 2;

box.ondragstart = function() {
  return false;
};

(async () => {
  const dnd = repeat(() => filter(
    seq(
      once(box, 'pointerdown'),
      every(
        any(
          on(document.body, 'pointermove'),
          on(box, 'pointerup')
        ),
        onlyEvent('pointermove'),
      )
    ),
    onlyEvent('pointermove'),
  ));
  for await (const ev of dnd) {
    const { top, left } = getCoords(container);
    if (ev.pageX - shiftX > left && ev.pageX + shiftX < left + container.offsetWidth) {
      box.style.left = ev.pageX - left - shiftX + 'px';
    }
    if (ev.pageY - shiftY > top && ev.pageY + shiftY < top + container.offsetHeight) {
      box.style.top = ev.pageY - top - shiftY + 'px';
    }
  }
})();