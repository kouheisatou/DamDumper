// 拡張機能のアイコンがクリックされたら、content.jsスクリプトを実行する
chrome.browserAction.onClicked.addListener(function (tab) {

	if (tab.url != "https://www.clubdam.com/app/damtomo/MyPage.do") return

	fetch('dam_dumper.js')
		.then(response => response.text())
		.then(mainScript => {
			// Webページにcontent.jsスクリプトを注入する
			chrome.tabs.executeScript({
				code: `
				var script = document.createElement('script');
				script.textContent = \`` + mainScript + `\`;
				document.head.appendChild(script);
				`
			});
		});
});
