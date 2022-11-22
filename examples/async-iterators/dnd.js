import on from '../../lib/homework-10/on';
import once from '../../lib/homework-10/once';
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
      once(box, 'mousedown'),
      every(
        any(
          on(document.body, 'mousemove'),
          on(box, 'mouseup')
        ),
        (ev) => ev.type === 'mousemove',
      )
    ),
    (ev) => ev.type === 'mousemove',
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