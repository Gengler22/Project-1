class NumPlanetsBarchart {

    /**
     * Class constructor with basic chart configuration
     * @param {Object}
     * @param {Array}
     */
    constructor(_config, _data) {
      // Configuration object with defaults
      // Important: depending on your vis and the type of interactivity you need
      // you might want to use getter and setter methods for individual attributes
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
    
    
    /**
     * This function contains all the code that gets excecuted only once at the beginning.
     * (can be also part of the class constructor)
     * We initialize scales/axes and append static elements, such as axis titles.
     * If we want to implement a responsive visualization, we would move the size
     * specifications to the updateVis() function.
     */
    initVis() {
      // We recommend avoiding simply using the this keyword within complex class code
      // involving SVG elements because the scope of this will change and it will cause
      // undesirable side-effects. Instead, we recommend creating another variable at
      // the start of each function to store the this-accessor
      let vis = this;
  
      // Calculate inner chart size. Margin specifies the space around the actual chart.
      // You need to adjust the margin config depending on the types of axis tick labels
      // and the position of axis titles (margin convetion: https://bl.ocks.org/mbostock/3019563)
      vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
      vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
  
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
      .scale(vis.yScale)
      .tickSizeOuter(0)
      .ticks(11);

  // Define size of SVG drawing area
  vis.svg = d3.select(vis.config.parentElement)
      .attr('width', vis.config.containerWidth)
      .attr('height', vis.config.containerHeight);

  vis.svg.append("text")
    .attr("transform", "translate(0,0)")
    .attr("x", 5)
    .attr("y", 10)
    .attr("font-size", "12px")
    .text("Number of Planets in Exoplanets' Systems");

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
      .attr('class', 'axis y-axis')
      


  vis.updateVis();

  // Append titles, legends and other static elements here
  // ...
}
  
    /**
     * This function contains all the code to prepare the data before we render it.
     * In some cases, you may not need this function but when you create more complex visualizations
     * you will probably want to organize your code in multiple functions.
     */
    updateVis() {
      let vis = this;

    // Set the scale input domains

    vis.xAxisG.append('text')
      .attr("transform", "translate(0,0)")
      .attr("y", vis.height - 194)
      .attr("x", vis.width - 65)
      .attr("font-size", "16px")
      .attr("stroke", "black")
      .text("Number of Planets in System");

    vis.yAxisG.append('text')
      .attr("transform", "rotate(-90)")
      .attr("dy", "-13.5em")
      .attr("y", vis.height - 125)
      .attr("x", vis.width - 160)
      .attr("font-size", "12px")
      .attr("stroke", "black")
      .text("Number of Exoplanets per Category");
    
      const intPlanets = d3.rollups(vis.data, v => v.length, d => d.sy_pnum);

      intPlanets.sort();
        
    vis.aggregatedData = Array.from(intPlanets, ([key, count]) => ({ key, count }));

    const orderedKeys = ['1','2','3','4','5','6','7','8'];
    vis.aggregatedData = vis.aggregatedData.sort((a,b) => {
          return orderedKeys.indexOf(a.key) - orderedKeys.indexOf(b.key);
        });
    vis.xValue = d => d.key;
    // console.log(vis.data[0][1]);
    vis.yValue = d => d.count;
    
    vis.xScale.domain(vis.aggregatedData.map(vis.xValue));
    vis.yScale.domain([1, d3.max(vis.aggregatedData, vis.yValue) + 1200]);
    vis.renderVis();
    }
  
    /**
     * This function contains the D3 code for binding data to visual elements.
     * We call this function every time the data or configurations change 
     * (i.e., user selects a different year)
     */
    renderVis() {
      let vis = this;
  
      // Add rectangles
      const bars = vis.chart.selectAll('.bar')
          .data(vis.aggregatedData, d => d.sy_pnum)
        .join('rect')
          .attr('class', 'bar')
          .attr('width', vis.xScale.bandwidth())
          .attr('height', d => vis.height - vis.yScale(vis.yValue(d)))
          .attr('y', d => vis.yScale(vis.yValue(d)))
          .attr('x', d => vis.xScale(vis.xValue(d)))
          .style('opacity', 0.5)
          .style('opacity', 1)
          .style('fill', "#b8860b")
          .on('mouseover', (event, d) => {
            d3.select('#tooltip2')
            .style('display', 'block')
            .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
            .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
            .style('opacity', 1)
              // Format number with million and thousand separator
            .html(`<div class="tooltip-title2">Number of Exoplanets</div><ul>${d3.format(',')(d.count)} </ul>`);
        })
          .on('mouseleave', () => {
          d3.select('#tooltip2').style('display', 'none');
        });
      
      // Update the axes because the underlying scales might have changed
      vis.xAxisG.call(vis.xAxis);
      vis.yAxisG.call(vis.yAxis);
    }
  }