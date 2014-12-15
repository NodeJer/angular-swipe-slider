
/**
*swipeSlider  Module
*
* Description
*/
angular.module('swipeSlider', ['ngTouch']).

directive('swipeSlider', ['$swipe', '$interval', function($swipe, $interval){
	return {
		scope:{
			ngModel: '=',
			controls: '='
		},
		controller: function($scope, $element, $attrs, $transclude) {
			/*
				图片数据[{
                    link: '###',
                    src: 'http://007.cnweiyan.com/shop/images/szx-banner.jpg'
                }]
			*/
			$scope.images = $scope.ngModel;
			//当前显示图片的索引值
			$scope.swipe = { index: 0 };

			//左滑动
			$scope.swipeLeft = function(){
				if($scope.swipe.index != $scope.images.length - 1){
					$scope.swipe.index++
				}
				else{
					$scope.swipe.index = $scope.images.length - 1;
				}
			}
			//右滑动
			$scope.swipeRight = function(){
				if($scope.swipe.index != 0){
					$scope.swipe.index--;
				}
				else{
					$scope.swipe.index = 0;
				}
			}
			//取消自动播放
			$scope.cancel = function(){
				this.timer && ($interval.cancel(this.timer));
			}
			//自动播放
			$scope.open = function(){
				if( $attrs.autoplay > 1000 ){
					this.timer = $interval(function(){
						if($scope.swipe.index == $scope.images.length - 1){
							$scope.swipe.index = 0;
						}
						else{
							$scope.swipe.index++
						}
					}, Math.abs($attrs.autoplay));
				}
			}
			//尝试自动播放
			$scope.open();
		},
		restrict: 'AE',
		template: '\
			<div class="swipe-slider" ng-mouseenter="cancel()" ng-mouseleave="open()">\
		        <div class="swipe-list" ng-style="{left: -swipe.index*100+\'%\'}">\
		            <a ng-href="{{i.link}}" class="item" ng-repeat="i in images">\
		                <img draggable="false" ng-src="{{i.src}}" alt="" width="100%">\
		            </a>\
		        </div>\
		        <ul class="btn-list">\
		            <li class="item" ng-class="{active: $index===swipe.index}" ng-repeat="i in images" ng-click="swipe.index=$index">\
		            </li>\
		        </ul>\
				<div class="prev" ng-show="controls && swipe.index!==0" ng-click="swipeRight()"> </div>\
				<div class="next" ng-hide="!controls || swipe.index===images.length-1" ng-click="swipeLeft()"> </div>\
		        <div ng-transclude></div>\
		    </div>',
		replace: true,
		transclude: true,
		link: function($scope, $element, $attrs, controller) {
			var transition;

			//记录css设置的transition动画
			if(controller.$swipeList[0].currentStyle){
				transition = controller.$swipeList[0].currentStyle['transition'];
			}
			else{
				transition = getComputedStyle(controller.$swipeList[0], false)['transition'];
			}
			/*
				实现拖拽效果 在end事件结束时候会根据滑动方向调用滑动方法
			*/
			if($attrs.swipe == 'false')return;

			$swipe.bind($element, {
				start: function(currentPoint, ev){
					ev.preventDefault();

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
					//恢复css transition
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
