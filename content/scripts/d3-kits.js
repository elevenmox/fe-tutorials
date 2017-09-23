"use strict";
// https://developer.mozilla.org/en-US/docs/Web/CSS/padding
function formatPadding(){
	let v_top = 0, v_right = 0, v_bottom = 0, v_left = 0;
	let len = arguments.length;
	switch(len){
		case 1:
			v_top = v_right = v_bottom = v_left = arguments[0];
			break;
		case 2:
			v_top = v_bottom = arguments[0];
			v_right = v_left = arguments[1];
			break;
		case 3:
			v_top = arguments[0];
			v_right = v_left = arguments[1];
			v_bottom = arguments[2];
			break;
		case 4:
			v_top = arguments[0];
			v_right = arguments[1];
			v_bottom = arguments[2];
			v_left = arguments[3];
			break;
	}
	return {"top": v_top, "right": v_right, "bottom": v_bottom, "left": v_left};
}

function initScaleAndPoints(data, setting){
	let area = setting.area;

	let ratio = setting.ratio || 1.2;
	let scaleX = d3.scaleLinear()
		.domain([0, ratio * d3.max(data, value => value[0])])
		.range([0, area.width]);
	let scaleY = d3.scaleLinear()
		.domain([0, ratio * d3.max(data, value => value[1])])
		.range([area.height, 0]);

	let scale = {"x": scaleX, "y": scaleY};
	setting.scale = scale;

	let padding = setting.padding;
	// 
	let points = data.map( 
		//ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#Returning_object_literals
		// json data with curly braces.
		value => ({"x": padding.left + scale.x(value[0]), "y": padding.bottom + scale.y(value[1])})  
	);
	setting.points = points;
}

function drawScatter(svg, setting){
	let points = setting.points;
	let scatter_container = svg.append("g")
		.attr("class", "scatters");

	scatter_container.selectAll("circle")
		.data(points)
		.enter()
		.append("circle")
		.attrs({
			"fill":"#F00",
			"r": 4,
			"cx": value => value.x,
			"cy": value => value.y
		});
}

function drawLine(svg, setting){
	let points = setting.points;
	let linePath = d3.line()
		.x( value => value.x )
		.y( value => value.y );

	let line_container = svg.append("g")
		.attr("class", "lines");

	line_container.append("path")
		.attrs({
			"d": linePath(points),
			"stroke": "#999",
			"stroke-width": 2,
			"fill": "none"
		});
}

function drawLabel(svg, setting){
	let data = setting.data;
	let points = setting.points;

	let label_container = svg.append("g")
		.attr("class", "labels");

	label_container.selectAll("text")
		.data(points)
		.enter()
		.append("text")
		.attrs({
			"fill":"#333",
			"font-size": "12px",
			"text-anchor": "middle",
			"x": value => value.x,
			"y": value => value.y,
			"dy": "-1em"
		})
		.text( (value, index) => `(${data[index][0]},${data[index][1]})` );

}

function drawAxis(svg, setting){
	let padding = setting.padding;
	let scale = setting.scale;
	let area = setting.area;

	// draw axis (command: append("g").attrs(...).call(axis) )
	let axis_container = svg.append("g")
		.attrs({
			"class": "coordinate",
			"transform": "translate(" + padding.left + ", " + padding.top + ")"
		});

	let axisX = d3.axisBottom()
		.scale(scale.x);
	axis_container.append("g")
		.attrs({
			"class": "axis axis-x",
			"transform": "translate(0, " + area.height + ")"
		})
		.call(axisX);

	let axisY = d3.axisLeft()
		.scale(scale.y);
	axis_container.append("g")
		.attrs({
			"class": "axis axis-y"
		})
		.call(axisY);
}