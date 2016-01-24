
module.exports = {
	name: 'RPM',
	unit: '',
	id: '0C',
	formula: function (res) {
		return res / 4
	},
	fakeResponse: function () {
		return Math.random() * 4000 + 1000;
	}
}
