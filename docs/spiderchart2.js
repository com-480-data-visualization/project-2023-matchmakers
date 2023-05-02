class SpiderBackground {

  constructor(svg, data, features, label_keys, container_w, container_h) {
    this.svg = svg;
    this.data = data;
    this.features = features;
    this.label_keys = label_keys;
    this.container_w = container_w;
    this.container_h = container_h;

    this.radialScale = d3.scaleLinear()
      .domain([0, 50])
      .range([0, width/2-25]);

    this.ticks = [10, 20, 30, 40, 50];

    //this.update();
  }

  update() {
    this.svg.selectAll("circle")
      .data(this.ticks)
      .join(
          enter => enter.append("circle")
              .attr("cx", this.container_w / 2)
              .attr("cy", this.container_h / 2)
              .attr("fill", "none")
              .attr("stroke", "gray")
              .attr("r", d => this.radialScale(d))
      )
      .attr('transform', "translate(0, 0)");

    this.svg.selectAll(".ticklabel")
      .data(this.ticks)
      .join(
          enter => enter.append("text")
              .attr("class", "ticklabel")
              .attr("x", this.container_w / 2 + 5)
              .attr("y", d => this.container_h / 2 - this.radialScale(d))
              .text(d => d.toString())
      );

    const pi_half = Math.PI / 2;
    const pi_threeq = 3 * Math.PI / 2;

    let featureData = this.features.map((f, i) => {
        let angle = (Math.PI / 2) + (2 * Math.PI * i / this.features.length);
        return {
            "name": f,
            "angle": angle,
            "line_coord": this.angleToCoordinate(angle, 50),
            "label_coord": this.angleToCoordinateLabel(angle, 53)
        };
    });

    this.svg.append('g')
      .selectAll("line")
        .data(featureData)
        .join(
            enter => enter.append("line")
                .attr("x1", this.container_w / 2)
                .attr("y1", this.container_h / 2)
                .attr("x2", d => d.line_coord.x)
                .attr("y2", d => d.line_coord.y)
                .attr("stroke","black")
        );

        // draw axis label
    this.svg.append('g')
      .selectAll(".axislabel")
        .data(featureData)
        .join(
            enter => enter.append("text")
                .attr("x", d => d.label_coord.x)
                .attr("y", d => d.label_coord.y)
                .text(d => this.label_keys[d.name])
        );

    let line = d3.line()
        .x(d => d.x)
        .y(d => d.y);


  }

  angleToCoordinate(angle, value){
    let x = Math.cos(angle) * this.radialScale(value);
    let y = Math.sin(angle) * this.radialScale(value);

    return {"x": this.container_w / 2 + x, "y": this.container_h / 2 - y};
  }

  angleToCoordinateLabel(angle, value){
    let coords = this.angleToCoordinate(angle, value);

    if (angle>Math.PI/2 && angle<3*Math.PI/2){
      coords["x"] = coords["x"] - 80;
    }
      return coords;
  }

}

class SpiderPath extends SpiderBackground {
  constructor(svg, datapoint, plot_bg, color, features, label, label_keys, container_w, container_h){

    super(svg, null, features, label_keys, container_w, container_h);
    this.datapoint = datapoint;
    this.path = null;
    this.plot_bg = plot_bg;
    this.color = color;
    this.features = features;
    this.container_w = 1200;
    this.container_h = 400;
    this.label = label;

    this.radialScale = d3.scaleLinear()
      .domain([0, 50])
      .range([0, 400/2-25]);

    this.update();
  }

  update() {

    let line = d3.line()
        .x(d => d.x)
        .y(d => d.y);


    this.path = this.svg.append('path')
      .datum(this.getPathCoordinates(this.datapoint))
      .attr("d", line)
      .attr("stroke-width", 3)
      .attr("stroke", this.color)
      .attr("fill", this.color)
      .attr("stroke-opacity", 1)
      .attr("opacity", 0.5);

  }

