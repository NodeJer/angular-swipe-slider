使用文档
=============
##如何使用
####需要的js
```javascript
    <script src="js/angular.min.js"></script>
    <script src="js/angular-touch.min.js"></script>
	<script src="js/angular-swipe-slider.js"></script>
```
####css
```css
    <link rel="stylesheet" href="css/reset.css">
    <link rel="stylesheet" href="css/swipe-slider.css">
```
####测试图片是在线的

##使用非常简单：
```html
    <swipe-slider ng-model="images" autoplay="0" controls="true" swipe="true"></swipe-slider>

    <button id="btn" class="block mlra mt10" style="width:-webkit-fit-content; width:fit-content;">click add image</button>
```
```javascript
    <script>
        angular.module('app', ['swipeSlider']).

        controller('swipeSliderCtrl', function($scope){
            $scope.images = [
                {
                    link: '###',
                    src: 'http://www.w3cfuns.com/data/attachment/cmplugin/W3Cfuns_Adv/portal/index/focus/201412/22/142440dy2rb2bzkw2boblk.jpg'
                },
                {
                    link: '###',
                    src: 'http://www.w3cfuns.com/data/attachment/cmplugin/W3Cfuns_Adv/portal/index/focus/201412/30/173456gagqrgl5qal2e5xx.jpg'
                },
                {
                    link: '###',
                    src: 'http://www.w3cfuns.com/data/attachment/cmplugin/W3Cfuns_Adv/portal/index/focus/201412/26/171018mxa3zbe8q6bzjvkw.jpg'
                }
            ];

            document.getElementById('btn').onclick = function(){
                var rd = $scope.images[ Math.random()*3|0 ];

                $scope.images.push( angular.copy(rd) );
                $scope.$apply();
            }
        });

    	angular.bootstrap(document.body, ['app']);
    </script>
```

#####ng-model="images" $scope.image是数据模型
#####你如果想自动播放可以加一句autoplay="3000" 3秒走一次
#####如果你想禁止滑动设置swipe="false"
#####如果你想显示隐藏控制箭头可以设置  controls="true"
   
