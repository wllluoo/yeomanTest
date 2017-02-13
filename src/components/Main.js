require('normalize.css/normalize.css');
require('styles/App.css');
require('styles/main.scss');

import React from 'react';

// let yeomanImage = require('../images/yeoman.png');
//载入图片相关信息
let imageDatas=require('../data/imageDatas.json');
//获取图片的路径
imageDatas=(function getImageUrl(arr)
{
	for(var i=0,j=arr.length;i<j;i++)
	{
		var singleImageData=arr[i];
		singleImageData.imageURL=require('../images/'+singleImageData.fileName);
		arr[i]=singleImageData;
	}
	return arr;
})(imageDatas);

// var ImgFigure=React.createClass({
class ImgFigure extends React.Component {
	constructor(props) {
	    super(props);
	    this.handleClick = this.handleClick.bind(this);
	}
	//猜错啦骚年
	wrong()
	{

	}
	//点击旋转图片
	handleClick(e)
	{
		if(this.props.arrange.isCenter)
		{
			//判断是否猜对了
			// console.log(this.props.data.bingo);
   //    		if(this.props.data.bingo)
   //    		{
			// 	bingo();
   //    		}
   //    		else
   //    		{
   //    			wrong();
   //    		}
			this.props.inverse();
		}
		else
		{
			this.props.center();
		}
		e.stopPropagation();
   		e.preventDefault();
	}
	render(){
		var styleObj={};
		if(this.props.arrange.pos){
			styleObj = this.props.arrange.pos;
		}
		//图片旋转的角度设置
		if(this.props.arrange.rotate)
		{
			['MozTransform','msTransform','WebkitTransform','transform'].forEach(function(value){
				styleObj[value]='rotate('+this.props.arrange.rotate+'deg)';
			}.bind(this));
			
		}
		//添加z-index 避免遮盖
	    if(this.props.arrange.isCenter){
	      styleObj.zIndex = 11;
	    } else {
	      styleObj.zIndex = 0;
	    }	
		var igmFigureClassName='img-figure';
		igmFigureClassName+=this.props.arrange.isInverse?' is-inverse':'';
		var wrongClassName="wrong";
		wrongClassName+=this.props.data.bingo?' hiddenClassName':'';
		var bingoClassName="bingo";
		bingoClassName+=this.props.data.bingo?'':' hiddenClassName';
		
		return (
			<figure className={igmFigureClassName} ref ='figure' style={styleObj} onClick={this.handleClick}>
				<img src={this.props.data.imageURL} alt={this.props.data.title} />
				<figcaption>
					<h2 className="img-title"> {this.props.data.title}</h2>
					<div className='img-back'>
						<p>
							{this.props.data.desc}
						</p>
					</div>
				</figcaption>
				 <span className='suprise'>
					<span className={wrongClassName}><img src='../images/wrong.png'/></span>
					<span className={bingoClassName}>
						<img src='../images/star1.png' />
						<img src='../images/star2.png' />
						<img src='../images/star1.png' />
						<img src='../images/star2.png' />
					</span>	
				</span> 
			</figure>
		)
	}
};

/*
 * 获取区间内随机值
 */
function getRangeRandom(low, high) {
  return Math.ceil(Math.random() * (high - low) + low);
}
/*
* 控制旋转角度区间
*/
function getDegRandom() {
	var baseR=30;
	var mr=Math.random();
   return ((mr>0.5?'':'-')+Math.ceil(mr*baseR));
}
//控制组件
class ControllerUnit extends React.Component{
	// constructor(props){
	// 	super(props);
	// 	this.handleClick = this.handleClick.bind(this);
	// }
	handleClick(e)
	{
		if(this.props.arrange.isCenter)
		{
			this.props.inverse();
		}else
		{
			this.props.center();

		}
		e.stopPropagation();
   		e.preventDefault();		
	}
	render(){
		var controllerClassName='controller-unit';

		if(this.props.arrange.isCenter)
		{
			controllerClassName+=' is-center';
		}
		if(this.props.arrange.isInverse)
		{
			controllerClassName+=' is-inverse';

		}
		return (
			<span className={controllerClassName} onClick={this.handleClick.bind(this)}></span>
		)
	}
}

