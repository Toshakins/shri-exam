$.fn.gallery = function () {
	//length of .thumbs block - it will change dynamically via side effects
	var thumbsLength = 0;

	function img (src, alt) {
		return '<img src="' + src + '" alt="' + alt + '">';
	}

	function a (src, content) {
		return '<a href="' + src + '">' + content + '</a>';
	}

	function attachThumbs (photos) {
		var $thumbsContainer = $('.thumbs');
		for (var i = 0, length = photos.length; i < length; ++i) {
			$thumbsContainer.append('<li class="crop">' +  
				a(photos[i].img.XL.href, 
					img(photos[i].img.S.href, photos[i].img.title)) + '</li>');
			//count total thumbnails length: 8 is margin
			//FIXME: make it binded on css
			thumbsLength += 8 + photos[i].img.S.width;
		}
		thumbsLength /= 2;
	}

	var getNextPhotos = (function() {
			var limit = 20,
				photos,
				nextPhoto = "http://api-fotki.yandex.ru//api//users//aig1001//album//63684//photos//?format=json" 
					+ '&limit=' + limit;
			return function() {
					$.ajax({
						url:nextPhoto,
						dataType: 'jsonp'
					})
					.then(function (data) {
						photos = data.entries;
						nextPhoto = data.links.next;
						attachThumbs(photos);
					});
				};
		})();

		function scrollPhotos(event) {
			var $thumbs = $(event.currentTarget),
				delta = event.originalEvent.wheelDelta,
				oldMargin = parseInt($thumbs.css('margin-left')),
				newMargin = oldMargin + delta;
				if (newMargin > 0) newMargin = 0;
				if (newMargin < -thumbsLength) newMargin = -thumbsLength;
			$thumbs.css({'margin-left': newMargin + 'px'})


		}

		getNextPhotos();
		if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1)
			$('.thumbs').on('wheel', scrollPhotos);
		else $('.thumbs').on('mousewheel', scrollPhotos);
}

$(function () {
  $('.gallery').gallery();
});