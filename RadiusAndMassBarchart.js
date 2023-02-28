class RadiusAndMassBarchart {

    /**
     * Class constructor with basic chart configuration
     * @param {Object}
     * @param {Array}
     */
    constructor(_config, _data) {
      // Configuration object with defaults
      this.config = {
        parentElement: _config.parentElement,
        colorScale: _config.colorScale,
        containerWidth: _config.containerWidth || 800,
        containerHeight: _config.containerHeight || 400,
        margin: _config.margin || {top: 35, right: 40, bottom: 50, left: 50},
      }
      this.data = _data;
      this.initVis();
    }
    
    /**
     * Initialize scales/axes and append static elements, such as axis titles
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
      
      // Important: we flip array elements in the y output range to position the rectangles correctly
      vis.yScale = d3.scaleLog()
          .range([vis.height, 0]) 
  
      vis.xScale = d3.scaleBand()
          .range([0, vis.width])
          .paddingInner(0.2);
  
      vis.xAxis = d3.axisBottom(vis.xScale)
          .ticks(['1992', '1993', '1994', '1995',
          '1996', '1997', '1998', '1999', '2000', '2001', '2002', '2003', '2004',
          '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013',
          '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022',
          '2023'])
          .tickSizeOuter(0);
  
      vis.yAxis = d3.axisLeft(vis.yScale)
          .ticks(6)
          .tickSizeOuter(0)
          .scale(vis.yScale);

  
      // Define size of SVG drawing area
      vis.svg = d3.select(vis.config.parentElement)
          .attr('width', vis.config.containerWidth)
          .attr('height', vis.config.containerHeight);
  
      // SVG Group containing the actual chart; D3 margin convention
      vis.chart = vis.svg.append('g')
          .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);
  
      // Append empty x-axis group and move it to the bottom of the chart
      vis.xAxisG = vis.chart.append('g')
          .attr('class', 'axis x-axis')
          .attr('transform', `translate(0,${vis.height})`);
      
      // Append y-axis group 
      vis.yAxisG = vis.chart.append('g')
          .attr('class', 'axis y-axis');
  
      // Append axis title
      vis.svg.append('text')
          .attr('class', 'axis-title')
          .attr('x', 165)
          .attr('y', 5)
          .attr('dy', '.71em')
          .text('Number of Planets Discovered each Year (click on bar chart to edit scatterplot)');

        vis.updateVis();
    }
  
    /**
     * Prepare data and scales before we render it
     */
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
      .attr("y", vis.height - 270)
      .attr("x", vis.width - 360)
      .attr("font-size", "12px")
      .attr("stroke", "black")
      .text("Discovery Year");
      

    vis.yAxisG.append('text')
      .attr("transform", "rotate(-90)")
      .attr("dy", "-13.5em")
      .attr("y", vis.height - 210)
      .attr("x", vis.width - 780)
      .attr("font-size", "12px")
      .attr("stroke", "black")
      .text("Number of Exoplanets per Category");

      // Prepare data: count number of trails in each difficulty category
      // i.e. [{ key: 'easy', count: 10 }, {key: 'intermediate', ...
      const aggregatedDataMap = d3.rollups(vis.data, v => v.length, d => d.disc_year);
      //aggregatedDataMap.sort();
      vis.aggregatedData = Array.from(aggregatedDataMap, ([key, count]) => ({ key, count }));
  
      const orderedKeys = ['1992', '1993', '1994', '1995',
      '1996', '1997', '1998', '1999', '2000', '2001', '2002', '2003', '2004',
      '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013',
      '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022',
      '2023'];
      vis.aggregatedData = vis.aggregatedData.sort((a,b) => {
        return orderedKeys.indexOf(a.key) - orderedKeys.indexOf(b.key);
      });
  
      // Specificy accessor functions
      vis.colorValue = d => d.key;
      vis.xValue = d => d.key;
      vis.yValue = d => d.count;
  
      // Set the scale input domains
      vis.xScale.domain(vis.aggregatedData.map(vis.xValue));
      vis.yScale.domain([0.5, d3.max(vis.aggregatedData, vis.yValue)]);

     

  
      vis.renderVis();
    }
  
    /**
     * Bind data to visual elements
     */
    renderVis() {
      let vis = this;
  
      // Add rectangles
      const bars = vis.chart.selectAll('.bar')
          .data(vis.aggregatedData, vis.xValue)
        .join('rect')
          .attr('class', 'bar')
          .attr('x', d => vis.xScale(vis.xValue(d)))
          .attr('width', vis.xScale.bandwidth())
          .attr('height', d => vis.height - vis.yScale(vis.yValue(d)))
          .attr('y', d => vis.yScale(vis.yValue(d)))
          .attr('fill', d => vis.colorScale(vis.colorValue(d)))
          .on('click', function(event, d) {
            const isActive = dateFilter.includes(d.key);
            if (isActive) {
              dateFilter = dateFilter.filter(f => f !== d.key); // Remove filter
            } else {
              dateFilter.push(d.key); // Append filter
            }
            filterScatterData(); // Call global function to update scatter plot
            d3.select(this).classed('active', !isActive); // Add class to style active filters with CSS
          });
  
      // Update axes
      vis.xAxisG.call(vis.xAxis);
      vis.yAxisG.call(vis.yAxis);
    }
  }