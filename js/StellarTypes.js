class StellarTypeBarchart {

    /**
     * Class constructor with basic chart configuration
     * @param {Object}
     * @param {Array}
     */
    constructor(_config, _data) {

      this.config = {
        parentElement: _config.parentElement,
        containerWidth: _config.containerWidth || 225,
        containerHeight: _config.containerHeight || 280,
        margin: _config.margin || {top: 20, right: 40, bottom: 35, left: 55},
        tooltipPadding: _config.tooltipPadding || 15
      }
      this.data = _data;
      this.initVis();
    }
    
    initVis() {

      let vis = this;
  
      vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
      vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
  
      // Doing some data handling here to categorize the data correctly
      
      vis.xScale = d3.scaleBand()
        .range([0, vis.width])
        .paddingInner(0.15)
        .padding(0.2);
      
      vis.yScale = d3.scaleLog()
        .range([vis.height, 0]);

  // Initialize axes
  vis.xAxis = d3.axisBottom(vis.xScale)
    .tickSizeOuter(0);
  
  vis.yAxis = d3.axisLeft(vis.yScale)
    .tickSizeOuter(0)
    .scale(vis.yScale)
    .ticks(11);
    

  // Define size of SVG drawing area
  vis.svg = d3.select(vis.config.parentElement)
      .attr('width', vis.config.containerWidth)
      .attr('height', vis.config.containerHeight);

  vis.svg.append("text")
    .attr("transform", "translate(0,0)")
    .attr("x", 34)
    .attr("y", 10)
    .attr("font-size", "12px")
    .text("Exoplanets' Stars Stellar Values");

  // Append group element that will contain our actual chart 
  // and position it according to the given margin config
  vis.chart = vis.svg.append('g')
      .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

  // Append empty x-axis group and move it to the bottom of the chart
  vis.xAxisG = vis.chart.append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', `translate(0,${vis.height})`);
  
  // Append y-axis group 
  vis.yAxisG = vis.chart.append('g')
      .attr('class', 'axis y-axis');
      


  vis.updateVis();

}

    updateVis() {
      let vis = this;

      vis.xAxisG.append('text')
      .attr("transform", "translate(0,0)")
      .attr("y", vis.height - 194)
      .attr("x", vis.width - 65)
      .attr("font-size", "12px")
      .attr("stroke", "black")
      .text("Stellar Types");

    vis.yAxisG.append('text')
      .attr("transform", "rotate(-90)")
      .attr("dy", "-13.5em")
      .attr("y", vis.height - 125)
      .attr("x", vis.width - 160)
      .attr("font-size", "12px")
      .attr("stroke", "black")
      .text("Number of Exoplanets per Category");


     
      const stellarType = d3.rollups(vis.data, v => v.length, d => d.st_spectype);

      vis.aggregatedData = Array.from(stellarType, ([key, count]) => ({ key, count }));
      const orderedKeys = ['A','F','G','K','M','N/A'];
      vis.aggregatedData = vis.aggregatedData.sort((a,b) => {
        return orderedKeys.indexOf(a.key) - orderedKeys.indexOf(b.key);
      });

    vis.xValue = d => d.key;
    vis.yValue = d => d.count;

    vis.xScale.domain(['A','F','G','K','M','N/A']);
    vis.yScale.domain([1, d3.max(vis.aggregatedData, vis.yValue) + 1500]);
    vis.renderVis();
    }
  
    renderVis() {
      let vis = this;
  
      const bars = vis.chart.selectAll('.bar')
          .data(vis.aggregatedData, d => d.st_spectype)
        .join('rect')
          .attr('class', 'bar')
          .attr('width', vis.xScale.bandwidth())
          .attr('height', d => vis.height - vis.yScale(vis.yValue(d)))
          .attr('y', d => vis.yScale(vis.yValue(d)))
          .attr('x', d => vis.xScale(vis.xValue(d)))
          .style('opacity', 0.5)
          .style('opacity', 1)
          .style('fill', "#7b68ee")
          .on('mouseover', (event, d) => {
            d3.select('#tooltip3')
            .style('display', 'block')
            .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
            .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
            .style('opacity', 1)
              // Format number with million and thousand separator
            .html(`<div class="tooltip-title3">Number of Exoplanets</div><ul>${d3.format(',')(d.count)} </ul>`);
        })
          .on('mouseleave', () => {
          d3.select('#tooltip3').style('display', 'none');
        });
      
      vis.xAxisG.call(vis.xAxis);
      vis.yAxisG.call(vis.yAxis);
    }
  }