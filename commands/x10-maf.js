
module.exports = {
	name: 'MAF air flow rate',
	unit: 'Gram/s',
	id: '10',
	formula: function (res) {
		return res / 100
	},
	fakeResponse: function () {
		return 400
	}
}
