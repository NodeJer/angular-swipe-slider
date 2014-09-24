var tools = {
	offset: function(element, parentWin){
		if(parentWin === window || parentWin === document){
			parentWin = document.body;
		}
		parentWin.style.position = 'relative';

		var offsetTop = element.offsetTop;
		var offsetLeft = element.offsetLeft;

		var offset = {
			top: offsetTop,
			left: offsetLeft
		};
		while(element.offsetParent && element.offsetParent !== parentWin){
			offset.top+=element.offsetParent.offsetTop;
			offset.left+=element.offsetParent.offsetLeft;
		}

		return offset;
		
	},
	isVisible: function(element, parentWin){

		var windowHeight;
		var scrollTop;

		if(parentWin.tagName === 'BODY'|| parentWin === window||parentWin === document){
			windowHeight = document.documentElement.clientHeight||document.body.clientHeight;
			scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
		}
		else{
			windowHeight = parentWin.clientHeight;
			scrollTop = parentWin.scrollTop;
		}
		

		var offset = this.offset(element, parentWin);
		
		var offsetHeight = element.offsetHeight;

		var ws = windowHeight+scrollTop;

		if(offset.top < ws && offsetHeight+offset.top > scrollTop){
			return true;
		}
		return false;
	},
	getStyle: function(obj, attr){
		var res;

		if(obj.currentStyle){
			res = obj.currentStyle[attr];
		}
		else{
			res = getComputedStyle(obj, false)[attr];
		}
		return res;
	},
	animate: function startMove(obj,json,allTime,fn,fx){
		var self = this;
		var fps = 35;
		allTime = allTime || 400;
		fx = fx || 'linear';
		var frames = Math.ceil(allTime/1000 * fps);
		var tervalTime = allTime/frames;
		var nowFrames = 1;
		
		var iCur = {};
		
		for(var attr in json){
				iCur[attr] = 0;
				
				if(attr == 'opacity'){
						  if(Math.round(parseFloat(this.getStyle(obj,attr))*100) == 0){
									 iCur[attr] = 0;
						  }
						  else{
									 iCur[attr] = Math.round(parseFloat(this.getStyle(obj,attr))*100) || 100;
						  }
				}
				else{
						  iCur[attr] = parseInt(this.getStyle(obj,attr)) || 0;
				} 
		}
		clearInterval(obj.timer);
		obj.timer = setInterval(function(){
				
				nowFrames++;
				
				if(nowFrames >= frames){
						  clearInterval(obj.timer);
						  nowFrames = frames;
						  if(fn){
							fn();	  
						}
				}
				
				for(var attr in json){
				
						  var value = self.Tween[fx]( nowFrames/frames*allTime,iCur[attr],json[attr]-iCur[attr],allTime );
						  
						  if(attr == 'opacity'){
									 
									 obj.style.filter = 'alpha(opacity='+value+')';
									 obj.style.opacity = value/100;
									 
						  }
						  else{
									 obj.style[attr] = value + 'px';
						  }
				
				}
		},tervalTime);
	},
	Tween: {
		linear: function (t, b, c, d){
			return c*t/d + b;
		},
		easeIn: function(t, b, c, d){
			return c*(t/=d)*t + b;
		},
		easeOut: function(t, b, c, d){
			return -c *(t/=d)*(t-2) + b;
		},
		easeBoth: function(t, b, c, d){
			if ((t/=d/2) < 1) {
				 return c/2*t*t + b;
			}
			return -c/2 * ((--t)*(t-2) - 1) + b;
		}
	}
};

// var res = tools.isVisible(document.images[1], window);

// alert(res)