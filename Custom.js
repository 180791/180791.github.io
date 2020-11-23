var domain = "; path=/";

//頁面初始，先到IsShowNotice確定此uid是否需要顯示提示訊息
if (IsShowNotice(uid))
	$("#notice").show();
else
	$("#notice").hide();


//點選公告的【關閉】，依是否已勾選【不要顯示】來進行Cookie存入
$(".btn_close").on("click", function (e) {
	if ($(".in_show").is(":checked")) {
		SetNoShowNotice(uid); //設定不要再顯示
	}
	$("#notice").hide();
});

//以此函式取得是否需顯示會員提示訊息
function IsShowNotice(uid) {
	var curDate = new Date();
	var Now = getYYYYMMDD(curDate);
	var cval = readCookie("mck_" + uid);
	if (cval != null && cval == Now)
		return false;//不需要顯示
	else
		return true;//需要顯示
}


//如果有勾選今天不再顯示，並且點按關閉時，呼叫此函式
function SetNoShowNotice(uid) {
	//Cookie保存期限到 今天的 23:59:59
	var curDate = new Date();
	//目前時間
	var curTamp = curDate.getTime();
	//當日凌晨的時間 -1 = 23:59:59
	var curWeeHours = new Date(curDate.toLocaleDateString()).getTime() - 1;
	//當日已過的時間(s)
	var passedTamp = curTamp - curWeeHours;
	//當日剩餘時間
	var leftTamp = 24 * 60 * 60 * 1000 - passedTamp;
	var leftTime = new Date();
	leftTime.setTime(leftTamp + curTamp);
	//建立cookie
	var KeyName = "mck_" + uid;
	var Now = getYYYYMMDD(curDate);
	document.cookie = KeyName + "=" + Now + ";expires=" + leftTime.toGMTString() + domain;
}

//讀取 Cookie
function readCookie(name) {
	var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
	if (arr != null) return unescape(arr[2]); return null;
}

//日期轉yyyyMMdd
function getYYYYMMDD(curDate) {
	var mm = curDate.getMonth() + 1;
	var dd = curDate.getDate();

	return [curDate.getFullYear(),
	(mm > 9 ? '' : '0') + mm,
	(dd > 9 ? '' : '0') + dd
	].join('');
}


//點選 清除 mck Cookie
$(".btn_clear").on("click", function (e) {
	DeleteMck(uid);
	alert('頁面準備進行重新整理!');
	window.location.reload();
});

//刪除指定uid
function DeleteMck(uid) {
	var KeyName = "mck_" + uid;
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval = readCookie(KeyName);
	if (cval != null)
		document.cookie = KeyName + "=" + cval + ";expires=" + exp.toGMTString() + domain;
}