class RadiusAndMassScatterplot {

    /**
     * Class constructor with basic chart configuration
     * @param {Object}
     * @param {Array}
     */
    constructor(_config, _data) {
      this.config = {
        parentElement: _config.parentElement,
        containerWidth: _config.containerWidth || 800,
        containerHeight: _config.containerHeight || 400,
        margin: _config.margin || {top: 40, right: 20, bottom: 20, left: 35},
        tooltipPadding: _config.tooltipPadding || 15
      }
      this.data = _data;
      this.initVis();
    }
    
    /**
     * We initialize scales/axes and append static elements, such as axis titles.
     */
    initVis() {
      let vis = this;
  
      // Calculate inner chart size. Margin specifies the space around the actual chart.
      vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
      vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
  
      // Initialize scales
      vis.colorScale = d3.scaleOrdinal()
          .range(["#000000", "#800000", "#FF0000","#800080","#FF00FF","#008000","#00FF00",
          "#808000","#FFFF00","#000080","#008080","#00FFFF","#7fff00","#5f9ea0","#d2691e",
          "#ff7f50","#6495ed","#006400","#b8860b","#bdb76b","#8b008b","#ff1493","#cd5c5c",
          "#4b0082","#add8e6","#f08080","#90ee90","#ba55d3","#7b68ee","#3cb371","#ffe4b5","#00ff7f"])
          .domain([1992, 2023]);


    // for(let i = 0; i < 5243; i++) {
    //   if(vis.data[i].pl_bmasse == undefined) {
    //     vis.data.slice();
    //   };
    //   if(vis.data[i].pl_rade == undefined) {
    //     vis.data[i].slice();
    //     };
    // };


    let placeholder = vis.data.filter(function(d) { if(d.pl_rade != undefined) { return d.pl_rade}});
    let placeholder1 = placeholder.filter(function(d) { if(d.pl_bmasse != undefined) { return d.pl_bmasse}});
  
    vis.data = placeholder1;

    

      vis.xScale = d3.scaleLog()
          .range([0, vis.width]);
  
      vis.yScale = d3.scaleLog()
          .range([vis.height, 0]);
  
      // Initialize axes
      vis.xAxis = d3.axisBottom(vis.xScale)
          .ticks(13)
          .tickSize(-vis.height - 10)
          .tickPadding(5)
          //.tickFormat(d => d)
          .scale(vis.xScale);
  
      vis.yAxis = d3.axisLeft(vis.yScale)
          .ticks(20)
          .tickSize(-vis.width - 10)
          .tickPadding(1)
          .scale(vis.yScale);
  
      // Define size of SVG drawing area
      vis.svg = d3.select(vis.config.parentElement)
          .attr('width', vis.config.containerWidth)
          .attr('height', vis.config.containerHeight);
  
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
  
      // Append both axis titles
      vis.chart.append('text')
          .attr('class', 'axis-title')
          .attr('y', vis.height - 15)
          .attr('x', vis.width + 10)
          .attr('dy', '.71em')
          .style('text-anchor', 'end')
          .text('Radius (Earth Radii)');

      vis.chart.append('text')
        .attr('class', 'axis-title')
        .attr('y', vis.height - 350)
        .attr('x', vis.width - 620)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text('Mass (Earth Masses)');
  
      vis.svg.append('text')
          .attr('class', 'axis-title')
          .attr('x', 300)
          .attr('y', 10)
          .attr('dy', '.71em')
          .text('Exoplanet Radius and Mass Relationship');
      
    }
  
    /**
     * Prepare the data and scales before we render it.
     */
    updateVis() {
      let vis = this;
      
      // Specificy accessor functions
      
      vis.colorValue = d => d.disc_year;
      vis.xValue = d => d.pl_rade;
      vis.yValue = d => d.pl_bmasse;
      
      // Set the scale input domains
      vis.xScale.domain([0.1, d3.max(vis.data, vis.xValue)]);
      vis.yScale.domain([0.001, d3.max(vis.data, vis.yValue)]);
  
      vis.renderVis();
    }
  
    /**
     * Bind data to visual elements.
     */
    renderVis() {
      let vis = this;
  
      // Add circles
      const circles = vis.chart.selectAll('.point')
          .data(vis.data, d => d.disc_year)
        .join('circle')
          .attr('class', 'point')
          .attr('r', 2.5)
          .attr('cy', d => vis.yScale(vis.yValue(d)))
          .attr('cx', d => vis.xScale(vis.xValue(d)))
          .attr('fill', d => vis.colorScale(vis.colorValue(d)));
  
      // Tooltip event listeners
      circles
          .on('mouseover', (event,d) => {
            d3.select('#tooltip')
              .style('display', 'block')
              .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
              .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
              .html(`
                <div class="tooltip-title">${d.pl_name}</div>
                <div><i>${d.sys_name}</i></div>
                <ul>
                  <li>${d.pl_bmasse} Earth Masses </li>
                  <li>${d.pl_rade} Earth radii </li>
                </ul>
              `);
          })
          .on('mouseleave', () => {
            d3.select('#tooltip').style('display', 'none');
          });
      
      // Update the axes/gridlines
      // We use the second .call() to remove the axis and just show gridlines
      vis.xAxisG
          .call(vis.xAxis)
          .call(g => g.select('.domain').remove());
  
      vis.yAxisG
          .call(vis.yAxis)
          .call(g => g.select('.domain').remove())
    }
  }