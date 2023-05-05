 
 // set the dimensions and margins of the graph
 var margin = {top: 60, right: 30, bottom: 70, left: 50},
 width1 = 1200 
 height1 = 400



 // add a legend 
 // Define the colors and labels for the legend
 const colors = {
    '#4349e8': 'Men',
    '#e84388': 'Women'
  };

  // Create the legend HTML
  let legendHTML = '';
  for (const color in colors) {
    legendHTML += `<span style="display:inline-block;width:20px;height:20px;background-color:${color};margin-right:5px;margin-left:24px;"></span>${colors[color]}&nbsp;&nbsp;`;
  }

  // Add the legend HTML to the legend div
  const legendDiv = document.getElementById('legend');
  legendDiv.innerHTML = legendHTML;


 const svg = d3.select("#barplot")
  .append("svg")
    .attr("width", width1)
    .attr("height", height1)

    var dpath = "data/average_interests.csv";
    d3.csv(dpath, {
    delimiter: ",",
    header: true
    }).then(function(data) {


        // Size scale for countries
    const size = d3.scaleLinear()
        .domain([0, 10])
        .range([1,65])  // circle will be between 7 and 55 px wide

    var cx = width / 2 - 200
    var cy = height / 2




    const genders = ["female", "male"];
        // Three function that change the tooltip when user hover / move / leave a cell
    genders.forEach(g => {

            // Initialize the circle: all located at the center of the svg area

                var color = "#e84388"
                if (g == "female") {
                    color = "#e84388"
                } else {
                    color = "#4349e8"
                    cx = cx + 400
                }

                // create a tooltip
                const Tooltip = d3.select("body")
                    .append("div")
                    .style("position", "absolute")
                    .style("opacity", 0)
                    .attr("class", "tooltip")
                    .style("background-color", color)
                    //.style("border", "solid")
                    .style("border-width", "5px")
                    .style("border-radius", "9px")
                    .style("padding", "5px")
                    .style("text-transform", "capitalize")

                const mouseover = function(event, d) {
                    console.log("over")
                    Tooltip
                    .style("opacity", 1)
                }
                const mousemove = function(event, d) {
                    console.log("move")
                    Tooltip
                    .html((Math.round(d[g] * 100) / 10).toFixed(1) + " %")
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px")
                    .style("font-weight", "bold")
                    .style("color", "white")
                    .style("opacity", 1)
                }
                var mouseleave = function(event, d) {
                    Tooltip
                    .style("opacity", 0)
                }

                
            var node = svg.append("g")
            .selectAll("square")
            .data(data)
            .join("circle")
                .attr("class", "node")
                .attr("r", d => size(d[g]))
                .attr("cx", width / 2)
                .attr("cy", height / 2)
                .style("fill", color)
                .style("fill-opacity", 0.8)
                .attr("stroke", "black")
                .style("stroke-width", 1)
                .on("mouseover", mouseover) // What to do when hovered
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave)
                //.call(d3.drag() // call specific function when circle is dragged
                //    .on("start", dragstarted)
                  //  .on("drag", dragged)
                   // .on("end", dragended))
                //.each(function(d) { d.active = false; });

                
                //var labels = []
                var label = svg.append("g")
                    .selectAll("text")
                    .data(data)
                    .join("text")
                      .text(d => d.interests)
                      .attr("text-anchor", "middle")
                      .attr("dy", ".35em")
                      .style("font-size", "11px")
                      .style("font-weight", "bold")
                      .style("text-transform", "capitalize")
                      .style("fill", "white")
                      .attr("x", width / 2)
                      .attr("y", height / 2);


                 // Features of the forces applied to the nodes:
                const simulation = d3.forceSimulation()
                .force("center", d3.forceCenter().x(cx).y(cy)) // Attraction to the center of the svg area
                .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
                .force("collide", d3.forceCollide().strength(.1).radius(function(d){ return (size(d[g]) + 2) }).iterations(1)) // Force that avoids circle overlapping

                // Apply these forces to the nodes and update their positions.
                // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
                simulation
                .nodes(data)
                .on("tick", function(d){
                    node
                        .attr("cx", d => d.x)
                        .attr("cy", d => d.y)
                    label
                        .attr("x", d => d.x)
                        .attr("y", d => d.y)
                });

                // What happens when a circle is dragged?
                function dragstarted(event, d) {
                    // stop the simulation
                    simulation.alphaTarget(0.1).restart();

                    // set the dragged circle as active
                    d.active = true;

                    if (!event.active) simulation.alphaTarget(.03).restart();
                    event.subject.fx = event.subject.x;
                    event.subject.fy = event.subject.y;
                }

                function dragged(event, d) {
                    if (d.active) {
                        d.fx = event.x;
                        d[g].fy = event.y;
                    }
                }
                function dragended(event, d) {
                    if (!event.active) simulation.alphaTarget(.03);
                        d.active = false;
                        d.fx = null;
                        d.fy = null;
                }
            })

    })