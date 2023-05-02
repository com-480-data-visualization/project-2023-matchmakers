// set the dimensions and margins of the graph
const container_w1 = 1200;
const container_h1 = 400;

const width1 = 300;
const height1 = 300;

const marginL = 80;
const marginT = 30;

// append the svg object to the body of the page
var svg = d3.select("#barplot")
.append("svg")
 .attr("width", container_w1)
 .attr("height", container_h1)
.append("g")
 .attr("transform",
	   "translate(" + marginL + "," + marginT + ")");


// Parse the Data
// raw path "https://github.com/com-480-data-visualization/project-2023-matchmakers/blob/master/data/average_interests.csv"
// var data_path = "https://github.com/com-480-data-visualization/project-2023-matchmakers/blob/master/data/average_interests.csv";
var dpath = "data/average_interests.csv";
d3.csv(dpath, {
  delimiter: ",",
  header: true
}).then(function(data) {

  // X axis
  var x = d3.scaleBand()
    .range([ 0, width1 ])
    .domain(data.map(function(d) {
		console.log(d)
		 return d.interests; }))
    .padding(0.2);
  svg.append("g")
    .attr("transform", "translate(0," + height1 + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 13000])
    .range([ height1, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Bars
  svg.selectAll("mybar")
    .data(data)
    .enter()
    .append("rect")
      .attr("x", function(d) {
		console.log(d.interests)
		return x(d.interests); })
      .attr("y", function(d) {
		console.log(d.female)
		return y(d.female); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height1 - y(d.interests); })
      .attr("fill", "#b36989")

})
