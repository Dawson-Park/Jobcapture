require("dotenv").config({ path: ".env" });
const puppeteer = require('puppeteer');
const Callog = require('./lib/callog.js');
const Util = require('./lib/util.js');

(async () => {
	const browser = await puppeteer.launch(); // 크로미움 실행
	const page = await browser.newPage(); // 크로미움의 page 객체 생성
	await page.setViewport({ width: 900, height: 400 }); // page의 크기

	await login(page); // 로그인 진행

	await moveToThisWeek(page) // 이번 주차의 페이지로 이동

	await Callog.show(page); // 캘린더를 cui로 출력
	await Callog.schedulate();

	await snapShot(page); // 스크린샷

	await browser.close();
})();

async function login(page) {
	await page.goto('https://ssl.jobcan.jp/login/pc-employee-global'); // 이동할 위치 : 잡캔의 로그인 주소
	
	await page.evaluate(({ COMPANY, ID, PASSWORD }) => {
		document.querySelector('input#client_id').value = COMPANY; // 회사명을 입력
		document.querySelector('input#email').value = ID; // 아이디를 입력
		document.querySelector('input#password').value = PASSWORD; // 비밀번호를 입력
	}, process.env);
	
	await page.click('button'); // 로그인 버튼을 클릭
	await page.waitForSelector('div#clock'); // 특정 요소가 로딩될 떄까지 대기
}

async function moveToThisWeek(page) {
	const link = Util.link; // 월요일과 금요일을 가져와서 url에 넣어서 이동
	console.log(link)

	await page.goto(link);
	await page.waitForSelector('#search-result > div.table-responsive.text-nowrap > table'); // 테이블 요소가 로딩될 때까지 대기
}

async function snapShot(page) {
	await page.evaluate(_ => {
		const target = document.querySelector("#search-result > div.table-responsive.text-nowrap > table").getBoundingClientRect().y;
		window.scrollBy(0, target-80); // 테이블의 위치까지 스크롤
	});
	await page.screenshot({path: 'screenshot.png'}); // 스샷찍어서 screenshot.png로 저장
}