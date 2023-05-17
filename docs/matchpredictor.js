import * as tfcore from "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core";
import * as tfcpu from "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-cpu";
import * as tfconv from "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-converter";
import * as tfdf from "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-tfdf/dist/tf-tfdf.min.js";


const colors_map = {"female":"deeppink", "male":"blue", "all":"darkorange"};
const labels_map = {"female":"Women", "male":"Men", "all":"Everyone"};

// set the dimensions and margins of the graph
var margin = {top: 60, right: 30, bottom: 70, left: 30},
width1 = 1200 - margin.left - margin.right,
height1 = 400 - margin.top - margin.bottom;

const data_path = "data/people.csv";

tfdfModel

//const tfdfModel = await tfdf.loadTFDFModel('match_model');

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
