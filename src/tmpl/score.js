/**
 * [Score description]
 * @param  {object}  props
 * @param  {object[]}  props.scores [description]
 * @constructor
 */
export default function Score({id = 'scoreTable', scores}) {
  const element = document.createElement('table');

  element.style = 'position: absolute; z-index: 2;';
  element.id = id;

  const tr = element.insertRow();
  const th1 = document.createElement('th');
  const th2 = document.createElement('th');
  th2.innerHTML = 'Score';
  tr.appendChild(th1);
  tr.appendChild(th2);

  for (const {name, score} of scores) {
    const tr = element.insertRow();
    const td1 = document.createElement('td');
    td1.innerText = name;
    const td2 = document.createElement('td');
    td2.innerText = score;

    tr.appendChild(td1);
    tr.appendChild(td2);
  }

  return element;
}
