var bubbleReducer = 20;
var stories = null;
var storyIDs = null;

// Initializing fullpage and setting the options
$(document).ready(function() {
	$('#fullpage').fullpage({
    sectionsColor : ['#e8c2b7', '#ca4646', '#c0d6e4', '#ffcb6c', '#feff73'],
    //paddingTop: '8em',
		//paddingBottom: '10px'
  });
});

document.addEventListener('DOMContentLoaded', function(){


  var educationCSV = "data/education.csv";
  var employmentCSV = "data/employment_combined.csv";
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
  });

  d3.csv(employmentCSV, function(employment_combined){
    employment_combined.forEach(function(row){
      for(var i = 2004; i <= 2016; i++) {
        row[i.toString()] = +row[i.toString()];
      }
  });
    createEmploymentBubbleChart(employment_combined);
  });

});

const createDemographicsBubbleChart = function(demographics){
  // Returns total amount for one country (aggregating age groups)
  var bubbleZoom = 1;
  const getTotalFor = function(country) {
    var countries = demographics.filter(function(row){ return row['country of origin'] == country; });
    var amounts = countries.map( row => row['2017'] );
    var total = 0;
    amounts.forEach(function(amount){ total += amount; });
    return total;
  }

  var zoomSlider;
  var yearSlider;
  var swedenCheckbox = null;
  
  zoomSlider = document.getElementById('zoomSlider');
  yearSlider = document.getElementById('yearSlider');
  swedenCheckbox = document.getElementById('showSweden');
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
  var width = 1536;
  var svg = d3.select('svg#demoSVG');
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
      // Use the bubbleZoom scaler for all countries except Sweden
      if (country.name == 'Sweden'){
        console.log(year);
        console.log(zoom);
        var bubblesForSweden = svg.selectAll('.' + 'Sweden')
        .transition()
        .duration(100)
        .attr('r', function(row) { return zoom * Math.sqrt(row[year])})
      }
      else{
        var bubblesForCountry = svg.selectAll('.' + country.name.replace(/\s+/g, '-'))
        .transition()
        .duration(100)
        .attr('r', function(row) { return zoom * Math.sqrt(row[year]) *bubbleZoom })
    }
      });
    var currentYearArray = [year.toString()];
    var yearLabel = svg.select('#labelYear').text(year.toString());
  });

  swedenCheckbox.addEventListener('change', function(e) {
    showSweden = e.target.checked;
    bubbleZoom = showSweden ? 1 : 2;

    // scale all countries by bubbleZoom except for Sweden
    largestCountries.forEach(function(country){
      if (country.name == 'Sweden'){
        var bubblesForSweden = svg.selectAll('.' + 'Sweden')
        .transition()
        .duration(1000)
        .attr('r', function(row) { return zoom * Math.sqrt(row[year])})
      }
      else{
        var bubblesForCountry = svg.selectAll('.' + country.name.replace(/\s+/g, '-'))
        .transition()
        .duration(1000)
        .attr('r', function(row) { return zoom * Math.sqrt(row[year]) *bubbleZoom })
    }
      });

    //showSweden = e.target.checked;
    var bubblesForSweden = svg.selectAll('.' + 'Sweden')
    .transition()
    .duration(1000)
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

const createEmploymentBubbleChart = function(employment_combined){
  var bubbleZoom = 1;
  // Returns total amount for one country (aggregating age groups)
  const getTotalFor = function(country) {
    var countries = employment_combined.filter(function(row){ return row['origin of birth'] == country; });
    var amounts = countries.map( row => row['2016'] );
    var total = 0;
    amounts.forEach(function(amount){ total += amount; });
    return total;
  }

  var zoomSlider2;
  var yearSlider2;
  var swedenCheckbox2 = null;
  
  zoomSlider2 = document.getElementById('zoomSlider2');
  yearSlider2 = document.getElementById('yearSlider2');
  swedenCheckbox2 = document.getElementById('showSweden2');

  var ages = employment_combined.filter(function(row){ return row['origin of birth'] == 'Asia'; })
                          .map( row => row['age'] );
  var countries = _.uniq(employment_combined.map( row => row['origin of birth']));
  var countryTotals = countries.map( function(country){ return { name: country, total: getTotalFor(country), }; });
  var countriesSortedBySize = _.sortBy(countryTotals, function(country){ return -country.total; });
  var largestCountries = _.take(countriesSortedBySize, 11);
  var range = ages.length;
  var domain = largestCountries.length;
  const getZoomFactor = function(sliderValue) { return 64 / (largestCountries[0].total * 0.005) * sliderValue; };
  var zoom = getZoomFactor(zoomSlider2.value);
  var year = yearSlider2.value;
  var height = 700 - 16;
  var width = 1537;
  var svg = d3.select('svg#employmentSVG');
  var colors = d3.scaleOrdinal(d3.schemeDark2);
  var showSweden = swedenCheckbox2.checked;

  zoomSlider2.addEventListener('input', function(e) {
    zoom = getZoomFactor(e.target.value);
    largestCountries.forEach(function(country){
      var bubblesForCountry = svg.selectAll('.' + country.name.replace(/\s+/g, '-'))
        .attr('r', function(row) { return zoom * Math.sqrt(row[year])/bubbleReducer })
    });
  });

  yearSlider2.addEventListener('input', function(e) {
    year = e.target.value;
    largestCountries.forEach(function(country){
      // Use the bubbleZoom scaler for all countries except Sweden
      if (country.name == 'Sweden'){
        console.log(year);
        console.log(zoom);
        var bubblesForSweden = svg.selectAll('.' + 'Sweden')
        .transition()
        .duration(100)
        .attr('r', function(row) { return zoom * Math.sqrt(row[year])/bubbleReducer})
      }
      else{
        var bubblesForCountry = svg.selectAll('.' + country.name.replace(/\s+/g, '-'))
        .transition()
        .duration(100)
        .attr('r', function(row) { return zoom * Math.sqrt(row[year])/bubbleReducer *bubbleZoom })
    }
      });
    var currentYearArray = [year.toString()];
    var yearLabel = svg.select('#labelYear').text(year.toString());
  });

  swedenCheckbox2.addEventListener('change', function(e) {
    showSweden = e.target.checked;
    bubbleZoom = showSweden ? 1 : 2;

    // scale all countries by bubbleZoom except for Sweden
    largestCountries.forEach(function(country){
      if (country.name == 'Sweden'){
        var bubblesForSweden = svg.selectAll('.' + 'Sweden')
        .transition()
        .duration(1000)
        .attr('r', function(row) { return zoom * Math.sqrt(row[year])/bubbleReducer})
      }
      else{
        var bubblesForCountry = svg.selectAll('.' + country.name.replace(/\s+/g, '-'))
        .transition()
        .duration(1000)
        .attr('r', function(row) { return zoom * Math.sqrt(row[year])/bubbleReducer *bubbleZoom })
    }
      });

    var bubblesForSweden = svg.selectAll('.' + 'Sweden')
    .transition()
    .duration(1000)
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
    var country = employment_combined.filter(function(row){ return row['origin of birth'] == countryName; });
    console.log('creating bubbles for country');
    var circles = svg.selectAll('circle')
            .data(country, function(row) { return row['2016']; })
          .enter().append('circle')
            .attr('id', function(d){ return (d['origin of birth'] + d['age']).replace(/\s+/g, '-') })
            .attr('class', countryName.replace(/\s+/g, '-'))
            .attr('fill', colors(rank))
            .attr('opacity', (!showSweden && countryName == 'Sweden') ? 0 : 1)
            .attr('r', function(row) { return zoom * Math.sqrt(row[year])/bubbleReducer })
            .attr('cx', function(row) { return 128 + ((width - 128) / domain * rank) + ((width - 128) / domain / 2); })
            .attr('cy', function(row, index) { return height - ((height / range) * index) - (height / range / 2); })};

  largestCountries.forEach(function(country, index){
    console.log('looping over largest countries');
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