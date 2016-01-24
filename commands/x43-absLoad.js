
module.exports = {
	name: 'Absolute Load Value',
	unit: '%',
	id: '43',
	formula: function (res) {
		return res * 100 / 255
	},
	fakeResponse: function () {
		return 40
	}
}
