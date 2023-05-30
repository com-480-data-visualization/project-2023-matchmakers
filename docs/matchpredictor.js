// const colors_map = {"female":"deeppink", "male":"blue", "all":"darkorange"};
// const labels_map = {"female":"Women", "male":"Men", "all":"Everyone"};


const button = document.getElementById("predict-button");
console.log(button);

button.addEventListener("click", async() => {
  const model = await tfdf.loadTFDFModel('https://com-480-data-visualization.github.io/project-2023-matchmakers/matchmodel_current_js/model.json');
  console.log(model);
  //const model = await tfdf.loadTFDFModel('http://127.0.0.1:8080/project-2023-matchmakers/matchmodel_current_js/model.json');

  // Input to model directly from website (users input the values, pass them to the model directly):

  let age = parseFloat(document.getElementById("age").value);
  let age_o = parseFloat(document.getElementById("age_o").value);

  let att = parseFloat(document.getElementById("att").value);
  let sincere = parseFloat(document.getElementById("sinc").value);
  let intell = parseFloat(document.getElementById("intell").value);
  let fun = parseFloat(document.getElementById("fun").value);
  let ambit = parseFloat(document.getElementById("ambit").value);
  let shared = parseFloat(document.getElementById("shared").value);

  let att_o = parseFloat(document.getElementById("att_o").value);
  let sincere_o = parseFloat(document.getElementById("sinc_o").value);
  let intell_o = parseFloat(document.getElementById("intell_o").value);
  let fun_o = parseFloat(document.getElementById("fun_o").value);
  let ambit_o = parseFloat(document.getElementById("ambit_o").value);
  let shared_o = parseFloat(document.getElementById("shared_o").value);

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
    att_o, sincere_o, intell_o, fun_o, ambit_o, shared_o,
    att, sincere, intell, fun, ambit, shared,
    wh, bl, lat, asian,
    wh_o, bl_o, lat_o, o_o
  ]]);

  // predict:

  let matchproba = await model.executeAsync(inp);

  console.log(matchproba.arraySync()[0][0]);
  let pred = matchproba.arraySync()[0][0];
  if (pred < 0.25){
    console.log("low match probability :(");
  } else if (pred < 0.3) {
    console.log("medium match probability :/");
  } else {
    console.log("good match probability :)");
  }

})
