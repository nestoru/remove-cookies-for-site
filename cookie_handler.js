this.cookies_ = {};

function addCookie(cookie) {
   	var key = cookie.name+cookie.domain+cookie.hostOnly+cookie.path+cookie.secure+cookie.httpOnly+cookie.session+cookie.storeId;
	console.log(key);
  	this.cookies_[key] = cookie;
}

function listener(info) {
	var cookie = info.cookie;
	addCookie(cookie);
}

/*
function onload() {
	var foo = true;
}
*/

jQuery(document).ready(function(){
  	console.log("From cookie_handler.js:");
    if (!chrome.cookies) {
	  chrome.cookies = chrome.experimental.cookies;
	}
  	chrome.browserAction.onClicked.addListener(function(tab) {
		chrome.cookies.getAll({}, function(cookies) {
			chrome.cookies.onChanged.addListener(listener);
			for( var i in cookies ) {
				addCookie(cookies[i]);
			}
		});
		setTimeout(runProcess(tab), 250);
		//runProcess(tab);


	});
});

function runProcess(tab) {
	var domain = extractDomain(tab.url);
	for (var i in this.cookies_) {
	   	var cookie = this.cookies_[i];
		if( ("."+domain).indexOf(cookie.domain) != -1 ) {
			  url = "http" + (cookie.secure ? "s" : "") + "://" + cookie.domain + cookie.path;
			  chrome.cookies.remove({"url": url, "name": cookie.name});
		}
  }
  setTimeout(function(){
    chrome.browserAction.setBadgeText({'text':'done'});
    setTimeout(function(){
      chrome.browserAction.setBadgeText({'text':''});
    }, 1000);
  }, 0);

}

function extractDomain(url) {
	return url.match(/:\/\/(.[^/:]+)/)[1];
}
