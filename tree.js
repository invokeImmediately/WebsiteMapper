/*!*************************************************************************************************
 * WsMapper.tree.js
 * -------------------------------------------------------------------------------------------------
 * SUMMARY: Implementation of a tree ADT for use on the Website Mapper project.
 *
 * AUTHOR: Daniel Rieck [daniel.rieck@wsu.edu] (https://github.com/invokeImmediately)
 *
 * REPOSITORY: https://github.com/invokeImmediately/WSU-UE---JS
 *
 * LICENSE: ISC - Copyright (c) 2019 Daniel C. Rieck.
 *
 *   Permission to use, copy, modify, and/or distribute this software for any purpose with or
 *   without fee is hereby granted, provided that the above copyright notice and this permission
 *   notice appear in all copies.
 *
 *   THE SOFTWARE IS PROVIDED "AS IS" AND DANIEL RIECK DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS
 *   SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL
 *   DANIEL RIECK BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY
 *   DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF
 *   CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 *   PERFORMANCE OF THIS SOFTWARE.
 **************************************************************************************************/

////////////////////////////////////////////////////////////////////////////////////////////////////
// TABLE OF CONTENTS
// -----------------
//   §1: Script dependencies..................................................................37
//     §1.1: Node.js includes.................................................................40
//     §1.2: Namespace declaration............................................................47
//   §2: Class declarations...................................................................52
//     §2.1: WsMapper.Tree....................................................................55
//     §2.2: WsMapper.TreeNode...............................................................136
//   §3: Class testing.......................................................................263
////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
// §1: Script dependencies

////////
// §1.1: Node.js includes

var tty = require('tty');
var ttys = require('ttys');
var stdout = ttys.stdout;

////////
// §1.2: Namespace declaration

var WsMapper = WsMapper || {};

////////////////////////////////////////////////////////////////////////////////////////////////////
// §2: Class declarations

////////
// §2.1: WsMapper.Tree

/**
 * @todo Add inline documentation.
 * @todo Finish writing class.
 */
WsMapper.Tree = class Tree {
	/**
	 * @todo Add inline documentation.
	 */
	constructor( rootValue ) {
		this.root = new WsMapper.TreeNode(
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

////////
// §2.2: WsMapper.TreeNode

/**
 * @todo Add inline documentation.
 * @todo Finish writing class.
 */
WsMapper.TreeNode = class TreeNode {
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

////////////////////////////////////////////////////////////////////////////////////////////////////
// §3: Class testing

WsMapper.testTrees = function () {
	var tree = new WsMapper.Tree( 'Node 1' );
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

	console.log( tree.getPrintStr() );
}

WsMapper.testTrees();
