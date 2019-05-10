"use strict";

const Select45 = (el) => {
	let obj;
	let index = 1;
	const fn = {
		addClasses: (node) => node.classList.add('select45'),
		addStyles: (node) => node.style.display = 'none',
		addElement: (node, referenceNode) => {
			referenceNode.parentNode.insertBefore(node, referenceNode.nextSibling);
		},
		selectOption: function (e) {
			const selection = e.target;
			const inner = selection.closest('ul');
			const parent = inner.parentNode.closest('ul');
			const target = document.getElementsByClassName(parent.dataset.target)[0];

			e.preventDefault();

			target.value = selection.dataset.val;
			parent.getElementsByClassName('select45__selected')[0].innerText = selection.innerText;
		},
		setOptions: function (node) {
			const options = node.getElementsByTagName('option');
			const new_obj = document.createElement('ul');
			const top_li = document.createElement('li');
			const inner_list = document.createElement('ul');

			this.addClasses(new_obj);

			new_obj.dataset.target = `select45-${index}`;
			top_li.setAttribute('tabindex', 1);
			top_li.classList.add('select45__wrap');
			top_li.addEventListener('click', this.toggleDropdown);

			for (let option of options) {
				const item = document.createElement('li');
				const anchor = document.createElement('a');

				if (option.hasAttribute('selected')) {
					const a = document.createElement('a');

					a.setAttribute('href', '#');
					a.classList.add('select45__selected');
					a.innerText = option.innerText;

					top_li.append(a);
				}

				anchor.setAttribute('href', '#');
				anchor.dataset.val = option.value;
				anchor.innerText = option.innerText;

				item.classList.add('select45__option');
				item.append(anchor);
				item.addEventListener('click', this.selectOption);

				inner_list.classList.add('select45__inner');
				inner_list.append(item);
			}

			top_li.append(inner_list);
			new_obj.append(top_li);

			this.addElement(new_obj, node);
		},
		getOffset: (node) => {
			const box = node.getBoundingClientRect();
			const body = document.body;
			const docEl = document.documentElement;
			const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
			const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
			const clientTop = docEl.clientTop || body.clientTop || 0;
			const clientLeft = docEl.clientLeft || body.clientLeft || 0;
			const top = box.top + scrollTop - clientTop;
			const left = box.left + scrollLeft - clientLeft;

			return {x: left, y: top};
		},
		setPosition: function (node) {
			const node_height = node.clientHeight;
			const node_offset = this.getOffset(node).y;
			const view_height = document.documentElement.clientHeight || window.innerHeight;

			if (node_height + node_offset > view_height - 15) {
				node.classList.add('top');
			}
		},
		toggleDropdown: function (e) {
			const inner = this.getElementsByClassName('select45__inner')[0];

			e.stopPropagation();
			inner.classList.remove('top');
			this.classList.toggle('active');
			fn.setPosition(inner);
		},
		init: function (node) {
			node.classList.add(`select45-${index}`);

			this.addStyles(node);
			this.setOptions(node);

			index++;
		}
	};

	if (typeof el === 'string') {
		if (el.charAt(0) === '#') {
			obj = document.getElementById(el.substring(1));
		} else if (el.charAt(0) === '.') {
			obj = document.getElementsByClassName(el.substring(1));
		}
	} else {
		obj = el;
	}

	// Check if it's a collection of elements (array of nodes)
	if (HTMLCollection.prototype.isPrototypeOf(obj)) {
		for (let node of obj) {
			fn.init(node);
		}
	} else {
		fn.init(obj);
	}

	document.addEventListener('click', () => {
		const wrappers = document.getElementsByClassName('select45__wrap');

		for (let wrapper of wrappers) {
			wrapper.classList.remove('active');
		}
	});
};
