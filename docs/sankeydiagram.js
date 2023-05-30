// set the dimensions and margins of the graph
var margin = {top: 0, right: 10, bottom: 10, left: 85},
    width2 = 1100 - margin.left - margin.right,
    height2 = 370 - margin.top - margin.bottom;  

var name_map = {"male": "Male", "female": "Female", "European/Caucasian-American": "Caucasian", "Other ethnicity": "Other", 
            "Asian/Pacific Islander/Asian-American": "Asian", "Latino/Hispanic American": "Latino/Hispanic", "Black/African American": "African American",
            "intelligence": "Intelligence", "sincere":"Sincerity", "attractive": "Attractiveness", 
            "funny": "Sense of humour", "ambition": "Ambition", "date": "Average of Dates", "match": "Average of Matches"}

// format variables
var formatNumber = d3.format(",.0f"), // zero decimal places
    format = function(d) { return formatNumber(d); },
    //color = d3.scaleOrdinal(d3.schemeCategory10);

// Define the pastel color scale
color = d3.scaleOrdinal()
    .range(["#FF85A8", "#85C1E9", "#1B4F72", "#fc607e", "#2874A6", "#3498DB", "#e66383", "#f59ac1", "#256a99"]);

function sankeyPlot(svg, data, gender, ethnicity, charact, btn) {
    svg.selectAll(".node2").remove();
    svg.selectAll(".link").remove();

    var dataa = data.filter(function(el){
        if (btn === "match") {
            if (gender && ethnicity && charact) {
                return (el.check === "GE") ||(el.check === "GEC") || (el.check === "GECM");
            } else if (gender && ethnicity) {
                return (el.check === "GE") || (el.check === "GEM");
            } else if (gender && charact) {
                return (el.check === "GC") || (el.check === "GCM");
            } else if (ethnicity && charact) {
                return (el.check === "EC") || (el.check === "ECM");
            } else if (gender) {
                return (el.check === "GM");
            } else if (ethnicity) {
                return (el.check === "EM");
            } else if (charact) {
                return (el.check === "CM");
            } else {
                return;
            }

        } else {
            if (gender && ethnicity && charact) {
                return (el.check === "GE") ||(el.check === "GEC") || (el.check === "GECD");
            } else if (gender && ethnicity) {
                return (el.check === "GE") || (el.check === "GED");
            } else if (gender && charact) {
                return (el.check === "GC") || (el.check === "GCD");
            } else if (ethnicity && charact) {
                return (el.check === "EC") || (el.check === "ECD");
            } else if (gender) {
                return (el.check === "GD");
            } else if (ethnicity) {
                return (el.check === "ED");
            } else if (charact) {
                return (el.check === "CD");
            } else {
                return;
            }
        }
    });

    //set up graph in same style as original example but empty
    sankeydata = {"nodes" : [], "links" : []};

    dataa.forEach(function (d) {
        sankeydata.nodes.push({ "name": d.source });
        sankeydata.nodes.push({ "name": d.target });
        sankeydata.links.push({ "source": d.source,
                        "target": d.target,
                        "value": +d.value });
    });

    // return only the distinct / unique nodes
    sankeydata.nodes = Array.from(
        d3.group(sankeydata.nodes, d => d.name),
        ([value]) => (value)
    );

    // loop through each link replacing the text with its index from node
    sankeydata.links.forEach(function (d, i) {
        sankeydata.links[i].source = sankeydata.nodes
        .indexOf(sankeydata.links[i].source);
        sankeydata.links[i].target = sankeydata.nodes
        .indexOf(sankeydata.links[i].target);
    });

    // now loop through each nodes to make nodes an array of objects
    // rather than an array of strings
    sankeydata.nodes.forEach(function (d, i) {
        sankeydata.nodes[i] = { "name": d };
    });

    graph = sankey(sankeydata);

    // add in the links
    var link = svg.append("g").selectAll(".link")
        .data(graph.links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", d3.sankeyLinkHorizontal())
        .attr("stroke-width", function(d) { return d.width ; })
        .style("stroke", function(d) {
            return color(d.source.name.replace(/ .*/, ""));
          });

    // add the link titles
    link.append("title")
            .text(function(d) {
                    return name_map[d.source.name] + " → " + 
                    name_map[d.target.name] + "\n" + format(d.value); });

    // add in the nodes
    var node2 = svg.append("g").selectAll(".node2")
        .data(graph.nodes)
        .enter().append("g")
        .attr("class", "node2")
        .call(
        d3
            .drag()
            .subject(function(d) {
            return d;
            })
            .on("start", function() {
            this.parentNode.appendChild(this);
            })
            .on("drag", dragmove)
        );

    // add the rectangles for the nodes
    node2.append("rect")
        .attr("x", function(d) { return d.x0; })
        .attr("y", function(d) { return d.y0; })
        .attr("height", function(d) {
            d.rectHeight = d.y1 - d.y0;
            return d.y1 - d.y0;
        })
        .attr("width", sankey.nodeWidth())
        .style("fill", function(d) { 
                return d.color = color(d.name.replace(/ .*/, "")); })
        .style("stroke", function(d) { 
            return d3.rgb(d.color).darker(5);})
        .append("title")
        .text(function(d) { 
            return name_map[d.name] + "\n" + format(d.value); });

    // add in the title for the nodes
    node2.append("text")
        .attr("x", function(d) { return d.x0 - 6; })
        .attr("y", function(d) { return (d.y1 + d.y0) / 2; })
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .text(function(d) { return name_map[d.name]; })
        .filter(function(d) { return d.x0 < width2 / 2; })
        .attr("x", function(d) { return d.x1 + 6; })
        .attr("text-anchor", "start");

    // the function for moving the nodes
    function dragmove(d) {
        d3.select(this)
          .select("rect")
          .attr("y", function(n) {
            n.y0 = Math.max(0, Math.min(n.y0 + d.dy, height - (n.y1 - n.y0)));
            n.y1 = n.y0 + n.rectHeight;

            return n.y0;
          });

        d3.select(this)
          .select("text")
          .attr("y", function(n) {
            return (n.y0 + n.y1) / 2;
          });

        sankey.update(graph);
        link.attr("d", d3.sankeyLinkHorizontal());
      };
};

function updateSankey() {
    var btn = getSelectedRadioValue();
    sankeyPlot(svg2, dataa, checkboxes2["gender"].checked,  checkboxes2["race"].checked, checkboxes2["charact"].checked, btn)
};

let checkboxes2 = {
    "gender": document.getElementById("gen-check"),
    "race": document.getElementById("race-check"),
    "charact": document.getElementById("chara-check")
  };

checkboxes2["gender"].addEventListener("change", function () {
    updateSankey();
});
  
checkboxes2["race"].addEventListener("change", function () {
    updateSankey();
});

checkboxes2["charact"].addEventListener("change", function () {
    updateSankey();
});

function getSelectedRadioValue() {
    var radioButtons = document.getElementsByName("displayButton");
    for (var i = 0; i < radioButtons.length; i++) {
      if (radioButtons[i].checked) {
        var selectedValue = radioButtons[i].value;
        console.log(selectedValue);
        return selectedValue;
      }
    }
};

  // Add event listener to the radio buttons
var radioButtons = document.getElementsByName("displayButton");
for (var i = 0; i < radioButtons.length; i++) {
  radioButtons[i].addEventListener("change", updateSankey);
};

// append the svg object to the body of the page
var svg2 = d3.select("#sankeydiagram").append("svg")
    .attr("width", width2 + margin.left + margin.right)
    .attr("height", height2 + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

// Set the sankey diagram properties
var sankey = d3.sankey()
    .nodeWidth(36)
    .nodePadding(40)
    .size([width2, height2]);

var path = sankey.links();

var initialBtn = getSelectedRadioValue();

// load the data and inital sankey diagram
d3.csv("data/people_sankey.csv").then(function(data) {
    dataa = data; 
    sankeyPlot(svg2, dataa, checkboxes2["gender"].checked, checkboxes2["race"].checked, checkboxes2["charact"].checked, initialBtn);
});