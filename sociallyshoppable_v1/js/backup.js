

// Create new set of icons same problem

		// ok code
		$(document).on('touchstart', '.shared_icons >li' , function (e) {

			$(this).parent().parent().append('<ul class="shared_icon zooming">'+ $(this).parent().html() +'</ul>')


		}).on('touchend', function (e) {


			console.log('first end')



		})



	// ok code
	$(document).on('touchstart', '.shared_icon.zooming >li' , function (e) {

		console.log('second start')



	}).on('touchend', function (e) {


		console.log('second end')



	})

