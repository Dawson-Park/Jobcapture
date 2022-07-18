module.exports = class Util {
	static getWeek() {
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

	static get link() {
		const {firstDay, lastDay} = Util.getWeek(); // 월요일과 금요일을 가져와서 url에 넣어서 이동
		return `https://ssl.jobcan.jp/employee/attendance?list_type=normal&search_type=term
		&from%5By%5D=${firstDay.year}&from%5Bm%5D=${firstDay.month}&from%5Bd%5D=${firstDay.day}
		&to%5By%5D=${lastDay.year}&to%5Bm%5D=${lastDay.month}&to%5Bd%5D=${lastDay.day}&type=pdf`;
	}
}