
module.exports = {
	name: 'Timing advance',
	unit: '',
	id: '0E',
	formula: function (res) {
		return res / 2
	},
	fakeResponse: function () {
		return 2
	}
}
