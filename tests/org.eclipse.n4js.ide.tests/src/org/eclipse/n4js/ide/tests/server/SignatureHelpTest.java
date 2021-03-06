/**
 * Copyright (c) 2020 NumberFour AG.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   NumberFour AG - Initial API and implementation
 */
package org.eclipse.n4js.ide.tests.server;

import org.eclipse.n4js.ide.tests.helper.server.AbstractSignatureHelpTest;
import org.eclipse.xtext.testing.SignatureHelpConfiguration;
import org.junit.Test;

/**
 * Signature help test class
 */
public class SignatureHelpTest extends AbstractSignatureHelpTest {

	/** Example test for signature help */
	@Test
	public void test() throws Exception {
		SignatureHelpConfiguration shc = new SignatureHelpConfiguration();
		shc.setModel("class A { foo(a: A) { } } class Main { main(a: A) { a.foo(null); } }");
		shc.setLine(0);
		shc.setColumn("class A { foo(a: A) { } } class Main { main(a: A) { a.fo".length());
		shc.setExpectedSignatureHelp("(, , [])");

		test(shc);
	}

}
