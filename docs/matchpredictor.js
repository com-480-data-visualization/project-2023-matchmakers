import * as tf from 'https://cdn.skypack.dev/@tensorflow/tfjs';
import * as sk from 'https://cdn.skypack.dev/scikitjs';
sk.setBackend(tf);

const colors_map = {"female":"deeppink", "male":"blue", "all":"darkorange"};
const labels_map = {"female":"Women", "male":"Men", "all":"Everyone"};

// set the dimensions and margins of the graph
var margin = {top: 60, right: 30, bottom: 70, left: 30},
width1 = 1200 - margin.left - margin.right,
height1 = 400 - margin.top - margin.bottom;

const data_path = "data/people.csv";

let lr = new sk.LinearRegression()


console.log('match predictor script');

/*
d3.csv(data_path, {
  delimiter: ",",
  header: true
}).then(function(dataa){

})
*/
