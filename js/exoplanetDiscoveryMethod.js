class DiscoveryMethodBarchart {

    /**
     * Class constructor with basic chart configuration
     * @param {Object}
     * @param {Array}
     */
    constructor(_config, _data) {

      this.config = {
        parentElement: _config.parentElement,
        containerWidth: _config.containerWidth || 250,
        containerHeight: _config.containerHeight || 280,
        margin: _config.margin || {top: 20, right: 40, bottom: 85, left: 55},
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
      console.log(vis.data);
      // let placeholder =[];
      
      // placeholder[0] = vis.data[0];
      // placeholder[1] = vis.data[1];
      // placeholder[2] = vis.data[2];
      // placeholder[3] = vis.data[3];
      // placeholder[4] = vis.data[4];
      // placeholder[5] = vis.data[5];

      // placeholder[5][0] = "Other";
      // placeholder[5][1] = vis.data[5][1] + vis.data[7][1] + vis.data[8][1] + vis.data[9][1] + vis.data[10][1];
      // placeholder[6] = vis.data[6];
      // vis.data[6] = placeholder[5];
      // vis.data[5] = placeholder[6];
      // placeholder[5] = vis.data[5];
      // placeholder[6] = vis.data[6];
      // vis.data = [];
      // vis.data = placeholder;


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
    .attr("x", 60)
    .attr("y", 10)
    .attr("font-size", "12px")
    .text("Exoplanet Discovery Method");

  // Append group element that will contain our actual chart 
  // and position it according to the given margin config
  vis.chart = vis.svg.append('g')
      .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

  // Append empty x-axis group and move it to the bottom of the chart
  vis.xAxisG = vis.chart.append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', `translate(0,${vis.height})`)
    .call(vis.xAxis);
      
  // Append y-axis group 
  vis.yAxisG = vis.chart.append('g')
      .attr('class', 'axis y-axis');
      

  vis.updateVis();

}

    updateVis() {
        let vis = this;

        vis.xAxisG.selectAll('g')
          .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.5em")
          .attr("dy", ".4em")
          .attr("font-size", "9px")
          .attr("transform", "rotate(-30)");
 
        vis.xAxisG.append('text')
          .attr("transform", "translate(0,0)")
          .attr("y", vis.height - 95)
          .attr("x", vis.width - 90)
          .attr("font-size", "12px")
          .attr("stroke", "black")
          .text("Discovery Method");
          

        vis.yAxisG.append('text')
          .attr("transform", "rotate(-90)")
          .attr("dy", "-13.5em")
          .attr("y", vis.height - 54)
          .attr("x", vis.width - 145)
          .attr("font-size", "12px")
          .attr("stroke", "black")
          .text("Number of Exoplanets per Category");

        const discoveryMethod = d3.rollups(vis.data, v => v.length, d => d.discoverymethod);
        
        vis.aggregatedData = Array.from(discoveryMethod, ([key, count]) => ({ key, count }));
        const orderedKeys = ['Radial Velocity','Transit','Imaging','Eclipse Timing Variations','Transit Timing Variations','Microlensing', 'Other'];
        vis.aggregatedData = vis.aggregatedData.sort((a,b) => {
          return orderedKeys.indexOf(a.key) - orderedKeys.indexOf(b.key);
        });

        vis.xValue = d => d.key;
        vis.yValue = d => d.count;

        vis.xScale.domain(vis.aggregatedData.map(vis.xValue));
        vis.yScale.domain([1, d3.max(vis.aggregatedData, vis.yValue) + 1500]);

        vis.renderVis();
    }
  
    renderVis() {
      let vis = this;
  
      const bars = vis.chart.selectAll('.bar')
          .data(vis.aggregatedData, vis.xValue)
          .join('rect')
          .attr('class', 'bar')
          .attr('width', vis.xScale.bandwidth())
          .attr('height', d => vis.height - vis.yScale(vis.yValue(d)))
          .attr('y', d => vis.yScale(vis.yValue(d)))
          .attr('x', d => vis.xScale(vis.xValue(d))).style('opacity', 0.5)
          .style('opacity', 1)
          .style('fill', "#cd5c5c")
          .on('mouseover', (event, d) => {
            d3.select('#tooltip4')
            .style('display', 'block')
            .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
            .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
            .style('opacity', 1)
              // Format number with million and thousand separator
            .html(`<div class="tooltip-title4">Number of Exoplanets</div><ul>${d3.format(',')(d.count)} </ul>`);
        })
          .on('mouseleave', () => {
          d3.select('#tooltip4').style('display', 'none');
        });
      
      vis.xAxisG.call(vis.xAxis);
      vis.yAxisG.call(vis.yAxis);
    }
  }