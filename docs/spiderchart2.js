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
      .range([0, this.container_h/2-50]);

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
              .attr("y", d => this.container_h/2 - this.radialScale(d)) // this.container_h / 2 -
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
    } else if (angle==Math.PI/2) {
      coords["y"] = coords["y"] - 10;
    } else if (angle==3*Math.PI/2){
      coords["y"] = coords["y"] + 10;
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
    this.container_w = container_w;
    this.container_h = container_h;
    this.label = label;

    this.radialScale = d3.scaleLinear()
      .domain([0, 50])
      .range([0, container_h/2 - 50]);

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

      console.log("heeee")

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

};

// const container = d3.select('#spider');

// set the dimensions and margins of the graph
var margin = {top: 60, right: 30, bottom: 70, left: 30},
width1 = 1200 - margin.left - margin.right,
height1 = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page


const container_w = width1 + margin.left + margin.right;
const container_h = height1 + margin.top + margin.bottom;

const width = width1 + margin.left + margin.right;
const height = height1 + margin.top + margin.bottom;

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

function drawPaths(svg, data, features, gender, ){

}

// "https://github.com/com-480-data-visualization/project-2023-matchmakers/blob/ac7c0f0d5833bf3e51eaca1331d45bef8d357767/data/people.csv";
d3.csv(data_path, {
  delimiter: ",",
  header: true
}).then(function(dataa){

  const og_dataframe = dataa;

  console.log("dimensions");
  console.log(width1 + margin.left + margin.right);
  console.log(height1 + margin.top + margin.bottom);

  var svg = d3.select("#spider")
      .append("svg")
      .attr("width", width1 + margin.left + margin.right)
      .attr("height", height1 + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
          "translate(0," + margin.top/2 + ")");

  let data = [];
  const features = ["attractive_important", "intelligence_important", "sincere_important", "funny_important", "ambition_important", "shared_interests_important"];
  const label_keys = {
    "attractive_important": "Attractiveness", "intelligence_important": "Intelligence",
     "sincere_important": "Sincerity", "funny_important": "Sense of humour",
     "ambition_important":"Ambition", "shared_interests_important": "Shared interests"
  };

  const genders = ["female", "male"];
  const label_names = ["Women", "Men"];
  let min_age = 18;
  let max_age = 25;

  let spider_bg = new SpiderBackground(svg, data, features, label_keys, container_w, container_h);
  spider_bg.update();
  let colors = ["deeppink", "blue", "gray", "darkorange", "navy"];

  let spiderPaths = [];

  const btn = document.getElementById("spider-btn");

  genders.forEach(g => {

    let avg_vals = {};
    let df = dataa.filter(function(el){
      return (el["gender"] == g) && (el["age"]>=min_age) && (el["age"]<=max_age);
    });

    avg_vals = get_avg_values(df, features);
    data.push(avg_vals);
  });


  data.forEach((d, i) => {
    spiderPaths.push(new SpiderPath(svg, d, spider_bg, colors[i], features, label_names[i], null, container_w, container_h));
  });

  spiderPaths.forEach(sp => sp.setLabels());
  console.log("done");

  $( function() {
    $( "#slider-range" ).slider({
      classes: {
        "ui-slider": "my-pink-slider"
      },
      range: true,
      min: 18,
      max: 55,
      values: [ 20, 35 ],
  
      slide: function( event, ui ) {
        $( "#age-box" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );

        d3.selectAll("path").remove();

        min_age = ui.values[0];
        max_age = ui.values[1];

        console.log("slider moved");
        let data = [];

       genders.forEach(g => {

          let avg_vals = {};
          let df = dataa.filter(function(el){
            return (el["gender"] == g) && (el["age"]>=min_age) && (el["age"]<=max_age);
          });

          avg_vals = get_avg_values(df, features);
          data.push(avg_vals);
        });


        data.forEach((d, i) => {
          spiderPaths.push(new SpiderPath(svg, d, spider_bg, colors[i], features, label_names[i], null, container_w, container_h));
        });

        spiderPaths.forEach(sp => sp.setLabels());

      }
    });
    $( "#age-box" ).val( $( "#slider-range" ).slider( "values", 0 ) +
      " - " + $( "#slider-range" ).slider( "values", 1 ) );
  } );

//  $("slider-range").on('slidechange', function(event, ui){ console.log("slider used");})
/*
  ( function() {
    $( "#slider-range" ).slider({
      slide: function( event, ui ) {
        $( "#age-box" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
        console.log("slider moved");
      }
    });
    $( "#age-box" ).val( $( "#slider-range" ).slider( "values", 0 ) +
      " - " + $( "#slider-range" ).slider( "values", 1 ) );
  } ); */

})
