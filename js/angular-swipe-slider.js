/**
*swipeSlider  Module
*
* Description
*/
angular.module('swipeSlider', ['ngTouch']).

directive('swipeSlider', ['$swipe', function($swipe){
	return {
		scope:{
			ngModel: '='
		},
		controller: function($scope, $element, $attrs, $transclude) {

			$scope.images = $scope.ngModel;

			$scope.swipe = { index: 0 };

			$scope.swipeLeft = function(){
				if($scope.swipe.index != $scope.images.length - 1){
					$scope.swipe.index++
				}
				else{
					$scope.swipe.index = $scope.images.length - 1;
				}
			}
			$scope.swipeRight = function(){
				if($scope.swipe.index != 0){
					$scope.swipe.index--;
				}
				else{
					$scope.swipe.index = 0;
				}
			}
			$scope.show = 123
		},
		restrict: 'AE',
		template: '\
			<div class="swipe-slider" ng-show="true">\
		        <div class="swipe-list" ng-style="{left: -swipe.index*100+\'%\'}">\
		            <a ng-href="{{i.link}}" class="item" ng-repeat="i in images">\
		                <img draggable="false" ng-src="{{i.src}}" alt="" width="100%" height=300>\
		            </a>\
		        </div>\
		        <ul class="btn-list">\
		            <li class="item" ng-class="{active: $index===swipe.index}" ng-repeat="i in images" ng-click="swipe.index=$index">\
		            </li>\
		        </ul>\
		    </div>',
		replace: true,
		link: function($scope, $element, iAttrs, controller) {
			var transition;
			
			if(controller.$swipeList[0].currentStyle){
				transition = controller.$swipeList[0].currentStyle['transition'];
			}
			else{
				transition = getComputedStyle(controller.$swipeList[0], false)['transition'];
			}

			$swipe.bind($element, {
				start: function(currentPoint, ev){
					currentPoint.offsetLeft = controller.$swipeList[0].offsetLeft;

					$element.prop('currentPoint', currentPoint);
				},
				move: function(currentPoint, ev){
					var prevPoint = $element.prop('currentPoint');

					var l = currentPoint.x - prevPoint.x+ prevPoint.offsetLeft;

					controller.$swipeList.css({
						transition: 'none',
						left: l+'px'
					});
				},
				end: function(currentPoint){
					
					controller.$swipeList.css('transition', transition);

					var prevPoint = $element.prop('currentPoint');

					var dx = currentPoint.x - prevPoint.x;

					//左滑动
					if(dx<0 && Math.abs(dx) >= 100 ){
						$scope.$apply($scope.swipeLeft);
					}
					//左滑动没有成功
					else{
						ha();
					}

					//右滑动
					if(dx>0 && Math.abs(dx) >= 100 ){
						$scope.$apply($scope.swipeRight);
					}
					//右滑动没有成功
					else{
						ha();
					}

					function ha(){
						$scope.$apply(function(){
								$scope.swipe.index--;
						});
						$scope.$apply(function(){
								$scope.swipe.index++;
						});
					}
				}
			});
		}
	};
}]).

directive('swipeList',function(){
	return {
		require: '^swipeSlider',
		restrict: 'AC', 
		link: function($scope, $element, iAttrs, controller) {
			controller.$swipeList = $element;
		}
	};
})