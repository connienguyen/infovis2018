document.addEventListener('DOMContentLoaded', function(){

  var demographicsCSV = "data/demographics.csv";
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
});

const createDemographicsBubbleChart = function(demographics){
  console.log(demographics[0]);
  // Returns total amount for one country (aggregating age groups)
  const getTotalFor = function(country) {
    var countries = demographics.filter(function(row){ return row['födelseland'] == country; });
    var amounts = countries.map( row => row['2016'] )
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
  var zoom = 0.05;
  var height = 768 - 16;
  var width = 1280;
  var svg = d3.select('svg');

  // Creates bubbles for one country
  const createBubblesFor = function(countryName, rank) {
    var country = demographics.filter(function(row){ return row['födelseland'] == countryName; });
    var circle = svg.selectAll('circle')
            .data(country, function(row) { return row['2016']; })
          .enter().append('circle')
            .attr('fill', 'steelblue')
            .attr('opacity', (countryName == 'Sverige' ? 0.1 : 1))
            .attr('r', function(row) { return zoom * Math.sqrt(row['2016'] * Math.PI) })
            .attr('cx', function(row) { return 256 + ((width - 256) / domain * rank) + ((width - 256) / domain / 2); })
            .attr('cy', function(row, index) { return height - ((height / range) * index) - (height / range / 2); })
          .exit().remove();
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
          .attr('x', function(name, rank) { return 256 + ((width - 256) / domain * rank) + ((width - 256) / domain / 2); })
          .attr('y', height)
        .exit().remove();
};
