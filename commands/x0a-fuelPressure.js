
module.exports = {
	name: 'Fuel Pressure',
	unit: 'kPa',
	id: '0A',
	formula: function (res) {
		return res * 3
	},
	fakeResponse: function () {
		return 40
	}
}
