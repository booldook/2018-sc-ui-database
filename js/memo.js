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
var key = '';
//CRUD(Create, Read, Update, Delete)
/***** 전역함수 선언 ******/
function initData() {
	$(".lists").empty();
	initBt('R');
	//ref = db.ref("문자열");
	ref = db.ref("root/memos/"+user.uid);
	ref.on("child_added", addData);
	ref.on("child_removed", revData);
	ref.on("child_changed", chgData);
}
function initBt(mode) {
	switch(mode) {
		case 'C' :
			if($(window).width() <= 900) {
				$(".lists").hide();
			}
			$("#bt_new").hide();
			$("#bt_save").show();
			$("#bt_update").hide();
			$("#bt_cancel").show();
			$("#content:not(:focus)").focus();
			break;
		case 'R' :
			$("#bt_new").show();
			$("#bt_save").hide();
			$("#bt_update").hide();
			$("#bt_cancel").hide();
			$("#content").val('').blur();
			break;
		case 'U' :
			if($(window).width() <= 900) {
				$(".lists").hide();
			}
			$("#bt_new").hide();
			$("#bt_save").hide();
			$("#bt_update").show();
			$("#bt_cancel").show();
			break;
	}
}
function addData(data) {
	var id = data.key;
	var memo = data.val();
	var title = memo.title;
	var wdate = memo.wdate;
	var html = '<li class="list" id="'+id+'" onclick="upData(this);">';
	html += '<p>'+title+'</p>';
	html += '<div>'+timeConverter(wdate)+'</div>';
	html += '<span class="fa fa-trash bt_del" onclick="delData(this);"></span>';
	html += '</li>';
	$(".lists").prepend(html);
}
function chgData(data) {
	$("#"+data.key).find('p').html(data.val().title);
	$("#"+data.key).find('div').html(timeConverter(data.val().wdate));
}
function revData(data) {
	$("#"+data.key).remove();
}
function upData(obj) {
	//var id = $(obj).attr("id");
	if($(window).width() <= 900) {
		$(".lists").hide();
	}
	var id = obj.id;
	key = id;
	db.ref("root/memos/"+user.uid+"/"+id).once("value").then(function(snapshot){
		$("#content").val(snapshot.val().content);
		initBt('U');
	});
}
function delData(obj) {
	window.event.stopPropagation();
	var id = obj.parentNode.id;
	if(confirm("정말로 삭제하시겠습니까?")){
		db.ref("root/memos/"+user.uid+"/"+id).remove();
		initBt('R');
	}
}
/***** 이벤트 선언 ******/
$("#bt_login_google").on("click", function(){
	auth.signInWithPopup(googleAuth);
	//auth.signInWithRedirect(googleAuth);
});
function loginFn() {
	
}
$("#bt_logout").on("click", function(){
	auth.signOut();
});
$("#bt_save").on("click", function(){
	key = '';
	var content = $("#content").val();
	var title = content.substr(0, 10);
	if(content == "") {
		alert("내용을 입력하세요~");
		$("#content").focus();
	}
	else {
		ref = db.ref("root/memos/"+user.uid);
		ref.push({
			title: title,
			content: content,
			wdate: new Date().getTime()
		}).key;
		initBt('R');
	}
});
$("#bt_new").on("click", function(){
	key = '';
	initBt('C');
});
$("#bt_cancel").on("click", function(){
	key = '';
	initBt('R');
});
$("#bt_update").on("click", function(){
	var content = $("#content").val();
	var title = content.substr(0, 10);
	if(content == "") {
		alert("내용을 입력하세요~");
		$("#content").focus();
	}
	else {
		ref = db.ref("root/memos/"+user.uid+"/"+key);
		ref.update({
			title: title,
			content: content,
			wdate: new Date().getTime()
		});
		key = '';
		initBt('R');
	}
});
$("#content").on("focus", function(){
	if(key != '') initBt('U');
	else initBt('C');
});

//onAUthStateChanged : 현재 앱의 로그인 상태가 변화되면 발생되는 이벤트
auth.onAuthStateChanged(function(result){
	//result에는 [null] 또는 [로그인사용자] 정보가 담겨져 온다.
	//null은 프로그램에서 빈값을 의미함. 단 '', ""(비어있는 문자열) 와는 다르다.
	/*
	var s ; //s라는 변수를 선언만 함. 이때는 s에 null이 들어감.
	if(s == '') {console.log('문자열빈값');} //실행 안됨
	if(s) {console.log(null);} //실행 안됨
	if("ascd") {console.log('ascd');} //실행 됨
	if(1) {console.log(1);} //실행됨
	if(0) {console.log(0);} //실행안됨
	if(true) {console.log(true);} //실행됨
	if(false) {console.log(false);} //실행안됨
	*/
	console.log(result);
	user = result;
	if(user) {
		$("#bt_login_google").hide();
		$("#bt_logout").show();
		$(".tv_email").html(user.email);
		$(".iv_user").attr("src", user.photoURL);
		//$(".tv_email").html();							//대상 안의 태그를 가져온다.
		//$(".tv_email").html(user.email);		//대상 안의 모든 태그를 지우고 현재의 태그로 바꿔준다.
		//$(".tv_email").append(user.email);	//대상 안의 태그 맨 뒤에 현재 태그를 넣어준다.
		//$(".tv_email").prepend(user.email);	//대상 안의 태그 맨 앞에 현재 태그를 넣어준다.
		initData();
	}
	else {
		$("#bt_login_google").show();
		$("#bt_logout").hide();
		$(".tv_email").html('');
		$(".iv_user").attr('src', '');
		$(".lists").empty();
	}
});

/***** 반응형 자바스크립트 ******/
$(".header_bar").on('click', function(){
	$(".lists").toggle();
});



/***** 참조사항 ******/
/*
$("#bt").on("click", function(){

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



function initBt(mode) {
	if(mode == 'C') {
		$("#bt_new").hide();
		$("#bt_save").show();
		$("#bt_update").hide();
		$("#bt_cancel").show();
		$("#content:not(:focus)").focus();
	}
	else if(mode == 'R') {
		$("#bt_new").show();
		$("#bt_save").hide();
		$("#bt_update").hide();
		$("#bt_cancel").hide();
		$("#content").val('').blur();
	}
	else if(mode == 'U') {
		$("#bt_new").hide();
		$("#bt_save").hide();
		$("#bt_update").show();
		$("#bt_cancel").show();
	}
}

//객체 안의 변수는 멤버, 멤버변수 라고 지칭함.
//객체 안의 함수는 메서드(method)라고 지칭함.
var sample = {
	x: 0,
	y: 0,
	hap: function() {
		return this.x + this.y;
	}
};

sample.x = 100;
sample.y = 200;
var n = sample.hap();
console.log(n);

var firebase = {	//db = firebase.database();
	database: function() {	//ref = db.ref("문자열");
		var db = {
			ref: function(str){
				var data = {
					uid: "..",
					val: {
						key:"..",
						data: {
							title: "..",
							content: "..",
							wdate: 15897832482
						}
					},
					child_added: function(data){

					},
					child_changed: function(data) {

					}, 
					val: function(data){
						{
							title: "..",
							content: "..",
							wdate: 15897832482
						}
					},
					push: function() {

					}
				}
				return data;
			}
		};
		return db;
	}
}

var test = {
	a: 100,
	b: 200,
	hap: function(a, b) {
		console.log(this.a + this.b);
	}
}
console.log(this);
test.hap(10, 20);
*/