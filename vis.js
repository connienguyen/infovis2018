var zoomSlider;
var bubbleReducer = 110;
var stories = null;

document.addEventListener('DOMContentLoaded', function(){

  
  var educationCSV = "data/education.csv";
  var employmentCSV = "data/employment_only_job.csv";
  var demographicsCSV = "data/demographics.csv";
  var storiesCSV = "data/stories.csv";
  d3.csv(demographicsCSV, function(demographics){
    // Demographics is an array of objects
    // Each object has members födelseland, ålder, 2000, ... 2016

    // Change amounts for each year from strings numbers
    demographics.forEach(function(row){
      for(var i = 2000; i <= 2017; i++) {
        row[i.toString()] = +row[i.toString()];
      }
    });

    createDemographicsBubbleChart(demographics);
  });

  d3.csv(storiesCSV, function (csvStories) {
    csvStories.forEach(function (row) {
      row['CircleID'] = row['Country']+row['AgeGroup'];
    })
  })

  zoomSlider = document.getElementById('zoomSlider');
});

const createDemographicsBubbleChart = function(demographics){
  // Returns total amount for one country (aggregating age groups)
  const getTotalFor = function(country) {
    var countries = demographics.filter(function(row){ return row['födelseland'] == country; });
    var amounts = countries.map( row => row['2016'] );
    var total = 0;
    amounts.forEach(function(amount){ total += amount; });
    return total;
  }

  var ages = demographics.filter(function(row){ return row['födelseland'] == 'Afghanistan'; })
                          .map( row => row['ålder'] );
  var countries = _.uniq(demographics.map( row => row['födelseland']));
  var countryTotals = countries.map( function(country){ return { name: country, total: getTotalFor(country), }; });
  var countriesSortedBySize = _.sortBy(countryTotals, function(country){ return -country.total; });
  var largestCountries = _.take(countriesSortedBySize, 10);
  var range = ages.length;
  var domain = largestCountries.length;
  const getZoomFactor = function(sliderValue) { return 32 / (largestCountries[0].total * 0.005) * sliderValue; };
  var zoom = getZoomFactor(zoomSlider.value);
  var height = 700 - 16;
  var width = 1024;
  var svg = d3.select('svg');

  zoomSlider.addEventListener('input', function(e) {
    console.log(e.target.value)
 zoom = getZoomFactor(e.target.value);
    largestCountries.forEach(function(country){
      var bubblesForCountry = svg.selectAll('.' + country.name.substring(0,5)) // Substring is a hack to avoid classname with spaces
        .attr('r', function(row) { return zoom * Math.sqrt(row[e.target.value]/bubbleReducer) })
    });
  });

  // Creates bubbles for one country
  const createBubblesFor = function(countryName, rank) {
    var country = demographics.filter(function(row){ return row['födelseland'] == countryName; });
    var circles = svg.selectAll('circle')
            .data(country, function(row) { return row['2016']; })
          .enter().append('circle')
            .attr('class', countryName.substring(0,5)) // Substring is a hack to avoid classname with spaces
            .attr('fill', 'steelblue')
            .attr('opacity', (countryName == 'Sverige' ? .1 : 1)) // Change opacity
            .attr('r', function(row) { return zoom * Math.sqrt(row[zoomSlider.value]/bubbleReducer) })
            .attr('cx', function(row) { return 128 + ((width - 128) / domain * rank) + ((width - 128) / domain / 2); })
            .attr('cy', function(row, index) { return height - ((height / range) * index) - (height / range / 2); });
  };

  largestCountries.forEach(function(country, index){
    createBubblesFor(country.name, index);
  });

  // Create labels along Y axis
  var ageLabels = svg.selectAll('text')
          .data(ages, function(age) { return age; })
        .enter().append('text')
          .text(function(age) { return age; })
          .attr('text-anchor', 'end')
          .attr('alignment-baseline', 'central')
          .attr('class', 'labelX')
          .attr('x', 128)
          .attr('y', function(age, index) { return height - ((height / range) * index) - (height / range / 2); })
        .exit().remove();

  // create labels along X axis
  var ageLabels = svg.selectAll('text')
          .data(largestCountries, function(country) { return country; })
        .enter().append('text')
          .text(function(country) { return (country.name.length > 10 ? country.name.substring(0,9) + '...' : country.name); })
          .attr('text-anchor', 'middle')
          .attr('alignment-baseline', 'bottom')
          .attr('class', 'labelX')
          .attr('x', function(name, rank) { return 128 + ((width - 128) / domain * rank) + ((width - 128) / domain / 2); })
          .attr('y', height)
        .exit().remove();
};