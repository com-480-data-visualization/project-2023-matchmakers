const container = d3.select('#spider');

const container_w = 1200;
const container_h = 400;

const width = 400;
const height = 400;

const data_path = "data/people.csv";

// "https://github.com/com-480-data-visualization/project-2023-matchmakers/blob/ac7c0f0d5833bf3e51eaca1331d45bef8d357767/data/people.csv";
d3.csv(data_path, {
  delimiter: ",",
  header: true
}).then(function(dataa){
  const svg = container.append('svg')
      .attr('width', container_w)
      .attr('height', container_h);
  //    .attr('transform', "translate(1000,0)");
    //  .attr('transform', "translate(1000, 0)");

    let data = [];
    let features = ["attractive_important", "intelligence_important", "sincere_important", "funny_important", "ambition_important", "shared_interests_important"];
    const label_keys = {
      "attractive_important": "Attractiveness", "intelligence_important": "Intelligence",
       "sincere_important": "Sincerity", "funny_important": "Sense of humour",
       "ambition_important":"Ambition", "shared_interests_important": "Shared interests"
    };
    //generate the data
/*    women = dataa.filter(function (el) {
      return el["gender"] == "female"
    });
    men = dataa.filter(function(el){
      return el["gender"] == "male"
    }); */
    genders = ["female", "male"];

    genders.forEach(g => {
      let avg_vals = {};
      var df = dataa.filter(function(el){
        return el["gender"] == g
      });

      features.forEach(f => {
        var colData = df.map(function(d) {
          return parseFloat(d[f]);
        })
        avg_vals[f] = d3.mean(colData);
      });
      data.push(avg_vals);
    });

/*    features.forEach(f => {
      var colData = women.map(function(d){
        return parseFloat(d[f]);
      })
      avg_vals[f] = d3.mean(colData);
    });
    data.push(avg_vals); */

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
      )
      .attr('transform', "translate(0, 0)");

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
      coords["x"] = coords["x"] - 80;
    }

    console.log(coords);
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
  svg.append('g')
    .selectAll("line")
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
  svg.append('g')
    .selectAll(".axislabel")
      .data(featureData)
      .join(
          enter => enter.append("text")
              .attr("x", d => d.label_coord.x)
              .attr("y", d => d.label_coord.y)
              .text(d => label_keys[d.name])
      );

  let line = d3.line()
      .x(d => d.x)
      .y(d => d.y);
  let colors = ["deeppink", "blue", "darkorange", "gray", "navy"];

  function getPathCoordinates(data_point){
      let coordinates = [];
      for (var i = 0; i < features.length; i++){
          let ft_name = features[i];
          let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
          coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
      }
      return coordinates;
  }

  function getLabelCoordinates(data_point){
    let path_coordinates = getPathCoordinates(data_point);
    return {'x': d3.max(path_coordinates, p => Math.abs(p.x)), 'y':d3.min(path_coordinates, p => Math.abs(p.y))}
  }

  const gender_labels = ['Women', 'Men'];
  // draw the path element
  svg.append('g')
     .selectAll("path")
      .data(data)
      .join(
          enter => {
            pp = enter.append("path")
              .datum(d => getPathCoordinates(d))
              .attr("d", line)
              .attr("stroke-width", 3)
              .attr("stroke", (_, i) => colors[i])
              .attr("fill", (_, i) => colors[i])
              .attr("stroke-opacity", 1)
              .attr("opacity", 0.5)
            enter.append('rect')
              .attr('width', 100)
              .attr('height', 20)
              .attr('x', d => getLabelCoordinates(d).x-50)
              .attr('y', d => getLabelCoordinates(d).y-15)
              .attr('rx', 10)
              .attr('ry', 10)
              .attr('fill', 'white');

            enter.append('text')
          /*    .datum(d => getLabelCoordinates(d)) */
              .attr('class', 'label')
              .attr('x', d => getLabelCoordinates(d).x)
              .attr('y', d => getLabelCoordinates(d).y)
              .attr('text-anchor', 'middle')
              .attr("stroke-width", 1)
          //    .attr("stroke", (_, i) => colors[i])
          //    .attr("stroke", "white")
              .attr("fill", (_, i) => colors[i])
            //  .attr("fill", "white")
              .text((_, i) => gender_labels[i]);
          }
      );
/*
    container.append('rect')
      .attr('width', 200)
      .attr('height' 200); */

  const svg2 = container.append('rect')
      .attr('width', 200)
      .attr('height', 350)
      .attr('transform', "translate(50,20)");

})
