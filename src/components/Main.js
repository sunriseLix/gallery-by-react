'use strict';

//css
require('normalize.css/normalize.css');
require('styles/App.css');

//引入react
import React from 'react';
import ReactDOM from 'react-dom';

//获取图片相关数据
var imageDatas = require('../sources/imageData.json');

//利用自执行函数，将图片名信息转成图片URL途径信息
imageDatas = (function genImageURL(imageDataArr) {
	for (var i = 0, j = imageDataArr.length; i < j; i++) {
		var singleImageData = imageDataArr[i];
		singleImageData.imageURL = require('../images/' + singleImageData.fileName);
		imageDataArr[i] = singleImageData;
	}
	return imageDataArr;
})(imageDatas);
//imageDatas = genImageURL(imageDatas);
/*
 *获取区间内的一个随机值
 */
function getRangeRandom(low, high) {
	return Math.ceil(Math.random() * (high - low) + low);
}

/*
 *获取0～30任意旋转
 */
function get30DegRandom() {
	return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
}


//图片组件
var ImgFigure = React.createClass({
	/*
	 *imgFigure的点击处理函数
	 */
	handleClick: function(event) {
		event.stopPropagation();
		event.preventDefault();

		if (this.props.arrange.isCenter) {
			this.props.inverse();
		} else {
			this.props.center();
		}

	},

	render: function() {
		var styleObj = {};
		//如果props属性中指定了位置就使用
		if (this.props.arrange.pos) {
			styleObj = this.props.arrange.pos;
		}
		//如果图片的旋转角度有值并且不为0，添加旋转角度
		if (this.props.arrange.rotate) {
			var fixedArr = ['Moz', 'ms', 'Webkit', ''];
			fixedArr.forEach(function(value) {
				styleObj[value + 'Transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
			}.bind(this));

		}
		if (this.props.arrange.isCenter) {
			styleObj.zIndex = 11;
		}
		var imgFigureClassName = 'img-figure';
		imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

		return (
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
				<img src={this.props.data.imageURL} alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
					<div className="img-back" onClick={this.handleClick}>
						<p>
							{this.props.data.disc}
						</p>
					</div>
				</figcaption>
			</figure>

		)
	}

});
// 控制组件
var ControllerUnit = React.createClass({
	handleClick: function(event) {
		event.stopPropagation();
		event.preventDefault();
		//如果点击的是当前正在选中态的按钮，则翻转图片。否则将对应的图片居中
		if (this.props.arrange.isCenter) {
			this.props.inverse();
		} else {
			this.props.center();
		}

	},
	render: function() {
		var controllerUnitClassName = 'controller-unit';
		//如果对应的是居中的图片，显示控制按钮的居中态
		if (this.props.arrange.isCenter) {
			controllerUnitClassName += ' is-center';

			// 如果同时对应的是翻转图片， 显示控制按钮的翻转态
			if (this.props.arrange.isInverse) {
				controllerUnitClassName += 'is-inverse';
			}
		}
		return (
			<span className={controllerUnitClassName} onClick={this.handleClick}></span>
		);
	}
});

//最外层控制
var AppComponent = React.createClass({
	//变量初始化
	Constant: {
		centerPos: {
			left: 0,
			right: 0
		}, //中心图片位置
		hPosRange: {
			leftSecx: [0, 0],
			rightSecx: [0, 0],
			y: [0, 0]
		}, //水平方向的取值范围
		vPosRange: {
			x: [0, 0],
			topY: [0, 0]
		} //垂直方向的取值范围
	},
	//初始化状态
	getInitialState: function() {
		return {
			imgsArrangeArr: [
				// pos: {
				// 	left: "0",
				// 	top: "0",
				// }, //状态对象
				// rotate:0,       //旋转角度
				// isInverse:false, //图片正反面
				// isCenter:false,
			]
		}
	},
	/*
	＊利用rearRange函数，居中对应的index的图片
	＊@param index ,需要被居中的图片对应的图片信息数组的index值
	*return {Function}
	*/

	center: function(index) {
		return function() {
			this.rearRange(index);
		}.bind(this);
	},
	/*
	＊翻转图片
	＊@param index输入当前被执行inverse操作的图片对应的图片信息数组的index值
	＊@return {Function} 是一个闭包函数，其内return一个真正待被执行的函数
	*/
	inverse: function(index) {
		return function() {
			var imgsArrangeArr = this.state.imgsArrangeArr;
			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
			this.setState({
				imgsArrangeArr: imgsArrangeArr
			});
		}.bind(this);
	},

	/*
	 *重新布局所有图片
	 *@param centerIndex 指定居中排布哪个图片
	 */
	rearRange: function(centerIndex) {
		var imgsArrangeArr = this.state.imgsArrangeArr,
			Constant = this.Constant,
			centerPos = Constant.centerPos,
			hPosRange = Constant.hPosRange,
			vPosRange = Constant.vPosRange,
			hPosRangeLeftSecx = hPosRange.leftSecx,
			hPosRangeRightSecx = hPosRange.rightSecx,
			hPosRangeY = hPosRange.y,
			vPosRangeTopY = vPosRange.topY,
			vPosRangeX = vPosRange.x,

			imgsArrangeTopArr = [],
			topImgNum = Math.floor(Math.random() * 2), //取一个或者不取
			topImgSpliceIndex = 0,

			imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
		//首先居中centerIndex 的图片
		imgsArrangeCenterArr[0] = {
			pos: centerPos,
			rotate: 0,
			//居中的centerIndex 的图片不需要旋转
			isCenter: true
		}


		//取出要布局上侧的图片的状态信息
		topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));

		imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

		//布局位于上侧的图片
		imgsArrangeTopArr.forEach(function(value, index) {
			imgsArrangeTopArr[index] = {
				pos: {
					top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
					left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
				},
				rotate: get30DegRandom(),
				isCenter: false

			};
		});
		//布局左右两侧的图片
		for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
			var hPosRangeLorX = null;

			//	前半部分布局左边，右半部分布局右边
			if (i < k) {
				hPosRangeLorX = hPosRangeLeftSecx;
			} else {
				hPosRangeLorX = hPosRangeRightSecx;
			}

			imgsArrangeArr[i] = {

				pos: {
					top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
					left: getRangeRandom(hPosRangeLorX[0], hPosRangeLorX[1])
				},
				rotate: get30DegRandom(),
				isCenter: false
			}
		}
		// debugger;
		if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
			imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
		}
		imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
		this.setState({
			imgsArrangeArr: imgsArrangeArr
		})
	},
	//组件加载以后，为每张图片计算其位置的范围
	componentDidMount: function() {
		//首先拿到舞台的大小
		var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
			halfStageW = Math.ceil(stageW / 2),
			halfStageH = Math.ceil(stageH / 2);
		//拿到一个imgFigure的大小
		var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
			imgW = imgFigureDOM.scrollWidth,
			imgH = imgFigureDOM.scrollHeight,
			halfImgW = Math.ceil(imgW / 2),
			halfImgH = Math.ceil(imgH / 2);
		//计算中心图片的位置点
		this.Constant.centerPos = {
				left: halfStageW - halfImgW,
				top: halfStageH - halfImgH
			}
			//计算左侧、右侧区域图片排布位置的取值范围
		this.Constant.hPosRange.leftSecx[0] = -halfImgW;
		this.Constant.hPosRange.leftSecx[1] = halfStageW - halfImgW * 3;
		this.Constant.hPosRange.rightSecx[0] = halfStageW + halfImgW;
		this.Constant.hPosRange.rightSecx[1] = stageW - halfImgW;
		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH - halfImgH;
		//计算上侧区域图片排布位置的取值范围
		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
		this.Constant.vPosRange.x[0] = halfStageW - imgW;
		this.Constant.vPosRange.x[1] = halfStageW;

		this.rearRange(0);
	},

	render: function() {
		var controllerUnits = [],
			imgFigures = [];

		imageDatas.forEach(function(value, index) {
			if (!this.state.imgsArrangeArr[index]) {
				this.state.imgsArrangeArr[index] = {
					pos: {
						left: 0,
						top: 0
					},
					rotate: 0,
					isInverse: false,
					isCenter: false
				}
			} //初始化状态对象

			imgFigures.push(<ImgFigure data={value} key={index} ref={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
			controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
		}.bind(this));



		return (
			<section className="stage" ref="stage">
				<section className="img-sec">
				   {imgFigures}
				</section>
				<nav className="controller-nav">
					{controllerUnits}
				</nav>
			</section>
		);
	}
})


export default AppComponent;