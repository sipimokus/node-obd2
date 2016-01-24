
module.exports = {
	name: 'Throttle Position',
	unit: '%',
	id: '11',
	formula: function (res) {
		return res * 100 / 255
	},
	fakeResponse: function () {
		return 40
	}
}
