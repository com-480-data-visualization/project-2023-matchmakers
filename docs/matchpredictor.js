const colors_map = {"female":"deeppink", "male":"blue", "all":"darkorange"};
const labels_map = {"female":"Women", "male":"Men", "all":"Everyone"};


const button = document.getElementById("predict-button");

button.addEventListener("click", async() => {
  const model = await tfdf.loadTFDFModel('project-2023-matchmakers/matchmodel/model.json');
  
  //const model = await tfdf.loadTFDFModel('http://127.0.0.1:8080/project-2023-matchmakers/matchmodel/model.json');

  let age = parseFloat(document.getElementById("age").value);
  let age_o = parseFloat(document.getElementById("age_o").value);

  let att = parseFloat(document.getElementById("att").value);
  let sincere = parseFloat(document.getElementById("sincere").value);
  let intell = parseFloat(document.getElementById("intell").value);
  let fun = parseFloat(document.getElementById("fun").value);
  let ambit = parseFloat(document.getElementById("ambit").value);
  let shared = parseFloat(document.getElementById("shared").value);

  let att_o = parseFloat(document.getElementById("att_o").value);
  let sincere_o = parseFloat(document.getElementById("sincere_o").value);
  let intell_o = parseFloat(document.getElementById("intell_o").value);
  let fun_o = parseFloat(document.getElementById("fun_o").value);
  let ambit_o = parseFloat(document.getElementById("ambit_o").value);
  let shared_o = parseFloat(document.getElementById("shared_o").value);

  let race = document.getElementById("race").value;
  let race_o = document.getElementById("race_o").value;

  //let interests_corr = 1.462403;
  let interests_corr = -1;

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
    -1.002973,
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

  console.log(r.correlationCoefficient);
})
