// 拡張機能のアイコンがクリックされたら、content.jsスクリプトを実行する
chrome.browserAction.onClicked.addListener(function (tab) {

	if (tab.url != "https://www.clubdam.com/app/damtomo/MyPage.do") return

	async function loadScript() {
		try {
			const utilScript = await (await fetch('utils.js')).text();
			const mainScript = await (await fetch('dam_dumper.js')).text();
			// Webページにcontent.jsスクリプトを注入する
			chrome.tabs.executeScript({
				code: `

					var script = document.createElement('script');
					script.textContent = \`${utilScript}\` + "\\n" + \`${mainScript}\`;
					document.head.appendChild(script);
					`
			});
		} catch (error) {
			console.error(error);
		}
	}
	loadScript();

});
