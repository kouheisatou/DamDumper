async function fetchScorings(cdmToken, cdmCardNo, scoreingType) {
	const parser = new DOMParser();
	const serializer = new XMLSerializer();

	let hasNext = true;
	let dumpResult = [];
	var pageNo = 1
	var itemCount = 0

	while (hasNext) {
		await new Promise(resolve => setTimeout(resolve, 1000));

		let url = "https://www.clubdam.com/app/damtomo/scoring/" + scoreingType + ".do?cdmCardNo=" + cdmCardNo + "&cdmToken=" + cdmToken + "&enc=sjis&pageNo=" + pageNo + "&detailFlg=1&dxgType=1&UTCserial=" + Date.now();
		console.log(url);

		try {
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/xml'
				}
			});

			const xmlData = parser.parseFromString(await response.text(), "application/xml");

			hasNext = xmlData
				.getElementsByTagName("page")[0]
				.getAttribute("hasNext") == "1";

			let scoreings = xmlData.getElementsByTagName("scoring");
			for (var i = 0; i < scoreings.length; i++) {
				dumpResult.push(serializer.serializeToString(scoreings[i]));
				itemCount++
			}

		} catch (error) {
			console.error(error);
			hasNext = false
		}
		pageNo++
	}

	var resultString = '<document xmlns="https://www.clubdam.com/app/damtomo/scoring/' + scoreingType + '" type="2.2"><list count="' + itemCount + '">'
	for (var i = 0; i < dumpResult.length; i++) {
		resultString += dumpResult[i]
	}
	resultString += '</list></document>'
	return resultString
}

async function downloadScores(cdmToken, cdmCardNo, scoreingType) {
	let resultXml = await fetchScorings(cdmToken, cdmCardNo, scoreingType)
	let filename = scoreingType + "_" + dateToFormatString(new Date(), "%YYYY%-%MM%-%DD%") + ".xml"
	console.log(filename)

	// テキストファイルをバイナリデータに変換
	const blob = new Blob([resultXml], { type: 'text/xml' });

	let link = document.createElement('a')
	link.href = URL.createObjectURL(blob)
	link.download = filename
	link.click()
}

async function startDownload(cdmToken, cdmCardNo) {
	await downloadScores(cdmToken, cdmCardNo, "GetScoringAiListXML")
	await downloadScores(cdmToken, cdmCardNo, "GetScoringDxgListXML")
}

let startDump = window.confirm("採点履歴を保存しますか？")
if (startDump) {
	let cdmToken = DamHistoryManager.getCdmToken()
	let cdmCardNo = DamHistoryManager.getCdmCardNo()
	console.log("cdmToken : " + cdmToken)
	console.log("cdmCardNo : " + cdmCardNo)
	startDownload(cdmToken, cdmCardNo)
}
