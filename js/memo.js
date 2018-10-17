/***** Firebase Initialize(초기화) ******/
var config = {
	apiKey: "AIzaSyDGfj5JyuPXXHoXyX48QJ5I_S0Hccy5LuM",
	authDomain: "booldook-db1.firebaseapp.com",
	databaseURL: "https://booldook-db1.firebaseio.com",
	projectId: "booldook-db1",
	storageBucket: "booldook-db1.appspot.com",
	messagingSenderId: "310840275351"
};
firebase.initializeApp(config);

/***** 전역변수 선언 ******/
var auth = firebase.auth();
var db = firebase.database();
var googleAuth = new firebase.auth.GoogleAuthProvider();
var ref;
var user;

/***** 전역함수 선언 ******/
function initData() {
	$(".lists").empty();
	ref = db.ref("root/memos/"+user.uid);
	ref.on("child_added", addData);
	ref.on("child_changed", chgData);
	ref.on("child_removed", revData);
}
function addData(data) {
	var key = data.key;
	var memo = data.val();
	var title = memo.title;
	var content = memo.content;
	var wdate = memo.wdate;
	var html = '<li class="list" id="'+key+'" onclick="upData(this);">';
	html += '<p>'+title+'</p>';
	html += '<div>'+timeConverter(wdate)+'</div>';
	html += '<span class="fa fa-trash bt_del" onclick="delData(this);"></span>';
	html += '</li>';
	$(".lists").prepend(html);
}
function chgData() {

}
function revData() {

}

/***** 이벤트 선언 ******/
$("#bt_login_google").click(function(){
	auth.signInWithPopup(googleAuth);
	//auth.signInWithRedirect(googleAuth);
});
$("#bt_logout").click(function(){
	auth.signOut();
});
$("#bt_save").click(function(){
	var title;
	var content;
	content = $("#content").val();
	if(content == "") {
		alert("내용을 입력하세요~");
		$("#content").focus();
	}
	else {
		title = content.substr(0, 10);
		ref = db.ref("root/memos/"+user.uid);
		ref.push({
			title: title,
			content: content,
			wdate: new Date().getTime()
		}).key;
		$("#content").val('');
		initData();
	}
});
/***** 콜백 선언 ******/
auth.onAuthStateChanged(function(result){
	user = result;
	if(result) {
		$("#bt_login_google").hide();
		$("#bt_logout").show();
		$(".tv_email").html(user.email);
		initData();
	}
	else {
		$("#bt_login_google").show();
		$("#bt_logout").hide();
		$(".tv_email").html('');
		$(".lists").empty();
	}
});


/***** 참조사항 ******/
/*
$("#bt").click(function(){

});
$("#bt").on("click", function(){

});
$("#bt").on("click", clickFn);
function clickFn() {
	
}

var option = {
	url: "../json/test.json",
	type: "get",
	dataType: "json",
	success: function(data) {

	}
}
$.ajax(option);


var abc = {
	x: "10",
	y: "20",
	z: {

	},
	fn: function(){

	}
}
console.log(abc.x);
//Json은 자바스크립트 객체의 구조를 가지는 데이터 집합(통신을 위한 규칙에 맞는 데이터)
var def = {
	"x": "10",
	"y": "20",
	"z":{
		"ab":"10"
	}
}
*/