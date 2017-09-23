/* 20170923
*/
(function(root, $) {
	"use strict";

	let corindex = 1;
	let defaultSetting = {
		span: 20,
		olines: 4
	};

	let Coordinate = function(){};


	Coordinate.draw =  function(el, setting){
		let self = this;
		setting = $.extend({}, setting, defaultSetting)
		let span = setting.span;
		let olines = setting.olines;


		let width = el.width();
		let height = el.height();
		let origin = el.html();
		let ctnid = "test-" + corindex++;

		el.addClass("overlapping");			
		/* 
		el.empty();
		let front_el = $("<div class='front' />")
			.html(origin)
			.appendTo(el);*/

		el.append($("<div class='coordinate ground' />").attr({"id": ctnid}));

		let svg_container =	SVG(ctnid);
		svg_container.attr({"width": width, "height": height});

		let start_x = 0;
		let start_y = 0;

		let max_count = Math.floor(Math.max(width/span, height/span));
		let spin = Math.floor(max_count / olines);
		let index = 1;
		while(true){
			let tmp = index * span;
			if(tmp > height)
				break;
			let color = index % spin == 0 ? "#CCC" : "#EEE";
			svg_container.line(start_x, start_y + tmp, width, start_y + tmp).attr({"stroke": color});
			index++;
		}

		index = 1;
		while(true){
			let tmp = index * span;
			if(tmp > width)
				break;
			let color = index % spin == 0 ? "#CCC" : "#EEE";
			svg_container.line(start_x + tmp, start_y, start_x + tmp, height).attr({"stroke": color});
			index++;
		}
	}

	root.coordinate = Coordinate.draw;
})(window, jQuery);