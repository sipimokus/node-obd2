
module.exports = {
	name: 'Long term fuel trim—Bank 1',
	unit: '%',
	id: '07',
	formula: function (res) {
		return (res - 128) * 100 / 128
	},
	fakeResponse: function () {
		return 1
	}
}
