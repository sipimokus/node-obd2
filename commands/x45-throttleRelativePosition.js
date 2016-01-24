
module.exports = {
	name: 'Relative Throttle Position',
	unit: '%',
	id: '45',
	formula: function (res) {
		return res * 100 / 255
	},
	fakeResponse: function () {
		return 40
	}
}
