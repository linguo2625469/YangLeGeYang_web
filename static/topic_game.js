$(document).ready(function() {
	console.log();
	const fn1 = (MatchPlayInfo,mapSeed2) => {
		return new Promise((resolve, reject) => {
			var token = $('#token').val();
			let url = "https://cat-match.easygame2021.com/sheep/v1/game/topic/game_over?t="+token
			$.ajax({
				'cache': true,
				'type': 'post',
				'url': url,
				'data': {
					'rank_state': 1,
					'rank_time': 60,
					'rank_role': 1,
					'MapSeed2': mapSeed2,
					'play_info': MatchPlayInfo,
					'Version': '0.0.1' 
				},
				'dataType': 'json',
				'success': function(result) {
					layer.closeAll()
					$('#content').html('已经为您通关成功');
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

	const fn3 = () => {
		return new Promise((resolve, reject) => {
			var token = $('#token').val();
			$.ajax({
				'cache': true,
				'type': 'get',
				'url': "https://cat-match.easygame2021.com/sheep/v1/game/topic/game_start?t=" + token,
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
								resolve({map_seed_2,result})
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

	$('#topic_game_over').click(function() {
		var token = $('#token').val();
		if (token == '') {
			layer.msg('请输入你的 token', {
				'icon': 5
			});
			return;
		}
		topicGameOver()
	});

	async function topicGameOver() {
		layer.msg('开始获取地图数据');
		let userInfo = await getPersonInfo()
		if(userInfo.err_code!=0){
			layer.msg(userInfo.err_msg, {
				'icon': 5
			});
			return
		}
		let {map_seed_2,result} = await fn3() // 先获取今天多少张卡片
		console.log(result);
		
		let MatchPlayInfo = getMatchPlayInfo(JSON.parse(result))
		console.log(MatchPlayInfo);
		layer.closeAll()
		layer.msg('开始本次话题,请等待',{time:5000});
		setTimeout(async () => {
			let res = await fn1(MatchPlayInfo,map_seed_2)
			console.log(res.data);
			if(res&&res.data&&res.data.skin_id!==0){
				layer.msg('话题通关成功，获取皮肤编码：'+res.data.skin_id);
				$('#content').html('话题通关成功，获取皮肤编码：'+res.data.skin_id);
			}else{
				layer.msg('话题通关失败：'+res.err_msg);
				$('#content').html('话题通关失败：'+res.err_msg);
			}
		}, 5000);
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

	function getMatchPlayInfo(mapInfo) {
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
		
		let ii=0
		let p=[]
		mapInfo = mapInfo.levelData
		for (let i = 0; i < Object.keys(mapInfo).length; i++) {
			let levelMap = mapInfo[i + 1];
			levelMap.forEach((item,k) => {
				p.push({
					chessIndex: ii,
					timeTag: ii
				})
				ii++
			})
		}
		console.log(p);
		GAMEDAILY = 3
		GAMETOPIC = 4
		for (var f = {
			gameType: GAMETOPIC,
			stepInfoList: p
		}, y = MatchPlayInfo.create(f), v = MatchPlayInfo.encode(y).finish(), b = "", _ = 0; _ < v.length; _++)
			b += String.fromCharCode(v[_]); // 序列化

		var data = btoa(b);
		// console.log(data);
		return data
	}
});