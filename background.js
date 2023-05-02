// 拡張機能のアイコンがクリックされたら、content.jsスクリプトを実行する
chrome.browserAction.onClicked.addListener(function (tab) {

	if (tab.url != "https://www.clubdam.com/app/damtomo/MyPage.do") return

	let mainScript = `
	let startDump = window.confirm("採点履歴を保存しますか？")
	if (startDump) {
		let cdmToken = DamHistoryManager.getCdmToken()
		let cdmCardNo = DamHistoryManager.getCdmCardNo()
		console.log("cdmToken : " + cdmToken)
		console.log("cdmCardNo : " + cdmCardNo)
	
	
		var hasNext = true
		var pageNo = 1
		while (hasNext) {
			let url = "https://www.clubdam.com/app/damtomo/scoring/GetScoringAiListXML.do?cdmCardNo=" + cdmCardNo + "&cdmToken=" + cdmToken + "&enc=sjis&pageNo=" + pageNo + "&detailFlg=1&UTCserial=" + Date.now()
			console.log(url)
			fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/xml'
				}
			})
				.then(response => response.text())
				.then(xmlData => {
					console.log(xmlData.toString())
				})
				.catch(error => console.error(error));
	
	
	
			hasNext = false
			pageNo++
		}
	}
	`

	// Webページにcontent.jsスクリプトを注入する
	chrome.tabs.executeScript({
		code: `
	  var script = document.createElement('script');
	  script.textContent = \`` + mainScript + `\`;
	  document.head.appendChild(script);
	`
	});
});
