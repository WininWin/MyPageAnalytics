var FBServices = angular.module('FBServices', []);


FBServices.factory('FBapi', function($http, $q, $window, $timeout){



	function feedcall(url){
	
		if(typeof FB !== 'undefined'){
			var deferred = $q.defer();
            FB.api(url, function(response) {
                if (!response || response.error) {
                    deferred.reject('Error occured');
                } else {
                    deferred.resolve(response);
                }
            });
            return deferred.promise;
		}
		

		
			
	}

	function getPostLikes(url, id){
		if(typeof FB !== 'undefined'){
		var deferred = $q.defer();
            FB.api(url, function(response) {
                if (!response || response.error) {
                    deferred.reject('Error occured');
                } else {
                    deferred.resolve([response,id]);
                }
            });
            return deferred.promise;
            }

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
