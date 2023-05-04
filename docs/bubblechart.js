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


        // create a tooltip
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



    const genders = ["female", "male"];
        // Three function that change the tooltip when user hover / move / leave a cell
    genders.forEach(g => {
        const genders = ["female", "male"];

            // Initialize the circle: all located at the center of the svg area

                var color = "#e84388"
                var textColor = "#b5024d"
                var cx = width / 2
                var cy = height / 2
                if (g == "female") {
                    color = "#e84388"
                } else {
                    color = "#4349e8"
                    cx = cx + width / 4
                    textColor = "#0c14e8"
                    //cy = cy + height / 2
                }

                const mouseover = function(event, d) {
                    console.log("over")
                    Tooltip
                    .style("opacity", 1)
                }
                const mousemove = function(event, d) {
                    console.log("move")
                    Tooltip
                    .html((Math.round(d[g] * 100) / 100).toFixed(2))
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
            .selectAll("circle")
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
                .call(d3.drag() // call specific function when circle is dragged
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));


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
                      .style("fill", textColor)
                      .attr("x", width / 2)
                      .attr("y", height / 2);


                 // Features of the forces applied to the nodes:
                const simulation = d3.forceSimulation()
                .force("center", d3.forceCenter().x(cx).y(cy)) // Attraction to the center of the svg area
                .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
                .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (size(d[g])+4) }).iterations(1)) // Force that avoids circle overlapping

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
                if (!event.active) simulation.alphaTarget(.03).restart();
                d.fx = d.x;
                d.fy = d.y;
                }
                function dragged(event, d) {
                d.fx = event.x;
                d.fy = event.y;
                }
                function dragended(event, d) {
                if (!event.active) simulation.alphaTarget(.03);
                d.fx = null;
                d.fy = null;
                }
            })

    })