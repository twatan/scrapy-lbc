
d3.json('./data/leboncoin.json', function (data) {

var svgWidth = 600;
var svgHeight = 600;
var margin = {top: 20, right: 20, bottom: 20, left: 50};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
var scale = {};

// ----- SVG settings ----- //
var svg = d3.select("svg")
  .attr('width', svgWidth)
  .attr('height', svgHeight);

// ----- Graph area settings ----- //
var g = svg.append('g')
  .attr('transform', translate(margin.left, margin.top));

var tooltip = d3.select('body').select('#tooltip');

// ----- Score ----- //
var threshold = 0;

// ----- Initialization ----- //
setScale();
initializeAxis();
initializePlot();

// ==================== Helper functions ==================== //

function initializePlot() {
  var plot = g.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', function(d) { return scale.x(d.x) })
    .attr('cy', function(d) { return scale.y(d.y) })
    .attr('r', function(d) { return radius(d) })
    .style("fill", function(d){ return color(d); })
    .style("opacity", .7)
    .on("click", function(d, i){ window.open(d.url, '_blank'); })
    .on("mouseover", function(d) {
      $('#detail').css("visibility", "visible");
      $('#detail > .price').text(d.y + " €");
      $('#detail > .surface').text(d.x + " m");
      $('#detail > .nb_rooms').text(d.nb_rooms + " pièces");
      $('#detail > .address').text(d.address);
      $('#detail > .positive').text(d.positive.join());
      $('#detail > .negative').text(d.negative.join());
      $('#detail > .description').html(d.description);
    })
    .on("mouseout", function(d){return $('#detail').css("visibility", "hidden");})
}


function setScale() {
  // X
  // var xRangeMin = 0;
  var xRangeMin = d3.min(data, function(d) { return +d.x; }) - 10;
  var xRangeMax = d3.max(data, function(d) { return +d.x; });

  scale.x = d3.scaleLinear()
    .domain([xRangeMin, xRangeMax])
    .range([0, width]);

  // Y
  var yRangeMin = 0;
  var yRangeMin = d3.min(data, function(d) { return +d.y; }) - 10000;
  var yRangeMax = d3.max(data, function(d) { return +d.y; });

  scale.y = d3.scaleLinear()
    .domain([yRangeMin, yRangeMax])
    .range([height, 0]);
}

function initializeAxis() {
  svg.append('g')
    .attr('class', "x_axis")
    .attr('transform', translate(margin.left, height + margin.top))
    .call(d3.axisBottom(scale.x));

  svg.append('g')
    .attr('class', "y_axis")
    .attr('transform', translate(margin.left, margin.top))
    .call(d3.axisLeft(scale.y));
}

function translate(x, y) {
  return 'translate(' + x + ',' + y + ')';
}

function radius(d) {
  var nb_rooms = +d.nb_rooms;
  return nb_rooms + 2;
}

function color(d) {
  var score = +d.score;
  if (threshold < score) {
    return 'green';
  } else if (threshold > score) {
    return 'red';
  }
  return 'gray';
}

});
