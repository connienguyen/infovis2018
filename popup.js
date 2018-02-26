document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
	$('.demoChartContainer').on('popup', function (event, story) {
		// Add pop up next to event
		var circle = document.querySelector('#' + story.AgeGroup);
		addPopUp(circle, story);
	})
  }
};

// TODO connect with data
function addPopUp(circle, personStory) {
	var popUp = constructPopUp(personStory);
	var x = +circle.getAttribute('cx') + +circle.getAttribute('r') + 15;
	var y = +circle.getAttribute('cy');
	popUp.style.left = x;
	if (y > 300) {
		popUp.style.bottom = 0;
	} else {
		popUp.style.top = y;
	}

	// Add popUp to 
	var chartContainer = document.querySelector('.demoChartContainer');
	// Remove an existing popup
	var existing = chartContainer.querySelector('.popUp');
	if (existing) {
		chartContainer.removeChild(existing);
	}
	chartContainer.append(popUp);

	// Add "button" to close popup
	var closeButton = document.createElement('div');
	closeButton.style.top = '10px';
	closeButton.style.right = '10px';
	closeButton.innerHTML = 'close';
	closeButton.addEventListener('click', function() {
		chartContainer.removeChild(popUp);
	})
	popUp.querySelector('.popClose').append(closeButton);
}

function constructPopUp(personStory) {
	var popUp = document.createElement('div');
	popUp.classList.add('popUp');
	popUp.innerHTML = '<div class="popClose"></div>'
	popUp.innerHTML += '<h3>' + personStory.Name + ', ' + personStory.Age + '</h3>';
	popUp.innerHTML += '<p><b>Country: </b>' + personStory.Country + '</p>';
	popUp.innerHTML += '<p><b>Status: </b>' + personStory.Status + '</p>';
	popUp.innerHTML += '<p><b>Education: </b>' + personStory.Education + '</p>';
	popUp.innerHTML += '<p><b>Occupation: </b>' + personStory.Occupation + '</p>';
	popUp.innerHTML += '<p class="quote">' + personStory.Quote + '</p>';
	popUp.innerHTML += '<p><a href="' + personStory.StoryLink + '" target="_blank">Read ' + personStory.Name + '\'s full story</a>';
	return popUp;
}

// Helper func to get absolute position of element 
function getPosition(el) {
	// Get distance from left
	var x = 0;
	var y = 0;
	while (el) {
		if (el.tagName == "BODY") {
			var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
			var yScroll = el.scrollTop || document.documentElement.scrollTop;

			x += el.offsetLeft - xScroll + el.clientLeft;
			y += el.offsetTop - yScroll + el.clientTop;
		} else {
			x += el.offsetLeft - el.scrollLeft + el.clientLeft;
			y += el.offsetTop - el.scrollTop + el.clientTop;
		}
		el = el.offsetParent;
	}
	
	return {
		x: x,
		y: y
	}
}
