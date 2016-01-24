
module.exports = {
	name: 'Fuel Level Input',
	unit: '%',
	id: '2F',
	formula: function (res) {
		return res * 100 / 255
	},
	fakeResponse: function () {
		return 40
	}
}
