//Map dimensions (in pixels)
var WIDTH = 900,
    HEIGHT = 650;

//Map projection
var projection = d3.geo.albersUsa()
    .scale(730.2209486090715)
    .translate([WIDTH/2,HEIGHT/2]) //translate to center the map in view

//Generate paths based on projection
var path = d3.geo.path()
    .projection(projection);

//Create an SVG
var svg = d3.select("body").append("svg")
    .attr("id", "map")
    .attr("width", WIDTH)
    .attr("height", HEIGHT);

// code snippit sourced from :https://www.tutorialsteacher.com/d3js/create-svg-elements-in-d3js
svg.append("text")
.attr("x", 200)
.attr("y", 120)
.attr("stroke", "black")
.attr("font-family", "sans-serif")
.attr("font-size", "24px")
.text("Gun Deaths Per-city Per-State From 2012-2013");

//Group for the map features
var features = svg.append("g")
    .attr("class","features");

var states = svg.append("g")
    .attr("class","states");

    var cities = svg.append("g")
    .attr("class","cities");

//Create zoom/pan listener
//Change [1,Infinity] to adjust the min/max zoom scale
var zoom = d3.behavior.zoom()
    .scaleExtent([1, Infinity])
    .on("zoom",zoomed);

svg.call(zoom);

// code snippit from from https://github.com/coymeetsworld/d3-geopath
const getCoordinates = (projection, geoObj, coordinate) => {
  let point = projection(geoObj);
  if (coordinate === 'lon') { return point[0]; }
  else if (coordinate === 'lat') { return point[1]; }
  return -1; //Shouldn't get here
}

d3.json("data/us-states.geojson", function(error,geoData) {
  if (error) return console.log(error); //unknown error, check the console

  d3.json("data/freq_by_state.json", function(error,stateData) {
    if (error) return console.log(error); //unknown error, check the console

    d3.json("data/frequency2.json", function(error,cityData) {
      if (error) return console.log(error); //unknown error, check the console

      //Create a path for each map feature in the data
      features.selectAll("path")
              .data(geoData.features).enter().append("path")
              .attr("d",path)
              .style("fill", "#D50032")

      cities.selectAll("ellipse")
            .data(cityData).enter().append("ellipse")
            .attr("cx", d => getCoordinates(projection, [d.lng, d.lat], 'lon'))
            .attr("cy", d => getCoordinates(projection, [d.lng, d.lat], 'lat'))
            .attr("d", path)
            .attr("rx", d => (d.males)+1)
            .attr("ry", d => (d.females)+1)
            .attr("opacity", 0.2)
            .style("fill", "black")
            // code snippit below is from from https://github.com/coymeetsworld/d3-geopath
            // .on("mouseover", function(d) {
            //   let xPos = parseFloat(d3.select(this).attr("cx"));
            //   let yPos = parseFloat(d3.select(this).attr("cy"));
            //   let rx = parseFloat(d3.select(this).attr("rx"));
            //   let ry = parseFloat(d3.select(this).attr("ry"));

            //   let xRect, yRect;

            //   // To make sure the tooltip doesn't go out of the window.
            //   if (xPos+rx+ry+250 > WIDTH) { xRect = xPos-rx+ry-250;  }
            //   else { xRect = xPos+rx+ry; }

            //   if (yPos+rx+ry+175 > WIDTH) { yRect = yPos-rx+ry-175;  }
            //   else { yRect = yPos+rx+ry; }

            //   svg.append('rect')
            //      .attr('class', 'tip')
            //      .attr('x', xRect)
            //      .attr('y', yRect)
            //      .attr('width', 250)
            //      .attr('height', 175);

            //   svg.append('text')
            //      .attr('class', 'tip')
            //      .html(
            //        `<tspan x=${xRect+15} y=${yRect+30} class="tooltipInfo">Names: ${d.names}</tspan>`
            //        + `<tspan x=${xRect+15} y=${yRect+50} class="tooltipInfo">State: ${d.state}</tspan>`
            //        + `<tspan x=${xRect+15} y=${yRect+70} class="tooltipInfo">Male Deaths: ${d.males}</tspan>`
            //        + `<tspan x=${xRect+15} y=${yRect+90} class="tooltipInfo">Female Deaths: ${d.females}</tspan>`);
            //   })
            //   .on('mouseout', d => svg.selectAll('.tip').remove());
    });
  });
});

// Add optional onClick events for features here
// d.properties contains the attributes (e.g. d.properties.name, d.properties.population)
function hover(d,i) {

}


//Update map on zoom/pan
function zoomed() {
  features.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")")
      .selectAll("path").style("stroke-width", 1 / zoom.scale() + "px" );

  cities.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")")
      .selectAll("path").style("stroke-width", 1 / zoom.scale() + "px" );
}