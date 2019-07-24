//저장 신청 관련 =============================================
var VimeoToken = "";

var TargetSaveVideo = "";
var TargetSaveAudio = "";
var ArrTargetSaveVideo;
var ArrTargetSaveAudio;
var ArrTargetSaveVideoLength = 0;
var ArrTargetSaveAudioLength = 0;
var ArrTargetSaveVideoEnd = [];
var ArrTargetSaveAudioEnd = [];
var ResultUploading = 0;

function GetResultUseInterviewInfo(GetType){
	var json_url = AppDomain + AppPath + "/jsonp_get_interview_result_info.php?AppRegUID="+AppRegUID+"&AppID="+AppID+"&AppDomain="+AppDomain+"&AppPath="+AppPath+"&CenterID="+CenterID+"&MemberID="+MemberID+"&ResultUseInterviewID="+ResultUseInterviewID+"&GetType="+GetType+"&callback=?";

	$.getJSON( json_url, {
		format: "json"
	})
	.done(function( data ) {

		ResultUseInterviewInfo = data.ResultUseInterviewInfo;
		ServerSaved = data.ServerSaved;
		TargetSaveVideo = data.TargetSaveVideo;
		TargetSaveAudio = data.TargetSaveAudio;

		VimeoToken = data.VimeoToken;

		ArrTargetSaveVideo = TargetSaveVideo.split('|');
		ArrTargetSaveAudio = TargetSaveAudio.split('|');

		ArrTargetSaveVideoLength = ArrTargetSaveVideo.length;
		ArrTargetSaveAudioLength = ArrTargetSaveAudio.length;

		for (ii=1;ii<=ArrTargetSaveVideoLength-2;ii++){//원래 1은 공백이지만 체크를 위해 값을 넣어준다.
			ArrTargetSaveVideoEnd[ii] = 0;
		}
		for (ii=1;ii<=ArrTargetSaveAudioLength-2;ii++){//원래 1은 공백이지만 체크를 위해 값을 넣어준다.
			ArrTargetSaveAudioEnd[ii] = 0;
		}

		document.getElementById("ResultUseInterviewInfoArea").innerHTML = ResultUseInterviewInfo;
		document.getElementById("DivUploadProgress").innerHTML = "0%";
	
	}).fail(function() {
		
	});

}


function ApplySaveServer(){
	$.confirm({
		title: '안내',
		content: "서버에 저장 하시겠습니까?",
		buttons: {
			확인: function () {
				UploadResult(1,0);
			},
			취소: function () {
				//취소
			}
		}
	});
}

function ApplyAssessment(MyAssessmentMaxCount, MyAssessmentCount){
	$.confirm({
		title: '안내',
		content: "이용 가능횟수 "+MyAssessmentMaxCount+"회 중 "+MyAssessmentCount+"회 이용 하셨습니다.<br>평가신청을 하시면 이용 가능횟수가 차감 됩니다.<br>평가를 신청 하시겠습니까?",
		buttons: {
			확인: function () {
				UploadResult(2,0);

			},
			취소: function () {
				//취소
			}
		}
	});
}


function ApplyAssessmentErr(MyAssessmentMaxCount, MyAssessmentCount){
	$.alert({title: '안내', content: "이용 가능횟수 "+MyAssessmentMaxCount+"회 중 "+MyAssessmentCount+"회 이용 하셨습니다.<br>계속해서 평가를 이용하시려면 관리자에게 요청하시기 바랍니다."});
	return;
}



function ApplyCoachingType(){

	$('.pop_coching').fadeIn(300);
}

function CloseCoachingType(){

	$('.pop_coching').fadeOut(300);
}

function ApplyCoaching(CoachingType){

	$.confirm({
		title: '안내',
		content: "코칭을 신청 하시겠습니까?",
		buttons: {
			확인: function () {
				CloseCoachingType();
				UploadResult(3, CoachingType);
			},
			취소: function () {
				//취소
			}
		}
	});
	
}


function ApplyDelete(){
	$.confirm({
		title: '안내',
		content: "결과를 삭제 하시겠습니까?",
		buttons: {
			확인: function () {
				var json_url = AppDomain + AppPath + "/jsonp_set_interview_result_del.php?AppRegUID="+AppRegUID+"&AppID="+AppID+"&AppDomain="+AppDomain+"&AppPath="+AppPath+"&CenterID="+CenterID+"&MemberID="+MemberID+"&ResultUseInterviewID="+ResultUseInterviewID+"&callback=?";

				$.getJSON( json_url, {
					format: "json"
				})
				.done(function( data ) {
					webview.Close();
				}).fail(function() {
					
				});				
			},
			취소: function () {
				//취소
			}
		}
	});
}


