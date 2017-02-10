/*  
 *  This file is encoded in UTF-8 without BOM!!!
 * 
 *  计算机艺术  第一次作业
 *  运行环境：支持HTML5的浏览器，Chrome、FireFox、IE10+
 *  注意：文件仅限在有效域名下访问，本地直接查看由于跨域问题将无法呈现效果
 *        如果没有本地服务器，可以查看我部署的样例：http://xsk.tehon.org/dev/zt/canvas/
 *  作者：11121675 肖世康
 */

// 黑白二值化处理，转化为灰值后大于128的作为黑，小于的作为白
function ex01() {
	var image = document.querySelector("#img1");
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext("2d");
	canvas.width = image.width;
	canvas.height = image.height;
	document.getElementById('ex01').appendChild(canvas);
	ctx.drawImage(image, 0, 0);
	for (var i = 0; i < 4; i++) {
		// 依次处理四位验证码的矩形区域
		var getDat = ctx.getImageData(13 * i + 7, 3, 9, 16);
		var pixels = getDat.data;
		for (var j = 0, length = pixels.length; j < length; j += 4) {
			// 二值化，先转化为灰色，然后处理为黑和白
			if (pixels[j] * 0.2126 + pixels[j + 1] * 0.7152 + pixels[j + 2] * 0.0722 >= 128)
				pixels[j] = pixels[j + 1] = pixels[j + 2] = 255;
			else
				pixels[j] = pixels[j + 1] = pixels[j + 2] = 0;
		}
		ctx.putImageData(getDat, 13 * i + 7, 3);
	}
}
// 利用二值化后的特征进行验证码识别
function crack() {
	// 已提取的0-9的验证码黑白特征 RGBA
	var numbers = ["111000111100000001100111001001111100001111100001111100001111100001111100001111100001111100100111001100000001111000111111111111111111111111111111",
		"111000111100000111100000111111100111111100111111100111111100111111100111111100111111100111111100111100000000100000000111111111111111111111111111",
		"100000111000000011011111001111111001111111001111110011111100111111001111110011111100111111001111111000000001000000001111111111111111111111111111",
		"100000111000000001011111001111111001111110011100000111100000011111110001111111001111111001011110001000000011100000111111111111111111111111111111",
		"111110011111100011111100011111000011110010011110010011100110011100110011000000000000000000111110011111110011111110011111111111111111111111111111",
		"000000001000000001001111111001111111001111111000001111000000011111110001111111001111111001011110001000000011100000111111111111111111111111111111",
		"111000011110000001100111101100111111001111111001000011000000001000111000001111100001111100100111000100000001111000011111111111111111111111111111",
		"100000000100000000111111100111111101111111001111110011111110111111100111111101111111001111111001111110011111110011111111111111111111111111111111",
		"110000011100000001100111001100111001100011011110000011110000011100110001001111100001111100000111000100000001110000011111111111111111111111111111",
		"110000111100000001000111001001111100001111100000111000100000000110000100111111100111111001101111001100000011110000111111111111111111111111111111"
	];
	var recResult = "";
	var image = document.querySelector("#img1");
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext("2d");
	canvas.width = image.width;
	canvas.height = image.height;
	ctx.drawImage(image, 0, 0);
	for (var i = 0; i < 4; i++) {
		var ldString = "";
		var getDat = ctx.getImageData(12 * i + 10, 5, 9, 18);
		var pixels = getDat.data;
		for (var j = 0, length = pixels.length; j < length; j += 4) {
			ldString = ldString + (+(pixels[j] * 0.3 + pixels[j + 1] * 0.59 + pixels[j + 2] * 0.11 >= 140));
		}
		var comms = numbers.map(function(value) {
			return ldString.split("").filter(function(v, index) {
				return value[index] === v;
			}).length
		});
		recResult += comms.indexOf(Math.max.apply(null, comms));
	}
	alert("识别结果：" + recResult);
}

function ex02() {
	var image = document.querySelector("#img2");
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext("2d");
	canvas.width = image.width;
	canvas.height = image.height;
	document.getElementById('ex02').appendChild(canvas);
	ctx.drawImage(image, 0, 0);
	var getDat = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var d = getDat.data;
	for (var i = 0; i < d.length; i += 4) {
		var r = d[i];
		var g = d[i + 1];
		var b = d[i + 2];
		// CIE luminance for the RGB
		// The human eye is bad at seeing red and blue, so we de-emphasize them.
		var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
		d[i] = d[i + 1] = d[i + 2] = v
	}
	ctx.putImageData(getDat, 0, 0);
}

// 亮度调整，adjustment值不同效果不同
function ex03() {
	var adjustment = 100; //可自定义增加值，加后大于255的系统视为255
	var image = document.querySelector("#img3");
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext("2d");
	canvas.width = image.width;
	canvas.height = image.height;
	document.getElementById('ex03').appendChild(canvas);
	ctx.drawImage(image, 0, 0);
	var getDat = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var d = getDat.data;
	for (var i = 0; i < d.length; i += 4) {
		d[i] += adjustment;
		d[i + 1] += adjustment;
		d[i + 2] += adjustment;
	}
	ctx.putImageData(getDat, 0, 0);
}

