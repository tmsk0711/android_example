function OpenMagazineList(){
	//var Options = { dimBackground: true };
	//SpinnerPlugin.activityStart("Loading...", Options);
	var close_listen_loop;
	var NewWin=window.open( AppDomain+AppPath+"/magazine_list.php", "_blank", "location=no");
	NewWin.addEventListener( "loadstop", function(){
		   close_listen_loop = window.setInterval(function(){
			   NewWin.executeScript({
					   code: "window.Exit"
				   },
				   function(values){
					   if(values[0]){
						 NewWin.close();
					   }
				   }
			   );
		   },1000);
	});

	NewWin.addEventListener( "exit", function(){
		window.clearInterval(close_listen_loop);
	});

}


function OpenNoticeList(){
	//var Options = { dimBackground: true };
	//SpinnerPlugin.activityStart("Loading...", Options);
	var close_listen_loop;
	var NewWin=window.open( AppDomain+AppPath+"/notice_list.php", "_blank", "location=no");
	NewWin.addEventListener( "loadstop", function(){
		   close_listen_loop = window.setInterval(function(){
			   NewWin.executeScript({
					   code: "window.Exit"
				   },
				   function(values){
					   if(values[0]){
						 NewWin.close();
					   }
				   }
			   );
		   },1000);
	});

	NewWin.addEventListener( "exit", function(){
		window.clearInterval(close_listen_loop);
	});

}


function OpenGuideHome(){
	
	//webview.Show("my_study_complete.html");


	//var Options = { dimBackground: true };
	//SpinnerPlugin.activityStart("Loading...", Options);
	var close_listen_loop;
	var NewWin=window.open( AppDomain+AppPath+"/guide_home.php", "_blank", "location=no");
	NewWin.addEventListener( "loadstop", function(){
		   close_listen_loop = window.setInterval(function(){
			   NewWin.executeScript({
					   code: "window.Exit"
				   },
				   function(values){
					   if(values[0]){
						 NewWin.close();
					   }
				   }
			   );
		   },1000);
	});

	NewWin.addEventListener( "exit", function(){
		window.clearInterval(close_listen_loop);
	});

}


function OpenMemberForm(){
	//var Options = { dimBackground: true };
	//SpinnerPlugin.activityStart("Loading...", Options);
	var close_listen_loop;
	var NewWin=window.open( AppDomain+AppPath+"/member_form.php", "_blank", "location=no");
	NewWin.addEventListener( "loadstop", function(){
		   close_listen_loop = window.setInterval(function(){
			   NewWin.executeScript({
					   code: "window.Exit"
				   },
				   function(values){
					   if(values[0]){
						 NewWin.close();
					   }
				   }
			   );
		   },1000);
	});

	NewWin.addEventListener( "exit", function(){
		window.clearInterval(close_listen_loop);
	});
}


function OpenVoucherForm(){
	//var Options = { dimBackground: true };
	//SpinnerPlugin.activityStart("Loading...", Options);
	var close_listen_loop;
	var NewWin=window.open( AppDomain+AppPath+"/product_voucher_form.php", "_blank", "location=no");
	NewWin.addEventListener( "loadstop", function(){
		   close_listen_loop = window.setInterval(function(){
			   NewWin.executeScript({
					   code: "window.Exit"
				   },
				   function(values){
					   if(values[0]){
						 NewWin.close();
					   }
				   }
			   );
		   },1000);
	});

	NewWin.addEventListener( "exit", function(){
		window.clearInterval(close_listen_loop);
	});

}


function OpenVoucherList(){
	//var Options = { dimBackground: true };
	//SpinnerPlugin.activityStart("Loading...", Options);
	var close_listen_loop;
	var NewWin=window.open( AppDomain+AppPath+"/product_voucher_list.php", "_blank", "location=no");
	NewWin.addEventListener( "loadstop", function(){
		   close_listen_loop = window.setInterval(function(){
			   NewWin.executeScript({
					   code: "window.Exit"
				   },
				   function(values){
					   if(values[0]){
						 NewWin.close();
					   }
				   }
			   );
		   },1000);
	});

	NewWin.addEventListener( "exit", function(){
		window.clearInterval(close_listen_loop);
	});

}



function OpenOrderList(){
	//var Options = { dimBackground: true };
	//SpinnerPlugin.activityStart("Loading...", Options);
	var close_listen_loop;
	var NewWin=window.open( AppDomain+AppPath+"/order_list.php", "_blank", "location=no");
	NewWin.addEventListener( "loadstop", function(){
		   close_listen_loop = window.setInterval(function(){
			   NewWin.executeScript({
					   code: "window.Exit"
				   },
				   function(values){
					   if(values[0]){
						 NewWin.close();
					   }
				   }
			   );
		   },1000);
	});

	NewWin.addEventListener( "exit", function(){
		window.clearInterval(close_listen_loop);
	});

}


