const colors_map = {"female":"deeppink", "male":"blue", "all":"darkorange"};
const labels_map = {"female":"Women", "male":"Men", "all":"Everyone"};

(async () => {
 // Load the model.
 // Tensorflow.js currently needs the absolute path to the model including the full origin.
 //const model = await tfdf.loadTFDFModel('http://127.0.0.1:8080/project-2023-matchmakers/matchmodel/model.json');
 const model = await tfdf.loadTFDFModel('matchmodel/model.json');
 // Perform an inference
 const res = await model.executeAsync(tf.tensor([[ 1.06318785,  1.33890233,  1.46240333, -1.04112199,  0.35454676,
  2.59838526, -1.1037124 ,  0.04642716, -0.16618421, -1.05857994,
  0.37055393, -0.08550185, -1.10840028,  0.04145437,  2.74283214,
 -1.00297304, -0.22643017, -1.09902919, -0.32037796, -0.27160724,
 -0.22694717,  0.93111942, -0.31674382, -0.27160724]]));
 console.log(typeof res);
 res.print();
/* const result = await model.executeAsync({
    "age":tf.tensor([1.063188]),
    "age_o":tf.tensor([1.338902]),
    "interests_correlate":tf.tensor([1.462403]),
    "pref_o_attractive":tf.tensor([-1.041122]),
    "pref_o_sincere":tf.tensor([0.354547]),
    "pref_o_intelligence":tf.tensor ([2.598385]),
    "pref_o_funny":tf.tensor([-1.103712]),
    "pref_o_ambitious":tf.tensor([0.046427]),
    "pref_o_shared_interests":tf.tensor([-0.166184]),
    "attractive_important":tf.tensor([-1.058580]),
    "sincere_important":tf.tensor([0.370554]),
    "intellicence_important":tf.tensor([-0.085502]),
    "funny_important":tf.tensor([-1.108400]),
    "ambtition_important":tf.tensor([0.041454]),
    "shared_interests_important":tf.tensor([2.742832]),
    "gender_male":tf.tensor([-1.002973]),
    "race_Black":tf.tensor([-0.226430]),
    "race_Caucasian" :tf.tensor([-1.099029]),
    "race_Latinx"   :tf.tensor([-0.320378]),
    "race_Other"  :tf.tensor([-0.271607]),
    "race_o_Black"  :tf.tensor([-0.226947]),
    "race_o_Caucasian"  :tf.tensor([0.931119]),
    "race_o_Latinx":tf.tensor([-0.316744]),
    "race_o_Other":tf.tensor([-0.271607]),
 });
 // The result is a 6-dimensional vector, the first half may be ignored
 result.print();*/
})();
/*
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
