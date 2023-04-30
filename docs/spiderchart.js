const container = d3.select('#spider');

const container_w = 1200;
const container_h = 400;

const width = 400;
const height = 400;


d3.csv("../data/people.csv", {
  delimiter: ",",
  header: true
}).then(function(dataa){
  const svg = container.append('svg')
      .attr('width', container_w)
      .attr('height', container_h);
    //  .attr('transform', "translate(1000, 0)");

const svg = container.append('svg')
    .attr('width', container_w)
    .attr('height', container_h);
  //  .attr('transform', "translate(1000, 0)");

let data = [];
let features = ["A", "B", "C", "D", "E", "F"];
//generate the data
for (var i = 0; i < 3; i++){
    var point = {}
    //each feature will be a random number from 1-9
    features.forEach(f => point[f] = 1 + Math.random() * 8);
    data.push(point);
}
console.log(data);
console.log('max:')
console.log(d3.max(data))

let radialScale = d3.scaleLinear()
  .domain([0, 10])
  .range([0, width/2-25]);

let ticks = [2, 4, 6, 8, 10];

svg.selectAll("circle")
    .data(ticks)
    .join(
        enter => enter.append("circle")
            .attr("cx", container_w / 2)
            .attr("cy", container_h / 2)
            .attr("fill", "none")
            .attr("stroke", "gray")
            .attr("r", d => radialScale(d))
    );

svg.selectAll(".ticklabel")
    .data(ticks)
    .join(
        enter => enter.append("text")
            .attr("class", "ticklabel")
            .attr("x", container_w / 2 + 5)
            .attr("y", d => container_h / 2 - radialScale(d))
            .text(d => d.toString())
    );


function angleToCoordinate(angle, value){
    let x = Math.cos(angle) * radialScale(value);
    let y = Math.sin(angle) * radialScale(value);
    return {"x": container_w / 2 + x, "y": height / 2 - y};
}

let featureData = features.map((f, i) => {
    let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
    return {
        "name": f,
        "angle": angle,
        "line_coord": angleToCoordinate(angle, 10),
        "label_coord": angleToCoordinate(angle, 10.5)
    };
});

// draw axis line
svg.selectAll("line")
    .data(featureData)
    .join(
        enter => enter.append("line")
            .attr("x1", container_w / 2)
            .attr("y1", height / 2)
            .attr("x2", d => d.line_coord.x)
            .attr("y2", d => d.line_coord.y)
            .attr("stroke","black")
    );

// draw axis label
svg.selectAll(".axislabel")
    .data(featureData)
    .join(
        enter => enter.append("text")
            .attr("x", d => d.label_coord.x)
            .attr("y", d => d.label_coord.y)
            .text(d => d.name)
    );

let line = d3.line()
    .x(d => d.x)
    .y(d => d.y);
let colors = ["darkorange", "gray", "navy"];

function getPathCoordinates(data_point){
    let coordinates = [];
    for (var i = 0; i < features.length; i++){
        let ft_name = features[i];
        let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
        coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
    }
    return coordinates;
}

// draw the path element
svg.selectAll("path")
    .data(data)
    .join(
        enter => enter.append("path")
            .datum(d => getPathCoordinates(d))
            .attr("d", line)
            .attr("stroke-width", 3)
            .attr("stroke", (_, i) => colors[i])
            .attr("fill", (_, i) => colors[i])
            .attr("stroke-opacity", 1)
            .attr("opacity", 0.5)
    );

d3.text("../data/people.csv").then(function(data) {
>>>>>>> c6fc6be98a779550c97cd6d99c2077e13885b717
  console.log(data);

/*  for (var i = 0; i < 3; i++){
      var point = {}
      //each feature will be a random number from 1-9
      features.forEach(f => point[f] = 1 + Math.random() * 29);
      data.push(point);
  }
  console.log(data); */

  let radialScale = d3.scaleLinear()
    .domain([0, 30])
    .range([0, width/2-25]);

  let ticks = [6, 12, 18, 24, 30];

  svg.selectAll("circle")
      .data(ticks)
      .join(
          enter => enter.append("circle")
              .attr("cx", container_w / 2)
              .attr("cy", container_h / 2)
              .attr("fill", "none")
              .attr("stroke", "gray")
              .attr("r", d => radialScale(d))
      );

  svg.selectAll(".ticklabel")
      .data(ticks)
      .join(
          enter => enter.append("text")
              .attr("class", "ticklabel")
              .attr("x", container_w / 2 + 5)
              .attr("y", d => container_h / 2 - radialScale(d))
              .text(d => d.toString())
      );

  const pi_half = Math.PI / 2;
  console.log(pi_half);

  const pi_threeq = 3 * Math.PI / 2;
  console.log(pi_threeq);

  function angleToCoordinate(angle, value){
      let x = Math.cos(angle) * radialScale(value);
      let y = Math.sin(angle) * radialScale(value);

      return {"x": container_w / 2 + x, "y": height / 2 - y};
  }

  function angleToCoordinateLabel(angle, value){
    let coords = angleToCoordinate(angle, value);

    if (angle>Math.PI/2 && angle<3*Math.PI/2){
      coords["x"] = coords["x"] - 100;
    }

//    console.log(coords);
    //return angleToCoordinate(angle, value);
    return coords;
  }

  let featureData = features.map((f, i) => {
      let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
      return {
          "name": f,
          "angle": angle,
          "line_coord": angleToCoordinate(angle, 30),
          "label_coord": angleToCoordinateLabel(angle, 32)
      };
  });

  console.log(featureData);

  // draw axis line
  svg.selectAll("line")
      .data(featureData)
      .join(
          enter => enter.append("line")
              .attr("x1", container_w / 2)
              .attr("y1", height / 2)
              .attr("x2", d => d.line_coord.x)
              .attr("y2", d => d.line_coord.y)
              .attr("stroke","black")
      );

  // draw axis label
  svg.selectAll(".axislabel")
      .data(featureData)
      .join(
          enter => enter.append("text")
              .attr("x", d => d.label_coord.x)
              .attr("y", d => d.label_coord.y)
              .text(d => d.name)
      );

  let line = d3.line()
      .x(d => d.x)
      .y(d => d.y);
  let colors = ["darkorange", "gray", "navy"];

  function getPathCoordinates(data_point){
      let coordinates = [];
      for (var i = 0; i < features.length; i++){
          let ft_name = features[i];
          let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
          coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
      }
      return coordinates;
  }

  // draw the path element
  svg.selectAll("path")
      .data(data)
      .join(
          enter => enter.append("path")
              .datum(d => getPathCoordinates(d))
              .attr("d", line)
              .attr("stroke-width", 3)
              .attr("stroke", (_, i) => colors[i])
              .attr("fill", (_, i) => colors[i])
              .attr("stroke-opacity", 1)
              .attr("opacity", 0.5)
      );

})
