module.exports = class Callog {
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

	static getPivot() {
		const domain = [ 'mon', 'tue', 'wed', 'thu', 'fri' ];
		const pivot = { mon:[], tue:[], wed:[], thu:[], fri:[] };

		for (let i = 0; i < domain.length; i++) {
			for (let j = 0; j < 6; j++) {
				const temp = this.#dayObj[`${this.#domain[j].replace(/ /g, '').toLowerCase()}`];
				pivot[`${domain[i]}`].push(temp[i].replace(/ /g, ''));
			}
		}

		return pivot;
	}
}