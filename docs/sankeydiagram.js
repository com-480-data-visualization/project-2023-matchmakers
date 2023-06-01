// set the dimensions and margins of the graph
var margin = {top: 0, right: 10, bottom: 10, left: 85},
    width2 = 1100 - margin.left - margin.right,
    height2 = 370 - margin.top - margin.bottom;  

var name_map = {"male": "Men", "female": "Women", "European/Caucasian-American": "White/Caucasian", "Other ethnicity": "Other", 
            "Asian/Pacific Islander/Asian-American": "Asian", "Latino/Hispanic American": "Latino/Hispanic", "Black/African American": "Black/African American",
            "intelligence": "Intelligence", "sincere":"Sincerity", "attractive": "Attractiveness", 
            "funny": "Sense of humour", "ambition": "Ambition", "fail date": "Failed dates", "success date": "Successful dates"}

// format variables
var formatNumber = d3.format(",.0f"), // zero decimal places
    format = function(d) { return formatNumber(d); }

// Define the pastel color scale
color = d3.scaleOrdinal()
    .range(["#FF85A8", "#85C1E9", "#1B4F72", "#fc607e", "#2874A6", "#3498DB", "#e66383", "#f59ac1", "#256a99"]);

function sankeyPlot(svg, data, gender, race, char, checkgender, checkrace, checkchar) {
    svg.selectAll(".node2").remove();
    svg.selectAll(".link").remove();

    var date = ["fail date", "success date"];

    // filtering the data
    var filterData = data.filter(function(el){
        var steps = JSON.parse(el.steps.replace(/'/g, '"')); // To convert steps into array

        if (checkgender && checkrace && checkchar) {
            return (gender.includes(el.source) && race.includes(el.target) && gender.includes(steps[0]) && race.includes(steps[1])) 
            || (race.includes(el.source) && char.includes(el.target) && gender.includes(steps[0]) && race.includes(steps[1]) && char.includes(steps[2])) 
            || (char.includes(el.source) && date.includes(el.target) && gender.includes(steps[0]) && race.includes(steps[1]) && char.includes(steps[2]));
        } else if (checkgender && checkrace) {
            return (gender.includes(el.source) && race.includes(el.target) && gender.includes(steps[0]) && race.includes(steps[1])) 
            || (race.includes(el.source) && date.includes(el.target) && gender.includes(steps[0]) && race.includes(steps[1]));
        } else if (checkgender && checkchar) {
            return (gender.includes(el.source) && char.includes(el.target) && gender.includes(steps[0]) && char.includes(steps[1])) 
            || (char.includes(el.source) && date.includes(el.target) && gender.includes(steps[0]) && char.includes(steps[1]));
        } else if (checkrace && checkchar) {
            return (race.includes(el.source) && char.includes(el.target) && race.includes(steps[0]) && char.includes(steps[1])) 
            || (char.includes(el.source) && date.includes(el.target) && race.includes(steps[0]) && char.includes(steps[1]));
        } else if (checkgender) {
            return (gender.includes(el.source) && date.includes(el.target) && gender.includes(steps[0]));
        } else if (checkrace) {
            return (race.includes(el.source) && date.includes(el.target) && race.includes(steps[0]));
        } else if (checkchar) {
            return (char.includes(el.source) && date.includes(el.target) && char.includes(steps[0]));
        } else {
            return false;
        }
    });

    console.log("the filtered Data : ")
    console.log(filterData)

    var uniqueData = {};

    // Iterate over each object in filterData to group the source and target 
    filterData.forEach((obj) => {
        const { source, target, value } = obj;

        const key = `${source}#${target}`;
        if (uniqueData.hasOwnProperty(key)) {
            uniqueData[key] += parseFloat(format(value));
        } else {
            uniqueData[key] = parseFloat(format(value));
        }
    });

    // convert the object into an array of objects
    var dataa = Object.entries(uniqueData).map(([key, value]) => {
        const [source, target] = key.split('#');
        return { source, target, value };
    });

    console.log("result array ")
    console.log(dataa)

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

let checkboxes2 = {
    "women": document.getElementById("female-check"),
    "men": document.getElementById("male-check"),
    "white": document.getElementById("white-check"),
    "asian": document.getElementById("asian-check"),
    "latino": document.getElementById("latino-check"),
    "black": document.getElementById("black-check"),
    "other": document.getElementById("other-check"),
    "attractive": document.getElementById("attractive-check"),
    "ambition": document.getElementById("ambition-check"),
    "intelligence": document.getElementById("intelligence-check"),
    "humour": document.getElementById("humour-check"),
    "sincerity": document.getElementById("sincerity-check"),
  };

var checkboxGroups = {
    gender: ["women", "men"],
    race: ["white", "asian", "latino", "black", "other"],
    char: ["attractive", "ambition", "intelligence", "sincerity", "humour"]
  };
  
Object.keys(checkboxGroups).forEach(function(group) {
    checkboxGroups[group].forEach(function(checkbox) {
        checkboxes2[checkbox].addEventListener("change", updateSankey);
    });
});

var raceName = ["European/Caucasian-American", "Asian/Pacific Islander/Asian-American", "Latino/Hispanic American", "Black/African American", "Other ethnicity"];
var genderName = ["female", "male"];
var charName = ["attractive", "ambition", "intelligence", "sincere", "funny"];

function updateSankey() {
    let race = [];
    let gender = [];
    let char = [];

    var bool_gender = [checkboxes2["women"].checked, checkboxes2["men"].checked];
    var bool_race = [checkboxes2["white"].checked, checkboxes2["asian"].checked, checkboxes2["latino"].checked, checkboxes2["black"].checked, checkboxes2["other"].checked];
    var bool_char = [checkboxes2["attractive"].checked, checkboxes2["ambition"].checked, checkboxes2["intelligence"].checked, checkboxes2["sincerity"].checked, checkboxes2["humour"].checked];

    for (var i = 0; i < bool_gender.length; i++) {
        if (bool_gender[i]) {
            gender.push(genderName[i]);
        }
    }

    for (var i = 0; i < bool_race.length; i++) {
        if (bool_race[i]) {
            race.push(raceName[i]);
        }
    }

    for (var i = 0; i < bool_char.length; i++) {
        if (bool_char[i]) {
            char.push(charName[i]);
        }
    }

    var checkGender = checkboxes2["women"].checked || checkboxes2["men"].checked;
    var checkRace = checkboxes2["white"].checked || checkboxes2["asian"].checked || checkboxes2["latino"].checked || checkboxes2["black"].checked || checkboxes2["other"].checked;
    var checkChar = checkboxes2["attractive"].checked || checkboxes2["ambition"].checked || checkboxes2["intelligence"].checked || checkboxes2["sincerity"].checked || checkboxes2["humour"].checked;

    sankeyPlot(svg2, maindata, gender, race, char, checkGender, checkRace, checkChar);
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

// load the data and inital sankey diagram
d3.csv("data/people_sankey.csv").then(function(data) {
    maindata = data;
    updateSankey();
});