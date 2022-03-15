const puppeteer = require('puppeteer');

(async () => {
	const browser = await puppeteer.launch(); // 크로미움 실행
	const page = await browser.newPage(); // 크로미움의 page 객체 생성
	await page.setViewport({ width: 800, height: 400 }); // page의 크기

	await page.goto('https://ssl.jobcan.jp/login/pc-employee-global'); // 이동할 위치 : 잡캔의 로그인 주소
	await page.evaluate(() => {
		document.querySelector('input#client_id').value = '회사명'; // 회사명을 입력
		document.querySelector('input#email').value = '아이디'; // 아이디를 입력
		document.querySelector('input#password').value = '비밀번호'; // 비밀번호를 입력
	});

	await page.click('button'); // 로그인 버튼을 클릭
	await page.waitForSelector('div#clock'); // 특정 요소가 로딩될 떄까지 대기

	const {firstDay, lastDay} = getWeek(); // 월요일과 금요일을 가져와서 url에 넣어서 이동
	const link = `https://ssl.jobcan.jp/employee/attendance?list_type=normal&search_type=term
		&from%5By%5D=${firstDay.year}&from%5Bm%5D=${firstDay.month}&from%5Bd%5D=${firstDay.day}
		&to%5By%5D=${lastDay.year}&to%5Bm%5D=${lastDay.month}&to%5Bd%5D=${lastDay.day}&type=pdf`;

	await page.goto(link);
	await page.waitForSelector('#search-result > div.table-responsive.text-nowrap > table'); // 테이블 요소가 로딩될 때까지 대기

	await page.evaluate(_ => {
		window.scrollBy(0, 1970); // 테이블의 위치까지 스크롤
	});

	await page.screenshot({path: 'screenshot.png'}); // 스샷찍어서 screenshot.png로 저장

	await browser.close();
})();

function getWeek() {
	const curr = new Date; // 오늘 날짜
	const first = (curr.getDate() - curr.getDay()) + 1; // 오늘 날짜에서 오늘 요일을 뺀 후 +1 해서 월요일을 구한다
	const last = first + 4; // 월요일 + 4 = 금요일

	// Date 메소드를 사용하기 위해 생성자로 Date 객체 생성
	const firstDay = new Date(curr.setDate(first));
	const lastDay = new Date(curr.setDate(last));
	
	const flag = (firstDay > lastDay) ? 2 : 1; // 달이 바뀌는 경우 2 / 아니면 1

	// 주의 첫날과 주의 마지막날을 객체로 return
	return {
		firstDay: {
			year: firstDay.getFullYear(),
			month: firstDay.getMonth()+1,
			day: firstDay.getDate()
		},
		lastDay: {
			year: lastDay.getFullYear(),
			month: lastDay.getMonth() + flag,
			day: lastDay.getDate()
		}
	}
}
