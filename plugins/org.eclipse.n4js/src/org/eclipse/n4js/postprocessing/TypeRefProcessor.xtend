/**
 * Copyright (c) 2021 NumberFour AG.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   NumberFour AG - Initial API and implementation
 */
package org.eclipse.n4js.postprocessing

import com.google.inject.Inject
import org.eclipse.emf.ecore.EObject
import org.eclipse.n4js.n4JS.N4JSASTUtils
import org.eclipse.n4js.n4JS.N4TypeAliasDeclaration
import org.eclipse.n4js.n4JS.TypeReferenceNode
import org.eclipse.n4js.ts.typeRefs.TypeRef
import org.eclipse.n4js.typesystem.utils.RuleEnvironment
import org.eclipse.n4js.typesystem.utils.TypeSystemHelper
import org.eclipse.n4js.utils.EcoreUtilN4

import static extension org.eclipse.n4js.typesystem.utils.RuleEnvironmentExtensions.*

/**
 * Processor for converting the raw type references provided by the parser into valid type references that
 * can be used internally.
 * <p>
 * Most type references created by the parser are already valid and can be used directly; the only exceptions
 * are:
 * <ul>
 * <li>{@link TypeRef#isAliasUnresolved() unresolved type aliases} must be converted to
 * {@link TypeRef#isAliasResolved() resolved type aliases} (note: type aliases in the TModule are not handled
 * here but in {@link TypeAliasProcessor}).
 * </ul>
 */
package class TypeRefProcessor extends AbstractProcessor {

	@Inject
	private TypeSystemHelper tsh;

	def void handleTypeRefs(RuleEnvironment G, EObject node, ASTMetaInfoCache cache) {
		var G2 = G;
		val checkForCyclicTypeAlias = node instanceof N4TypeAliasDeclaration;
		if (checkForCyclicTypeAlias) {
			G2 = G2.wrap;
			G2.requestReportCyclicTypeAlias();
		}

		for (TypeReferenceNode<?> typeRefNode : N4JSASTUtils.getContainedTypeReferenceNodes(node)) {
			val typeRefProcessed = doHandleTypeRef(G2, typeRefNode.typeRefInAST);
			if (typeRefProcessed !== null) {
				EcoreUtilN4.doWithDeliver(false, [
					typeRefNode.typeRef = typeRefProcessed;
				], typeRefNode);
			}
		}

		if (checkForCyclicTypeAlias) {
			val isCyclicTypeAlias = G2.didReportCyclicTypeAlias();
			EcoreUtilN4.doWithDeliver(false, [
				(node as N4TypeAliasDeclaration).cyclic = isCyclicTypeAlias;
			], node);
		}
	}

	def private TypeRef doHandleTypeRef(RuleEnvironment G, TypeRef typeRef) {
		if (typeRef === null) {
			return null;
		}
		// note: we also have to resolve type aliases that might be nested below a non-alias TypeRef!
		return tsh.resolveTypeAliases(G, typeRef);
	}
}
