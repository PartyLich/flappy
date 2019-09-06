/**
 * [startButton description]
 * @param {object} props
 * @param  {string} props.id   [description]
 * @param  {string} props.text [description]
 * @return {object}      an html button element
 */
export default function startButton({id, text}) {
  const element = document.createElement('button');

  element.id = id;
  element.innerText = text;

  return element;
}
