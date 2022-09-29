let timer 
let GLOBALfrequencyLength = 0
let XorShift;
var n = function() {
	function t() {}
	return Object.defineProperty(t, "instance", {
		get: function() {
			return this._instance || (this._instance = new t()), this._instance;
		},
		enumerable: !1,
		configurable: !0
	}), t.prototype.setSeed = function(t) {
		if (!Array.isArray(t) || 4 !== t.length) throw new TypeError("seed must be an array with 4 numbers");
		this._state0U = 0 | t[0], this._state0L = 0 | t[1], this._state1U = 0 | t[2], this._state1L = 0 | t[3];
	}, t.prototype.randomint = function() {
		var t = this._state0U, e = this._state0L, o = this._state1U, n = this._state1L, i = (n >>> 0) + (e >>> 0), a = o + t + (i / 2 >>> 31) >>> 0, r = i >>> 0;
		this._state0U = o, this._state0L = n;
		var c = 0, s = 0;
		return c = (t ^= c = t << 23 | (-512 & e) >>> 9) ^ o, s = (e ^= s = e << 23) ^ n, 
		c ^= t >>> 18, s ^= e >>> 18 | (262143 & t) << 14, c ^= o >>> 5, s ^= n >>> 5 | (31 & o) << 27, 
		this._state1U = c, this._state1L = s, [ a, r ];
	}, t.prototype.random = function() {
		var t = this.randomint();
		return 2.3283064365386963e-10 * t[0] + 2.220446049250313e-16 * (t[1] >>> 12);
	}, t._instance = null, t;
}();
XorShift = n
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

	const fn2 = (levelNums,map_seed_2,mapInfo,mapSeed) => {
		return new Promise((resolve, reject) => {
			layer.msg('正在提交首次加入羊群', {
				'icon': 16
			});
			var token = $('#token').val();
			let MatchPlayInfo = getMatchPlayInfo(levelNums,mapInfo,mapSeed)
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
					"rank_time": 600, // 通关时间
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
						let map_seed = result.data.map_seed
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
								XorShift.instance.setSeed(map_seed)
								resolve({levelNums,map_seed_2,result,map_seed})
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
		let {levelNums,map_seed_2,result,map_seed} = await fn3() // 先获取今天多少张卡片
		console.log(result);
		if (levelNums === 0) return
		let sleepNum = Number($('#frequencyLimit').val())
		layer.msg('等待'+sleepNum+'秒');

		let time = sleepNum;//倒计的时间
        //创建定时器
        let timer = setInterval(async function () {
            if (time == 0) {
				//清除定时器效果
                clearInterval(timer);
				layer.closeAll()
				layer.msg('开始本次通关');
				let res = await fn2(levelNums,map_seed_2,JSON.parse(result),map_seed) // 先通关一次
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
				layer.msg('等待'+sleepNum+'秒，'+"还剩" + time + "秒");
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

	function getMatchPlayInfo(levelNums,mapInfo,mapSeed) {
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
			for (var e = t.length - 1; e >= 0; e--) {
				var o = XorShift.instance.random(), n = Math.floor(o * (e + 1)), a = t[n];
				t[n] = t[e], t[e] = a;
			}
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
		console.log(blockTypeArr);
		blockTypeArr = shuffle(blockTypeArr)
		console.log(blockTypeArr);

		let addBlockFunc = function(t) {
			if (0 == t.type) {
				var u = blockTypeArr.pop();
				t.type = u;
			}
		}
		var levelData = mapInfo.levelData, z = 0;
        for (var n in levelData) for (var i in levelData[n]) levelData[n][i].cardId = z, z++, addBlockFunc(levelData[n][i]);

		console.log("levelData");
		console.log(levelData);

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
				addOp(item.cardId,item.type)
				ii++
			})
		}
		console.log(JSON.parse(JSON.stringify(operationList)))

		operationList.sort((a,b)=>{
			if(b.color !== a.color){
				return b.color - a.color
			}else{
				return b.id-a.id
			}
		})
		for (var u = operationList, p = [], h = 0; h < u.length; h++){
			if(h===160){
				p.push({
					chessIndex: -4,
					timeTag: -4
				})
			}
			p.push({
				chessIndex: u[h].id,
				timeTag: u[h].color
			})
		}
		GAMEDAILY = 3
		GAMETOPIC = 4
		for (var f = {
			gameType: GAMEDAILY,
			stepInfoList: p
		}, y = MatchPlayInfo.create(f), v = MatchPlayInfo.encode(y).finish(), b = "", _ = 0; _ < v.length; _++)
			b += String.fromCharCode(v[_]); // 序列化
			console.log(f)

		var data = btoa(b);
		// console.log(data);
		return data
	}

	
});