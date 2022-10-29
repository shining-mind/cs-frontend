import forEach from '../../lib/homework-07/for-each';

const info = document.getElementById('info');

const onPause = (index) => {
  info.appendChild(document.createTextNode(`Paused index: ${index}, time: ${new Date().toISOString()}\n`));
}

const onContinue = (index) => {
  info.appendChild(document.createTextNode(`Continue from index: ${index}, time: ${new Date().toISOString()}\n`));
}

const start = Date.now();

forEach(new Array(50e6), () => {}, { onPause, onContinue }).then(() => {
  info.appendChild(document.createTextNode(`Done! Time: ${new Date().toISOString()}, time elapsed: ${Date.now() - start} ms\n`));
});