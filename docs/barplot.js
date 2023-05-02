 // set the dimensions and margins of the graph
 const container_w = 1200;
 const container_h = 400;
 
 const width = 300;
 const height = 300;

 const marginL = 80;
const marginT = 30;

// append the svg object to the body of the page
var svg = d3.select("#barplot")
.append("svg")
 .attr("width", container_w)
 .attr("height", container_h)
.append("g")
 .attr("transform",
	   "translate(" + marginL + "," + marginT + ")");


// Parse the Data
// raw path "https://github.com/com-480-data-visualization/project-2023-matchmakers/blob/master/data/average_interests.csv"
d3.csv("https://github.com/com-480-data-visualization/project-2023-matchmakers/blob/master/data/average_interests.csv", function(data) {

  // X axis
  var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(data.map(function(d) { return d.interests; }))
    .padding(0.2);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 13000])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Bars
  svg.selectAll("mybar")
    .data(data)
    .enter()
    .append("rect")
      .attr("x", function(d) { return x(d.interests); })
      .attr("y", function(d) { return y(d.female); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.interests); })
      .attr("fill", "#b36989")

})