/**
 * Copyright (c) 2018 NumberFour AG.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   NumberFour AG - Initial API and implementation
 */
package org.eclipse.n4js.ui.building;

import java.util.Deque;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.concurrent.ConcurrentLinkedDeque;

import org.eclipse.xtext.builder.impl.ToBeBuilt;

import com.google.common.collect.ImmutableSet;
import com.google.inject.Singleton;

/**
 * A queue of projects that are supposed to be removed from the Xtext index.
 */
@SuppressWarnings("restriction")
@Singleton
public class ClosedProjectQueue {

	/**
	 * Encapsulates the changes that need to be performed after one or more projects have been removed / closed.
	 */
	class Task {
		/**
		 * The names of the projects as encapsulated by this task.
		 */
		public final Set<String> projectNames;
		/**
		 * The built data for this task.
		 */
		public final ToBeBuilt toBeBuilt;

		private Task(Set<String> projectNames, ToBeBuilt toBeBuilt) {
			this.projectNames = projectNames;
			this.toBeBuilt = toBeBuilt;
		}

		/**
		 * Returns true if the is an empty task.
		 *
		 * @return true if empty.
		 */
		public boolean isEmpty() {
			return toBeBuilt.getToBeDeleted().isEmpty();
		}

		/**
		 * Add the tasks again to the top of the queue.
		 */
		public void reschedule() {
			insert(projectNames, toBeBuilt);
		}
	}

	/**
	 * Use a concurrent linked queue internally to allow concurrent read and add operations.
	 */
	private final Deque<Task> internalQueue = new ConcurrentLinkedDeque<>();

	/**
	 * Add the given projects to the end of the build queue.
	 *
	 * @param projectNames
	 *            the projects to be cleaned.
	 * @param toBeBuilt
	 *            their contents.
	 */
	void enqueue(Set<String> projectNames, ToBeBuilt toBeBuilt) {
		internalQueue.addLast(new Task(ImmutableSet.copyOf(projectNames), toBeBuilt));
	}

	/**
	 * Add the given projects to the beginning of the build queue.
	 *
	 * @param projectNames
	 *            the projects to be cleaned.
	 * @param toBeBuilt
	 *            their contents.
	 */
	void insert(Set<String> projectNames, ToBeBuilt toBeBuilt) {
		internalQueue.addFirst(new Task(ImmutableSet.copyOf(projectNames), toBeBuilt));
	}

	/**
	 * Return the next task that contains all the enqueued projects.
	 *
	 * @return the normalized task that has all the stuff that is to be done.
	 */
	Task exhaust() {
		Set<String> projectNames = new LinkedHashSet<>();
		ToBeBuilt toBeBuilt = new ToBeBuilt();
		Task next = internalQueue.poll();
		while (next != null) {
			projectNames.addAll(next.projectNames);
			toBeBuilt.getToBeDeleted().addAll(next.toBeBuilt.getToBeDeleted());
			next = internalQueue.poll();
		}
		return new Task(ImmutableSet.copyOf(projectNames), toBeBuilt);
	}

}
