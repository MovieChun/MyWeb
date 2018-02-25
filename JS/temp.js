
var  printf = function (str) {
	document.getElementById('result').innerHTML = "输出结果:" + str;
};

document.getElementById('button1').onclick = function (){
	var f = document.getElementById('InStr').value;
	//printf(f);
	//alert(f);  //弹窗显示，需要点击确定才会往下执行
	//document.write('<button> B1 </button>');

	var D1 = document.getElementById('D1');
	D1.innerHTML += '<p>增加一行</p>';

};

document.getElementById('button2').onclick = function (){
	//var f = document.getElementById('InStr').value;
	//printf(f);
	//alter(f);
	//document.write('<button> B1 </button>');

	var D1 = document.getElementById('D1');
	D1.innerHTML = '';

};