function UploadResult(ApplyType, CoachingType){//1:저장, 2:평가, 3:코칭 ---- CoachingType : 코칭신청시 코칭타입
	
	document.getElementById("BlindLayer"+ApplyType).style.display = "";
	if (ApplyType==2 || ApplyType==3){
		document.getElementById("BlindLayer1").style.display = "";
	}

	if (ServerSaved=="N" && (ArrTargetSaveVideoLength>=4 || ArrTargetSaveAudioLength>=4)){//저장을 안했으며 동영상 또는 음성이 있을때
		
		ResultUploading = 1;//업로드 시작
	
		if (ArrTargetSaveVideoLength>=4){
			document.getElementById("UploadProgressBoxLayer").style.display = "";
			UploadVideoArray(2, ApplyType, CoachingType);//2 부터 ArrTargetSaveVideoLength-2 까지;
		}else{
			if (ArrTargetSaveAudioLength>=4){
				document.getElementById("UploadProgressBoxLayer").style.display = "";
				UploadAudioArray(2, ApplyType, CoachingType);//2 부터 ArrTargetSaveAudioLength-2 까지;
			}
		}
		
	}else{
		UploadUpdate(ApplyType, CoachingType);
	}

}

function UploadVideoArray(ArrIndex, ApplyType, CoachingType){
	if (ArrTargetSaveVideo[ArrIndex]!=""){//이부분이 공백이 올수는 없지만. 체크한다.
		ArrArrTargetSaveVideo = ArrTargetSaveVideo[ArrIndex].split('^');
		if (ArrArrTargetSaveVideo[1]!=""){//이부분이 공백이 올수는 없지만. 체크한다.
			UploadVideo(ArrArrTargetSaveVideo[1], ArrIndex, ApplyType, CoachingType);
		}
	}
}

function UploadAudioArray(ArrIndex, ApplyType, CoachingType){
	if (ArrTargetSaveAudio[ArrIndex]!=""){//이부분이 공백이 올수는 없지만. 체크한다.
		ArrArrTargetSaveAudio = ArrTargetSaveAudio[ArrIndex].split('^');
		if (ArrArrTargetSaveAudio[1]!=""){//이부분이 공백이 올수는 없지만. 체크한다.
			UploadAudio(ArrArrTargetSaveAudio[1], ArrIndex, ApplyType, CoachingType);
		}
	}
}


function UploadUpdate(ApplyType, CoachingType){
	var json_url = AppDomain + AppPath + "/jsonp_set_interview_result_update.php?AppRegUID="+AppRegUID+"&AppID="+AppID+"&AppDomain="+AppDomain+"&AppPath="+AppPath+"&CenterID="+CenterID+"&MemberID="+MemberID+"&ResultUseInterviewID="+ResultUseInterviewID+"&ApplyType="+ApplyType+"&CoachingType="+CoachingType+"&callback=?";

	$.getJSON( json_url, {
		format: "json"
	})
	.done(function( data ) {
		ServerSaved="Y";
		document.getElementById("UploadProgressBoxLayer").style.display = "none";
		ResultUploading = 0;//업로드 종료

		if (ApplyType==2){
			GetAssessmentStatus();
		}

	}).fail(function() {
		
	});	
}

