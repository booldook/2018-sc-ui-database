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

/***** 이벤트 선언 ******/
$("#bt_login_google").click(function(){
	auth.signInWithPopup(googleAuth);
	//auth.signInWithRedirect(googleAuth);
});
$("#bt_logout").click(function(){
	auth.signOut();
});
/***** 콜백 선언 ******/
auth.onAuthStateChanged(function(result){
	console.log(result)
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