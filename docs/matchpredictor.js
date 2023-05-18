/*import * as tfcore from "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core";
import * as tfcpu from "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-cpu";
import * as tfconv from "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-converter";
import * as tfdf from "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-tfdf/dist/tf-tfdf.min.js"; */


const colors_map = {"female":"deeppink", "male":"blue", "all":"darkorange"};
const labels_map = {"female":"Women", "male":"Men", "all":"Everyone"};

// set the dimensions and margins of the graph
var margin = {top: 60, right: 30, bottom: 70, left: 30},
width1 = 1200 - margin.left - margin.right,
height1 = 400 - margin.top - margin.bottom;

const data_path = "data/people.csv";

//
const model = await tf.loadGraphModel('matchmodel/model.json')
const xs = tf.tensor2d([ 1.06318785,  1.33890233,  1.46240333, -1.04112199,  0.35454676,
        2.59838526, -1.1037124 ,  0.04642716, -0.16618421, -1.05857994,
        0.37055393, -0.08550185, -1.10840028,  0.04145437,  2.74283214,
       -1.00297304, -0.22643017, -1.09902919, -0.32037796, -0.27160724,
       -0.22694717,  0.93111942, -0.31674382, -0.27160724], [1, 24]);

console.log(model);
console.log(xs);
let pred = await model.executeAsync(xs);
console.log('pred:${predDocument}');
/*clf2 = DecisionTreeClassifier()
clf3 = GaussianNB()


clf = VotingClassifier(estimators=[
        ('lr', clf1), ('dt', clf2), ('gnb', clf3)],
        voting='soft',
        flatten_transform=True)
clf = clf.fit(X_train, y_train, train_weights) */


console.log('match predictor script');

/*
d3.csv(data_path, {
  delimiter: ",",
  header: true
}).then(function(dataa){

})
*/
