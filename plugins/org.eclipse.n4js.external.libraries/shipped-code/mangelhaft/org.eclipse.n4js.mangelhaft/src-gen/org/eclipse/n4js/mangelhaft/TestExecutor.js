// Generated by N4JS transpiler; for copyright see original N4JS source file.

(function(System) {
	'use strict';
	System.register([
		'org.eclipse.n4js.mangelhaft.assert/src-gen/org/eclipse/n4js/mangelhaft/assert/AssertionError',
		'org.eclipse.n4js.mangelhaft.assert/src-gen/org/eclipse/n4js/mangelhaft/precondition/PreconditionNotMet',
		'org.eclipse.n4js.mangelhaft/src-gen/org/eclipse/n4js/mangelhaft/types/ResultGroup',
		'org.eclipse.n4js.mangelhaft/src-gen/org/eclipse/n4js/mangelhaft/types/ResultGroups',
		'org.eclipse.n4js.mangelhaft/src-gen/org/eclipse/n4js/mangelhaft/types/TestResult',
		'org.eclipse.n4js.mangelhaft/src-gen/org/eclipse/n4js/mangelhaft/types/TestSpy'
	], function($n4Export) {
		var AssertionError, PreconditionNotMet, ResultGroup, ResultGroups, TestResult, TestSpy, TestExecutor, getExecutingFunction;
		TestExecutor = function TestExecutor(spy) {
			this.spy = undefined;
			this.constext = undefined;
			this.spy = spy;
		};
		$n4Export('TestExecutor', TestExecutor);
		getExecutingFunction = function getExecutingFunction(instrumentedTest) {
			return (testMethodDescriptor)=>(new Promise((resolve, reject)=>{
				const pr = Promise.resolve(testMethodDescriptor.value.call(instrumentedTest.testObject));
				let timeoutId;
				if (!n4.runtimeOptions["mangelhaft-timeout-disabled"]) {
					timeoutId = setTimeout(()=>reject(new Error(`Test object ${testMethodDescriptor.name} timed out after ${testMethodDescriptor.timeout} milliseconds`)), testMethodDescriptor.timeout);
				}
				pr.then((res)=>{
					clearTimeout(timeoutId);
					resolve();
				}, (err)=>{
					clearTimeout(timeoutId);
					reject(err);
				});
			}));
		};
		return {
			setters: [
				function($exports) {
					// org.eclipse.n4js.mangelhaft.assert/src-gen/org/eclipse/n4js/mangelhaft/assert/AssertionError
					AssertionError = $exports.AssertionError;
				},
				function($exports) {
					// org.eclipse.n4js.mangelhaft.assert/src-gen/org/eclipse/n4js/mangelhaft/precondition/PreconditionNotMet
					PreconditionNotMet = $exports.PreconditionNotMet;
				},
				function($exports) {
					// org.eclipse.n4js.mangelhaft/src-gen/org/eclipse/n4js/mangelhaft/types/ResultGroup
					ResultGroup = $exports.ResultGroup;
				},
				function($exports) {
					// org.eclipse.n4js.mangelhaft/src-gen/org/eclipse/n4js/mangelhaft/types/ResultGroups
					ResultGroups = $exports.ResultGroups;
				},
				function($exports) {
					// org.eclipse.n4js.mangelhaft/src-gen/org/eclipse/n4js/mangelhaft/types/TestResult
					TestResult = $exports.TestResult;
				},
				function($exports) {
					// org.eclipse.n4js.mangelhaft/src-gen/org/eclipse/n4js/mangelhaft/types/TestSpy
					TestSpy = $exports.TestSpy;
				}
			],
			execute: function() {
				$makeClass(TestExecutor, N4Object, [], {
					handleFixme: {
						value: function handleFixme___n4(testObject, scope, testRes) {
							if (testObject.fixme && (!testObject.fixmeScopes || testObject.fixmeScopes.has(scope))) {
								if (testRes.testStatus === 'PASSED') {
									testRes.testStatus = 'FAILED';
									testRes.message = "Test marked with @Fixme annotation but was successful. Issue blocking test has probably been fixed. Try removing annotation.";
									if (testObject.fixmeReason != null) {
										testRes.message += " (reason was '" + testObject.fixmeReason + "')";
									}
									testRes.trace = [
										String(testRes)
									];
								} else if (testRes.testStatus === 'FAILED' || testRes.testStatus === 'ERROR') {
									testRes.testStatus = 'SKIPPED_FIXME';
									testRes.message = testObject.fixmeReason;
									testRes.actual = testRes.expected = testRes.trace = null;
								}
							}
							return testRes;
						}
					},
					callAllGrouped: {
						value: async function callAllGrouped___n4(instrumentedTest, testMethodDescriptors) {
							for(const batch of testMethodDescriptors) {
								await this.callAll(instrumentedTest, batch);
							}
						}
					},
					callAll: {
						value: async function callAll___n4(instrumentedTest, testMethodDescriptors) {
							if (testMethodDescriptors) {
								const runTestMethod = getExecutingFunction(instrumentedTest);
								await Promise.all(testMethodDescriptors.map(runTestMethod));
							}
						}
					},
					getAncestorTestMethods: {
						value: function getAncestorTestMethods___n4(iTest, testMethodName) {
							let testMethods = [];
							let node = iTest;
							while(node.parent) {
								node = node.parent;
							}
							do {
								let nodeObj = node;
								const nodeTestMethods = nodeObj[testMethodName];
								if (nodeTestMethods && nodeTestMethods.length) {
									testMethods.push(nodeTestMethods);
								}
							} while(node = node.child);
							return testMethods;
						}
					},
					runTestAsync: {
						value: async function runTestAsync___n4(instrumentedTest) {
							return await this.runTestsAsync([
								instrumentedTest
							]);
						}
					},
					runGroup: {
						value: async function runGroup___n4(iTest, scope) {
							let testResults = [];
							await this.spy.groupStarted.dispatch([
								iTest
							]);
							if (!iTest.error) {
								try {
									const beforeAlls = this.getAncestorTestMethods(iTest, "beforeAlls");
									await this.callAllGrouped(iTest, beforeAlls);
									await this.runBeforesTestsAfters(testResults, iTest, scope);
									const afterAlls = this.getAncestorTestMethods(iTest, "afterAlls").reverse();
									await this.callAllGrouped(iTest, afterAlls);
								} catch(error) {
									let results = await this.errorTests(iTest, error);
									testResults = testResults.concat(results);
								}
							} else {
								testResults = await this.errorTests(iTest, iTest.error);
							}
							const result = new ResultGroup(testResults, `${iTest.name}`);
							await this.spy.groupFinished.dispatch([
								iTest,
								result
							]);
							return result;
						}
					},
					runBeforesTestsAfters: {
						value: async function runBeforesTestsAfters___n4(testResults, iTest, scope) {
							const numTests = iTest.tests.length;
							for(let ii = 0;ii < numTests;++ii) {
								let testMethod = iTest.tests[ii];
								let start, end;
								let testRes;
								try {
									await this.spy.testStarted.dispatch([
										iTest,
										testMethod
									]);
									start = new Date().getTime();
									if (!testMethod.ignore) {
										try {
											const befores = this.getAncestorTestMethods(iTest, "befores");
											await this.callAllGrouped(iTest, befores);
											await this.callAll(iTest, [
												testMethod
											]);
											testRes = new TestResult({
												testStatus: 'PASSED',
												description: testMethod.name
											});
										} finally {
											const afters = this.getAncestorTestMethods(iTest, "afters").reverse();
											await this.callAllGrouped(iTest, afters);
										}
									} else {
										testRes = new TestResult({
											testStatus: 'SKIPPED_IGNORE',
											message: testMethod.ignoreReason,
											description: testMethod.name
										});
									}
									end = new Date().getTime();
								} catch(er) {
									end = new Date().getTime();
									testRes = TestExecutor.generateFailureTestResult(er, testMethod.name);
								}
								testRes.elapsedTime = end - start;
								testRes = this.handleFixme(testMethod, scope, testRes);
								await this.spy.testFinished.dispatch([
									iTest,
									testMethod,
									testRes,
									async()=>{
										let allTests = iTest.tests;
										iTest.tests = [
											testMethod
										];
										try {
											await this.runTestsAsync([
												iTest
											]);
										} finally {
											iTest.tests = allTests;
										}
									}
								]);
								testResults.push(testRes);
							}
						}
					},
					runTestsAsync: {
						value: async function runTestsAsync___n4(instrumentedTests, scope) {
							let results = [];
							for(let test of instrumentedTests) {
								if (test) {
									if (test.hasParameterizedTests) {
										let pResults = [];
										await this.spy.parameterizedGroupsStarted.dispatch([
											test
										]);
										for(let ptest of test.parameterizedTests) {
											let testRes = await this.runGroup(ptest, scope);
											pResults.push(testRes);
											results.push(testRes);
										}
										await this.spy.parameterizedGroupsFinished.dispatch([
											new ResultGroups(pResults)
										]);
									} else {
										let testRes = await this.runGroup(test, scope);
										results.push(testRes);
									}
								}
							}
							let resultGroups = new ResultGroups(results);
							return resultGroups;
						}
					},
					errorTests: {
						value: async function errorTests___n4(instrumentedTest, error) {
							const testResults = [];
							const len = instrumentedTest.tests.length;
							for(let ii = 0;ii < len;++ii) {
								const test = instrumentedTest.tests[ii];
								await this.spy.testStarted.dispatch([
									instrumentedTest,
									test
								]);
								const testResult = TestExecutor.generateFailureTestResult(error, test.name);
								testResult.elapsedTime = 0;
								await this.spy.testFinished.dispatch([
									instrumentedTest,
									test,
									testResult
								]);
								testResults.push(testResult);
							}
							return testResults;
						}
					},
					spy: {
						value: undefined,
						writable: true
					},
					constext: {
						value: undefined,
						writable: true
					}
				}, {
					getStringFromAbiguous: {
						value: function getStringFromAbiguous___n4(thing) {
							let str;
							if (thing === null) {
								str = "null";
							} else if (typeof thing === "object") {
								str = Object.prototype.hasOwnProperty.call(thing, "toString") ? "" + thing : "prototypeless object";
							} else {
								str = "" + thing;
							}
							return str;
						}
					},
					generateFailureTestResult: {
						value: function generateFailureTestResult___n4(ex, description) {
							const status = this.getStatus(ex);
							const error = this.getError(ex, description);
							const reason = this.getReason(error, description);
							const trace = this.getTrace(error);
							const expected = this.getStringifiedOwnProperty(error, "expected");
							const actual = this.getStringifiedOwnProperty(error, "actual");
							let tr = new TestResult({
								testStatus: status,
								message: reason,
								trace: trace,
								description: description,
								expected: expected,
								actual: actual
							});
							return tr;
						}
					},
					getReason: {
						value: function getReason___n4(error, description) {
							if (error.message) {
								return String(error);
							}
							let reason = error.toString();
							if (reason.charAt(0) === "[") {
								reason = error.name ? `${error.name} : ${description}` : description;
							}
							return reason;
						}
					},
					getStringifiedOwnProperty: {
						value: function getStringifiedOwnProperty___n4(object, name) {
							if (!object.hasOwnProperty(name)) {
								return undefined;
							}
							const prop = object[name];
							const res = this.getStringFromAbiguous(prop);
							return res;
						}
					},
					getError: {
						value: function getError___n4(ex, description) {
							if (!ex) {
								return new Error("Unknown error: " + description);
							}
							if (typeof ex === "string") {
								return new Error(ex);
							}
							if (ex instanceof AssertionError) {
								return ex;
							}
							return ex;
						}
					},
					getStatus: {
						value: function getStatus___n4(ex) {
							if (ex instanceof AssertionError) {
								return 'FAILED';
							}
							if (ex instanceof PreconditionNotMet) {
								return 'SKIPPED_PRECONDITION';
							}
							if (ex instanceof N4ApiNotImplementedError) {
								return 'SKIPPED_NOT_IMPLEMENTED';
							}
							return 'ERROR';
						}
					},
					getTrace: {
						value: function getTrace___n4(e) {
							let trace;
							if (e['stack']) {
								const stack = e['stack'];
								if (typeof stack === "string") {
									trace = (stack).split("\n");
								} else if (Array.isArray(stack)) {
									trace = stack;
								} else {
									trace = [
										(stack).toString()
									];
								}
								trace = trace.map((line)=>line.trim());
							}
							return trace;
						}
					}
				}, function(instanceProto, staticProto) {
					var metaClass = new N4Class({
						name: 'TestExecutor',
						origin: 'org.eclipse.n4js.mangelhaft',
						fqn: 'org.eclipse.n4js.mangelhaft.TestExecutor.TestExecutor',
						n4superType: N4Object.n4type,
						allImplementedInterfaces: [],
						ownedMembers: [
							new N4DataField({
								name: 'spy',
								isStatic: false,
								annotations: [
									new N4Annotation({
										name: 'Inject',
										details: []
									})
								]
							}),
							new N4DataField({
								name: 'constext',
								isStatic: false,
								annotations: []
							}),
							new N4Method({
								name: 'constructor',
								isStatic: false,
								jsFunction: instanceProto['constructor'],
								annotations: []
							}),
							new N4Method({
								name: 'getStringFromAbiguous',
								isStatic: true,
								jsFunction: staticProto['getStringFromAbiguous'],
								annotations: []
							}),
							new N4Method({
								name: 'generateFailureTestResult',
								isStatic: true,
								jsFunction: staticProto['generateFailureTestResult'],
								annotations: []
							}),
							new N4Method({
								name: 'getReason',
								isStatic: true,
								jsFunction: staticProto['getReason'],
								annotations: []
							}),
							new N4Method({
								name: 'getStringifiedOwnProperty',
								isStatic: true,
								jsFunction: staticProto['getStringifiedOwnProperty'],
								annotations: []
							}),
							new N4Method({
								name: 'getError',
								isStatic: true,
								jsFunction: staticProto['getError'],
								annotations: []
							}),
							new N4Method({
								name: 'getStatus',
								isStatic: true,
								jsFunction: staticProto['getStatus'],
								annotations: []
							}),
							new N4Method({
								name: 'getTrace',
								isStatic: true,
								jsFunction: staticProto['getTrace'],
								annotations: []
							}),
							new N4Method({
								name: 'handleFixme',
								isStatic: false,
								jsFunction: instanceProto['handleFixme'],
								annotations: []
							}),
							new N4Method({
								name: 'callAllGrouped',
								isStatic: false,
								jsFunction: instanceProto['callAllGrouped'],
								annotations: []
							}),
							new N4Method({
								name: 'callAll',
								isStatic: false,
								jsFunction: instanceProto['callAll'],
								annotations: []
							}),
							new N4Method({
								name: 'getAncestorTestMethods',
								isStatic: false,
								jsFunction: instanceProto['getAncestorTestMethods'],
								annotations: []
							}),
							new N4Method({
								name: 'runTestAsync',
								isStatic: false,
								jsFunction: instanceProto['runTestAsync'],
								annotations: []
							}),
							new N4Method({
								name: 'runGroup',
								isStatic: false,
								jsFunction: instanceProto['runGroup'],
								annotations: []
							}),
							new N4Method({
								name: 'runBeforesTestsAfters',
								isStatic: false,
								jsFunction: instanceProto['runBeforesTestsAfters'],
								annotations: []
							}),
							new N4Method({
								name: 'runTestsAsync',
								isStatic: false,
								jsFunction: instanceProto['runTestsAsync'],
								annotations: []
							}),
							new N4Method({
								name: 'errorTests',
								isStatic: false,
								jsFunction: instanceProto['errorTests'],
								annotations: []
							})
						],
						consumedMembers: [],
						annotations: []
					});
					return metaClass;
				});
				Object.defineProperty(TestExecutor, '$di', {
					value: {
						fieldsInjectedTypes: [
							{
								name: 'spy',
								type: TestSpy
							}
						]
					}
				});
			}
		};
	});
})(typeof module !== 'undefined' && module.exports ? require('n4js-node').System(require, module) : System);
//# sourceMappingURL=TestExecutor.map
