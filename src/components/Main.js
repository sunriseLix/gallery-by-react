require('normalize.css/normalize.css');
require('styles/App.css');


import React from 'react';

/*//获取图片相关数据
var imageDatas = require('../sources/imageData.json');
//let yeomanImage = require('../images/yeoman.png');

//利用自执行函数，将图片名信息转成图片URL途径信息
imageDatas = (function genImageURL(imageDataArr) {
	for (let i = 0, j = imageDataArr.length; i < j; i++) {
		let singleImageData = imageDataArr[i];
		singleImageData.imageURL = require('../images' + singleImageData.fileName);
		imageDataArr[i] = singleImageData;
	}
	return imageDataArr;
})(imageDatas);*/
//imageDatas = genImageURL(imageDatas);



class AppComponent extends React.Component {
	render() {
		return (
			<section className="stage">
				<section className="img-sec">
				eweqweqwssdfds
				</section>
				<nav className="controller-nav">
				</nav>
			</section>
		);
	}
}

AppComponent.defaultProps = {};

export default AppComponent;