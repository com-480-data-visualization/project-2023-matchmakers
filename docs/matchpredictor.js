// const colors_map = {"female":"deeppink", "male":"blue", "all":"darkorange"};
// const labels_map = {"female":"Women", "male":"Men", "all":"Everyone"};


const button = document.getElementById("predict-button");
console.log(button);

const sliders_list = ["att_o", "sinc_o", "intell_o", "fun_o", "ambit_o", "shared_o",
                      "att", "sinc", "intell", "fun", "ambit", "shared"];
const labels = ["att_o_label", "sinc_o_label", "intell_o_label", "fun_o_label", "ambit_o_label", "shared_o_label",
                "att_label", "sinc_label", "intell_label", "fun_label", "ambit_label", "shared_label"];

sliders_list.forEach((item, i) => {
  let sl = document.getElementById(item);
  let sl_label = document.getElementById(labels[i]);
  sl.addEventListener("input", function(){
    sl_label.innerHTML = sl.value;
  })
});


button.addEventListener("click", async() => {
  if (button.className != "predict-button"){
    button.className = "predict-button";
    button.innerHTML = "Predict";
    return;
  }

  const model = await tfdf.loadTFDFModel('https://com-480-data-visualization.github.io/project-2023-matchmakers/matchmodel_current_js/model.json');
  console.log(model);
  //const model = await tfdf.loadTFDFModel('http://127.0.0.1:8080/project-2023-matchmakers/matchmodel_current_js/model.json');

  // Input to model directly from website (users input the values, pass them to the model directly):

  let age = parseFloat(document.getElementById("age").value);
  let age_o = parseFloat(document.getElementById("age_o").value);

  const prefs = ["att", "sinc", "intell", "fun", "ambit", "shared"];
  const prefs_o = ["att_o", "sinc_o", "intell_o", "fun_o", "ambit_o", "shared_o"];
  let pref_vals = [];
  let pref_o_vals = [];
  let sum = 0;
  let sum_o = 0;

  prefs.forEach((item, i) => {
    let pref_val = parseFloat(document.getElementById(item).value);
    let pref_o_val = parseFloat(document.getElementById(item+'_o').value);
    sum = sum + pref_val;
    sum_o = sum_o + pref_o_val;
    pref_vals.push(pref_val);
    pref_o_vals.push(pref_o_val);
  });

  // normalize to sum to 100

  pref_vals.forEach((item, i) => {
    pref_vals[i] = item*100/sum;
    pref_o_vals[i] = pref_o_vals[i]*100/sum_o;
  });


  console.log(pref_vals);

/*
  let att = parseFloat(document.getElementById("att").value)*10;
  let sincere = parseFloat(document.getElementById("sinc").value)*10;
  let intell = parseFloat(document.getElementById("intell").value)*10;
  let fun = parseFloat(document.getElementById("fun").value)*10;
  let ambit = parseFloat(document.getElementById("ambit").value)*10;
  let shared = parseFloat(document.getElementById("shared").value)*10;

  console.log(att , sincere);
  let pref_sum = att + sincere + intell + fun + ambit;

  let att_o = parseFloat(document.getElementById("att_o").value)*10;
  let sincere_o = parseFloat(document.getElementById("sinc_o").value)*10;
  let intell_o = parseFloat(document.getElementById("intell_o").value)*10;
  let fun_o = parseFloat(document.getElementById("fun_o").value)*10;
  let ambit_o = parseFloat(document.getElementById("ambit_o").value)*10;
  let shared_o = parseFloat(document.getElementById("shared_o").value)*10;
*/
  // race: has to preprocessed (1-hot encoded for the model):

  let race = document.getElementById("race").value;
  let race_o = document.getElementById("race_o").value;

  let wh = race=="white" ? 1 : 0;
  let bl = race=="black" ? 1 : 0;
  let lat = race=="latinx" ? 1 : 0;
  let asian = race=="asian" ? 1 : 0;

  let wh_o = race_o=="white" ? 1 : 0;
  let bl_o = race_o=="black" ? 1 : 0;
  let lat_o = race_o=="latinx" ? 1 : 0;
  let o_o = race_o=="asian" ? 1 : 0;

  // interests: model takes the correlation between the two peoples' interests,
  // not the actual scores for each separate thing
  // => calculate correlation first, then pass it to the model

  const interests = ['sports', 'museums', 'tvsports', 'exercise', 'dining', 'art', 'hiking',
       'gaming', 'clubbing', 'reading', 'tv', 'theater', 'movies', 'concerts',
       'shopping', 'music', 'yoga'];

  const interests_o = interests.map(i => i+'_o');
  console.log(interests_o);


  // collect my scores (Person 1) for each possible interest into a dictionary:

  let my_interests_map = {};
  interests.forEach((item, i) => {
    my_interests_map[item] = (+ document.getElementById(item).checked) * 10 ;
  });

  // collect Person 2's scores for each possible interest into a dictionary:

  let their_interests_map = {};
  interests.forEach((item, i) => {
    their_interests_map[item] = (+ document.getElementById(item+'_o').checked) * 10;
  });

  // make a list in the format necessary to calculate the correlation:

  let int_map = [];
  interests.forEach((item, i) => {
    int_map.push({
      me: my_interests_map[item],
      partner: their_interests_map[item]
    })
  });

  var interestsVars = {
  	me: 'metric',
  	partner: 'metric'
  };

  var stats = new Statistics(int_map, interestsVars);
  var interests_corr = stats.correlationCoefficient('me', 'partner').correlationCoefficient;
  console.log("interests correlation:");
  console.log(interests_corr);

  // construct input tensor :

  let inp = tf.tensor([[
    age, age_o, interests_corr,
    pref_o_vals[0], pref_o_vals[1], pref_o_vals[2], pref_o_vals[3], pref_o_vals[4], pref_o_vals[5],
    pref_vals[0], pref_vals[1], pref_vals[2], pref_vals[3], pref_vals[4], pref_vals[5],
    wh, bl, lat, asian,
    wh_o, bl_o, lat_o, o_o
  ]]);

  // predict:

  let matchproba = await model.executeAsync(inp);

  console.log(matchproba.arraySync()[0][0]);
  let pred = matchproba.arraySync()[0][0];
  if (pred < 0.3){
    button.className = "predict-low";
    button.innerHTML = "Low match probability &#128533";
    //console.log("low match probability :(");
  } else if (pred < 0.40) {
    button.className = "predict-medium";
    button.innerHTML = "Medium match probability &#128522";
    //console.log("medium match probability :/");
  } else {
    button.className = "predict-good";
    button.innerHTML = "Good match probability &#128525";
    //console.log("good match probability :)");
  }

})
