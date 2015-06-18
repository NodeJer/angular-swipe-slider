(function() {
    var slider = angular.module('slider', ['ngTouch']);

    slider.service('$slider', function(){
        this.getStyle = function(obj, name) {
            if (obj.currentStyle) {
                return obj.currentStyle[name];
            } else {
                return getComputedStyle(obj, false)[name];
            }
        }
        this.isMobile = function (){
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);   
        }
        this.getTemplate = function(){
            return '<div class="ng-slider" ng-mouseenter="cancel()" ng-mouseleave="open()">\
                        <div class="ng-slider-list" ng-transclude ng-style="style"></div>\
                        <ul class="ng-slider-btn-list" ng-if="panes.length > 1">\
                            <li class="item" ng-class="{active: selectedPane===o}" ng-click="select(o)" ng-repeat="o in panes"></li>\
                        </ul>\
                    </div>';
        }
    });

    slider.directive('slider', ['$interval', '$swipe', '$timeout', '$document', '$slider',
        function($interval, $swipe, $timeout, $document, $slider) {
            return {
                scope: {},
                controller: function($scope, $element, $attrs, $transclude) {
                    var self = this;
                    var panes = $scope.panes = [];
                    var timer = null;
                    var style = $scope.style = {};

                    $scope.select = function(pane, swipe) {
                        if($slider.isMobile() && !swipe)return;

                        var x = -pane.index * $element[0].offsetWidth + 'px';

                        if (!$slider.isMobile()) {
                            style.left = x;
                            style.position = 'relative';
                        } else {
                            style.webkitTransform = 'translate(' + x + ')';
                        }

                        $scope.selectedPane = pane;
                    }

                    $slider.getController = function(){
                        return self;
                    }

                    this.getScope = function(){
                        return $scope;
                    }
                    this.addPane = function(pane) {
                        pane.index = panes.length;

                        if (panes.length == 0) $scope.select(pane, true);

                        panes.push(pane);
                    }
                    this.swipe = function(num) {
                        var nextPane = panes[$scope.selectedPane.index + num];

                        if (nextPane) {
                            $scope.select(nextPane, true);
                        } else {
                            return false;
                        }
                    }
                        //取消自动播放
                    $scope.cancel = function() {
                        timer && ($interval.cancel(timer));
                    }
                        //自动播放
                    $scope.open = function() {
                        $scope.cancel();

                        if ($attrs.autoplay > 1000) {
                            timer = $interval(function() {
                                if ($scope.selectedPane.index === panes.length - 1) {
                                    self.swipe(-(panes.length - 1));
                                } else {
                                    self.swipe(1);
                                }
                            }, Math.abs($attrs.autoplay));
                        }
                    }
                        //尝试自动播放
                    $scope.open();
                },
                restrict: 'AE',
                template: $slider.getTemplate(),
                replace: true,
                transclude: true,
                link: function($scope, $element, $attrs, controller) {
                    $document.on('scroll', function() {
                        if ($attrs.autoplay > 1000) {
                            $scope.cancel();

                            setTimeout(function() {
                                $scope.open();
                            }, 1000);
                        }
                    });
                    angular.element(window).on('resize', function(){
                        $scope.$apply(function(){
                            $scope.select($scope.selectedPane, true);
                        });
                    });

                    if (!$slider.isMobile() || $scope.panes.length <= 1) return;

                    var translate = 0,
                        list = $element[0].firstElementChild,
                        prevPoint,
                        transition = $slider.getStyle(list, 'transition');

                    $swipe.bind($element, {
                        start: function(currentPoint, ev) {

                            prevPoint = currentPoint;
                            translate = list.style.webkitTransform.match(/-\d+|\d+/)[0] | 0;

                            list.style.transition = 'none';
                        },
                        move: function(currentPoint, ev) {

                            var l = (currentPoint.x - prevPoint.x + translate) + 'px';

                            list.style.webkitTransform = 'translate(' + l + ')';

                            ev.preventDefault();
                        },
                        end: function(currentPoint, ev) {

                            list.style.transition = transition;

                            var dx = currentPoint.x - prevPoint.x;
                            var num;

                            if (dx === 0) return;

                            //左滑动
                            else if (dx < 0) {
                                if (Math.abs(dx) >= 100) {
                                    num = 1;

                                } else {
                                    reset();
                                }
                            }
                            //右滑动
                            else if (dx > 0) {
                                if (Math.abs(dx) >= 100) {
                                    num = -1;
                                } else {
                                    reset();
                                }
                            }
                            $scope.$apply(function() {
                                if (!controller.swipe(num)) {
                                   reset();
                                }
                            });
                        }
                    });

                    function reset(){
                        list.style.webkitTransform = $scope.style.webkitTransform;
                    }
                }
            };
        }
    ]);

    slider.directive('sliderPane', function() {
        return {
            scope: {},
            require: '^?slider',
            restrict: 'AE',
            transclude: true,
            replace: true,
            template: '<div class="item" ng-transclude></div>',
            link: function($scope, $element, iAttrs, slideController) {
                if (!slideController) return;

                slideController.addPane($scope);
            }
        };
    });

})();
