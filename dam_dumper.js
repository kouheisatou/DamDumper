async function fetchScorings(cdmToken, cdmCardNo, scoreingType) {
	const parser = new DOMParser();
	const serializer = new XMLSerializer();

	let hasNext = true;
	let dumpResult = [];
	var pageNo = 1

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
			}

		} catch (error) {
			console.error(error);
		}
		pageNo++
	}

	for (var i = 0; i < dumpResult.length; i++) {
		console.log(dumpResult[i]);
	}
}

async function startFetch(cdmToken, cdmCardNo){
	await fetchScorings(cdmToken, cdmCardNo, "GetScoringAiListXML")
	await fetchScorings(cdmToken, cdmCardNo, "GetScoringDxgListXML")
}

let startDump = window.confirm("採点履歴を保存しますか？")
if (startDump) {
	let cdmToken = DamHistoryManager.getCdmToken()
	let cdmCardNo = DamHistoryManager.getCdmCardNo()
	console.log("cdmToken : " + cdmToken)
	console.log("cdmCardNo : " + cdmCardNo)

	startFetch(cdmToken, cdmCardNo)
}