  setLabels() {


    let tooltip = this.svg.append('g')
      .attr('class', 'tooltip')
      .style('display', 'none');

    tooltip.append('rect')
          .attr('width', 60)
          .attr('height', 20)
          .attr('fill', this.color)
          .attr('stroke', this.color)
          .attr('stroke-width', 2)
          .attr('rx', 10);

    tooltip.append('text')
          .attr('x', 30)
          .attr('y', 14)
          .attr('text-anchor', 'middle')
          .attr('font-size', 12)
          .attr('fill', 'white')
          .text(this.label);

    //console.log(this.label);
    // Define the mouseover event handler
    const handleMouseOver = function(d, i) {
      const mouseX = d.pageX;
      const mouseY = d.pageY;
      tooltip.style('display', null)
        .attr('transform', `translate(${mouseX*0.7},${mouseY/6})`);
      tooltip.select('text');
      //  .text(`val: ${this.label}`);
    };

    // Define the mouseout event handler
    const handleMouseOut = function(d, i) {
      tooltip.style('display', 'none');
    };

    // Add the event listeners
    this.path.on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut);
      console.log(this.datapoint);
  }

  getPathCoordinates(data_point) {
      let coordinates = [];
      for (var i = 0; i < this.features.length; i++){
          let ft_name = this.features[i];
          let angle = (Math.PI / 2) + (2 * Math.PI * i / 6);
          coordinates.push(this.angleToCoordinate(angle, data_point[ft_name]));
      }
      return coordinates;
  }

  getLabelCoordinates(data_point){
    let path_coordinates = this.getPathCoordinates(data_point);
    return {'x': d3.max(path_coordinates, p => Math.abs(p.x)), 'y':d3.min(path_coordinates, p => Math.abs(p.y))}
  }

/*  angleToCoordinate(angle, value){
    let x = Math.cos(angle) * this.radialScale(value);
    let y = Math.sin(angle) * this.radialScale(value);

    return {"x": this.container_w / 2 + x, "y": this.container_h / 2 - y};
  }

  angleToCoordinateLabel(angle, value){
    let coords = this.angleToCoordinate(angle, value);

    if (angle>Math.PI/2 && angle<3*Math.PI/2){
      coords["x"] = coords["x"] - 80;
    }
      return coords;
  } */
};

const container = d3.select('#spider');

const container_w = 1200;
const container_h = 400;

const width = 400;
const height = 400;

const data_path = "data/people.csv";

function get_avg_values(data, column_names) {
  let avg_vals = {};

  column_names.forEach(f => {
    var colData = data.map(function(d){
      return parseFloat(d[f]);
    })
    avg_vals[f] = d3.mean(colData);
  });

  return avg_vals;

}

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
    const genders = ["female", "male"];
    const label_names = ["Women", "Men"];
    const min_age = 30;
    const max_age = 100;

/*    let avg_vals = get_avg_values(dataa, features);
    data.push(avg_vals) */
    var slider = document.getElementById("minAge");
    console.log(slider.value);


    genders.forEach(g => {
      let avg_vals = {};
      var df = dataa.filter(function(el){
        return (el["gender"] == g) && (el["age"]>=min_age) && (el["age"]<=max_age);
      });

      avg_vals = get_avg_values(df, features);
      data.push(avg_vals);
    });

    let spider_bg = new SpiderBackground(svg, data, features, label_keys, container_w, container_h);
    spider_bg.update();
    let colors = ["deeppink", "blue", "gray", "darkorange", "navy"];

    let spiderPaths = [];

    data.forEach((d, i) => {
      spiderPaths.push(new SpiderPath(svg, d, spider_bg, colors[i], features, label_names[i]));
    });

    spiderPaths.forEach(sp => sp.setLabels());



/*    features.forEach(f => {
      var colData = women.map(function(d){
        return parseFloat(d[f]);
      })
      avg_vals[f] = d3.mean(colData);
    });
    data.push(avg_vals);

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
  data.forEach(d => {
    new SpiderPath(svg, d);
  }); */

})
