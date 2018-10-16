/***** Firebase Init ******/
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
	ref.on("child_remove", revData);
}
function addData(data) {
	var key = data.key;
	var memo = data.val();
	var title = memo.title;
	var content = memo.content;
	var wdate = memo.wdate;
	var html = '<li class="list">';
	html += '<p>'+title+'</p>';
	html += '<div>'+wdate+'</div>';
	html += '<span class="fa fa-trash bt_del"></span>';
	html += '</li>';
	$(".lists").append(html);
}
function chgData() {

}
function revData() {

}
function timeConverter(ts){
	var a = new Date(ts);
	var months = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
	var year = a.getFullYear();
	var month = months[a.getMonth()];
	var date = a.getDate();
	var hour = a.getHours();
	var min = a.getMinutes();
	var sec = a.getSeconds();
	var str = String(year).substr(2)+"년 "+month+" "+date+"일 "+amPm(addZero(hour))+"시 "+addZero(min)+"분 "+addZero(sec) +"초";
	return str;
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
		$(".status").append('<p>'+result.email+'</p>');
		$(".status").append('<p>'+result.displayName+'</p>');
		$(".status").append('<p>'+result.uid+'</p>');
	}
	else {
		$("#bt_login_google").show();
		$("#bt_logout").hide();
		$(".status").empty();
	}
});


/***** 참조사항 ******/
$("#bt").click(function(){

});
$("#bt").on("click", function(){

});
$("#bt").on("click", clickFn);
function clickFn() {
	
}