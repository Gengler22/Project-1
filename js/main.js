let data1, _data, radiusAndMassScatterplot, radiusAndMassBarchart, discoveryYearLinechart,
distanceFromEarthHistogram, habitableZoneBarchart,numStarsBarchart, numPlanetsBarchart,
stellarTypeBarchart, discoveryMethodBarchart;
let dateFilter = [];
let sunFilter = [];
let HabitableZones = [];

d3.csv('data/exoplanets.csv')
  .then(data => {
    _data = data;
    data1 = data;
    // Convert strings to numbers
    data.forEach(d => {
      d.sy_snum = +d.sy_snum;
      d.sy_pnum = +d.sy_pnum;
      d.pl_orbsmax = +d.pl_orbsmax;
      d.sy_dist = +d.sy_dist;
      d.disc_year = +d.disc_year;
      d.pl_rade = +d.pl_rade;
      d.pl_bmasse = +d.pl_bmasse;
    }); 
    data1 = data;
    habitableZoneDataset = data;

    let placeholder = _data.filter(function(d) { if(d.pl_rade != undefined) { return d.pl_rade}});
    let placeholder1 = placeholder.filter(function(d) { if(d.pl_bmasse != undefined) { return d.pl_bmasse}});
    _data = placeholder1;

    var HabitableZones = [
        {'zone': "A", 'NonHabitableZones': 0, 'HabitableZones' : 0},
        {'zone': "F", 'NonHabitableZones': 0, 'HabitableZones' : 0}, 
        {'zone': "G", 'NonHabitableZones': 0, 'HabitableZones' : 0}, 
        {'zone': "K", 'NonHabitableZones': 0, 'HabitableZones' : 0},
        {'zone': "M", 'NonHabitableZones': 0, 'HabitableZones' : 0}];


        for(let i = 0; i < 5243; i++) {
            if((habitableZoneDataset[i].st_spectype).charAt(0) == "A" && (habitableZoneDataset[i].pl_orbsmax) >= 8.5 && (habitableZoneDataset[i].pl_orbsmax) <= 12.5) {
                HabitableZones[0].HabitableZones += 1;
            }
            else if((habitableZoneDataset[i].st_spectype).charAt(0) == "A" && ((habitableZoneDataset[i].pl_orbsmax) < 8.5 || (habitableZoneDataset[i].pl_orbsmax) > 12.5)) {
                HabitableZones[0].NonHabitableZones += 1;
            }
            else if((habitableZoneDataset[i].st_spectype).charAt(0) == "F" && (habitableZoneDataset[i].pl_orbsmax) >= 1.5 && (habitableZoneDataset[i].pl_orbsmax) <= 2.2) {
                HabitableZones[1].HabitableZones += 1;
            }
            else if((habitableZoneDataset[i].st_spectype).charAt(0) == "F" && ((habitableZoneDataset[i].pl_orbsmax) < 1.5 || (habitableZoneDataset[i].pl_orbsmax) > 2.2)) {
                HabitableZones[1].NonHabitableZones += 1;
            }
            else if((habitableZoneDataset[i].st_spectype).charAt(0) == "G" && (habitableZoneDataset[i].pl_orbsmax) >= 0.95 && (habitableZoneDataset[i].pl_orbsmax) <= 1.4) {
                HabitableZones[2].HabitableZones += 1;
            }
            else if((habitableZoneDataset[i].st_spectype).charAt(0) == "G" && ((habitableZoneDataset[i].pl_orbsmax) < 0.95 || (habitableZoneDataset[i].pl_orbsmax) > 1.4)) {
                HabitableZones[2].NonHabitableZones += 1;
            }
            else if((habitableZoneDataset[i].st_spectype).charAt(0) == "K" && (habitableZoneDataset[i].pl_orbsmax) >= 0.38 && (habitableZoneDataset[i].pl_orbsmax) <= 0.56) {
                HabitableZones[3].HabitableZones += 1;
            }
            else if((habitableZoneDataset[i].st_spectype).charAt(0) == "K" && ((habitableZoneDataset[i].pl_orbsmax) < 0.38 || (habitableZoneDataset[i].pl_orbsmax) > 0.56)) {
                HabitableZones[3].NonHabitableZones += 1;
            }
            else if((habitableZoneDataset[i].st_spectype).charAt(0) == "M" && (habitableZoneDataset[i].pl_orbsmax) >= 0.08 && (habitableZoneDataset[i].pl_orbsmax) <= 0.12) {
                HabitableZones[4].HabitableZones += 1;
            }
            else if((habitableZoneDataset[i].st_spectype).charAt(0) == "M" && ((habitableZoneDataset[i].pl_orbsmax) < 0.08 || (habitableZoneDataset[i].pl_orbsmax) > 0.12)) {
                HabitableZones[4].NonHabitableZones += 1;
            }
        }


        const colorScale = d3.scaleOrdinal()
          .range(["#000000", "#800000", "#FF0000","#800080","#FF00FF","#008000","#00FF00",
          "#808000","#FFFF00","#000080","#008080","#00FFFF","#7fff00","#5f9ea0","#d2691e",
          "#ff7f50","#6495ed","#006400","#b8860b","#bdb76b","#8b008b","#ff1493","#cd5c5c",
          "#4b0082","#add8e6","#f08080","#90ee90","#ba55d3","#7b68ee","#3cb371","#ffe4b5","#00ff7f"])
          .domain([1992, 2023]);


    // intStars = d3.rollups(data, d => d.length, d => d.sy_snum);
    // var intPlanets = d3.rollups(data, d => d.length, d => d.sy_pnum);
    //var stellarValue = d3.rollups(data, d => d.length, d => d.st_spectype);
    var discoveryMethod = d3.rollups(data, d => d.length, d => d.discoverymethod);
    var discoveryYear = d3.rollups(data, d => d.length, d => d.disc_year);

      for(let i = 0; i < 5243; i++) {
          if((data[i].st_spectype).charAt(0) == "A") {
              data[i].st_spectype = "A";
          }
          else if((data[i].st_spectype).charAt(0) == "F") {
             data[i].st_spectype = "F";
          }
          else if((data[i].st_spectype).charAt(0) == "G") {
             data[i].st_spectype = "G";
          }
          else if((data[i].st_spectype).charAt(0) == "K") {
            data[i].st_spectype = "K";
          }
          else if((data[i].st_spectype).charAt(0) == "M") {
            data[i].st_spectype = "M";
          }
          else if((data[i].st_spectype).charAt(0) == "") {
            data[i].st_spectype = "N/A";
          }
      }
      console.log(data);

      for(let i = 0; i < 5243; i++) {
        if(data[i].discoverymethod == "Pulsar Timing" || data[i].discoverymethod == "Orbital Brightness Modulation"
        || data[i].discoverymethod == "Disk Kinematics" || data[i].discoverymethod == "Pulsation Timing Variations"
        || data[i].discoverymethod == "Astrometry") {
            data[i].discoverymethod = "Other";
        };
      };

    // Initialize chart
    numStarsBarchart = new NumStarsBarchart({ parentElement: '#barchart'}, data);
    numPlanetsBarchart = new NumPlanetsBarchart({ parentElement: '#barchart1'}, data);
    stellarTypeBarchart = new StellarTypeBarchart({parentElement: '#barchart2'}, data);
    discoveryMethodBarchart = new DiscoveryMethodBarchart({parentElement: '#barchart3'}, data);
    habitableZoneBarchart = new HabitableZoneBarchart({parentElement: '#barchart4'}, HabitableZones);
    distanceFromEarthHistogram = new DistanceFromEarthHistogram({parentElement: '#histogram'}, data);
    discoveryYearLinechart = new DiscoveryYearLinechart({parentElement: '#linechart'}, discoveryYear);
    radiusAndMassScatterplot = new RadiusAndMassScatterplot({parentElement: '#scatterplot', colorScale: colorScale}, data);
    radiusAndMassBarchart = new RadiusAndMassBarchart({parentElement: '#barchart5', colorScale: colorScale}, data);
    // Show chart
    numStarsBarchart.updateVis();
    numPlanetsBarchart.updateVis();
    stellarTypeBarchart.updateVis();
    discoveryMethodBarchart.updateVis();
    habitableZoneBarchart.updateVis();
    distanceFromEarthHistogram.updateVis();
    discoveryYearLinechart.updateVis();
    radiusAndMassScatterplot.updateVis();
    radiusAndMassBarchart.updateVis();

    d3.select('#start-year-input').on('change', function() {
        // Get selected year
        const minYear = parseInt(d3.select(this).property('value'));
      
        // Filter dataset accordingly
        let filteredData = discoveryYear.filter(d => d[0] >= minYear);
      
        // Update chart
        discoveryYearLinechart.data = filteredData;

        discoveryYearLinechart.updateVis();
    })
})

