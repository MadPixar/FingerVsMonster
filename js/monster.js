document.body.style.height = view().h + 'px';
var bgm = document.getElementById('bgm'); 
var gameBgm = document.getElementById('game-bgm'); 
document.body.style.opacity = 1;
document.body.style.backgroundColor = '#243367';
/*
 * touches：表示当前跟踪的触摸操作的touch对象的数组。
 * targetTouches：特定于事件目标的Touch对象的数组。
 * changedTouches：表示自上次触摸以来发生了什么改变的Touch对象的数组。
 */
var silde = {
  loadFlag : false,        // 图片加载完成标识
  progressBar: function(){
    var loadingImgArr = [
      'images/finger.png',
      'images/beat-monster.png',
      'images/rocket.png',
      'images/alert.png',
      'images/human.png',
      'images/human2.png',
      'images/human3.png',
      'images/human4.png',
      'images/human5.png',
      'images/human6.png',
      'images/lighthouse.png',
      'images/monster1.png',
      'images/monster2.png',
      'images/monster3.png',
      'images/monster4.png',
      'images/monster11.png',
      'images/monster12.png',
      'images/monster13.png',
      'images/monster14.png',
      'images/pirate.png',
      'images/pirate2.png',
      'images/planet.png',
      'images/planet2.png',
      'images/planet3.png',
      'images/planet4.png',
      'images/planet5.png',
      'images/rocket.png',
      'images/rocket2.png',
      'images/rocket3.png',
      'images/smork.png',
      'images/smork2.png',
      'images/smork3.png',
      'images/smork4.png',
      'images/star.png',
      'images/star_bg.png',
      'images/star-line.png',
      'images/starotund.png',
      'images/start.png',
      'images/stop.png',
      'images/sun.png',
      'images/text1.png',
      'images/text2.png',
      'images/text3.png',
      'images/time.png',
      'images/game-icon_share.png',
      'images/arrow.png'
    ];
    var imgNum = 0;
    for( var i=0;i<loadingImgArr.length;i++){
      var img = document.createElement('img');
      img.src = loadingImgArr[i];
      img.onload = function(){
        imgNum ++ ;
        $('.progress-bar span').css('width',Math.floor(((imgNum/loadingImgArr.length).toFixed(2)*100))+'%');
        $('.progress-bar em').html(Math.floor(((imgNum/loadingImgArr.length).toFixed(2)*100))+'%');
        if(imgNum == loadingImgArr.length){
          $('#progress-bar').remove();
          loadFlag = true;
        }
      };
    };
  },
  changePage: function(){
    var off = true;
    var index = 0
    var downY = 0;
    $(document).on('touchstart',function(ev){
      ev.preventDefault();
      var touches = ev.changedTouches[0];
      downY = touches.pageY;
    });
    $(document).on('touchend',function(ev){
      var touches = ev.changedTouches[0];
      if(downY - touches.pageY > 40 && off && loadFlag){
        countPage(-1);
      }else if(downY - touches.pageY < -40 && off && loadFlag){
        countPage(1);
      }
    });
    function countPage(num){
      if(index == 0 && num == 1||index == 3 && num == -1){
        return false;
      }
      if(index == 2){
        $('#arrow-up').hide();
      }else{
        $('#arrow-up').show();
      }
      $('section').eq(index).removeClass('enter').addClass('out');
      off = false;
      setTimeout(function(){
        $('section').eq(index).removeClass('out').addClass('hide');
        $('section').eq(index-num).removeClass('hide').addClass('enter');
        index = index - num;
        off = true;
      },600);
    };
    $('#start').on('touchend',function(){
      $('#slide-box').hide();
      $('#game-box').show();
      bgm.pause();
      off = false;
    });
  },
  musicStart: function(audioEle,audioIcon,autoplayFlag){
    if(autoplayFlag){
      audioEle.autoplay = true;
    }else{
      audioEle.autoplay = false;
    }
    audioEle.play();
    $(audioIcon).on('touchstart',function() {
      if(audioEle.paused){
        $(this).removeClass('bg-music-stop');
        audioEle.play();
      }else{
        $(this).addClass('bg-music-stop');
        audioEle.pause();
      }
    });
  },
  init:function(){
    this.progressBar();
    this.changePage();
    this.musicStart(bgm,'.bg-music1',true);
  }
};

silde.init();

$('#start-btn').on('touchstart',function(){
  $('#layer-wrapper').hide();
  $('.game-state').show();
  bgm.pause();
  silde.musicStart(gameBgm,'.bg-music2',false);
  gameStart.begin();
});

$('#again-btn').on('touchstart',function(){
  $('#layer-wrapper').hide();
  $('.game-state').show();
  gameBgm.play();
  gameStart.begin();
});

