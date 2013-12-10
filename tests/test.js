exports.testTest = function (test) {
	test.expect(2);
	test.equal(2, 2, "Ah men va faaan");
	test.notEqual(2, 3, "Ah men va faaan");
	test.done();
}