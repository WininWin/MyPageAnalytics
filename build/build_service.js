var FBServices = angular.module('FBServices', []);


FBServices.factory('FBapi', ['$http', '$q', '$window', '$timeout', function($http, $q, $window, $timeout){



	function feedcall(url, option){

		if(typeof FB !== 'undefined'){
			var deferred = $q.defer();
            FB.api(url, 'get', option,function(response) {
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
		getGraphApi : function(url, option){
			
			return feedcall(url, option);
		},

		getLikes : function(id){
			return getPostLikes('/' + id + "/likes?fields=total_count&summary=true", id);
		}
		// getPageCall : function(url, arr, counter, checklength){
		// 	return	loopcall(url, arr, counter, checklength);
		// },
		// promiseWhile : promiseWhile
	};
}]);