var onErrorReadFile = function(error) {
	//UploadVideo Error 
}
function UploadVideo(TempVideoFilePath, ArrIndex, ApplyType, CoachingType) {

	ArrTempVideoFilePath = TempVideoFilePath.split('###');
	
	ResultUseInterviewDetailID = ArrTempVideoFilePath[0];
	VideoFilePath = ArrTempVideoFilePath[1];


	// upload direct vimeo ====================================
	window.resolveLocalFileSystemURL(VideoFilePath, function(VideoFileEntry) {

		document.getElementById("DivUploadProgress").innerHTML = "wait!!";

		VideoFileEntry.file(function (file) {

			var reader = new FileReader();
			reader.onloadend = function() {

				var RecordingVideoFile = new Blob([new Uint8Array(this.result)], { type: "video/*" });
				var TotalVideoSize = RecordingVideoFile.size;

				var uploader = new MediaUploader({
					file: RecordingVideoFile,
					//token: "d90d69bb3e7263bdd4274b5fa489e1c8",//accessToken,
					token: VimeoToken,//accessToken,
					onError: function(data) { /*alert("upload error");*/ },
					onProgress: function(data) {
						updateProgress(data / TotalVideoSize);
					},
					onComplete: function(videoId, index) {
						SetVimeoID(videoId, ArrIndex, ApplyType, CoachingType, ResultUseInterviewDetailID);
					}
				});
				uploader.upload();
				
			};
			reader.readAsArrayBuffer(file);
			
	 
		}, onErrorReadFile);		

	});
	// upload direct vimeo ====================================


	
	// upload server and vimeo ====================================
	/*
	var UploadVideoSuccess = function (r) {
		//alert("Code = " + r.responseCode);
		//alert("Response = " + r.response);
		//alert("Sent = " + r.bytesSent);

		//document.getElementById("aaaa").value = r.response;
	}

	var UploadVideoFail = function (error) {
		//alert("An error has occurred: Code = " + error.code);
		//alert("upload error source " + error.source);
		//alert("upload error target " + error.target);
	}

	var UploadVideoFilePath = VideoFilePath;
	var UploadVideoUri = encodeURI(AppDomain + AppPath + "/upload_video_to_vimeo_action.php");

	var UploadVideoOptions = new FileUploadOptions();
	UploadVideoOptions.fileKey="file";
	UploadVideoOptions.fileName=UploadVideoFilePath.substr(UploadVideoFilePath.lastIndexOf('/')+1);
	
	if (UploadVideoOptions.fileName.indexOf(".3gp")>=0){
		UploadVideoOptions.mimeType="video/3gpp";
	}else{
		UploadVideoOptions.mimeType="video/mp4";
	}

	var UploadVideoHeaders={'headerParam':'headerValue'};
	UploadVideoOptions.headers = UploadVideoHeaders;

	var Ft = new FileTransfer();
	Ft.onprogress = function(progressEvent) {
		var UploadProgress =  (progressEvent.loaded / progressEvent.total) * 100;
		UploadProgress = Math.round(UploadProgress);

		if (UploadProgress<1){
			UploadProgress = 1;
		}

		document.getElementById("DivUploadProgressBox").className = "c100 p"+UploadProgress;
		document.getElementById("DivUploadProgress").innerHTML = UploadProgress + "%";

		if (UploadProgress>=100){
			if (ArrIndex < ArrTargetSaveVideoLength-2){//동영상이 남아 있으면?
				if (ArrTargetSaveVideoEnd[ArrIndex]==0){
					UploadVideoArray(ArrIndex+1, ApplyType, CoachingType);
					ArrTargetSaveVideoEnd[ArrIndex] = 1;
				}
			}else{//남은 동영상이 없으면?
				if (ArrTargetSaveAudioLength>=4){//음성이 있으면?
					if (ArrTargetSaveAudioEnd[1]==0){//음성 첫번째것 아직 안올렸으면?
						UploadAudioArray(2, ApplyType, CoachingType);
						ArrTargetSaveAudioEnd[1] = 1;
					}
				}else{
					UploadUpdate(ApplyType, CoachingType);
				}
			}

		}
	};

	Ft.upload(UploadVideoFilePath, UploadVideoUri, UploadVideoSuccess, UploadVideoFail, UploadVideoOptions);
	*/
	// upload server and vimeo ====================================
}


function updateProgress(UploadProgress) {
	UploadProgress = Math.floor(UploadProgress * 100)

	if (UploadProgress<1){
		UploadProgress = 1;
	}

	document.getElementById("DivUploadProgressBox").className = "c100 p"+UploadProgress;
	document.getElementById("DivUploadProgress").innerHTML = UploadProgress + "%";

	if (UploadProgress>=100){
		//alert("동영상 업로드 완료");
		VideoUploadComplete = 1;
		document.getElementById("DivUploadProgress").innerHTML = "done!!";
	}

}


