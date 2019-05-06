// Tree (root node)
// ├─→ This is a child node.
// │   ├─→ This is a child of a child node.
// │   │   ├─→ This is yet another child of a child node.
// │   │   ├─→ This is yet another child of a child node.
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

var WebsiteMapper = WebsiteMapper || {};

WebsiteMapper.Tree = class Tree {
	/**
	 * @todo Add inline documentation.
	 */
	constructor( rootValue ) {
		this.root = new WebsiteMapper.TreeNode(
			rootValue,
			0,
			0,
			undefined,
			this
		);
		this.treeType = typeof rootValue;
		this.lastAdded = this.root;
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
		var curIdx = [0];
		var curDepth = 0
		var curNode = this.root.children[curIdx];
		var outHdr = '';
		var outStr = outHdr + this.root.value + '\n';
		var counter = 0;

		curIdx.push( 0 );
		while ( curNode !== undefined && counter < 100 ) {
			outHdr = outHdr.replace( '├─→', '│  ' );
			outHdr = outHdr.replace( '└─→', '   ' );
			if ( curNode.getSibNext() === undefined ) {
				outHdr += '└─→ ';
			} else {
				outHdr += '├─→ ';				
			}
			outStr += outHdr + curNode.value + '\n';
			if ( curNode.children.length ) {
				curNode = curNode.children[0];
			} else if ( curNode.getSibNext() !== undefined ) {
				curNode = curNode.getSibNext();
				outHdr = outHdr.slice(0, outHdr.length - 4 );
			} else {
				curNode = curNode.parent;
				outHdr = outHdr.slice(0, outHdr.length - 4 );
				while (
					curNode !== undefined &&
					curNode.getSibNext() === undefined &&
					counter < 100
				) {
					curNode = curNode.parent;
					outHdr = outHdr.slice(0, outHdr.length - 4 );
					counter++;
				}
				if ( curNode !== undefined ) {
					curNode = curNode.getSibNext();
					outHdr = outHdr.slice(0, outHdr.length - 4 );
				}
			}
			counter++;
		}

		return outStr;
	}
}

/**
 * @todo Add inline documentation.
 * @todo Finish writing class.
 */
WebsiteMapper.TreeNode = class TreeNode {
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
	 * Append a new node to this node's children.
	 * 
	 * @todo Finish inline documentation.
	 */
	addChild( value ) {
		var newNode = new TreeNode(
			value,
			this.children.length,
			this.depth + 1,
			this,
			this.tree
		);
		this.children.push( newNode );
		this.tree.lastAdded = newNode;

		return newNode;
	}

	/**
	 * @todo Append a new node to this node's siblings.
	 */
	addSib( value ) {
		var newNode = undefined;

		if ( this.parent !== undefined ) {
			newNode = new TreeNode(
				value,
				this.parent.children.length,
				this.depth,
				this.parent,
				this.tree
			);
			this.parent.children.push( newNode );
			this.tree.lastAdded = newNode;
		}

		return newNode;
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

		if (
			this.parent === undefined ||
			this.idx >= this.parent.children.length - 1
		) {
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
	var tree = new WebsiteMapper.Tree( 'Node 1' );
	var node;
	var node2;
	var foundNode;

	tree.root.addChild( 'Node 2' );
	node = tree.root.addChild( 'Node 3' );
	node.addChild( 'Node 4' );
	node2 = node.addChild( 'Node 5' );
	node.addChild( 'Node 6' );
	node.addSib( 'Node 7' );
	tree.root.addSib( 'Node 8' );
	node2.addChild( 'Node 9' );
	node2.addChild( 'Node 10' );

	console.log( 'Contents of tree:\n-----------------\n' +
		tree.getPrintStr() );
}

testTrees();
