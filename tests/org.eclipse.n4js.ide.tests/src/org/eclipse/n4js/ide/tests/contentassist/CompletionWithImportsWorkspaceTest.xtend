/**
 * Copyright (c) 2020 NumberFour AG.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 * Contributors:
 * NumberFour AG - Initial API and implementation
 */
package org.eclipse.n4js.ide.tests.contentassist;

import java.util.List
import org.eclipse.n4js.ide.tests.helper.server.AbstractCompletionTest
import org.junit.Test

/**
 * Code completion tests for scenarios that also might add an import statement
 * from dependency projects
 */
public class CompletionWithImportsWorkspaceTest extends AbstractCompletionTest {

	/** Some default modules that export a number of classes for all tests. */
	override final List<Pair<String, List<Pair<String, String>>>> getDefaultTestWorkspace() {
		return #[
			"P1*" -> #[
				CFG_DEPENDENCIES -> '''
					P2,
					SomeNPM,
					@n4jsd/SomeNPM
				'''
			],
			"P2" -> #[
				"LibXY" -> '''
					export public class XY {}
				'''
			],

			CFG_NODE_MODULES + "SomeNPM" -> #[
				"index" -> '''//some npm js code''',
				"AnotherModule.js" -> '''//some npm js code'''
			],
			CFG_NODE_MODULES + "@n4jsd/SomeNPM" -> #[
				"index.n4jsd" -> '''
					export public external class A1 {}
				''',
				"AnotherModule.n4jsd" -> '''
					export public external class AnotherClass {}
				''',
				PACKAGE_JSON -> '''
					{
						"name": "@n4jsd/SomeNPM",
						"version": "0.0.1",
						"n4js": {
							"projectType": "definition",
							"definesPackage": "SomeNPM",
							"sources": {
								"source": [
									"src"
								]
							}
						}
					}
				'''
			]
		];
	}

	@Test
	def void testRedirectionForDefinitionProjects() {
		testAtCursor('''
			let x = new A1<|>
		''', ''' 
			(A1, Class, index, , , 00000, , , , ([0:12 - 0:14], A1), [([0:0 - 0:0], import {A1} from "SomeNPM";
			)], [], , )
		''');
	}

	@Test
	def void testNoRedirectionForNormalProjects() {
		testAtCursor('''
			let x = new XY<|>
		''', ''' 
			(XY, Class, LibXY, , , 00000, , , , ([0:12 - 0:14], XY), [([0:0 - 0:0], import {XY} from "LibXY";
			)], [], , )
		''');
	}

	@Test
	def void testAddImportFromDefinitionProject() {
		testAtCursor('''
			AnotherClass<|>
		''', ''' 
			(AnotherClass, Class, AnotherModule, , , 00000, , , , ([0:0 - 0:12], AnotherClass), [([0:0 - 0:0], import {AnotherClass} from "SomeNPM/AnotherModule";
			)], [], , )
		''');
	}
}