function SetVimeoID(VimeoID, ArrIndex, ApplyType, CoachingType, ResultUseInterviewDetailID){

	LocalMemberID = localStorage.getItem(AppLocalStorageID+"MemberID");	

	
	var JsonUrl = AppDomain + AppPath + "/jsonp_set_result_vimeoid.php?AppRegUID="+AppRegUID+"&AppID="+AppID+"&AppDomain="+AppDomain+"&AppPath="+AppPath+"&CenterID="+CenterID+"&MemberID="+MemberID+"&ResultUseInterviewDetailID="+ResultUseInterviewDetailID+"&VimeoID="+VimeoID+"&callback=?";


	$.getJSON( JsonUrl, {
		format: "json"
	})
	.done(function( data ) {


		if (ArrIndex < ArrTargetSaveVideoLength-2){//동영상이 남아 있으면?
			if (ArrTargetSaveVideoEnd[ArrIndex]==0){
				UploadVideoArray(ArrIndex+1, ApplyType, CoachingType);
				ArrTargetSaveVideoEnd[ArrIndex] = 1;
			}
		}else{//남은 동영상이 없으면?
			if (ArrTargetSaveAudioLength>=4){//음성이 있으면?
				if (ArrTargetSaveAudioEnd[1]==0){//음성 첫번째것 아직 안올렸으면?
					UploadAudioArray(2, ApplyType, CoachingType);
					ArrTargetSaveAudioEnd[1] = 1;
				}
			}else{
				UploadUpdate(ApplyType, CoachingType);
				document.getElementById("UploadProgressBoxLayer").style.display = "none";
			}
		}


		//썸네일만 올리기
		/*
		document.RegThumbForm.MemberID.value = LocalMemberID;
		document.RegThumbForm.ResultCampionID.value = ResultCampionID;

		document.RegThumbForm.action = AppDomain + AppPath + "/jsonp_set_result_campion_thumb.php";
		document.RegThumbForm.target = "IframeBox";
		document.RegThumbForm.submit();

		setTimeout("RemoveVideoFile()", 1000);
		*/

	}).fail(function() {
		$(".page_loader").fadeOut("slow");		
	});
	
}



function UploadAudio(TempAudioFilePath, ArrIndex, ApplyType, CoachingType) {

	ArrTempAudioFilePath = TempAudioFilePath.split('###');
	
	ResultUseInterviewDetailID = ArrTempAudioFilePath[0];
	AudioFilePath = ArrTempAudioFilePath[1];

	var UploadAudioSuccess = function (r) {
		//alert("Code = " + r.responseCode);
		//alert("Response = " + r.response);
		//alert("Sent = " + r.bytesSent);
	}

	var UploadAudioFail = function (error) {
		//alert("An error has occurred: Code = " + error.code);
		//alert("upload error source " + error.source);
		//alert("upload error target " + error.target);
	}

	var UploadAudioFilePath = AudioFilePath;
	var UploadAudioUri = encodeURI(AppDomain + AppPath + "/upload_audio_action.php");

	var UploadAudioOptions = new FileUploadOptions();
	UploadAudioOptions.fileKey="file";
	UploadAudioOptions.fileName=UploadAudioFilePath.substr(UploadAudioFilePath.lastIndexOf('/')+1);
	//UploadAudioOptions.mimeType="video/mp4";

	var UploadAudioHeaders={'headerParam':'headerValue'};
	UploadAudioOptions.headers = UploadAudioHeaders;

	var Ft = new FileTransfer();
	Ft.onprogress = function(progressEvent) {

		var UploadProgress =  (progressEvent.loaded / progressEvent.total) * 100;
		UploadProgress = Math.round(UploadProgress);

		if (UploadProgress<1){
			UploadProgress = 1;
		}
		
		document.getElementById("DivUploadProgressBox").className = "c100 p"+UploadProgress;
		document.getElementById("DivUploadProgress").innerHTML = UploadProgress + "%";

		if (UploadProgress>=100){
			if (ArrIndex < ArrTargetSaveAudioLength-2){//음성이 남아 있으면?
				if (ArrTargetSaveAudioEnd[ArrIndex]==0){
					UploadAudioArray(ArrIndex+1, ApplyType, CoachingType);
					ArrTargetSaveAudioEnd[ArrIndex] = 1;
				}
			}else{
				UploadUpdate(ApplyType, CoachingType);
			}
		}
	};

	Ft.upload(UploadAudioFilePath, UploadAudioUri, UploadAudioSuccess, UploadAudioFail, UploadAudioOptions);
}



//저장 신청 관련 =============================================