
module.exports = {
	name: 'Fuel Rail Pressure (relative to manifold vacuum)',
	unit: 'kPa',
	id: '22',
	formula: function (res) {
		return res * 0.079
	},
	fakeResponse: function () {
		return 40
	}
}
