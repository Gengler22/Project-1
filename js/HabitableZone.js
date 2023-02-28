class HabitableZoneBarchart {

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
        
      vis.xScale = d3.scaleBand()
        .range([0, vis.width])
        .paddingInner(0.15)
        .padding(0.2);
      
      vis.yScale = d3.scaleLinear()
        .range([vis.height, 0]);

  // Initialize axes
      vis.xAxis = d3.axisBottom(vis.xScale)
        .tickSizeOuter(0);
  
      vis.yAxis = d3.axisLeft(vis.yScale)
        .tickSizeOuter(0)
        .ticks(11);
    

  // Define size of SVG drawing area
      vis.svg = d3.select(vis.config.parentElement)
        .attr('width', vis.config.containerWidth)
        .attr('height', vis.config.containerHeight);

      vis.svg.append("text")
        .attr("transform", "translate(0,0)")
        .attr("x", 0)
        .attr("y", 10)
        .attr("font-size", "12px")
        .text("Exoplanets' Zone Location by Stellar Type");

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
      
        vis.stack = d3.stack()
          .keys(['NonHabitableZones', 'HabitableZones']);

        vis.updateVis();

}

    updateVis() {
      let vis = this;

      vis.xAxisG.append('text')
      .attr("transform", "translate(0,0)")
      .attr("y", vis.height - 193)
      .attr("x", vis.width - 70)
      .attr("font-size", "12px")
      .attr("stroke", "black")
      .text("Stellar Types");

      vis.yAxisG.append('text')
        .attr("transform", "rotate(-90)")
        .attr("dy", "-13.5em")
        .attr("y", vis.height - 112)
        .attr("x", vis.width - 145)
        .attr("font-size", "12px")
        .attr("stroke", "black")
        .text("Number of Exoplanets by Stellar Type");

      
      vis.xScale.domain(["A", "F", "G", "K", "M"]);
      vis.yScale.domain([0, vis.data[2].NonHabitableZones + 100]);

      //console.log(vis.data)
      vis.stackedData = vis.stack(vis.data);
      vis.renderVis();

      
    }
  
    renderVis() {
      let vis = this;
  
      vis.chart.selectAll('category')
          .data(vis.stackedData)
        .join('g')
          .attr('class', d => `category cat-${d.key}`)
        .selectAll('rect')
          .data(d => d)
        .join('rect')
          .attr('x', d => vis.xScale(d.data.zone))
          .attr('y', d => vis.yScale(d[1]))
          .attr('width', vis.xScale.bandwidth())
          .attr('height', d => vis.yScale(d[0]) - vis.yScale(d[1])).on('mouseover', (event, d) => {
            d3.select('#tooltip5')
            .style('display', 'block')
            .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
            .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
            .style('opacity', 1)
              // Format number with million and thousand separator
            .html(`<div class="tooltip-title5">Number of Exoplanets</div><ul>:${d3.format(',')(d[1] - d[0])}</ul>`);
        })
          .on('mouseleave', () => {
          d3.select('#tooltip5').style('display', 'none');
        });
          
          
      
      vis.xAxisG.call(vis.xAxis);
      vis.yAxisG.call(vis.yAxis);
    }
  }