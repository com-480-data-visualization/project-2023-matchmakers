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
  
  
  //  svg.append("g")
  //  .attr("transform", "translate(0," + height1 + ")")
   // .call(d3.axisBottom(x))
   // .selectAll("text")
   //   .attr("transform", "translate(-10,0)rotate(-45)")
  //    .style("text-anchor", "end");

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

      // X axis
    x.domain(data.map(function(d) { return d.interests; }))
    xAxis.transition().duration(1000).call(d3.axisBottom(x))

    // Add Y axis
    y.domain([0, d3.max(data, function(d) { return +d[selectedVar] }) ]);
    yAxis.transition().duration(1000).call(d3.axisLeft(y));

    // variable u: map data to existing bars
    var u = svg.selectAll("rect")
      .data(data)

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
  })

}

// This function is called by the buttons on top of the plot

update('female')