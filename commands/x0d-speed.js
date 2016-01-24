
module.exports = {
	name: 'Speed',
	unit: 'm',
	id: '0D',
	formula: function (res) {
		return res * 0.621371192 // km => mile
	},
	fakeResponse: function () {
		return 40
	}
}
