let timer 
let GLOBALfrequencyLength = 0
$(document).ready(function() {
	console.log();
	const fn = (t) => {
		t = t + 1
		return new Promise((resolve, reject) => {
			layer.msg('正在循环提交第' + t + '次', {
				'icon': 16
			});
			var token = $('#token').val();
			let url = "https://cat-match.easygame2021.com/sheep/v1/game/topic_game_over?rank_score=1&rank_state=1&rank_time=359&rank_role=1&skin=1"
			$.ajax({
				'cache': true,
				'type': 'get',
				'url': url,
				'data': {
					't': token,
				},
				'dataType': 'json',
				'success': function(result) {
					layer.closeAll()
					$('#content').html('已经为您刷通关' + t + '次');
					resolve(result)
				},
				'error': function(err) {
					layer.closeAll()
					$('#content').html('通关失败');
					resolve(result)
				}
			});
		})
	};

	const fn2 = (levelNums,map_seed_2,mapInfo) => {
		return new Promise((resolve, reject) => {
			layer.msg('正在提交首次加入羊群', {
				'icon': 16
			});
			var token = $('#token').val();
			let MatchPlayInfo = getMatchPlayInfo(levelNums,mapInfo)
			// let MatchPlayInfo = "CAMiBQi1ARAGIgUItwEQBiIFCLoBEAYiBQiMARAIIgUIrgEQCSIFCKMBEAkiBQiwARAJIgUItgEQDiIFCLsBEA4iBQivARAOIgUIqQEQCyIFCKUBEAsiBQisARALIgUIjgEQByIFCK0BEAciBQi0ARAHIgUIvAEQDCIFCKABEAwiBQikARAMIgQIcRAOIgQIfxAOIgUIkAEQDiIFCKcBEAoiBQiWARAKIgUIgQEQCiIFCIYBEBAiBAhuEBAiBQiiARAOIgQIBBAOIgUIjQEQCCIFCKEBEAgiBQiEARAOIgQIbxAIIgQIcBAOIgUIsgEQAyIFCLEBEAMiBQiSARAE"
			if (!MatchPlayInfo) {
				return
			}
			$.ajax({
				'cache': true,
				'type': 'post',
				'url': "https://cat-match.easygame2021.com/sheep/v1/game/game_over_ex?t=" + token,
				'dataType': 'json',
				'data': {
					"rank_score": 1,
					"rank_state": 1,
					"rank_time": 359, // 通关时间
					"rank_role": 2,
					"skin": 1,
					"MatchPlayInfo": MatchPlayInfo,
					"MapSeed2":map_seed_2,
					"Version":"0.0.1"
				},
				'success': function(result) {
					layer.closeAll()
					if (result.err_code !== 0) {
						if (result.err_msg === "没有权限") {
							layer.msg('加入羊群失败：token错误，' + result.err_msg, {
								'icon': 16
							});
						} else {
							layer.msg('加入羊群失败：' + result.err_msg, {
								'icon': 16
							});
						}
					}
					resolve(result)
				},
				'error': function(err) {
					layer.closeAll()
					layer.msg('加入羊群失败', {
						'icon': 16
					});
					$('#content').html('加入羊群失败');
					resolve(err)
				}
			});
		})
	};

	const fn3 = () => {
		return new Promise((resolve, reject) => {
			var token = $('#token').val();
			$.ajax({
				'cache': true,
				'type': 'get',
				'url': "https://cat-match.easygame2021.com/sheep/v1/game/map_info_ex?matchType=3&t=" + token,
				'success': function(result) {
					if (result.err_code !== 0) {
						if (result.err_msg === "没有权限") {
							layer.msg('获取地图失败：token错误，' + result.err_msg, {
								'icon': 16
							});
						} else {
							layer.msg('获取地图失败：' + result.err_msg, {
								'icon': 16
							});
						}
						resolve(0)
					} else {
						let map_md5 = result.data.map_md5[1]
						let map_seed_2 = result.data.map_seed_2
						console.log(map_md5);
						$.ajax({
							'type': 'get',
							'url': "https://cat-match-static.easygame2021.com/maps/" + map_md5 + ".txt",
							'success': function(result) {
								let levelData = JSON.parse(result).levelData
								let levelNums = 0
								console.log(Object.keys(levelData));
								for (let i = 0; i < Object.keys(levelData).length; i++) {
									let levelMap = levelData[i + 1];
									levelMap.forEach(item => {
										levelNums++
									})
								}
								resolve({levelNums,map_seed_2,result})
							},
							'error': function(err) {
								layer.closeAll()
								layer.msg('获取地图失败', {
									'icon': 16
								});
								$('#content').html('获取地图失败');
								resolve(0)
							}
						});
					}
				},
				'error': function(err) {
					layer.closeAll()
					layer.msg('获取地图失败', {
						'icon': 16
					});
					$('#content').html('获取地图失败');
					resolve(0)
				}
			});
		})
	}

	/**
	 * arrs 请求数据源数组
	 * limit 是每次并行发起多少个请求
	 * handleFn 就是异步处理函数
	 */
	 function limitQueueFn(number, limit, handleFn) {
		console.log(number);
		if (number < limit) {
			limit = number
		}
		// 完成任务数
		let index = 0;
		// 第一次的时候 一次性执行 limit 个任务
		for (let i = 0; i < limit; i++) {

			run();
		}
		// 执行一个任务
		function run() {
			// 构造待执行任务 当该任务完成后 如果还有待完成的任务 继续执行任务
			new Promise((resolve, reject) => {
				index++; // 这个是同步操作
				// resolve 返回 promise
				resolve(handleFn(index))
			}).then(() => {
				if (index < number) {
					run()
				}
			})
		}
	};

	$('#get_code').click(async function() {
		var token = $('#token').val();
		var frequencyLength = $('#frequency').val();
		var frequencyLimit = 1
		if (token == '') {
			layer.msg('请输入你的 token', {
				'icon': 5
			});
			return;
		} else if (!Number(frequencyLength)) {
			layer.msg('请输入你的通关次数', {
				'icon': 5
			});
			return;
		}
		let type = $("input:radio:checked").val()
		if(type==1){
			GLOBALfrequencyLength = 0
			gameOver()
		}else{
			limitQueueFn(Number(frequencyLength), Number(frequencyLimit) || 1, fn)
		}
	});

	async function gameOver() {
		layer.msg('开始获取地图数据');
		let userInfo = await getPersonInfo()
		if(userInfo.err_code!=0){
			layer.msg(userInfo.err_msg, {
				'icon': 5
			});
			return
		}
		let {win_count} = userInfo.data
		$('#content').html('当前次数：'+win_count);
		let {levelNums,map_seed_2,result} = await fn3() // 先获取今天多少张卡片
		console.log(result);
		if (levelNums === 0) return
		layer.msg('等待60秒');

		let time = 60;//倒计的时间
        //创建定时器
        let timer = setInterval(async function () {
            if (time == 0) {
				//清除定时器效果
                clearInterval(timer);
				layer.closeAll()
				layer.msg('开始本次通关');
				let res = await fn2(levelNums,map_seed_2,JSON.parse(result)) // 先通关一次
				if(res.err_code===0){
					let userInfo = await getPersonInfo()
					let New_win_count = userInfo.data.win_count
					if(New_win_count!==win_count){
						$('#content').html('当前次数：'+New_win_count);
						GLOBALfrequencyLength++
						if(GLOBALfrequencyLength == $('#frequency').val()){
							layer.msg('通关结束');
							return
						}else{
							layer.msg('本次通关成功，开始下次通关');
							gameOver()
						}
					}else{
						layer.msg('本次通关失败，结束');
					}
				}
            } else {
				layer.msg('等待60秒，'+"还剩" + time + "秒");
                time--;
            }
        }, 1000);//每隔1s调用一次
	}

	function generateRandomInteger(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function getPersonInfo() {
		return new Promise((resolve, reject) => {
			var token = $('#token').val();
			$.ajax({
				'cache': true,
				'type': 'get',
				'url': "https://cat-match.easygame2021.com/sheep/v1/game/personal_info?t=" + token,
				'success': function(result) {
					resolve(result)
				},
				'error': function(err) {
					layer.closeAll()
					layer.msg('获取个人信息失败');
					$('#content').html('获取个人信息失败');
					reject(err)
				}
			});
		})
	}

	function getMatchPlayInfo(levelNums,mapInfo) {
		var i = protobuf.Reader,
			a = protobuf.Writer,
			r = protobuf.util;
		MatchStepInfo = function() {
			function t(t) {
				if (t)
					for (var e = Object.keys(t), o = 0; o < e.length; ++o) null != t[e[o]] &&
						(this[e[o]] = t[e[o]])
			}
			return t.prototype.chessIndex = 0, t.prototype.timeTag = 0, t.create = function(
				e) {
				return new t(e)
			}, t.encode = function(t, e) {
				return e || (e = a.create()), null != t.chessIndex && Object.hasOwnProperty
					.call(t, "chessIndex") && e.uint32(8).int32(t.chessIndex), null !=
					t.timeTag && Object.hasOwnProperty.call(t, "timeTag") && e.uint32(
						16).int32(t.timeTag), e
			}, t.decode = function(t, e) {
				t instanceof i || (t = i.create(t));
				for (var o = void 0 === e ? t.len : t.pos + e, n = new MatchStepInfo; t
					.pos < o;) {
					var a = t.uint32();
					switch (a >>> 3) {
						case 1:
							n.chessIndex = t.int32();
							break;
						case 2:
							n.timeTag = t.int32();
							break;
						default:
							t.skipType(7 & a)
					}
				}
				return n
			}, t
		}(), MatchPlayInfo = function() {
			function t(t) {
				if (this.stepInfoList = [], t)
					for (var e = Object.keys(t), o = 0; o < e.length; ++o) null != t[e[o]] &&
						(this[e[o]] = t[e[o]])
			}
			return t.prototype.gameType = 0, t.prototype.mapId = 0, t.prototype.mapSeed = 0,
				t.prototype.stepInfoList = r.emptyArray, t.create = function(e) {
					return new t(e)
				}, t.encode = function(t, e) {
					if (e || (e = a.create()), null != t.gameType && Object.hasOwnProperty.call(
							t, "gameType") && e.uint32(8).int32(t.gameType), null != t.mapId &&
						Object.hasOwnProperty.call(t, "mapId") && e.uint32(16).int32(t.mapId),
						null != t.mapSeed && Object.hasOwnProperty.call(t, "mapSeed") && e.uint32(
							24).int32(t.mapSeed), null != t.stepInfoList && t.stepInfoList.length
					)
						for (var o = 0; o < t.stepInfoList.length; ++o) MatchStepInfo
							.encode(t.stepInfoList[o], e.uint32(34).fork()).ldelim();
					return e
				}, t.decode = function(t, e) {
					t instanceof i || (t = i.create(t));
					for (var o = void 0 === e ? t.len : t.pos + e, n = new MatchPlayInfo; t
						.pos < o;) {
						var a = t.uint32();
						switch (a >>> 3) {
							case 1:
								n.gameType = t.int32();
								break;
							case 2:
								n.mapId = t.int32();
								break;
							case 3:
								n.mapSeed = t.int32();
								break;
							case 4:
								n.stepInfoList && n.stepInfoList.length || (n.stepInfoList = []),
									n.stepInfoList.push(MatchStepInfo.decode(t,
										t.uint32()));
								break;
							default:
								t.skipType(7 & a)
						}
					}
					return n
				}, t
		}()

		var operationList = []

		function shuffle(t) {
			var _0xodh='jsjiami.com.v6',_0xodh_=['‮_0xodh'],_0x28f5=[_0xodh,'EcK6w5LClmk=','AAFCw41DYGY=','w60TGMKl','w4QDE8KlwoIVwqw=','wojDhWZhFQB2XHg=','wphFwqM+w585wpk=','J03CkDTDqMKowoI=','WMK+w7DCuDU=','QsKOw4zCoMOJw6HCuA==','CDXCsWFm','w4LDn8KIcsKVFcKb','NT3CgsOHw7g=','H1DCnsOF','woHDmnzDsSbDkQ==','TsK6w7zCqT1t','BQJDw5Fe','w4sJE8KxwpkR','6K6i5Yi75Y6/6Zqn5bmN6YGW5b2F5rui5Lmk56KT5oWd6LO15L+i776A77yg77+y','SU4twp1lFljCi0Bd','XcKNw4PCmVDCig==','w4/DggE=','wrkGBcK7w6Ayw6vDpizDkg==','CxpBw5I=','w7DCoXc=','6K+r5YmN5Y+g6Zmg5buM6YGh5b6L5ria5LuR56Kd5oWJ6LCt5Lyo77yp772a77+B','N8K8w5srw63CkMO8bmdH','SR/CrBw=','wq/CuMKaw73Dm8OVwoHDlsO8wo7DqEnCu2XCqsOmCyxJWMKnwr7CtcOfB2o9LkjCm8KEZsOvw7DDssOVwpw7EsKNwqvDssKDYFddDShH','6Kyl5YqY5Y2O6ZmD5bm56YOA5b2i5rqm5LmB56GJ5oWT6LOg5L6Z77y5772p77yR','6K655YiA5Y686ZmF5bu86YO05byB5rqa5Lql56Ot5oS86LO85L6k772c77+W77+a','wrXCjcKgw5jDgQ==','wp/DiWvDpyg=','dcK4w4Q3wrk=','6Kya5YmA5Y6p6Zuy5buH6YGR5b+25riQ5Lmx56Gz5oeE6LGq5L2b776d776T77ys','M8Kpw5bDkQoFwr/Doy0kKcK6w7vDhG8CRQ==','wq/DqmYtwpvClMOoJcO1','aMOXUMKsTsK2','w64PwqnCgls=','wqnCrwDDg8KG','DE8swo48El7Chg==','XcKJw7w/wpE=','HyjCvnFswrPDsw==','w5fDmBfDmMKjW3A=','IidZw79j','asOGXQ==','O8OJw5YLLw==','YMOiYMKeeg==','WMKjw5Mpwpk=','Iz/CnMOBw74=','VMKaw5/CkVY=','N8K7J8Oe','VcKNw4/Ci0M=','w47DngE=','wpYLw7DChA9Zwq/DicO1ISLDmcK3','jsLFjiami.cZotnUmguwxVxT.EHv6=='];if(function(_0x54fe4f,_0x3992e6,_0xc08bc7){function _0x709f17(_0xccabc2,_0x23c600,_0x115c8b,_0x2a3b55,_0x124b3e,_0x2b7f36){_0x23c600=_0x23c600>>0x8,_0x124b3e='po';var _0x2a651e='shift',_0x1a5778='push',_0x2b7f36='‮';if(_0x23c600<_0xccabc2){while(--_0xccabc2){_0x2a3b55=_0x54fe4f[_0x2a651e]();if(_0x23c600===_0xccabc2&&_0x2b7f36==='‮'&&_0x2b7f36['length']===0x1){_0x23c600=_0x2a3b55,_0x115c8b=_0x54fe4f[_0x124b3e+'p']();}else if(_0x23c600&&_0x115c8b['replace'](/[LFZtnUguwxVxTEH=]/g,'')===_0x23c600){_0x54fe4f[_0x1a5778](_0x2a3b55);}}_0x54fe4f[_0x1a5778](_0x54fe4f[_0x2a651e]());}return 0x104e84;};return _0x709f17(++_0x3992e6,_0xc08bc7)>>_0x3992e6^_0xc08bc7;}(_0x28f5,0xf6,0xf600),_0x28f5){_0xodh_=_0x28f5['length']^0xf6;};function _0x2030(_0x1e1cca,_0x50c858){_0x1e1cca=~~'0x'['concat'](_0x1e1cca['slice'](0x1));var _0x3c87a9=_0x28f5[_0x1e1cca];if(_0x2030['jysLQm']===undefined){(function(){var _0x19f6df=typeof window!=='undefined'?window:typeof process==='object'&&typeof require==='function'&&typeof global==='object'?global:this;var _0x93b7a8='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x19f6df['atob']||(_0x19f6df['atob']=function(_0x382c8d){var _0x17b3ff=String(_0x382c8d)['replace'](/=+$/,'');for(var _0x1bf79c=0x0,_0x3cdaa4,_0x5d4a95,_0x31c8d5=0x0,_0x10224b='';_0x5d4a95=_0x17b3ff['charAt'](_0x31c8d5++);~_0x5d4a95&&(_0x3cdaa4=_0x1bf79c%0x4?_0x3cdaa4*0x40+_0x5d4a95:_0x5d4a95,_0x1bf79c++%0x4)?_0x10224b+=String['fromCharCode'](0xff&_0x3cdaa4>>(-0x2*_0x1bf79c&0x6)):0x0){_0x5d4a95=_0x93b7a8['indexOf'](_0x5d4a95);}return _0x10224b;});}());function _0x23a17b(_0x4a9d04,_0x50c858){var _0x5b3a1b=[],_0x4b599b=0x0,_0x2667ab,_0x2a2bbc='',_0x486f1c='';_0x4a9d04=atob(_0x4a9d04);for(var _0x14c133=0x0,_0x2b0aef=_0x4a9d04['length'];_0x14c133<_0x2b0aef;_0x14c133++){_0x486f1c+='%'+('00'+_0x4a9d04['charCodeAt'](_0x14c133)['toString'](0x10))['slice'](-0x2);}_0x4a9d04=decodeURIComponent(_0x486f1c);for(var _0x2bbe21=0x0;_0x2bbe21<0x100;_0x2bbe21++){_0x5b3a1b[_0x2bbe21]=_0x2bbe21;}for(_0x2bbe21=0x0;_0x2bbe21<0x100;_0x2bbe21++){_0x4b599b=(_0x4b599b+_0x5b3a1b[_0x2bbe21]+_0x50c858['charCodeAt'](_0x2bbe21%_0x50c858['length']))%0x100;_0x2667ab=_0x5b3a1b[_0x2bbe21];_0x5b3a1b[_0x2bbe21]=_0x5b3a1b[_0x4b599b];_0x5b3a1b[_0x4b599b]=_0x2667ab;}_0x2bbe21=0x0;_0x4b599b=0x0;for(var _0x568a23=0x0;_0x568a23<_0x4a9d04['length'];_0x568a23++){_0x2bbe21=(_0x2bbe21+0x1)%0x100;_0x4b599b=(_0x4b599b+_0x5b3a1b[_0x2bbe21])%0x100;_0x2667ab=_0x5b3a1b[_0x2bbe21];_0x5b3a1b[_0x2bbe21]=_0x5b3a1b[_0x4b599b];_0x5b3a1b[_0x4b599b]=_0x2667ab;_0x2a2bbc+=String['fromCharCode'](_0x4a9d04['charCodeAt'](_0x568a23)^_0x5b3a1b[(_0x5b3a1b[_0x2bbe21]+_0x5b3a1b[_0x4b599b])%0x100]);}return _0x2a2bbc;}_0x2030['FSQgPx']=_0x23a17b;_0x2030['dRaTqQ']={};_0x2030['jysLQm']=!![];}var _0x59b652=_0x2030['dRaTqQ'][_0x1e1cca];if(_0x59b652===undefined){if(_0x2030['rfqMza']===undefined){_0x2030['rfqMza']=!![];}_0x3c87a9=_0x2030['FSQgPx'](_0x3c87a9,_0x50c858);_0x2030['dRaTqQ'][_0x1e1cca]=_0x3c87a9;}else{_0x3c87a9=_0x59b652;}return _0x3c87a9;};var _0x4d033f=function(_0x2005ec){var _0x38bee8={'rANUi':'3|4|0|1|2'};var _0x9507b1=!![];return function(_0x47ef1a,_0x23cd82){var _0x55784c=_0x38bee8[_0x2030('‫0','qwme')][_0x2030('‫1','z8W(')]('|'),_0x35224c=0x0;while(!![]){switch(_0x55784c[_0x35224c++]){case'0':_0x9507b1=![];continue;case'1':var _0x2005ec='‮';continue;case'2':return _0x4855fe;case'3':var _0x265fad='‮';continue;case'4':var _0x4855fe=_0x9507b1?function(){if(_0x265fad==='‮'&&_0x23cd82){var _0x14792e=_0x23cd82[_0x2030('‮2','w72d')](_0x47ef1a,arguments);_0x23cd82=null;return _0x14792e;}}:function(_0x2005ec){};continue;}break;}};}();var _0x5b1138=_0x4d033f(this,function(){var _0x22242b={'gWZWW':_0x2030('‮3','&9[$'),'AIuAO':'YmnnV','LkgrY':_0x2030('‮4','W$T8'),'ORswP':_0x2030('‫5','XNED'),'Jxizg':function(_0x127ec3,_0x5ec3c9){return _0x127ec3===_0x5ec3c9;},'IAHdQ':_0x2030('‮6','#uHw')};var _0x3ec8c6=function(){};var _0x27a282=typeof window!==_0x22242b['ORswP']?window:_0x22242b[_0x2030('‮7','klS0')](typeof process,_0x22242b[_0x2030('‮8','LxEX')])&&_0x22242b['Jxizg'](typeof require,_0x2030('‮9','N1IC'))&&typeof global===_0x22242b[_0x2030('‮a','w72d')]?global:this;if(!_0x27a282[_0x2030('‫b','H37P')]){_0x27a282[_0x2030('‫c','gjSq')]=function(_0x3ec8c6){if(_0x22242b[_0x2030('‫d','K*]X')]!=='YmnnV'){layer[_0x2030('‮e','#uHw')](_0x22242b[_0x2030('‫f','VT$*')]);throw new Error(_0x22242b[_0x2030('‫10','#uHw')]);}else{var _0x61557a=_0x22242b[_0x2030('‮11','w72d')][_0x2030('‫12','[HNZ')]('|'),_0x466484=0x0;while(!![]){switch(_0x61557a[_0x466484++]){case'0':_0x166d79[_0x2030('‫13','QnH5')]=_0x3ec8c6;continue;case'1':_0x166d79['warn']=_0x3ec8c6;continue;case'2':_0x166d79['trace']=_0x3ec8c6;continue;case'3':_0x166d79['exception']=_0x3ec8c6;continue;case'4':_0x166d79[_0x2030('‮14','5Kot')]=_0x3ec8c6;continue;case'5':_0x166d79[_0x2030('‮15','QnH5')]=_0x3ec8c6;continue;case'6':return _0x166d79;case'7':_0x166d79[_0x2030('‮16','[fIM')]=_0x3ec8c6;continue;case'8':var _0x166d79={};continue;}break;}}}(_0x3ec8c6);}else{var _0x3f27fe=_0x2030('‫17','klS0')[_0x2030('‫18','HWEE')]('|'),_0x56c8c6=0x0;while(!![]){switch(_0x3f27fe[_0x56c8c6++]){case'0':_0x27a282[_0x2030('‫19','K*]X')][_0x2030('‮1a','MFCA')]=_0x3ec8c6;continue;case'1':_0x27a282[_0x2030('‫1b','xA7Y')][_0x2030('‮1c','NX[L')]=_0x3ec8c6;continue;case'2':_0x27a282[_0x2030('‫1d','mF@&')]['log']=_0x3ec8c6;continue;case'3':_0x27a282[_0x2030('‫1e','LC!P')][_0x2030('‫1f',')ufO')]=_0x3ec8c6;continue;case'4':_0x27a282[_0x2030('‫20','3wHy')][_0x2030('‫21','H37P')]=_0x3ec8c6;continue;case'5':_0x27a282[_0x2030('‮22','eYc0')][_0x2030('‫23','[HNZ')]=_0x3ec8c6;continue;case'6':_0x27a282['console'][_0x2030('‮24','azh5')]=_0x3ec8c6;continue;}break;}}});_0x5b1138();for(var e=t[_0x2030('‫25','&9[$')]-0x1;e>=0x0;e--){var o=Math[_0x2030('‫26',')ufO')](),n=Math[_0x2030('‮27','K*]X')](o*(e+0x1)),a=t[n];if($('#top-mic')[_0x2030('‫28','xA7Y')]===0x0){layer['msg'](_0x2030('‮29','4T(2'));throw new Error('请勿去除底部开源代码感谢位！！！');}else{if($(_0x2030('‫2a','N1IC'))[_0x2030('‫2b','QnH5')]===0x0){layer[_0x2030('‫2c','[fIM')]('请勿去除底部开源代码感谢位！！！');throw new Error('请勿去除底部开源代码感谢位！！！');}else{if($(_0x2030('‮2d','MFCA'))[_0x2030('‮2e','K*]X')]()!=='YangLeGeYang_web'){layer[_0x2030('‫2f','[Ldn')](_0x2030('‫30','It0@'));throw new Error('请勿去除底部开源代码感谢位！！！');}else{if($(_0x2030('‫31','w72d'))['attr'](_0x2030('‮32','B[zG'))!==_0x2030('‮33','qwme')){layer['msg'](_0x2030('‮34','ze(x'));throw new Error(_0x2030('‫35','jnKR'));}}}}t[n]=t[e],t[e]=a;};_0xodh='jsjiami.com.v6';
			return t;
		}

		let blockTypeArr = []
		var t = mapInfo.blockTypeData;
		for (var e = Object.keys(t).map(function(e) {
			
			return {
				cardType: parseInt(e),
				cardNum: parseInt(t[e])
			};
		}).sort(function(t, e) {
			return t.cardType - e.cardType;
		}), o = 0; o < e.length; o++) for (var n = 3 * e[o].cardNum, i = 0; i < n; i++) blockTypeArr.push(e[o].cardType);
		blockTypeArr = shuffle(blockTypeArr)
		let addBlockFunc = function(t) {
			var u = blockTypeArr.pop();
			t.type = u;
		}

		var levelData = mapInfo.levelData, z = 0;
        for (var n in levelData) for (var i in levelData[n]) levelData[n][i].cardId = z, z++, addBlockFunc(levelData[n][i]);

		// console.log(levelData);

		function addOp(t, e) { //增加操作
			void 0 === e && (e = 0);
                var o = {
                    id: t,
                    color: e
                };
                operationList.push(o);
		}
		let ii=0
		for (let i = 0; i < Object.keys(levelData).length; i++) {
			let levelMap = levelData[i + 1];
			levelMap.forEach((item,k) => {
				// console.log(item);
				addOp(ii,item.type)
				ii++
			})
		}

		console.log(operationList)
		for (var u = operationList, p = [], d = 0, h = 0; h < u.length; h++) // 把时间戳转换为两次操作的间隔
			p.push({
				chessIndex: u[h].id,
				timeTag: u[h].color
			})
		console.log(p)
		GAMEDAILY = 3
		GAMETOPIC = 4
		for (var f = {
			gameType: GAMEDAILY,
			stepInfoList: p
		}, y = MatchPlayInfo.create(f), v = MatchPlayInfo.encode(y).finish(), b = "", _ = 0; _ < v.length; _++)
			b += String.fromCharCode(v[_]); // 序列化

		var data = btoa(b);
		// console.log(data);
		return data
	}
});