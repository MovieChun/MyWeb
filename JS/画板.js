
function getBodyOffsetTop(el){ 
	var top = 0; 
	do{ 
		top = top + el.offsetTop; 
	}while(el = el.offsetParent); 
	return top; 
} 

function getBodyOffsetLeft(el){ 
	var left = 0; 
	do{ 
		left = left + el.offsetLeft; 
		//offsetLeft 是一个只读属性，返回当前元素左上角相对于 offsetParent 节点的左边界偏移的像素值。
		//??貌似没什么用
	}while(el = el.offsetParent); 
	//offsetParent() 方法返回最近的祖先定位元素。
	//没看懂指的是什么
	return left; 
} 

function Drawing(canvas,options){ 
	typeof canvas == 'string' && (canvas = document.getElementById(canvas));
	//typeof 运算符把类型信息当作字符串返回，返回值有"number," "string," "boolean," "object," "function," 和 "undefined."
	//typeof() 的括号可以省略，通常用于判断变量是否存在 
	//没接收返回，这句判断由意义吗？
	if(!canvas || !canvas.getContext){ 
		throw new Error(100,'do not support canvas!'); 
	} 
	this.option = { 
		colors:['#000000','#ff0000','#00ff00','#0000ff','#00ffff','#7fef02','#4488bb'] 
		//定义颜色数组
	}; 
	//this.setOption(options); 
	//？？
	this.init(canvas); 
} 

//prototype 属性使您有能力向对象添加属性和方法。
//和前面定义图形一个道理，名字是自定义的？
Drawing.prototype = {
	//功能选择区域
	setOption:function(options){ 
		typeof options == 'object' || (options = {}); 
		for(var i in options){  //目前操作里只有一个颜色属性
			switch(i){ 
				case 'colors': 
					this.option[i] = options[i]; 
					break; 
			} 
		} 
	}, 

	//初始化
	init:function(canvas){ 
		this.canvas = canvas; 
		this.context = canvas.getContext('2d'); 
		this.context.lineWidth = 1; 
		this.context.lineJons = 'round'; 
		this.context.lineCep = 'round'; 
		this.isButtonDown = false; 
		this.historyStroker = []; 
		this.curStroker = {color:'#000000',path:[]}; 
		this.lastX = 0; 
		this.lastY = 0; 
		this.curColor = '#000000'; 
		this.toolbarspos ={}; 
		this.bindEvent(); 
		this.ResetDrawToolbar(); 
	}, 
	//事件
	bindEvent:function(){ 
		var self = this; 
		//addEventListener(event,function,useCapture)
		//event : DOM事件名，除去on
		//function : 指定要事件触发时执行的函数。
		//useCapture : true - 事件句柄在捕获阶段执行  false- 默认。事件句柄在冒泡阶段执行
		this.canvas.addEventListener('mousemove',
			function(event){ 
				var x = event.pageX-getBodyOffsetLeft(this), 
				y = event.pageY-getBodyOffsetTop(this); 
				self.onMouseMove({x:x,y:y}); 
			},
			false);

		this.canvas.addEventListener('mousedown',
			function(event){ 
				var x = event.pageX-getBodyOffsetLeft(this), 
				y = event.pageY-getBodyOffsetTop(this); 
				self.onMouseDown(event,{x:x,y:y}); 
			},
			false);

		this.canvas.addEventListener('mouseup',
			function(event){ 
				var x = event.pageX-getBodyOffsetLeft(this), 
				y = event.pageY-getBodyOffsetTop(this); 
				self.onMouseUp(event,{x:x,y:y}); 
			},
			false);

		this.canvas.addEventListener('click',
			function(event){ 
				var x = event.pageX-getBodyOffsetLeft(this), 
				y = event.pageY-getBodyOffsetTop(this); 
				self.onClick({x:x,y:y}); 
			},
			false);

	},

	onMouseMove:function(pos){ 
		if(this.isButtonDown){ 
			var p = this.toolbarspos; 
			for(var i in p){ 
				if(pos.x >= p[i].x && pos.x <= p[i].x+p[i].w && pos.y >= p[i].y && pos.y <= p[i].y+p[i].h){ 
					return; 
				} 
			} 

			this.context.lineTo(pos.x,pos.y); 
			this.context.stroke(); 
			this.lastX = pos.x; 
			this.lastY = pos.y; 
			this.curStroker.path.push(pos); 
		} 
	}, 


	onMouseDown:function(event,pos){ 
		if(event.button == 0){ 
			var p = this.toolbarspos; 
			for(var i in p){ 
				if(pos.x >= p[i].x && pos.x <= p[i].x+p[i].w && pos.y >= p[i].y && pos.y <= p[i].y+p[i].h){ 
			return; 
			} 
		} 
			this.isButtonDown = true; 
			this.lastX = pos.x; 
			this.lastY = pos.y; 
			this.context.beginPath(); 
			this.context.moveTo(this.lastX,this.lastY); 
			this.curStroker.color = this.curColor; 
			this.curStroker.path.push(pos); 
		} 
	},


	onMouseUp:function(event,pos){ 
		if(event.button == 0){ 
			var p = this.toolbarspos; 
			for(var i in p){ 
				if(pos.x >= p[i].x && pos.x <= p[i].x+p[i].w && pos.y >= p[i].y && pos.y <= p[i].y+p[i].h){ 
					return; 
				} 
			} 
			this.isButtonDown = false; 
			this.historyStroker.push(this.curStroker); 
			this.curStroker = {color:this.curColor,path:[]}; 
		} 
	}, 

	ResetDrawAll:function(){ 
		this.context.clearRect(0,0,500,500); 
		this.ResetDrawCentre(); 
		this.ResetDrawToolbar(); 
	}, 


	ResetDrawCentre:function(){ 
		var p = this.historyStroker,p2, 
		curColor = this.context.strokeStyle; 
		for(var i=0; i< p.length;i++){ 
			this.context.strokeStyle = p[i].color; 
			this.context.beginPath(); 
			for(var t=0; t<p[i].path.length;t++){ 
				p2 = p[i].path[t]; 
				if(t==0) this.context.moveTo(p2.x,p2.y); 
				this.context.lineTo(p2.x,p2.y); 
				this.context.stroke(); 
			} 
			this.context.beginPath(); 
		} 
		this.context.strokeStyle = curColor; 
	}, 


	ResetDrawToolbar:function(){ 
		var curcolor = this.context.fillStyle; 
			for(var i=0; i<this.option.colors.length;i++){ 
				this.context.fillStyle = this.option.colors[i]; 
				if(this.curColor == this.context.fillStyle){ 
					this.context.fillRect(i*35+5,2,30,20); 
					this.toolbarspos[i] ={x:i*35+5,y:2,w:30,h:20}; 
				}else{ 
					this.context.fillRect(i*35+5,5,30,20); 
					this.toolbarspos[i] = {x:i*35+5,y:5,w:30,h:20}; 
				} 
				this.context.stroke(); 
			} 
		this.context.fillStyle = curcolor; 
	},

	onClick:function(pos){ 
		var p = this.toolbarspos; 
		for(var i in p){ 
			if(pos.x >= p[i].x && pos.x <= p[i].x+p[i].w && pos.y >= p[i].y && pos.y <= p[i].y+p[i].h){ 
				this.curColor = this.option.colors[i]; 
				this.context.strokeStyle = this.curColor; 
				this.ResetDrawAll(); 
			} 
		} 
	} 
};

//在can中建立新对象，函数执行的入口
new Drawing('can');


