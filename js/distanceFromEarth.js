class DistanceFromEarthHistogram {

    /**
     * Class constructor with basic chart configuration
     * @param {Object}
     * @param {Array}
     */
    constructor(_config, _data) {

      this.config = {
        parentElement: _config.parentElement,
        containerWidth: _config.containerWidth || 500,
        containerHeight: _config.containerHeight || 280,
        margin: _config.margin || {top: 20, right: 40, bottom: 50, left: 55}
      }
      this.data = _data;
      this.initVis();
    }
    
    initVis() {

      let vis = this;
  
      vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
      vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
   
      // vis.xValue = d => d[0];
      // vis.yValue = d => d[1];
    
      vis.xScale = d3.scaleLinear()
        .domain([0,8000])
        .range([0, vis.width]);

  // Initialize axes
      vis.xAxis = d3.axisBottom(vis.xScale)
        .tickSizeOuter(0)
        .ticks(20);

  // Define size of SVG drawing area
      vis.svg = d3.select(vis.config.parentElement)
          .attr('width', vis.config.containerWidth)
          .attr('height', vis.config.containerHeight);

      vis.svg.append("text")
        .attr("transform", "translate(0,0)")
        .attr("x", 100)
        .attr("y", 10)
        .attr("font-size", "12px")
        .text("Number of Exoplanets According to their Distance from Earth");

  // Append group element that will contain our actual chart 
  // and position it according to the given margin config
      vis.chart = vis.svg.append('g')
          .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

  // Append empty x-axis group and move it to the bottom of the chart
      vis.xAxisG = vis.chart.append('g')
          .attr('class', 'axis x-axis')
          .attr('transform', `translate(0,${vis.height})`)
           //.call(d3.axisBottom(vis.xScale))
  
  // Append y-axis group 
      vis.yAxisG = vis.chart.append('g')
          .attr('class', 'axis y-axis');

      vis.yScale = d3.scaleLinear()
        .range([vis.height, 0]);
      
      vis.yAxis = vis.chart.append('g');

      function update(nBin) {
        vis.histogram = d3.histogram()
          .value(function(d) {return d.sy_dist})
          .domain(vis.xScale.domain())
          .thresholds(vis.xScale.ticks(nBin));

        vis.bins = vis.histogram(vis.data);

        vis.yScale.domain([0, (d3.max(vis.bins, function(d) { return d.length}) + 100)]);

        vis.yAxis
          .transition()
          .duration(1000)
          .call(d3.axisLeft(vis.yScale));

        vis.manage = vis.chart.selectAll('rect')
          .data(vis.bins)
        
        vis.manage
          .join('rect')
          .transition()
          .duration(1000)
          .attr('transform', d => `translate(${vis.xScale(d.x0)}, ${vis.yScale(d.length)})`)
          .attr('width', d => ((vis.xScale(d.x1)) - vis.xScale(d.x0)))
          .attr('height', d => vis.height - (vis.yScale(d.length)))
          .attr('x', 1)
          .style("fill", "#69b3a2")
          .style("stroke", "#272727");
      }

      update(16);

      d3.select("#nBin").on("input", function() {
        update(+this.value);
      });

  vis.updateVis();

}

    updateVis() {
      let vis = this;

      vis.xAxisG.selectAll('g')
          .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.3em")
          .attr("dy", ".65em")
          .attr("font-size", "9px")
          .attr("transform", "rotate(-30)");

      vis.xAxisG.append('text')
      .attr("transform", "translate(0,0)")
      .attr("y", vis.height - 165)
      .attr("x", vis.width - 210)
      .attr("font-size", "12px")
      .attr("stroke", "black")
      .text("Distance from Earth (pc)");

    vis.yAxisG.append('text')
      .attr("transform", "rotate(-90)")
      .attr("dy", "-13.5em")
      .attr("y", vis.height - 107)
      .attr("x", vis.width - 600)
      .attr("font-size", "12px")
      .attr("stroke", "black")
      .text("Number of Exoplanets per Category");

    vis.renderVis();
    }
  
    renderVis() {
      let vis = this;
      
       vis.xAxisG.call(vis.xAxis);
      // vis.yAxisG.call(vis.yAxis);
    }
  }