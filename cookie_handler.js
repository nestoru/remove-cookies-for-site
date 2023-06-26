chrome.action.onClicked.addListener(async function () {
  const currentTab = await getCurrentTab();
  if (currentTab) {
    const cookies = await getCookies(currentTab.url);
    for (const cookie of cookies) {
      await removeCookie(cookie);
    }
    chrome.action.setBadgeText({ text: "Done!" });
    setTimeout(function () {
      chrome.action.setBadgeText({ text: "" });
    }, 3000);
  } else {
    console.error("Unable to retrieve the current tab.");
  }
});

async function getCurrentTab() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
      resolve(tabs[0]);
    });
  });
}

async function getCookies(url) {
  return new Promise((resolve) => {
    chrome.cookies.getAll({ url }, function (cookies) {
      resolve(cookies);
    });
  });
}

function removeCookie(cookie) {
  return new Promise((resolve) => {
    chrome.cookies.remove(
      { url: getCookieUrl(cookie), name: cookie.name },
      function (details) {
        resolve(details);
      }
    );
  });
}

function getCookieUrl(cookie) {
  return (
    (cookie.secure ? "https://" : "http://") +
    cookie.domain +
    cookie.path
  );
}