class AppComponent extends React.Component {
	constructor(props){
		super(props);
		this.Constant = { //常量的key ？
	        centerPos: {
	          left: 0,
	          right: 0
	        },
	        hPosRange: { //水平方向取值范围
	          leftSecX: [0, 0],
	          rightSecX: [0, 0],
	          y: [0, 0]
	        },
	        vPosRange: { //垂直方向取值范围
	          x: [0, 0],
	          topY: [0, 0]
	        }
	      };
	     this.state={
	     	imgsArrangeArr:[
	     	/*
	          {
	            pos: {
	              left: 0,
	              right: 0
	            },
	            rotate: 0,
	            isInverse: false //图片正反面
	          },
	          isCenter:false //图片默认不居中
	          */	
	     	]
	     }
	  }
	 /*
   * 重新布局图片，传入居中的index
   */
  rearrange(centerIndex) {
    var imgsArrangeArr = this.state.imgsArrangeArr,
      Constant = this.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,

      imgsArrangeTopArr = [],
      //上侧图片的数值，可有可无。0或者1
      topImgNum = Math.floor(Math.random() * 2),
      //上侧图片是从哪个位置拿出来的
      topImgSpliceIndex = 0,
      //中心图片的状态信息
      imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
      //居中 centerIndex
      imgsArrangeCenterArr[0] ={
        pos: centerPos,
        rotate : 0,
        isCenter: true,
      }

    //取出要布局上侧图片的状态信息
    topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

    //布局上侧图片
    imgsArrangeTopArr.forEach(function (value, index) {
      imgsArrangeTopArr[index] = {
        pos :{
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
        rotate:getDegRandom(),
        isCenter: false,
      }
    });
    //布局左右两侧的图片
    for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
      var hPosRangeLORX = null; //左区域或者右区域的取值范围

      //前半部分布局左边，右半部分布局右边
      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX;
      } else {
        hPosRangeLORX = hPosRangeRightSecX;
      }
      imgsArrangeArr[i] ={
        pos : {
          top: getRangeRandom(hPosRange.y[0], hPosRange.y[1]),
          left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        },
        rotate:getDegRandom(),
        isCenter:false
      };
    }

    //把取出来的图片放回去
    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
    }
    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
    this.setState({
      imgsArrangeArr: imgsArrangeArr
    });
  }
      //重新布局所以图片
      componentDidMount(){
      	var stageDOM = this.refs.stage,stageW = stageDOM.scrollWidth,stageH = stageDOM.scrollHeight,
 		halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);
        //取第一张图片的大小
        var imgFigureDom=this.refs.imgFigure0.refs.figure;
        var imgW = imgFigureDom.scrollWidth,
        imgH = imgFigureDom.scrollHeight,
        halfImgW = Math.ceil(imgW / 2),
        halfImgH = Math.ceil(imgH / 2);
        //计算中心图片的位置点
		this.Constant.centerPos = {
	        left: halfStageW - halfImgW,
	        top: halfStageH - halfImgH
	      };
	    //水平方向取值
	      this.Constant.hPosRange.leftSecX[0] = -halfImgW;
	      this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
	      this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
	      this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
	      this.Constant.hPosRange.y[0] = -halfImgH;
	      this.Constant.hPosRange.y[1] = stageH - halfImgH;
    	 //计算上侧，图片位置的取值范围
	      this.Constant.vPosRange.topY[0] = -halfImgH;
	      this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
	      this.Constant.vPosRange.x[0] = halfStageW - imgW;
	      this.Constant.vPosRange.x[1] = halfStageW;		      
      	  this.rearrange(0);
        	
      }
      //翻转函数
      inverse(index){
      	return function()
      	{
      		var imgsArrangeArr=this.state.imgsArrangeArr;
      		imgsArrangeArr[index].isInverse=!imgsArrangeArr[index].isInverse;
      		
      		this.setState({
      			imgsArrangeArr:imgsArrangeArr,
      		});
      	}.bind(this)
      };
      //将点击的图片放置在中间
      center(index)
      {
      	return function()
      	{
      		this.rearrange(index);
      	}.bind(this);
      }
  render() {
  	var controllerUnits=[];
  	var imgFigures=[];
  	imageDatas.forEach(function(value,index){
  		if(!this.state.imgsArrangeArr[index])
  		{
  			this.state.imgsArrangeArr[index]={
  				
		            pos: {
		              left: 0,
              			top: 0
		            },
		            rotate: 0,
		            isInverse: false ,//图片正反面
		          	isCenter:false //图片默认不居中
	  			}
  		}
  		imgFigures.push(<ImgFigure key={index} data={value} ref={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index]} 
  			inverse={this.inverse(index).bind(this)} center={this.center(index).bind(this)}/>);
  		controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
  	}.bind(this));
  	
    return (
      <section className="stage" ref = "stage">
      	<section className="img-sec">
			{imgFigures}
      	</section>
		<nav className="controller-nav">
			{controllerUnits}
		</nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
