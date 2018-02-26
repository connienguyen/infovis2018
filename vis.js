var zoomSlider;
var yearSlider;
var bubbleReducer = 110;
var stories = null;
var storyIDs = null;
var swedenCheckbox = null;

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
    stories = csvStories;
    storyIDs = stories.map(story => story['AgeGroup']);
  })

  zoomSlider = document.getElementById('zoomSlider');
  yearSlider = document.getElementById('yearSlider');
  swedenCheckbox = document.getElementById('showSweden');
});

const createDemographicsBubbleChart = function(demographics){
  // Returns total amount for one country (aggregating age groups)
  const getTotalFor = function(country) {
    var countries = demographics.filter(function(row){ return row['country of origin'] == country; });
    var amounts = countries.map( row => row['2017'] );
    var total = 0;
    amounts.forEach(function(amount){ total += amount; });
    return total;
  }

  var ages = demographics.filter(function(row){ return row['country of origin'] == 'Afghanistan'; })
                          .map( row => row['age'] );
  var countries = _.uniq(demographics.map( row => row['country of origin']));
  var countryTotals = countries.map( function(country){ return { name: country, total: getTotalFor(country), }; });
  var countriesSortedBySize = _.sortBy(countryTotals, function(country){ return -country.total; });
  var largestCountries = _.take(countriesSortedBySize, 11);
  var range = ages.length;
  var domain = largestCountries.length;
  const getZoomFactor = function(sliderValue) { return 64 / (largestCountries[0].total * 0.005) * sliderValue; };
  var zoom = getZoomFactor(zoomSlider.value);
  var year = yearSlider.value;
  var height = 700 - 16;
  var width = 1280;
  var svg = d3.select('svg');
  var colors = d3.scaleOrdinal(d3.schemeDark2);
  var showSweden = swedenCheckbox.checked;

  zoomSlider.addEventListener('input', function(e) {
    zoom = getZoomFactor(e.target.value);
    largestCountries.forEach(function(country){
      var bubblesForCountry = svg.selectAll('.' + country.name.replace(/\s+/g, '-'))
        .attr('r', function(row) { return zoom * Math.sqrt(row[year]) })
    });
  });

  yearSlider.addEventListener('input', function(e) {
    year = e.target.value;
    largestCountries.forEach(function(country){
      var bubblesForCountry = svg.selectAll('.' + country.name.replace(/\s+/g, '-'))
        .transition()
        .duration(100)
        .attr('r', function(row) { return zoom * Math.sqrt(row[year]) })
    });
    var currentYearArray = [year.toString()];
    var yearLabel = svg.select('#labelYear').text(year.toString());
  });

  swedenCheckbox.addEventListener('change', function(e) {
    showSweden = e.target.checked;
    var bubblesForSweden = svg.selectAll('.' + 'Sweden')
    .transition()
    .duration(250)
    .attr('opacity', !showSweden ? 0 : 1)
  });

  var yearLabel = svg.append('text')
          .text(year.toString())
          .attr('id', 'labelYear')
          .attr('text-anchor', 'end')
          .attr('x', function(name, rank) { return width; })
          .attr('y', height - 32)
        .exit().remove();

  // Creates bubbles for one country
  const createBubblesFor = function(countryName, rank) {
    var country = demographics.filter(function(row){ return row['country of origin'] == countryName; });
    var circles = svg.selectAll('circle')
            .data(country, function(row) { return row['2016']; })
          .enter().append('circle')
            .attr('id', function(d){ return (d['country of origin'] + d['age']).replace(/\s+/g, '-') })
            .attr('class', countryName.replace(/\s+/g, '-'))
            .attr('fill', colors(rank))
            .attr('opacity', (!showSweden && countryName == 'Sweden') ? 0 : 1)
            .attr('r', function(row) { return zoom * Math.sqrt(row[year]) })
            .attr('cx', function(row) { return 128 + ((width - 128) / domain * rank) + ((width - 128) / domain / 2); })
            .attr('cy', function(row, index) { return height - ((height / range) * index) - (height / range / 2); });

    // Listener for clicks
    svg.selectAll('circle').on('click', function(d, i) {
      var circleID = (d['country of origin'] + d['age']).replace(/\s+/g, '-');
      if (storyIDs.includes(circleID)) {
        var found = stories.filter(story => story['AgeGroup'] === circleID);
        if (found.length) {
          var story = found[0];
          $('.demoChartContainer').trigger('popup', [story]);
        }
      }
    })

    // Make visually different
    stories.forEach(function (story) {
      var circleID = story.AgeGroup;
      svg.select('#' + circleID)
        .attr('stroke', 'red')
        .attr('stroke-width', '5px');
    })
  };

  largestCountries.forEach(function(country, index){
    createBubblesFor(country.name, index);
  });

  // Create labels along Y axis
  var ageLabels = svg.selectAll('labelY')
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
  var yearLabels = svg.selectAll('labelX')
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
