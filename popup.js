document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
	var svgEl = document.querySelector('.demoChartContainer svg');
	svgEl.addEventListener('click', function(event) {
		// TODO listen for specific elements + pass associated data
		var personStory = {
			name: 'Salam',
			age: 22,
			status: 'Refugee',
			country: 'Syria',
			education: 'Gymnasial utbildning (high school). Studied eftergymnasial utbildning (college),  bank clerk.',
			occupation: 'Unemployed',
			quote: '"We saw how the rockets and the bombs flew through the air above us."',
			link: 'http://pejl.svt.se/syrien200/sv/stories/82'
		}
		addPopUp(event, personStory);
	})
  }
};

// TODO connect with data
function addPopUp(event, personStory) {
	var popUp = constructPopUp(personStory);
	popUp.style.left = event.clientX;
	popUp.style.top = event.clientY;

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
	console.log(popUp.children);
	popUp.querySelector('.popClose').append(closeButton);
}

function constructPopUp(personStory) {
	var popUp = document.createElement('div');
	popUp.classList.add('popUp');
	popUp.innerHTML = '<div class="popClose"></div>'
	popUp.innerHTML += '<h3>' + personStory.name + ', ' + personStory.age + '</h3>';
	popUp.innerHTML += '<p><b>Country: </b>' + personStory.country + '</p>';
	popUp.innerHTML += '<p><b>Status: </b>' + personStory.status + '</p>';
	popUp.innerHTML += '<p><b>Education: </b>' + personStory.education + '</p>';
	popUp.innerHTML += '<p><b>Occupation: </b>' + personStory.occupation + '</p>';
	popUp.innerHTML += '<p class="quote">' + personStory.quote + '</p>';
	popUp.innerHTML += '<p><a href="' + personStory.link + '" target="_blank">Read ' + personStory.name + '\'s full story</a>';
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
