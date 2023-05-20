 
 // set the dimensions and margins of the graph
 var margin = {top: 60, right: 30, bottom: 70, left: 50},
 width1 = 1200 
 height1 = 400

var cx = width / 2 - 200
var cy = height / 2

 const colors_gender = {"female":"deeppink", "male":"blue"};
 const labels_gender = {"female":"Women", "male":"Men"};

 const colors_race = {"European/Caucasian-American":"#78a1ab", "Asian/Pacific Islander/Asian-American":"#73ba73", "Latino/Hispanic American": "#d48a4a", "Black/African American":"#d44a4a"};
 const labels_race = {"European/Caucasian-American":"White", "Asian/Pacific Islander/Asian-American":"Asian", "Latino/Hispanic American": "Latino/Hispanic", "Black/African American":"Black"};

 const genders = ["female", "male"];
 const race = ["European/Caucasian-American", "Asian/Pacific Islander/Asian-American", "Latino/Hispanic American", "Black/African American"];

 const cxs_gender = {"female":cx, "male":cx+350};
 const cxs_race = {"European/Caucasian-American":cx-250, "Asian/Pacific Islander/Asian-American":cx+50, "Latino/Hispanic American": cx+350, "Black/African American":cx+650};

 const interests = ["sports", "museums", "tvsports", "exercise", "dining", "art", "hiking", "gaming", "clubbing", "reading", "tv", "theater", "movies", "concerts", "shopping", "music", "yoga"];

 function get_avg_interest(data, column_names) {
    let avg_vals = [];
  
    column_names.forEach(f => {
      let colData = data.map(d => parseFloat(d[f]));
      let temp = { interest: f, avg: d3.mean(colData) };
      avg_vals.push(temp);
    });
  
    return avg_vals;
  }

const size = d3.scaleLinear()
.domain([0, 10])
.range([1,55])

function chartplot(svg, data, tab, type, colors, labels, cxs) {
    // Remove existing circles
    svg.selectAll(".node").remove();
    // Remove existing labels
    svg.selectAll(".label").remove();

    tab.forEach(g => {
    //console.log(data)
        var color = colors[g];
        cx = cxs[g];

        var dataa = data.filter(el => (el[type] === g) && (el["age"]>=min_age) && (el["age"]<=max_age));
        var df = get_avg_interest(dataa, interests)

        const Tooltip = d3.select("body")
            .append("div")
            .style("position", "absolute")
            .style("opacity", 0.3)
            .attr("class", "tooltip")
            .style("background-color", color)
            .style("border-width", "5px")
            .style("border-radius", "9px")
            .style("padding", "5px")
            .style("text-transform", "capitalize")

        const mouseover = function(event, d) {
            Tooltip
            .style("opacity", 1)
        };

        const mousemove = function(event, d) {
            Tooltip
            .html(labels[g] + " : " + (Math.round(d.avg * 100) / 10).toFixed(1) + " %")
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px")
            .style("font-weight", "bold")
            .style("color", "white")
            .style("opacity", 1)
        };

        var mouseleave = function(event, d) {
            Tooltip
            .style("opacity", 0)
        };

        var node = svg.append("g")
        .selectAll("circle")
        .data(df)
        .join("circle")
            .attr("class", "node")
            .attr("r", d => size(d.avg))
            .attr("cx", cx)
            .attr("cy", cy)
            .style("fill", color)
            .style("fill-opacity", 0.8)
            .attr("stroke", "black")
            .style("stroke-width", 1)
            .on("mouseover", mouseover) // What to do when hovered
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)

        var label = svg.append("g")
            .selectAll("text")
            .data(df)
            .join("text")
            .attr("class", "label")
            .text(d => d.interest)
            .attr("text-anchor", "middle")
            .attr("dy", ".35em")
            .style("font-size", "11px")
            .style("font-weight", "bold")
            .style("text-transform", "capitalize")
            .style("fill", "white")
            .attr("x", d => d.x)
            .attr("y", d => d.y);

        // Features of the forces applied to the nodes:
        const simulation = d3.forceSimulation()
        .force("center", d3.forceCenter().x(cx).y(cy)) // Attraction to the center of the svg area
        .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
        .force("collide", d3.forceCollide().strength(.1).radius(d => size(d.avg) + 2).iterations(1)) // Force that avoids circle overlapping
        
        simulation
        .nodes(df)
        .on("tick", function(d){
            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
            label
                .attr("x", d => d.x)
                .attr("y", d => d.y)
        });
    });
}

function updateChart() {
    var type = getSelectedRadioValue();

    console.log(type)
    if (type == "gender") {
        chartplot(svg, data, genders, type, colors_gender, labels_gender, cxs_gender);
    } else {
        chartplot(svg, data, race, type, colors_race, labels_race, cxs_race);
    }
};


function getSelectedRadioValue() {
    var radioButtons = document.getElementsByName("typeButton");
    for (var i = 0; i < radioButtons.length; i++) {
      if (radioButtons[i].checked) {
        var selectedValue = radioButtons[i].value;
        console.log(selectedValue);
        return selectedValue;
      }
    }
};

  // Add event listener to the radio buttons
var radioButtons = document.getElementsByName("typeButton");
for (var i = 0; i < radioButtons.length; i++) {
  radioButtons[i].addEventListener("change", updateChart);
};
  

const svg = d3.select("#barplot")
    .append("svg")
    .attr("width", width1)
    .attr("height", height1)

// Initial chart setup
var initialType = getSelectedRadioValue();
var dpath = "data/people.csv";

let min_age = 18;
let max_age = 25;

d3.csv(dpath, {
delimiter: ",",
header: true
}).then(function(dataa) {
    //const btn = document.getElementById("spider-btn");
    data = dataa
    chartplot(svg, data, genders, initialType, colors_gender, labels_gender, cxs_gender, min_age, max_age);

});