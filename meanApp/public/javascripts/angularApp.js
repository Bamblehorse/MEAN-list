// Wrap in immediate function for use strict to only affect this file
(function() {
	'use strict';

	var app = angular.module('meanApp', ['ui.router']);

	app.factory('items', ['$http', function($http){
		var o = {
      items: [],
		increaseUpvotes : function(item) {
			o.upVote(item);
		},
		decreaseUpvotes : function(item) {
			o.downVote(item);
		},
		getAll : function() {
			return $http.get('/items').success(function(data) {
				angular.copy(data, o.items);
			});
		},
		create : function(item) {
			return $http.post('/items', item).success(function(data) {
				o.items.push(data);
			});
		},
		upVote : function(item) {
			if (item.item) {
				return $http.put('/items/' + item.item + '/comments/' + item._id + '/upvote')
					.success(function(data) {
						item.upvotes += 1;
					});
			} else {
			return $http.put('/items/' + item._id + '/upvote')
				.success(function(data) {
					item.upvotes += 1;
				});
			}
		},
		downVote : function(item) {
			if (item.item) {
				return $http.put('/items/' + item.item + '/comments/' + item._id + '/downvote')
					.success(function(data) {
						item.upvotes -= 1;
					});
			} else {
			return $http.put('/items/' + item._id + '/downvote')
				.success(function(data) {
					item.upvotes -= 1;
				});
			}
		},
		get : function(id) {
			return $http.get('/items/' + id).then(function(res) {
				return res.data;
			});
		},
		addComment : function(id, comment) {
			return $http.post('/items/' + id + '/comments', comment);
		},

	};
		return o;
	}]);

	app.controller('MainCtrl', [
	'$scope',
	'items',
	function($scope, items) {
		$scope.items = items.items;
		$scope.i = items;
		$scope.addItem = function() {
			if (!$scope.title || $scope.title === '') { return; }
			items.create({
				title: $scope.title,
				link: $scope.link,
				upvotes: 0,
				comments: [
				]
			});
			$scope.title = '';
			$scope.link = '';
		};
	}]);

	app.controller('ItemsCtrl', [
	'$scope',
	'items',
	'item',
	function($scope, items, item) {
		$scope.i = items;
		$scope.item = item;
		$scope.addComment = function() {
			if ($scope.body === '') { return; }
			if ($scope.user === '') {$scope.user = 'Anonymous';}
			items.addComment(item._id, {
				body: $scope.body,
				author: $scope.user,
				upvotes: 0
			}).success(function(comment) {
				$scope.item.comments.push(comment);
			});
			$scope.body = '';
			$scope.user = '';
		};
	}]);

	app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

	  $stateProvider
	    .state('home', {
	      url: '/home',
	      templateUrl: '/home.html',
	      controller: 'MainCtrl',
	      resolve: {
	      	itemPromise: ['items', function(items) {
	      		return items.getAll();
	      	}]
	      }
	    })

	    .state('items', {
	    	url: '/items/{id}',
	    	templateUrl: '/items.html',
	    	controller: 'ItemsCtrl',
	    	resolve: {
	    		item: ['$stateParams', 'items', function($stateParams, items) {
	    			return items.get($stateParams.id);
	    		}]
	    	}
	    });

	  $urlRouterProvider.otherwise('home');
	}]);

}());