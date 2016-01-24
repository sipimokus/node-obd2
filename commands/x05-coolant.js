
module.exports = {
	name: 'Coolant Temperature',
	unit: 'C',
	id: '05',
	formula: function (res) {
		return res - 40
	},
	fakeResponse: function () {
		return 40
	}
}