.catch(error => console.error(error));

function filterScatterData() {

    if (dateFilter.length == 0) {
        radiusAndMassScatterplot.data = _data;
        //numStarsBarchart.data = data1;
        //radiusAndMassBarchart = _data;
    }else {
        radiusAndMassScatterplot.data = _data.filter(d => dateFilter.includes(d.disc_year));
        console.log(dateFilter);
        //radiusAndMassBarchart.data = _data.filter(d => dateFilter.includes(d.sy_snum));
    }
    radiusAndMassScatterplot.updateVis();
    };

function filterBarData() {
    if (sunFilter.length == 0) {
        numPlanetsBarchart.data = data1;
        numStarsBarchart.data = data1;
        stellarTypeBarchart.data = data1;
        discoveryMethodBarchart.data = data1;
    }
    else { 
        numPlanetsBarchart.data = data1.filter(d => sunFilter.includes(d.sy_snum));
        stellarTypeBarchart.data = data1.filter(d => sunFilter.includes(d.sy_snum));
        discoveryMethodBarchart.data = data1.filter(d => sunFilter.includes(d.sy_snum));
        console.log(sunFilter);
    }
    numPlanetsBarchart.updateVis();
    stellarTypeBarchart.updateVis();
    discoveryMethodBarchart.updateVis();
}
      

  
  