function game(args){ 
  $('#game-stage').elements[0].width = view().w;
  $('#game-stage').elements[0].height = view().h - Math.ceil($('.game-state').css('height').replace(/px/,'')) + 4;
  $('.shake-page').css('height',$('#game-stage').elements[0].height+'px');

  var self = this;
  var initNum = 1;            // 怪物数量数列起始数量
  self.gameTime = 20;        // 游戏时间 s
  self.monsterNum = [];      // 怪物数量初始化
  self.gameLevel = 0;        // 游戏关卡
  self.position = {};        // 怪物座标范围
  self.monstersInfo = {};    // 怪物实例化的集合
  self.score = 0;            // 当前得分

  self.minX = 50;            // 怪物初始位置x最小值
  self.minY = 50;            // 怪物初始位置y最小值
  self.maxX = view().w-120;  // 怪物初始位置x最大值
  self.maxY = view().h-150;  // 怪物初始位置y最大值 
  self.roundTime = 20000;    // 绕屏幕转一圈所用总时间 20s
  self.speed = 20;           // 怪物绕圈变化时间间隔 ms

  self.countdown = null;     // 游戏时间定时器

  self.monster = {
    monster1: function (args){
      jc.start(args.canvas,true);
      var img = new Image();
      img.src = "images/monster1.png";
      img.onload = function (){
        jc.start(args.canvas);
        jc.image(img,-200,-200,55,57).id(args.id).level(2);
      };
    },
    monster2: function (args){
      jc.start(args.canvas,true);
      var img = new Image();
      img.src = "images/monster2.png";
      img.onload = function (){
        jc.start(args.canvas);
        jc.image(img,-200,-200,55,57).id(args.id).level(2);
      };
    },
    monster3: function (args){
      jc.start(args.canvas,true);
      var img = new Image();
      img.src = "images/monster3.png";
      img.onload = function (){
        jc.start(args.canvas);
        jc.image(img,-200,-200,54,65).id(args.id).level(2);
      };
    },
    monster4: function (args){
      jc.start(args.canvas,true);
      var img = new Image();
      img.src = "images/monster4.png";
      img.onload = function (){
        jc.start(args.canvas);
        jc.image(img,-200,-200,63,55).id(args.id).level(2);
      };
    },
    m1: [90,69],
    m2: [73,42],
    m3: [51,47],
    m4: [46,53]
  };
  
  function createMonsterNum (num){    // 怪物数量递增数列 1,2,2,3,3,3,4,4,4,4,5,5,5,5,5···
    for(var i=0; i<num; i++){
      self.monsterNum.push(num);
    }
    if(num<15){
      num++;
      createMonsterNum(num);
    }else{
      return self.monsterNum;
    }
  }
  createMonsterNum(initNum);

  self.next = function (){

    clearInterval(self.countdown);  // 清除现已有的游戏时间定时器
    clearInterval(this.running);    // 清除上一个怪物运动的定时器
    self.run();
    var i = 0;   // 每关创建怪物个数
    createMonster ();
    function createMonster (){
      var r = 150 + Math.round(Math.random()*100),    // 圆周运动半径
          clockWise = getRandomNum({min: 1, max: 3, num: 1}),      // 顺时针或者逆时针
          angle = 0;      // 圆点起始角度

      if(clockWise >= 1){
        angle = 3 + Math.round(Math.random()*3);
      }else{
        angle = -(3 + Math.round(Math.random()*3));
      }

      setTimeout(function(){
        self.monster['monster' + getRandomNum({min: 1,max: 4,num: 1})]({canvas:'game-stage',id:"monster" + i + self.gameLevel});
        self.monstersInfo['monster' + i + self.gameLevel] = new Monsters({canvas:'game-stage',id:"monster" + i + self.gameLevel,angle: angle, clockWise: clockWise});
        i++;
        if(i < self.monsterNum[self.gameLevel]){
          createMonster();
        };
      }, 200);
    }

    self.countdown = setInterval(function(){
      if(self.gameTime !== 0){
        self.gameTime--;
        $('#time').html(self.gameTime);
      }else{
        for(key in self.monstersInfo){
          Monsters.prototype.end({key: key});
        }
      }
    },1000);

  };

  function Monsters(args) {
    var that = this;
    that.id = args.id;       // 运动元素的id
    that.changeNum = (self.maxX + self.maxY)*2/(self.roundTime/self.speed);  // 绕一圈运动次数
    that.angle = args.angle || -2; // 递减角度 
    that.arcLength = 200;    // 弧长对应的角度
    that.r = args.r || 200;  // 圆的半径
    that.clockWise = args.clockWise;   // 绕圈方式 逆时针 交叉 顺时针
    that.tanC = view().w/view().h;      // 页面tan的角度值
    that.tanFlag = 0;  // 判断斜切线条倾斜方向

    var monsterPosition = getRandomNum({min: 1,max: 4,num: 1});
    switch(monsterPosition){
      case 1: that.positionX = getRandomNum({min: self.minX,max: self.maxX,num: 1});
              that.positionY = self.minY;
              that.arcLength = 100 + getRandomNum({min: 0,max: 50,num: 1});
            break;
      case 2: that.positionX = self.minX;
              that.positionY = getRandomNum({min: self.minY,max: self.maxY,num: 1});
              that.arcLength = -330 + getRandomNum({min: 0,max: 50,num: 1});
            break;
      case 3: that.positionX = getRandomNum({min: self.minX,max: self.maxX,num: 1});
              that.arcLength = -100 + getRandomNum({min: 0,max: 50,num: 1});
              that.positionY = self.maxY;
            break;
      case 4: that.positionX = self.maxX;
              that.positionY = getRandomNum({min: self.minY,max: self.maxY,num: 1});
              that.arcLength = 200 + getRandomNum({min: 0,max: 50,num: 1});
            break;
    }
  }

  Monsters.prototype.run = function() {

    switch(this.clockWise){
      case 1: 
            if(this.positionX > self.minX && this.positionY === self.minY){
              this.positionX = this.positionX - this.changeNum;
              if(this.positionX < self.minX){ this.positionX = self.minX;}
            }else if(self.minY <= this.positionY && self.maxY > this.positionY &&this.positionX === self.minX){
              this.positionY = this.positionY + this.changeNum;
              if(this.positionY > self.maxY){ this.positionY = self.maxY;}
            }else if(self.minX <= this.positionX && self.maxX > this.positionX && this.positionY === self.maxY){
              this.positionX = this.positionX + this.changeNum;
              if(this.positionX > self.maxX){ this.positionX = self.maxX;}
            }else if( this.positionY > self.minY && this.positionX === self.maxX){
              this.positionY = this.positionY - this.changeNum;
              if(this.positionY < self.minY){ this.positionY = self.minY;}
            }
            break;
      case 2:
             if(this.positionX > self.minX && this.positionX <= self.maxX && this.positionY === self.minY){
              this.positionX = this.positionX - this.changeNum;
              if(this.positionX < self.minX){ this.positionX = self.minX;}
            }else if(self.minY <= this.positionY && self.maxY > this.positionY && this.tanFlag === 0){
              this.positionY = this.positionY + this.changeNum;
              this.positionX = this.positionY * this.tanC;
              if(this.positionY > self.maxY){ this.positionY = self.maxY; this.positionX = self.maxX;this.tanFlag = 1}
            }else if(this.positionY === self.maxY && self.maxX >= this.positionX && self.minX < this.positionX){
              this.positionX = this.positionX - this.changeNum;
              if(this.positionX < self.minX){ this.positionX = self.minX;this.tanFlag = 1}
            }else if( self.maxY >= this.positionY && self.maxX > this.positionX && this.tanFlag === 1){
              this.positionX = this.positionX + this.changeNum;
              this.positionY = self.maxY - this.positionX/this.tanC;
              if(this.positionX > self.maxX){ this.positionX = self.maxX; this.positionY = self.minY;this.tanFlag = 0}
            }
            break;
      case 3:
             if(this.positionX < self.maxX && this.positionY === self.minY){
              this.positionX = this.positionX + this.changeNum;
              if(this.positionX > self.maxX){ this.positionX = self.maxX;}
            }else if(self.maxY >= this.positionY && self.minY < this.positionY &&this.positionX === self.minX){
              this.positionY = this.positionY - this.changeNum;
              if(this.positionY < self.minY){ this.positionY = self.minY;}
            }else if(self.maxX >= this.positionX && self.minX < this.positionX && this.positionY === self.maxY){
              this.positionX = this.positionX - this.changeNum;
              if(this.positionX < self.minX){ this.positionX = self.minX;}
            }else if( this.positionY < self.maxY && this.positionX === self.maxX){
              this.positionY = this.positionY + this.changeNum;
              if(this.positionY > self.maxY){ this.positionY = self.maxY;}
            }
            break;
    }

    this.arcLength = this.arcLength - this.angle;
    
    if(this.clockWise % 2 === 1){   // 逆时针旋转
      this.x = this.positionX - this.r * Math.cos(this.arcLength * Math.PI / 180);
      this.y = this.positionY - this.r * Math.sin(this.arcLength * Math.PI / 180);
    }else{                          // 顺时针旋转
      this.x = this.positionX + this.r * Math.sin(this.arcLength * Math.PI / 180);
      this.y = this.positionY + this.r * Math.cos(this.arcLength * Math.PI / 180);
    }
    self.position[this.id] = [];
    self.position[this.id][0] = this.x;
    self.position[this.id][1] = this.y;
    jc('#' + this.id).animate({x: this.x,y: this.y},1);
  };  
  
  Monsters.prototype.stop = function (args){
    if(args.next){
      self.score++;
      $('#score').html(Number(self.score));
    };

    var that = this,
        src = jc('#' + that.id)._img.src.split('/'),
        monsterSrc = src[src.length-1],
        monsterSrcNum = monsterSrc.findNum()[0];

    that.die = {};  // 怪物死亡集合

    jc.start('game-stage',true);
    var monster = new Image();
    monster.src='images/monster1'+ monsterSrcNum + '.png';

    monster.onload=function(){
      var i=1; // 怪物死亡后透明度变化
      jc.start('game-stage');
      jc.image(monster,self.position[args.key][0],self.position[args.key][1],self.monster['m' + monsterSrcNum][0],self.monster['m' + monsterSrcNum][1]).id(that.id+'del').level(1);    // 新添加怪物死亡图片
      
      that.die[that.id + 'del'] = setInterval(function(){
        i++;
        jc('#'+ that.id + 'del').opacity(1-i/40).scale((1-i/8000),(1-i/8000));
        if(1-i/40 < 0){
          jc('#'+ that.id + 'del').del();
          clearInterval(that.die[that.id + 'del']);
        }
      },50);
      
      jc('#' + that.id).del();
      
      self.monstersInfo[args.key] = undefined;     // 释放回收已经被点击死亡的怪物
      self.position[args.key][0] = undefined;
      self.position[args.key][1] = undefined;
      
      for( key in self.monstersInfo){      // 如果怪物还存在则不进入下一个关卡更新怪物
        if(self.monstersInfo[key]){
          return false;
        };
      };
    
      if(args.next && self.gameTime >= 2){
        setTimeout(function(){
          self.gameLevel++;
          jc.clear();
          self.next();
        },1000);
      };
    }
  };

  Monsters.prototype.end = function(args){
    var that = this;
    clearInterval(self.countdown);
    jc('#'+that.id).del();
    jc.clear();
    gameBgm.pause();
    $('.game-state').hide();
    if(self.score > 0){
      infoBoxDescribe('厉害了老铁，消灭了'+ self.score +'只怪物！');
    }else{
      infoBoxDescribe('啥子哟，一个都没击中，也太弱鸡了吧？强烈要求再来一次！');
    }
    $('#layer-wrapper').show();
    $('#time').html(20);
    $('#score').html(0);
  };
}

