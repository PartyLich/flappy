/**
 *
 */
import $ from 'jquery';
import Engine from './engine';

$(function () {
  // RequestAnimationFrame shim
  const requestAnimationFrame = window.requestAnimationFrame
      || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame
      || window.msRequestAnimationFrame;
  const engine = new Engine();

  window.requestAnimationFrame = requestAnimationFrame;

  engine.home();
});
