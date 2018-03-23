$(document).ready(function(){

	/***********************************	
				DOM Caching
	***********************************/

	var $container = $('.container');
	var $header = $('header');
	var $headerInfo = $header.find('h5');
	var $foxPanel = $('#foxPanel');
	var $foxUlPanel = $foxPanel.find('.artPanel');
	var $espnPanel = $('#espnPanel');
	var $espnUlPanel = $espnPanel.find('.artPanel');
	var $nytPanel = $('#nyTimesPanel');
	var $nytUlPanel = $nytPanel.find('.artPanel');
	var $readLaterSec = $('#readLaterSec');
	var $readLaterSecUl = $readLaterSec.find('ul');
	var $playAll = $("#mini-play-all");
	var $twitterPanel = $('#twitterPanel');
	var $twitterUlPanel = $twitterPanel.find('ul');
	var $twitterBtn = $('#twitterBtn');
	


	/***********************************	
				Variables
	***********************************/

		//1. Firebase
	 var config = {
	    apiKey: "AIzaSyDocrJbz0m-o1wwQrmOPMIcwpKWGgQ16_0",
	    authDomain: "novafy-8049a.firebaseapp.com",
	    databaseURL: "https://novafy-8049a.firebaseio.com",
	    projectId: "novafy-8049a",
	    storageBucket: "novafy-8049a.appspot.com",
	    messagingSenderId: "690803384128"
	  };
	firebase.initializeApp(config);

		// Hold the database in a variable
	var db = firebase.database();
	
		// Reference the database
	var dbRef =	 db.ref();

		//2. APIs
	var foxURL = "https://newsapi.org/v2/top-headlines?sources=fox-news&apiKey=e3f5ca683b4d4dc3b83b2d824133cc6e";
	var espnURL = "https://newsapi.org/v2/top-headlines?sources=espn&apiKey=e3f5ca683b4d4dc3b83b2d824133cc6e";
	var nyTimesURL = "https://api.nytimes.com/svc/mostpopular/v2/mostviewed/World/1.json?api-key=f09c13f1ab334133b59ab848df8991cd";


	/***********************************	
				Functions
	***********************************/

		//1. Header Effect
	function yScroll() {
		yPos = window.pageYOffset;
		if(yPos > 5){
			$header.addClass('small');
			$headerInfo.addClass('small');
		}
		else {
			$header.removeClass('small');
			$headerInfo.removeClass('small');
		}
	};

		//2. Firebase: Saves articles in the Firebase database
	function readLater(e) {
		var target = $(e.target);	// Get the clicked element
		// DOM Caching 
		var rlArt = target.closest('li');
		var rlTitle = rlArt.find('.a-title');
		var rlDesc = rlArt.find('.a-desc');
		var rlUrl = rlArt.find('.a-btns a');

		var rlArtObj = {	// Create an object with the info from the article that will be saved for later reading
			title: rlTitle.text(),
			description: rlDesc.text(),
			url: rlUrl.attr('href')
		}
		
		dbRef.push(rlArtObj);	// Save to the database
	};

		// Firebase: Display saved articles in the Read Later section
	function showReadLater(snapshot){
		// Get the unique ID from the newly added child
			// To add it as a data-attr to the created element
		let childIdref = snapshot.key;
	
		// Create an HTML string with the appropiate template
		if (`${snapshot.val().url}` == '#'){	// If the URL to full story was NOT provided (Twitter doesn't provide) create this template instead
			var rlArt = `
				<li>
					<div class="article-title collapsible-header rl-a-headline">
						<div>
							<p class="a-title">${snapshot.val().title}</p>
							<i class="material-icons">arrow_drop_down</i>
						</div>
						<i class="material-icons clearArticle" data-link="${childIdref}">clear</i>
					</div>
					<div class="collapsible-body a-body">
						<span class="a-desc">${snapshot.val().description}</span>                       
					</div>
				</li>`
				$readLaterSecUl.append(rlArt);	// Display the saved article in the Read Later section
		}
		else {	//If there a URL to full story was provided create this template
			var rlArt = `
				<li>
					<div class="article-title collapsible-header rl-a-headline">
						<div>
							<p class="a-title">${snapshot.val().title}</p>
							<i class="material-icons">arrow_drop_down</i>
						</div>
						<i class="material-icons clearArticle" data-link="${childIdref}">clear</i>
					</div>
					<div class="collapsible-body a-body">
						<span class="a-desc">${snapshot.val().description}</span>
						<br>
						<div class="a-btns">
							<a href="${snapshot.val().url}" target="_blank"><button class="btn black waves-effect waves-light">Full Story</button></a>
						</div>                        
					</div>
				</li>`
				$readLaterSecUl.append(rlArt);	// Display the saved article in the Read Later section
		}
	};
		// Remove article from Firebase
	function removeArticle(e) {
		var fireId = $(e.target).attr('data-link');	// Get the data-link attr from the clicked element (X Icon), it holds Firebase unique ID created when the article was pushed to the database initially
		var removeRef = db.ref(fireId);	//  Create a reference to the database using the unique ID 
		removeRef.remove();	// Firebase method to remove the entry (article)
	}
		// Remove the article from the DOM
	function removeArtFromDOM(snapshot) {	
		var id = snapshot.key;	// Get the unique Id from the removed element from the database (that triggered the firebase event)
		var xIcon = $(`i[data-link="${id}"]`);	// Look for the X icon with the attr equals to the unique id
		var liToRemove = xIcon.closest('li').remove();	// Remove element from DOM

		Materialize.toast("Story Deleted!", 4000, 'toastStyle');	// Alert the user that the story has been removed
	}

	//function to inform user that the story has been saved.
	function informSave() {
		Materialize.toast("Story saved!", 4000, 'toastStyle'); // 4000 is the duration of the toast
	}

	// Read the page to the user
	function readIt() {
		//speak text audibly 
		var foxReadOne = $("#foxPanel").find('li[data-item="1"]').find('p').text();
		var foxReadTwo = $("#foxPanel").find('li[data-item="2"]').find('p').text();
		var foxReadThree = $("#foxPanel").find('li[data-item="3"]').find('p').text();

		var sportReadOne = $("#espnPanel").find('li[data-item="1"]').find('p').text();
		var sportReadTwo = $("#espnPanel").find('li[data-item="2"]').find('p').text();
		var sportReadThree = $("#espnPanel").find('li[data-item="3"]').find('p').text();

		var nyReadOne = $("#nyTimesPanel").find('li[data-item="1"]').find('p').text();
		var nyReadTwo = $("#nyTimesPanel").find('li[data-item="2"]').find('p').text();
		var nyReadThree = $("#nyTimesPanel").find('li[data-item="3"]').find('p').text();

		var twitterReadOne = $("#twitterPanel").find('li[data-item="1"]').find('span').text();
		var twitterReadTwo = $("#twitterPanel").find('li[data-item="2"]').find('span').text();
		var twitterReadThree = $("#twitterPanel").find('li[data-item="3"]').find('span').text();

		responsiveVoice.speak("Fox News Number One. " + foxReadOne);
		responsiveVoice.speak("Fox News Number Two. " + foxReadTwo);
		responsiveVoice.speak("Fox News Number Three. " + foxReadThree);

		responsiveVoice.speak("ESPN News Number One. " + sportReadOne);
		responsiveVoice.speak("ESPN News Number Two. " + sportReadTwo);
		responsiveVoice.speak("ESPN News Number Three. " + sportReadThree);

		responsiveVoice.speak("NYT News Number One. " + nyReadOne);
		responsiveVoice.speak("NYT News Number Two. " + nyReadTwo);
		responsiveVoice.speak("NYT News Number Three. " + nyReadThree);

		responsiveVoice.speak("Twitter News Number One. " + twitterReadOne);
		responsiveVoice.speak("Twitter News Number Two. " + twitterReadTwo);
		responsiveVoice.speak("Twitter News Number Three. " + twitterReadThree);
	};

		//3. Fox News API
	$.ajax({	// AJAX Call to the Fox News
		url: foxURL,
		method:'GET'
	}).done(function (foxRes){
		var numArts = 3;	

		for (var i = 0; i < numArts; i++){	// Loop through the response object to retrieve only the info we need (headline, summary, img url and full art url)
			var foxTitle = foxRes.articles[i].title;
			var foxDesc = foxRes.articles[i].description;
			var foxLink = foxRes.articles[i].url;
			var foxImgUrl = foxRes.articles[i].urlToImage;
			
			// Working with the imgUrl to format it correctly
			// Find the parameters "?"
			var paramIndex = foxImgUrl.indexOf("?");
			// Remove everything after the "?"
			var slicedUrlStr = foxImgUrl.slice(0 , paramIndex);

			// HTML string to create panel with the info from the Fox News response
			var foxCard = `
				<li data-item="${i+1}">
					<div class="article-title collapsible-header a-headline">
						<div class="logo"></div>
						<p class="a-title">${foxTitle}</p>
						<i class="material-icons">arrow_drop_down</i>
					</div>
					<div class="collapsible-body a-body">
						<span class="a-desc">${foxDesc}</span>
						<img src="http:${slicedUrlStr}" class="responsive-img" alt="Picture for article">
						<br>
						<div class="a-btns">
							<button class="readLater btn teal waves-effect waves-light">Read Later</button>
							<a href="${foxLink}" target="_blank"><button class="btn black waves-effect waves-light">Full Story</button></a>
						</div>                        
					</div>
				</li>`;
			
			// Append HTML string to the panel
			$foxUlPanel.append(foxCard);
		}
	});

		//4. ESPN API
	$.ajax({
		url: espnURL,
		method:'GET'
	}).done(function (espnRes){
		var articleNumber = 3;	// Filter number of articles to display to user

		for (var i = 0; i < articleNumber; i++){	// Loop through the response object to retrieve only the info we need (headline, summary, img url and full art url)
			var espnTitle = espnRes.articles[i].title;
			var espnDesc = espnRes.articles[i].description;
			var espnLink = espnRes.articles[i].url;
			var espnImgURL = espnRes.articles[i].urlToImage;

			// HTML string to create panel with the info from the Fox News response
			var espnCard = `
				<li data-item="${i+1}">
					<div class="article-title collapsible-header a-headline">
						<div class="logo"></div>
						<p class="a-title">${espnTitle}</p>
						<i class="material-icons">arrow_drop_down</i>
					</div>
					<div class="collapsible-body a-body">
						<span class="a-desc">${espnDesc}</span>
						<img src="${espnImgURL}" class="responsive-img" alt="Picture for article">
						<br>
						<div class="a-btns">
							<button class="readLater btn teal waves-effect waves-light">Read Later</button>
							<a href="${espnLink}" target="_blank"><button class="btn black waves-effect waves-light">Full Story</button></a>
						</div>                        
					</div>
				</li>`;

			// Append HTML string to the panel
			$espnUlPanel.append(espnCard);
		};
	});

		//5. NY Times API
	$.ajax({
		  url: nyTimesURL,
		  method: 'GET',
		}).done(function (nytRes) {
		
			var numArt = 3;	// Filter number of articles to display to user

			for (var i = 0; i < numArt; i++) {	// Loop through the nytRes object to retrieve only the info we need (headline, summary, img url and full art url)
				var nytTitle = nytRes.results[i].title;
				var nytDesc = nytRes.results[i].abstract;
				var nytLink = nytRes.results[i].url;

				var nytCard = `
					<li data-item="${i+1}">
						<div class="article-title collapsible-header a-headline">
							<div class="logo"></div>
							<p class="a-title">${nytTitle}</p>
							<i class="material-icons">arrow_drop_down</i>
						</div>
						<div class="collapsible-body a-body">
							<span class="a-desc">${nytDesc}</span>
							<img src="" class="responsive-img" alt="">
							<br>
							<div class="a-btns">
								<button class="readLater btn teal waves-effect waves-light">Read Later</button>
								<a href="${nytLink}" target="_blank"><button class="btn black waves-effect waves-light">Full Story</button></a>
							</div>                        
						</div>
					</li>`;
				$nytUlPanel.append(nytCard);	// Append HTML string to the panel
			}
		}).fail(function (err) {
		  throw err;
		});

			// 6. Twitter API
		$.ajax({
			url: "/givemeTweet",
			method: 'GET',
		}).done(function (tweetRes) {
			var numArt = 3;	// Filter number of articles to display to user


			for(var i = 0; i < numArt; i++){ // Loop through the nytRes object to retrieve only the info we need (headline, summary, img url and full art url)
				// Create an HTML String
				var tweetStr = `
				<li data-item="${i+1}">
					<div class="article-title collapsible-header a-headline">
						<div class="logo"></div>
						<p class="a-title">Twitter ${[i+1]}</p>
						<i class="material-icons">arrow_drop_down</i>
					</div>
					<div class="collapsible-body a-body">
						<span class="a-desc">${tweetRes[i]}</span>
						<br>
						<div class="a-btns">
							<button class="readLater btn teal waves-effect waves-light">Read Later</button>
							<a href="#"></a>
						</div> 
					</div>
				</li>`
				// Append it to the page
				$twitterUlPanel.append(tweetStr);
			}
		});

	/***********************************	
				Event Binding
	***********************************/

	// Listen for clicks in the Read Later button (user wants to save an article)
	$container.on('click', 'button.readLater', readLater);

	//Inform the user that the story has been saved
	$container.on('click', 'button.readLater', informSave);

	// Firebase: Listen for articles added to the database
	dbRef.on("child_added", showReadLater);

	// Event listener for scrolls using plain JS (to trigger header effect)
	window.addEventListener('scroll', yScroll);

	//read page button
	$playAll.on('click', readIt);

	// Remove Saved Article from Firebase Database
	$readLaterSecUl.on('click', '.clearArticle', removeArticle);

	// Remove Saved Article from the HTML
	dbRef.on('child_removed', removeArtFromDOM);

});