game.prototype.bindEvent = function(){
  var that = this;

  $('.shake-page').on('touchstart',function(e){
    e.preventDefault();
    var touchs = e.changedTouches[0],
        touchX = touchs.pageX,
        touchY = touchs.pageY;

        for (key in that.position) {
          if(touchX >= (that.position[key][0]-50) && touchX <= (that.position[key][0] + 150) && touchY >= (that.position[key][1]-50) && touchY <= (that.position[key][1] + 150)){
            that.monstersInfo[key].stop({key: key, next: true});
            return false;
          }
        }

    shake();
    function shake(){
      var shakeDiv = document.createElement('div');
      shakeDiv.className = 'shake-bg';
      shakeDiv.id = 'shake-bg';
      document.body.appendChild(shakeDiv);
      $('.shake-page').addClass('shake');
      stopPP(shakeDiv);
      setTimeout(function(){
        $('.shake-page').removeClass('shake');
        $('#shake-bg').remove();
      },1000);
    }

  });
};

game.prototype.run = function(){
  var that = this;

  that.running = setInterval(function(){
    for(key in that.monstersInfo){
      if(that.monstersInfo[key]){
        // console.log(that.monstersInfo[key].run());
        that.monstersInfo[key].run();
      }
    }
  },this.speed);
};

game.prototype.init = function(){
  var that = this;
  that.score = 0;
  that.gameTime = 20;
  that.gameLevel = 0;
  that.monstersInfo = {};
  that.position = {};
  clearInterval(that.countdown);
  jc.clear();
};

game.prototype.begin = function(){
  this.init();
  this.next();
};

var gameStart = new game();
gameStart.bindEvent();

function infoBoxDescribe(text){
  $('.rule').hide();
  $('#start-btn').hide();
  $('#share-btn').show();
  $('#again-btn').show();
  $('.game-info').html(text);
}
