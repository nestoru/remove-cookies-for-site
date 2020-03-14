this.cookies_ = {};

const addCookie = cookie => {
  const key = cookie.name + cookie.domain + cookie.hostOnly + cookie.path + cookie.secure + cookie.httpOnly + cookie.session + cookie.storeId;
  this.cookies_[key] = cookie;
};

jQuery(document).ready(() => {
  if (!chrome.cookies) {
    chrome.cookies = chrome.experimental.cookies;
  }

  const listener = info => addCookie(info.cookie);
  chrome.browserAction.onClicked.addListener(tab => {
    chrome.cookies.getAll(
      {},
      cookies => {
        chrome.cookies.onChanged.addListener(listener);
        cookies.forEach(addCookie);
      },
    );
    setTimeout(() => runProcess(tab), 250);
  });
});

/** @param {string} url */
const extractDomain = url => url.match(/:\/\/(.[^/:]+)/)[1];

function runProcess(tab) {
  const domain = extractDomain(tab.url);
  for (const i in this.cookies_) {
    const cookie = this.cookies_[i];
    if ((`.${domain}`).includes(cookie.domain)) {
      const url = `http${cookie.secure ? "s" : ""}://${cookie.domain}${cookie.path}`;
      chrome.cookies.remove({"url": url, "name": cookie.name});
    }
  }
  setTimeout(
    () => {
      chrome.browserAction.setBadgeText({'text': 'done'});
      setTimeout(() => chrome.browserAction.setBadgeText({'text': ''}), 1000);
    },
    0,
  );
}
