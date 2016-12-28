var FBServices = angular.module('FBServices', []);


FBServices.factory('FBapi', function($http, $q, $window){

	//var myfeed;

	//future use 
	// var promiseWhile = function(condition, action) {
	//     var resolver = Promise.defer();

	//     var loop = function() {
	//         if (!condition()) return resolver.resolve();
	//         return Promise.cast(action())
	//             .then(loop)
	//             .catch(resolver.reject);
	//     };

	//     process.nextTick(loop);

	//     return resolver.promise;
	// };

	// function loopcall(url, arr, counter, checklength){
	// 	return new Promise(function(resolve, reject) {

	// 		$window.setTimeout(
	// 			function(){
	// 				if(typeof FB !== 'undefined'){
	// 					FB.api(url, function(response) {
	// 						if(response.data.length	!== 0){
	// 							counter++;
	// 							arr = arr.concat(response.data);
	// 							url = response.paging.next;
	// 							resolve();
	// 						}
	// 						else{
	// 							checklength = false;
	// 							resolve();
	// 						}
							
	// 					});
	// 					}

	// 					else{
	// 						reject(Error('There was a network error.'));
	// 					}
	// 			},600)

	// 	});

	// }

	function feedcall(url){


		return new Promise(function(resolve, reject) {

			$window.setTimeout(
				function(){
					if(typeof FB !== 'undefined'){
						FB.api(url, function(response) {
							resolve(response);
						});
						}

						else{
							reject(Error('There was a network error.'));
						}
				},600)

		});

		
			
	}

	function getPostLikes(url, id){
		return new Promise(function(resolve, reject) {
			$window.setTimeout(
				function(){
					if(typeof FB !== 'undefined'){
						FB.api(url, function(response) {

							resolve([response, id]);
						});
						}

						else{
							reject(Error('There was a network error.'));
						}
				},600)

		});
	}




	return {
		getGraphApi : function(url){
			
			return feedcall(url);
		},

		getLikes : function(id){
			return getPostLikes('/' + id + "/likes?fields=total_count&summary=true", id);
		}
		// getPageCall : function(url, arr, counter, checklength){
		// 	return	loopcall(url, arr, counter, checklength);
		// },
		// promiseWhile : promiseWhile
	};
});
