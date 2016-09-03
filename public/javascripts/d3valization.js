Object.prototype.values = function(obj) {
	var keys = Object.keys(obj),
		values = [];
	for (var i = 0, len = keys.length; i < len; i++ ) {
		values.push(obj[keys[i]]);
	}
	return values;
}

function indexof(array, item) {
	for (var i = 0, len = array.length; i < len; i++) {
		if ( array[i] == item ) return i;
	}
	return -1;
}
function render(wrapper, data) {
	//data是对象
	var keyArray = Object.keys(data),
		dataArray = Object.values(data),
		newDataArray = Object.values(data);
	
	newDataArray.sort();
	var maxData = newDataArray[newDataArray.length-1];

	console.log(maxData);
	var x =	d3.scale.linear()
		.domain([0, maxData])
		.range([0, 200]);

	d3.select(wrapper)
		.selectAll('div')
			.data(dataArray)
		.enter().append('div')
			.style('width', function(d) { return x(d) + 'px';})
			.text(function(d) {
				var index = indexof(dataArray, d);
				return keyArray[index] + ':  ' + d;
			});
}

var questionBodies = JSON.parse($('input').val());
questionBodies.forEach(function(item) {
	var questionRightId = '#' + item,
		data = JSON.parse($(questionRightId).attr('data-data'));
	render(questionRightId, data);
});