function OpenMyStudyCategoryList(){
	//var Options = { dimBackground: true };
	//SpinnerPlugin.activityStart("Loading...", Options);
	//setTimeout("SpinnerPluginStop()",1000);

	//webview.Show("my_study_category_list.html");
	
	
	//의왕시
	MemberID = localStorage.getItem(AppLocalStorageID+"MemberID");
	
	var JsonUrl = AppDomain + AppPath + "/jsonp_get_interview_favorite_count.php?AppRegUID="+AppRegUID+"&AppID="+AppID+"&AppDomain="+AppDomain+"&AppPath="+AppPath+"&CenterID="+CenterID+"&MemberID="+MemberID+"&callback=?";
	
	$.getJSON( JsonUrl, {
		format: "json"
	})
	.done(function( data ) {
		if (data.MemberFavoriteCount>=5){
			webview.Show("my_study_ready_list.html");
		}else{
			$.alert({title: '안내', content: '먼저 면접 학습설계를 진행해 주세요.<br>관심학과 5개를 선택하셔야 완료됩니다.'});
		}
	}).fail(function() {
		
	});
	//의왕시
}


function OpenMyStudyIngList(){
	//var Options = { dimBackground: true };
	//SpinnerPlugin.activityStart("Loading...", Options);
	//setTimeout("SpinnerPluginStop()",1000);

	webview.Show("my_study_ing_list.html");
}


function OpenMyStudyResultList(){
	//var Options = { dimBackground: true };
	//SpinnerPlugin.activityStart("Loading...", Options);
	//setTimeout("SpinnerPluginStop()",1000);

	webview.Show("my_study_result_list.html");
}

function OpenDemo(){
	
	//var Options = { dimBackground: true };
	//SpinnerPlugin.activityStart("Loading...", Options);
	//setTimeout("SpinnerPluginStop()",1000);

	localStorage.setItem(AppLocalStorageID+"LocalTempDemoService", "1");//체험하기 입니다.
	webview.Show("my_study_form.html");
}

function SpinnerPluginStop(){
	//SpinnerPlugin.activityStop();
}


function MemberRegForm(){
	//var Options = { dimBackground: true };
	//SpinnerPlugin.activityStart("Loading...", Options);
	var close_listen_loop;
	var NewWin=window.open( AppDomain+AppPath+"/member_form.php", "_blank", "location=no");
	NewWin.addEventListener( "loadstop", function(){
		   close_listen_loop = window.setInterval(function(){
			   NewWin.executeScript({
					   code: "window.Exit"
				   },
				   function(values){
					   if(values[0]){
						 NewWin.close();
					   }
				   }
			   );
		   },1000);
	});

	NewWin.addEventListener( "exit", function(){
		window.clearInterval(close_listen_loop);
	});

}


function OpenMyFavoriteList(){
	//var Options = { dimBackground: true };
	//SpinnerPlugin.activityStart("Loading...", Options);
	
	var close_listen_loop;
	var NewWin=window.open( AppDomain+AppPath+"/member_favorite_form.php", "_blank", "location=no");
	NewWin.addEventListener( "loadstop", function(){
		   close_listen_loop = window.setInterval(function(){
			   NewWin.executeScript({
					   code: "window.Exit"
				   },
				   function(values){
					   if(values[0]){
						 NewWin.close();
					   }
				   }
			   );
		   },1000);
	});

	NewWin.addEventListener( "exit", function(){
		window.clearInterval(close_listen_loop);

		LocalMemberID = localStorage.getItem(AppLocalStorageID+"MemberID");
		var JsonUrl = AppDomain + AppPath + "/jsonp_get_interview_favorite_count.php?AppRegUID="+AppRegUID+"&AppID="+AppID+"&AppDomain="+AppDomain+"&AppPath="+AppPath+"&CenterID="+CenterID+"&MemberID="+LocalMemberID+"&callback=?";
		
		$.getJSON( JsonUrl, {
			format: "json"
		})
		.done(function( data ) {
			if (data.MemberFavoriteCount>=5){
				document.getElementById("BtnMyFavoriteList1").style.display = "none";
				document.getElementById("BtnMyFavoriteList2").style.display = "";
			}else{
				$.alert({title: '안내', content: '관심학과 5개를 선택하셔야 완료됩니다.'});
				document.getElementById("BtnMyFavoriteList2").style.display = "none";
				document.getElementById("BtnMyFavoriteList1").style.display = "";
			}
		}).fail(function() {
			
		});	
	
	});

}


