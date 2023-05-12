 // set the dimensions and margins of the graph
 var margin = {top: 60, right: 30, bottom: 70, left: 50},
 width1 = 1200 - margin.left - margin.right,
 height1 = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#barplot")
.append("svg")
 .attr("width", width1 + margin.left + margin.right)
 .attr("height", height1 + margin.top + margin.bottom)
.append("g")
 .attr("transform",
	   "translate(" + margin.left + "," + margin.top + ")");


// Parse the Data
//var dpath = "https://github.com/com-480-data-visualization/project-2023-matchmakers/blob/master/data/average_interests.csv";

  // X axis
  var x = d3.scaleBand()
    .range([ 0, width1 ])
    .padding(0.2);

  var xAxis = svg.append("g")
    .attr("transform", "translate(0," + height1 + ")")


  // Add Y axis
  var y = d3.scaleLinear()
    .range([ height1, 0]);

  var yAxis = svg.append("g")
    .attr("class", "myYaxis")


  function update(selectedVar) {
    var dpath = "data/average_interests.csv";
    d3.csv(dpath, {
      delimiter: ",",
      header: true
    }).then(function(data) {


    // groups label
    var groups = d3.map(data, function(d){return d.interests}).keys()

      // X axis
    x.domain(data.map(function(d) { return d.interests; }))
    xAxis.transition().duration(1000).call(d3.axisBottom(x))

    // Add Y axis
    y.domain([0, d3.max(data, function(d) { return +d[selectedVar] }) ]);
    yAxis.transition().duration(1000).call(d3.axisLeft(y));

    // ----------------
  // Create a tooltip
  // ----------------
  let tooltip = this.svg.append('g')
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "1px")
  .style("border-radius", "5px")
  .style("padding", "10px")

// Three function that change the tooltip when user hover / move / leave a cell
var handleMouseOver = function(d) {
  tooltip
    .style("opacity", 1)
  d3.select(this)
    .style("stroke", "black")
    .style("opacity", 1)
}
var handleMouseMove = function(d) {
  tooltip
    .html("The exact value of<br>this cell is: " + d.value)
    .style("left", (d3.mouse(this)[0]+70) + "px")
    .style("top", (d3.mouse(this)[1]) + "px")
}
var handleMouseOut = function(d) {
  tooltip
    .style("opacity", 0)
  d3.select(this)
    .style("stroke", "none")
    .style("opacity", 0.8)
}

    // variable u: map data to existing bars
    var u = svg.selectAll("rect")
      .data(data, function(d) {return d.interests+':'+d[selectedVar];})

    // update bars
    var color = "#e84388"

    if (selectedVar == "female") {
      color = "#e84388"
    } else {
      color = "#4349e8"
    }

    u
      .enter()
      .append("rect")
      .merge(u)
      .transition()
      .duration(1000)
        .attr("x", function(d) { return x(d.interests); })
        .attr("y", function(d) { return y(d[selectedVar]); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height1 - y(d[selectedVar]); })
        .attr("fill", color)
      .on("mouseover", handleMouseOver)
      .on("mousemove", handleMouseMove)
      .on("mouseout", handleMouseOut)
  })

}

// This function is called by the buttons on top of the plot
update('female')
