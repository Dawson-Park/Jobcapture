module.exports = class Time {
	static ttom(string) {
		const s = string.split(":");

		if(s[0] === '     ' || s[0] === 'work ') {
			return 0;
		}
		else {
			const [h, m] = s;
			return ((Number(h)*60) + Number(m));
		}
	}

	static mtot(time) {
		const hours = (time/60);
		const rhours = Math.floor(hours);
		const min = (hours - rhours) * 60;
		const rmin = Math.round(min);

		return `${this.#strZero(rhours)}:${this.#strZero(rmin)}`;
	}

	static #strZero(time) {
		if(time <= 0) return '00'
		else if(time < 10) return `0${time}`
		else return `${time}`
	}
}