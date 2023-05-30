
 // set the dimensions and margins of the graph
 var margin = {top: 60, right: 30, bottom: 70, left: 50},
 width1 = 1200
 height1 = 400

var cx = width1 / 2 - 200
var cy = height1 / 2

function generateRangeColors() {
    const colors = ["#85C1E9", "#3498DB", "#2874A6", "#1B4F72", "#FFC4DD", "#FF85A8", "#FF527D", "#FF1B47"];
    let index = 0;

    return function () {
      const color = colors[index % colors.length];
      index++;
      return color;
    };
  }

const colorScale = generateRangeColors();

 const colors_gender = {"female":"#eb65b3", "male":"#2937f2"};
 const labels_gender = {"female":"Women", "male":"Men"};

 const labels_race = {"European/Caucasian-American":"Caucasian", "Asian/Pacific Islander/Asian-American":"Asian", "Latino/Hispanic American": "Latino/Hispanic", "Black/African American":"African American"};

 const labels_field = {"Law":"Law", "Social Work":"Social Science", "Business": "Business"};

 const genders = ["female", "male"];
 const race = ["European/Caucasian-American", "Asian/Pacific Islander/Asian-American", "Latino/Hispanic American", "Black/African American"];
 const field = ["Law", "Social Work", "Business"];

 const colors_race = {
    "European/Caucasian-American": colorScale(),
    "Asian/Pacific Islander/Asian-American": colorScale(),
    "Latino/Hispanic American": colorScale(),
    "Black/African American": colorScale()
  };

  const colors_field = {
    "Law": colorScale(),
    "Social Work": colorScale(),
    "Business": colorScale()
  };

const label_type = {"gender": "white", "race": "black", "field": "black"}

 const cxs_gender = {"female":cx, "male":cx+350};
 const cxs_field = {"Law":cx-150, "Social Work":cx+200, "Business":cx+550};
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

const min_y = 18;
const max_y = 25;

const min_m = 26;
const max_m = 35;

const min_o = 36;
const max_o = 55;


function chartplot(svg, data, tab, type, colors, labels, cxs, young, middle, old) {
    svg.selectAll(".node").remove();
    svg.selectAll(".label").remove();

    tab.forEach(g => {
        var color = colors[g];
        cx = cxs[g];

        var dataa = data.filter(function(el){
            let mask = false;

            if (young) {
                mask = mask || ((el["age"]>=min_y) && (el["age"]<=max_y));
            }

            if (middle) {
                mask = mask || ((el["age"]>=min_m) && (el["age"]<=max_m));
            }

            if (old) {
                mask = mask || ((el["age"]>=min_o) && (el["age"]<=max_o));
            }

            return (el[type] === g) && mask;
        })

        var df = get_avg_interest(dataa, interests)
        if (df.length === 0 || df.some(d => typeof d.avg === 'undefined')) {
            return;
        }

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
            Tooltip.style("opacity", 1)
        };

        const mousemove = function(event, d) {
            Tooltip
            .html(labels[g] + " : " + (Math.round(d.avg * 100) / 10).toFixed(1) + " %")
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px")
            .style("font-weight", "bold")
            .style("color", label_type[type])
            .style("opacity", 1)
        };

        var mouseleave = function(event, d) {
            Tooltip.style("opacity", 0)
        };

        var node = svg.append("g")
        .selectAll("circle")
        .data(df)
        .join("circle")
            .attr("class", "node")
            .attr("r", function(d) {
                return size(d.avg);
            })
            .attr("cx", cx)
            .attr("cy", cy)
            .style("fill", color)
            .style("fill-opacity", 0.9)
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
            .style("fill", label_type[type])
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
    var type = getSelectedRadioValue1();

    if (type === "gender") {
        svg.selectAll(".label").remove();
        chartplot(svg, data, genders, type, colors_gender, labels_gender, cxs_gender, checkboxes["young"].checked, checkboxes["middle"].checked, checkboxes["old"].checked);
    } else if (type === "race") {
        svg.selectAll(".label").remove();
        chartplot(svg, data, race, type, colors_race, labels_race, cxs_race, checkboxes["young"].checked, checkboxes["middle"].checked, checkboxes["old"].checked);
    } else {
        svg.selectAll(".label").remove();
        chartplot(svg, data, field, type, colors_field, labels_field, cxs_field, checkboxes["young"].checked, checkboxes["middle"].checked, checkboxes["old"].checked);
    }
};

let checkboxes = {
    "young": document.getElementById("young-check"),
    "middle": document.getElementById("middle-check"),
    "old": document.getElementById("old-check")
  };

  checkboxes["young"].addEventListener("change", function () {
    updateChart();
  });

  checkboxes["middle"].addEventListener("change", function () {
    updateChart();
  });

  checkboxes["old"].addEventListener("change", function () {
    updateChart();
  });


function getSelectedRadioValue1() {
    var radioButtons2 = document.getElementsByName("typeButton");
    for (var i = 0; i < radioButtons2.length; i++) {
      if (radioButtons2[i].checked) {
        var selectedValue = radioButtons2[i].value;
        console.log(selectedValue);
        return selectedValue;
      }
    }
};

  // Add event listener to the radio buttons
var radioButtons2 = document.getElementsByName("typeButton");
for (var i = 0; i < radioButtons2.length; i++) {
  radioButtons2[i].addEventListener("change", updateChart);
};


var svg = d3.select("#bubblechart")
    .append("svg")
    .attr("width", width1)
    .attr("height", height1)

// Initial chart setup
var initialType = getSelectedRadioValue1();
var dpath = "data/people.csv";

d3.csv(dpath, {
delimiter: ",",
header: true
}).then(function(dataa) {
    data = dataa;
    chartplot(svg, data, genders, initialType, colors_gender, labels_gender, cxs_gender, checkboxes["young"].checked, checkboxes["middle"].checked, checkboxes["old"].checked);
});
