import colors from "./colors.js";
import figures from "./figures.js";

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getRandFigure(){
  return figures[getRandomInt(figures.length)];
}

function getRandColor(){
  return colors[getRandomInt(colors.length)];
}

export {getRandomInt, getRandFigure, getRandColor}