const colors_map = {"female":"deeppink", "male":"blue", "all":"darkorange"};
const labels_map = {"female":"Women", "male":"Men", "all":"Everyone"};


const button = document.getElementById("predict-button");

button.addEventListener("click", async() => {
  const model = await tfdf.loadTFDFModel('https://com-480-data-visualization.github.io/project-2023-matchmakers/matchmodel_current_js/model.json');
  //const model = await tfdf.loadTFDFModel('http://127.0.0.1:8080/project-2023-matchmakers/matchmodel_current_js/model.json');

  let age = 23;
  let age_o = 30;//parseFloat(document.getElementById("age_o").value);

  let att = 22;//parseFloat(document.getElementById("att").value);
  let sincere = 44;//parseFloat(document.getElementById("sincere").value);
  let intell = 10;//parseFloat(document.getElementById("intell").value);
  let fun = 4;//parseFloat(document.getElementById("fun").value);
  let ambit = 10;//parseFloat(document.getElementById("ambit").value);
  let shared = 10;//parseFloat(document.getElementById("shared").value);

  let att_o = 0;//parseFloat(document.getElementById("att_o").value);
  let sincere_o = 0;//parseFloat(document.getElementById("sincere_o").value);
  let intell_o = 0;//parseFloat(document.getElementById("intell_o").value);
  let fun_o = 0;//parseFloat(document.getElementById("fun_o").value);
  let ambit_o = 0;//parseFloat(document.getElementById("ambit_o").value);
  let shared_o = 100;//parseFloat(document.getElementById("shared_o").value);

  let race = document.getElementById("race").value;
  let race_o = document.getElementById("race_o").value;

  //let interests_corr = 1.462403;
  let interests_corr = -0.01;

  let wh = race=="white" ? 1 : 0;
  let bl = race=="black" ? 1 : 0;
  let lat = race=="latinx" ? 1 : 0;
  let asian = race=="asian" ? 1 : 0;

  let wh_o = race=="white" ? 1 : 0;
  let bl_o = race=="black" ? 1 : 0;
  let lat_o = race=="latinx" ? 1 : 0;
  let o_o = race=="asian" ? 1 : 0;

  let inp = tf.tensor([[
    age, age_o, interests_corr,
    att_o, sincere_o, intell_o, fun_o, ambit_o, shared_o,
    att, sincere, intell, fun, ambit, shared,
  //  -1.002973,
    wh, bl, lat, asian,
    wh_o, bl_o, lat_o, o_o
  ]]);

  let matchproba = await model.executeAsync(inp);

  console.log(matchproba.arraySync()[0][0]);

  var interests = [
  	{ me: att, partner: att_o },
  	{ me: sincere, partner: sincere_o },
    { me: intell, partner: intell_o },
  	{ me: fun, partner: fun_o },
    { me: ambit, partner: ambit_o},
  	{ me: shared, partner: shared_o },
  ];

  var interestsVars = {
  	me: 'metric',
  	partner: 'metric'
  };

  var stats = new Statistics(interests, interestsVars);
  var r = stats.correlationCoefficient('me', 'partner');

//  console.log(r.correlationCoefficient);
})
