var FBServices = angular.module('FBServices', []);


FBServices.factory('FBapi', function($http, $q, $window){

	var myfeed;

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
				},300)

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
				},300)

		});
	}




	return {
		getGraphApi : function(url){
			
			return feedcall(url);
		},

		getLikes : function(id){
			return getPostLikes('/' + id + "/likes?fields=total_count&summary=true", id);
		}
	};
});
