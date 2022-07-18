module.exports = class Callog {
	static #pomain = [ 'mon', 'tue', 'wed', 'thu', 'fri' ];
	static #domain = ["Date ", "Arrive", "Leave", "Work ", "Break", "State"];
	static #dayObj = {};

	static async show(page) {
		const DOM = await page.evaluate(_ => {
			return document.querySelector("#search-result > div.table-responsive.text-nowrap > table").innerText;
		});
		const inner = this.#makeInner(DOM);

		this.#dayObj = this.#makeDayObj(inner, this.#domain);

		const header = this.#makeHeader(this.#domain);
		const topLoop = this.#makeLoop(header);
		const calendar = this.#makeCalendar(this.#dayObj, this.#domain);


		this.#printCalender(header, topLoop, calendar);
	}

	static #makeInner(DOM) {
		const inner = (DOM.toString().replace(/\t\t|구분\t/g, "").split("\n")).splice(2, 9);
		return inner.filter(arr => arr.length !== 0);
	}

	static #makeDayObj(inner, domain) {
		const dayObject = {
			date:[], arrive:[], leave:[], work:[], break:[], state:[]
		};

		for (let i = 0; i < inner.length; i++) {
			const temp = inner[i].replace('(근무중)', 'work ').replace(/\([^)]*\)/g, '').split("\t");
			for (let j = 0; j < 6; j++) {
				dayObject[`${domain[j].replace(/ /g, '').toLowerCase()}`].push((!!temp[j]) ? temp[j] : '     ')
			}
		}

		return dayObject;
	}

	static #makeHeader(domain) {
		let header = "|";

		for (let d of domain) {
			header += ` ${d} |`;
		}

		return header;
	}

	static #makeLoop(header) {
		return header.replace(/\|/g, '+').replace(/\s/g, '-').replace(/[a-z]/g, '-').replace(/[A-Z]/g, '-');
	}

	static #makeCalendar(dayObj, domain) {
		let calendar = [];

		for (let i = 0; i < 5; i++) {
			const blank = [];
			for (let j = 0; j < domain.length; j++) {
				let t = dayObj[`${domain[j].replace(/ /g, '').toLowerCase()}`][i];
				switch (j) {
					case 0: t = `| ${t} |`; break;
					case 1: t = ` ${t}  |`; break;
					default: t = ` ${t} |`; break;
				}
				blank.push(t);
			}
			calendar.push(blank.toString().replace(/,/g, ''));
		}

		return calendar;
	}

	static #printCalender(header, loop, calendar) {
		console.log(loop);
		console.log(header);
		console.log(loop);
		for (const c of calendar) {
			console.log(c);
		}
		console.log(loop);
	}

	static schedulate() {
		let pivot = this.#getPivot();
		const arrive = process.env.ARRIVE;

		this.#initArrive(pivot, arrive);
		const calc = this.#timeCalculate(this.#switchTime(pivot));
		console.log("remain", this.#minToTime(this.#remainCalculate(calc)));
	}

	static #remainCalculate(time) {
		const sum = time.reduce((acc, cur) => Number(acc) + Number(cur));
		if(-sum <= 0) return 0;
		else return -sum;
	}

	static #timeCalculate(time) {
		const temp = [];
		for (let i = 0; i < 5; i++) {
			const sum = time[i][1] - time[i][0] - time[i][2];
			temp.push(sum)
		}
		return temp;
	}

	static #switchTime(pivot) {
		const time = [];

		for (let i = 0; i < 5; i++) {
			const t = [];
			for (let j = 1; j < 5; j++) {
				const p = pivot[`${this.#pomain[i]}`][j];
				t.push(this.#timeToMin(this.#strToTime(p)))
			}

			const temp = t.filter((_, i) => i !== 2).map(v => (v === 'work') ? '':v);
			time.push(temp);
		}

		return time;
	}

	static #initArrive(pivot, arrive) {
		for (let i = 0; i < 5; i++) {
			pivot[`${this.#pomain[i]}`][1] = this.#compareTime(arrive, pivot[`${this.#pomain[i]}`][1]);
		}
	}

	static #getPivot() {
		const pivot = { mon:[], tue:[], wed:[], thu:[], fri:[] };

		for (let i = 0; i < this.#pomain.length; i++) {
			for (let j = 0; j < 6; j++) {
				const temp = this.#dayObj[`${this.#domain[j].replace(/ /g, '').toLowerCase()}`];
				pivot[`${this.#pomain[i]}`].push(temp[i].replace(/ /g, ''));
			}
		}

		return pivot;
	}

	static #compareTime(arrive, target) {
		if(target === 'work' || !target.length) return arrive;

		const min_arrive = this.#timeToMin(this.#strToTime(arrive));
		const min_target = this.#timeToMin(this.#strToTime(target));

		if(min_target > min_arrive) return target;
		else return arrive;
	}

	static #timeToMin({ h, m }) {
		return ((h*60) + m);
	}

	static #strToTime(string) {
		const s = string.split(":");

		if(s[0] === '' || s[0] === 'work') {
			return { h:0, m:0 }
		}
		else {
			const h = s[0];
			const m = s[1];
			return { h:Number(h), m:Number(m) }
		}
	}

	static #minToTime(time) {
		const hours = (time/60);
		const rhours = Math.floor(hours);
		const min = (hours - rhours) * 60;
		const rmin = Math.round(min);

		return `${this.#set2Time(rhours)}:${this.#set2Time(rmin)}`;
	}

	static #set2Time(time) {
		if(time <= 0) return '00'
		else if(time < 10) return `0${time}`
		else return `${time}`
	}
}