// Tree (root node)
// ├─→ This is a child node.
// │   ├─→ This is a child of a child node.
// │   │   └─→ This is yet another child of a child node.
// │   └─→ Testing 1 2 3.
// │       └─→ Bleh.
// └─→ This is a sibling child node.
// 

// ~Step     Indendation String      Value
// -----     ------------------      -----
// 1         ''                      Tree (root node)
// 2         '├─→ '                  This is a child node.
// 3a        '│   '                  This is a child of a child node.
// 3b        '│   ├─→ '              This is a child of a child node.
// 4a        '│   │   '              This is yet another child of a child node.
// 4b        '│   │   └─→ '          This is yet another child of a child node.
// 5a        '│   │   '              Testing 1 2 3.
// 5b        '│   │   '              Testing 1 2 3.

// Printing procedure (Work in Progress):
// -------------------------------------
// 1. Start at root, which should not be indented. Push an index onto the depth array, setting it to zero.
// 2. If there is a node at the current depth, add the indentation string plus the value of current node plus a newline to the output. Otherwise go to 4.
// 3a. If the current node does not have children left, goto 4. Otheriwse, goto 3b after processing the indentation string as follows:
// 3a1. Replace all instances of '├─→ ' in the indentation string with '│   '.
// 3a2. Replace all instances of '└─→ ' in the indentation string with '    '.
// 3a3. If the child node has an additional sibling, then append the substring '├─→ ' to the indentation string.
// 3a4. Otherwise, append the substring '└─→ ' to the indentation string.
// 3b. Set the current node to the child.
// 3c. Goto 2.
// 4. If there is not a parent, goto 5. Otherwise, go back to the parent after trimming 4 characters off the end of the indentation string and doing the following:
// 4a. Pop the depth array.
// 4b. Iterate the index at the end of the depth array.
// 5. End the operation, returning the final output.

// Notes on printing procedure:
// ---------------------------
// Should maintain an array that stores the index of the active child at the current depth. 

/**
 * @todo Add inline documentation.
 * @todo Finish writing class.
 */
class Tree {
	/**
	 * @todo Add inline documentation.
	 */
	constructor( rootValue ) {
		this.root = new TreeNode( rootValue, 0, 0, undefined, this );
		this.treeType = typeof rootValue;
	}

	/**
	 * @todo Add inline documentation.
	 */
	findFirst( value ) {
		return this.root.findFirst( value );
	}

	/**
	 * @todo Add inline documentation.
	 * @todo Finish writing function.
	 */
	getPrintStr() {
		// ...
		console.log( 'Tree.getPrintStr() -- Still under construction.' )
	}
}

/**
 * @todo Add inline documentation.
 * @todo Finish writing class.
 */
class TreeNode {
	/**
	 * @todo Add inline documentation.
	 */
	constructor( value, idx, depth, parentNode, parentTree ) {
		this.value = value;
		this.idx = idx;
		this.depth = depth;
		this.parent = parentNode;
		this.tree = parentTree
		this.children = [];
	}

	/**
	 * @todo Add inline documentation.
	 */
	addChild( value ) {
		this.children.push( new TreeNode( value, this.children.length, this.depth + 1, this, this.tree ) );

		return this.children[ this.children.length - 1 ];
	}

	/**
	 * @todo Add inline documentation.
	 */
	findFirst( value ) {
		var result = undefined;

		if ( value == this.value ) {
			result = this;
		} else if ( this.children.length ) {
			for ( var jdx = 0; !result && jdx < this.children.length; jdx++ ) {
				result = this.children[ jdx ].findFirst( value );
			}
		}

		return result;
	}

	/**
	 * @todo Add inline documentation.
	 */
	getPathToRoot() {
		var path = [];
		var curNode = this.parent;

		path.splice( 0, 0, this.idx );
		for ( var jdx = this.depth - 1; jdx > 0; jdx-- ) {
			path.splice( 0, 0, curNode.idx);
			curNode = curNode.parent;
		}

		return path;
	}

	/**
	 * @todo Add inline documentation.
	 */
	getSibNext() {
		var next;

		if ( this.idx >= this.parent.children.length - 1 ) {
			next = undefined; 
		} else {
			next = this.parent.children[ this.idx + 1 ];
		}

		return next;
	}

	/**
	 * @todo Add inline documentation.
	 */
	getSibPrev() {
		var prev;

		if ( this.idx == 0 ) {
			prev = undefined; 
		} else {
			prev = this.parent.children[ this.idx - 1 ];
		}

		return prev;
	}
}

function testTrees() {
	var tree = new Tree( 'Node 1' );
	var node;
	var foundNode;

	tree.root.addChild( 'Node 2' );
	node = tree.root.addChild( 'Node 3' );
	node.addChild( 'Node 4' );
	node.addChild( 'Node 5' );
	node.addChild( 'Node 6' );

	foundNode = tree.findFirst( 'Node 3' );
	console.log( foundNode );
}

testTrees();