// 处理RGBA中的Alpha通道，这里是半透明处理
function ex04() {
	var image = document.querySelector("#img4");
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext("2d");
	canvas.width = image.width;
	canvas.height = image.height;
	document.getElementById('ex04').appendChild(canvas);
	ctx.drawImage(image, 0, 0);
	var getDat = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var d = getDat.data;
	for (var i = 3; i < d.length; i += 4) {
		d[i] = 255 / 2;
	}
	ctx.putImageData(getDat, 0, 0);
}

// 锐化
function ex05() {
	var m = [0, -1, 0, -1, 5, -1, 0, -1, 0];
	var image = document.querySelector("#img5");
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext("2d");
	canvas.width = image.width;
	canvas.height = image.height;
	document.getElementById('ex05').appendChild(canvas);
	ctx.drawImage(image, 0, 0);
	var getDat = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var output = ConvolutionMatrix(getDat, m, 1, 0);
	ctx.putImageData(output, 0, 0);
}

// 模糊
function ex06() {
	var m = [1, 1, 1, 1, 1, 1, 1, 1, 1];
	var image = document.querySelector("#img6");
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext("2d");
	canvas.width = image.width;
	canvas.height = image.height;
	document.getElementById('ex06').appendChild(canvas);
	ctx.drawImage(image, 0, 0);
	var getDat = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var output = ConvolutionMatrix(getDat, m, 9, 0);
	ctx.putImageData(output, 0, 0);
}

// 浮雕处理
function ex07() {
	var m = [-2, -1, 0, -1, 1, 1, 0, 1, 2];
	var image = document.querySelector("#img7");
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext("2d");
	canvas.width = image.width;
	canvas.height = image.height;
	document.getElementById('ex07').appendChild(canvas);
	ctx.drawImage(image, 0, 0);
	var getDat = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var output = ConvolutionMatrix(getDat, m, 1, 0);
	ctx.putImageData(output, 0, 0);
}

// 反色 255-现在颜色值
function ex08() {
	var image = document.querySelector("#img8");
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext("2d");
	canvas.width = image.width;
	canvas.height = image.height;
	document.getElementById('ex08').appendChild(canvas);
	ctx.drawImage(image, 0, 0);
	var getDat = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var d = getDat.data;
	for (var i = 0; i < d.length; i += 4) {
		d[i] = 255 - d[i];
		d[i + 1] = 255 - d[i + 1];
		d[i + 2] = 255 - d[i + 2];
	}
	ctx.putImageData(getDat, 0, 0);
}

// 横向边缘检测，为了效果更好，可以适当调整亮度
function ex09() {
	var m = [0, 0, 0, -1, 1, 0, 0, 0, 0];
	var image = document.querySelector("#img9");
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext("2d");
	canvas.width = image.width;
	canvas.height = image.height;
	document.getElementById('ex09').appendChild(canvas);
	ctx.drawImage(image, 0, 0);
	var getDat = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var output = ConvolutionMatrix(getDat, m, 1, 100);
	ctx.putImageData(output, 0, 0);
}

// 对比度增强，为了效果更好，可以适当调整亮度
function ex10() {
	var m = [0, 0, 0, 0, 2, 0, 0, 0, 0];
	var image = document.querySelector("#img10");
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext("2d");
	canvas.width = image.width;
	canvas.height = image.height;
	document.getElementById('ex10').appendChild(canvas);
	ctx.drawImage(image, 0, 0);
	var getDat = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var output = ConvolutionMatrix(getDat, m, 1, -150);
	ctx.putImageData(output, 0, 0);
}

// 索贝尔横向边缘检测
function ex11() {
	var m = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
	var image = document.querySelector("#img11");
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext("2d");
	canvas.width = image.width;
	canvas.height = image.height;
	document.getElementById('ex11').appendChild(canvas);
	ctx.drawImage(image, 0, 0);
	var getDat = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var output = ConvolutionMatrix(getDat, m, 1, 0);
	ctx.putImageData(output, 0, 0);
}

// 卷积矩阵计算
function ConvolutionMatrix(input, m, divisor, offset) {
	var output = document.createElement("canvas").getContext('2d').createImageData(input);
	var w = input.width,
		h = input.height;
	var iD = input.data,
		oD = output.data;
	// 对除了边缘的点之外的内部点的 RGB 进行操作，透明度在最后都设为 255
	for (var y = 1; y < h - 1; y += 1) {
		for (var x = 1; x < w - 1; x += 1) {
			for (var c = 0; c < 3; c += 1) {
				var i = (y * w + x) * 4 + c;
				// 卷积核计算
				oD[i] = offset + (m[0] * iD[i - w * 4 - 4] + m[1] * iD[i - w * 4] + m[2] * iD[i - w * 4 + 4] + m[3] * iD[i - 4] + m[4] * iD[i] + m[5] * iD[i + 4] + m[6] * iD[i + w * 4 - 4] + m[7] * iD[i + w * 4] + m[8] * iD[i + w * 4 + 4]) / divisor;
			}
			oD[(y * w + x) * 4 + 3] = 255; // 设置透明度为不透明
		}
	}
	return output;
}