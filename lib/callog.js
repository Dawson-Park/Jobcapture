const Time = require("./time");

module.exports = class Callog {
	static #dayObj = {};

	static async init(page) {
		const DOM = await page.evaluate(_ => {
			return document.querySelector("#search-result > div.table-responsive.text-nowrap > table").innerText;
		});

		const inner = this.#makeInner(DOM);
		this.#dayObj = this.#makeDayObj(inner);
	}

	static show() {
		const DOMAIN = ["Date ", "Arrive", "Leave", "Work ", "Break", "State"];
		this.#printCalender(this.#dayObj, DOMAIN);
	}

	static #makeInner(DOM) {
		const inner = (DOM.toString().replace(/\t\t|구분\t/g, "").split("\n")).splice(2, 9);
		return inner.filter(arr => arr.length !== 0);
	}

	static #makeDayObj(inner) {
		const dayObject = {
			date:[], arrive:[], leave:[], work:[], break:[], state:[]
		};

		for (let i = 0; i < inner.length; i++) {
			const temp = inner[i].replace('(근무중)', 'work ').replace(/\([^)]*\)/g, '').split("\t");
			let j = 0;

			for (const key in dayObject) {
				dayObject[key].push((!!temp[j]) ? temp[j] : '     '); j++;
			}
		}

		return dayObject;
	}

	static #makeHeader(DOMAIN) {
		let header = "|";

		for (let d of DOMAIN) {
			header += ` ${d} |`;
		}

		return header;
	}

	static #makeLoop(header) {
		return header.replace(/\|/g, '+').replace(/\s/g, '-').replace(/[a-z]/g, '-').replace(/[A-Z]/g, '-');
	}

	static #makeCalendar(dayObj) {
		let calendar = [];

		for (let i = 0; i < 5; i++) {
			const blank = [];

			for (const key in dayObj) {
				let t = dayObj[key][i];
				switch (key) {
					case 'date': case 0:  t = `| ${t} |`;  break;
					case 'arrive': case 1:  t = ` ${t}  |`; break;
					default:  t = ` ${t} |`; break;
				}
				blank.push(t);
			}
			calendar.push( blank.toString().replace(/,/g, '') );
		}

		return calendar;
	}

	static #printCalender(day, DOMAIN) {
		const header = this.#makeHeader(DOMAIN);
		const topLoop = this.#makeLoop(header);
		const calendar = this.#makeCalendar(day);

		console.log(topLoop);
		console.log(header);
		console.log(topLoop);
		for (const c of calendar) {
			console.log(c);
		}
		console.log(topLoop);
	}

	static schedulate() {
		const pivot = this.#pivotSchedule();
		const sanitize = this.#sanitize(pivot);
		const dayObj = this.#convertDayObj(sanitize);

		const DOMAIN = ["Date ", "Arrive", "Leave", "Work ", "Break"];
		this.#printCalender(dayObj, DOMAIN);
		this.#totalWorking(dayObj);
	};

	static #pivotSchedule() {
		const DOMAIN = [ 'mon', 'tue', 'wed', 'thu', 'fri' ];
		let day = { mon:[], tue:[], wed:[], thu:[], fri:[] };

		for (let i = 0; i < 5; i++) {
			for (const key in this.#dayObj) {
				switch (key) {
					case "date":
						day[DOMAIN[i]].push(this.#dayObj[key][i]);
						break;
					case "state":
						break;
					default:
						day[DOMAIN[i]].push(Time.ttom(this.#dayObj[key][i]));
				}
			}
		}

		return day;
	}

	static #sanitize(pivot) {
		let day = {};
		const arrive = Time.ttom(process.env.ARRIVE);

		for (const key in pivot) {
			const factor = (arrive > pivot[key][1]) ? arrive-pivot[key][1] : 0;

			const a = pivot[key][1] + factor;
			const w = pivot[key][3] - factor;
			const b = pivot[key][4];
			const l = a + w + b;

			day[key] = [ pivot[key][0], Time.mtot(a), Time.mtot(l), Time.mtot(w), Time.mtot(b) ]
		}

		return day;
	}

	static #convertDayObj(pivot) {
		const dayObject = {
			date:[], arrive:[], leave:[], work:[], break:[]
		};

		for (const pk in pivot) {
			let i = 0;
			for (const dk in dayObject) {
				dayObject[dk].push(pivot[pk][i++]);
			}
		}

		return dayObject;
	}

	static #totalWorking(dayObj) {
		const arr = dayObj.work.reduce((prev, cur) => prev + Time.ttom(cur), 0);
		console.log("TOTAL WORK :", Time.mtot(arr));
	}
}