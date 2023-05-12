const colors_map = {"female":"deeppink", "male":"blue", "all":"darkorange"};
const labels_map = {"female":"Women", "male":"Men", "all":"Everyone"};

// set the dimensions and margins of the graph
var margin = {top: 60, right: 30, bottom: 70, left: 30},
width1 = 1200 - margin.left - margin.right,
height1 = 400 - margin.top - margin.bottom;


const container_w = width1 + margin.left + margin.right;
const container_h = height1 + margin.top + margin.bottom;

const width = width1 + margin.left + margin.right;
const height = height1 + margin.top + margin.bottom;

const data_path = "data/people.csv";

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

    //this.ticks = [10, 20, 30, 40, 50];
    this.ticks = [50, 40, 30, 20, 10];

    //this.update();
  }

  update() {

    var circle_colors = {10: '#FE6480', 20:'#FD92A5', 30:'#FFC0CB', 40:'#FFE0E6', 50:'#FFFFFF'};

    this.svg.selectAll("circle")
      .data(this.ticks)
      .join(
          enter => enter.append("circle")
              .attr("cx", this.container_w / 2)
              .attr("cy", this.container_h / 2)
              .attr("fill", d => circle_colors[d])
              .attr("stroke", "gray")
              .attr("r", d => this.radialScale(d))
              .attr("fill-opacity", 0.3)
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

  setLabels(g, c) {

    const Tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "black")
    //.style("border", "solid")
    .style("border-width", "5px")
    .style("border-radius", "9px")
    .style("padding", "5px")
    .style("text-transform", "capitalize")

    const mouseover = function(event, d) {
        Tooltip
        .style("opacity", 1)
    }
    const mousemove = function(event, d) {
        Tooltip
        .attr('width', 25)
        .attr('height', 25)
        .html(`${g}`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px")
        .style("font-weight", "bold")
        .style("color", "white")
        .style("opacity", 1)
        .style("background-color", c)

    }
    var mouseleave = function(event, d) {
        Tooltip
        .style("opacity", 0)
    }

    // Add the event listeners
    this.path.on("mouseover", mouseover) // What to do when hovered
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);
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

function drawPaths(svg, dataa, features, draw_women, draw_men, draw_all, min_age, max_age, spider_bg){

  d3.selectAll("path").remove();

  let spiderPaths = {};


  if (draw_all) {
    let sp_all = draw_one_path(dataa, "all", min_age, max_age, features, spider_bg, svg, container_w, container_h);
    spiderPaths["all"] = sp_all;
  }

  if (draw_men) {
    let sp_men = draw_one_path(dataa, "male", min_age, max_age, features, spider_bg, svg, container_w, container_h);
    spiderPaths["men"] = sp_men;
  }

  if (draw_women) {
    let sp_women = draw_one_path(dataa, "female", min_age, max_age, features, spider_bg, svg, container_w, container_h);
    spiderPaths["women"] = sp_women;
  }
}

function draw_one_path(dataa, g, min_age, max_age, features, spider_bg, svg, container_w, container_h){
  let avg_vals = {};
  let df = dataa;
  if (g!="all"){
    df = dataa.filter(function(el){
      return (el["gender"]==g)  && (el["age"]>=min_age) && (el["age"]<=max_age);
    })
  } else {
    df = dataa.filter(function(el){
      return (el["age"]>=min_age) && (el["age"]<=max_age);
    })
  }

  avg_vals = get_avg_values(df, features);
  sp = new SpiderPath(svg, avg_vals, spider_bg, colors_map[g], features, labels_map[g], null, container_w, container_h);
  sp.setLabels(labels_map[g], colors_map[g]);
  console.log(labels_map[g]);
  console.log(colors_map[g]);
  console.log(g);
  return sp;
}

d3.csv(data_path, {
  delimiter: ",",
  header: true
}).then(function(dataa){

  const og_dataframe = dataa;


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
  let colors = ["deeppink", "blue", "orange", "navy"];

  let spiderPaths = {};

  const btn = document.getElementById("spider-btn");

  let avg_vals = get_avg_values(dataa, features);
  sp = new SpiderPath(svg, avg_vals, spider_bg, colors_map["all"], features, labels_map["all"], null, container_w, container_h);
  sp.setLabels(labels_map["all"], colors_map["all"]);
  spiderPaths["all"] = sp;

  genders.forEach(g => {

    avg_vals = {};
    let df = dataa.filter(function(el){
      return (el["gender"] == g) && (el["age"]>=min_age) && (el["age"]<=max_age);
    });

    avg_vals = get_avg_values(df, features);
    let sp = new SpiderPath(svg, avg_vals, spider_bg, colors_map[g], features, labels_map[g], null, container_w, container_h);
    sp.setLabels(labels_map[g], colors_map[g]);
    spiderPaths[g] = sp;

  });

  let checkboxes = {"female": document.getElementById("women-check"), "male": document.getElementById("men-check"), "all": document.getElementById("all-check")};

  checkboxes["female"].addEventListener("change", function(){
    drawPaths(svg, dataa, features, checkboxes["female"].checked, checkboxes["male"].checked, checkboxes["all"].checked, min_age, max_age, spider_bg);
  });


  checkboxes["male"].addEventListener("change", function(){
    drawPaths(svg, dataa, features, checkboxes["female"].checked, checkboxes["male"].checked, checkboxes["all"].checked, min_age, max_age, spider_bg);
  });


  checkboxes["all"].addEventListener("change", function(){
    drawPaths(svg, dataa, features, checkboxes["female"].checked, checkboxes["male"].checked, checkboxes["all"].checked, min_age, max_age, spider_bg);
  });






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

        min_age = ui.values[0];
        max_age = ui.values[1];

        drawPaths(svg, dataa, features, checkboxes["female"].checked, checkboxes["male"].checked, checkboxes["all"].checked, min_age, max_age, spider_bg);

      }
    });
    $( "#age-box" ).val( $( "#slider-range" ).slider( "values", 0 ) +
      " - " + $( "#slider-range" ).slider( "values", 1 ) );
  } );

})
