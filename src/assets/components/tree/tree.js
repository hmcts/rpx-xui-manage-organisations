var Tree = function(container) {
  this.container = container;
  this.items = container.find('.jui-tree__item');
  this.links = container.find('.jui-tree__doc-link');
  this.container.attr('role', 'tree');
  this.items.attr('role', 'treeitem');
  this.items.attr('aria-expanded', 'false');
  this.items.attr('tabindex', '-1');
  this.links.attr('role', 'treeitem');
  this.links.attr('tabindex', '-1');
  this.treeItems = this.container.find('[role=treeitem]');

  var openItem = this.container.find('.jui-tree__item--open');
  if(openItem[0]) {
    openItem.attr('tabindex', '0');
    openItem.attr('aria-expanded', 'true');
  } else {
    this.treeItems.first().attr('tabindex', '0');
  }

  this.keys = {left: 37, right: 39, up: 38, down: 40, enter: 13, space: 32};

  this.container.on('keydown', '[role=treeitem]', $.proxy(this, 'onTreeItemKeydown'));
  this.container.on('click', '[role=treeitem]', $.proxy(this, 'onTreeItemClick'));
};


Tree.prototype.onTreeItemKeydown = function(e) {
  var item = $(e.currentTarget);
  switch(e.keyCode) {
    case this.keys.enter:
    case this.keys.space:
      if(item.hasClass('jui-tree__item')) {
        if(item.hasClass('jui-tree__item--open')) {
          item.removeClass('jui-tree__item--open');
        } else {
          item.addClass('jui-tree__item--open');
        }
        e.preventDefault();
      } else {
        e.stopPropagation(); // We don’t want clicking on a child to fire on the parent
      }
      break;
    case this.keys.right:
      if(item.hasClass('jui-tree__item')) {
        item.addClass('jui-tree__item--open');
      }
      e.preventDefault();
      e.stopPropagation(); // We don’t want clicking on a child to fire on the parent
      break;
    case this.keys.left:
      if(item.hasClass('jui-tree__item')) {
        item.removeClass('jui-tree__item--open');
      } else {
        var parent = item.parents('[role=treeitem]');
        parent.attr('tabindex', '0');
        parent.focus();
        item.attr('tabindex', '-1');
        e.stopPropagation(); // We don’t want clicking on a child to fire on the parent
      }
      e.preventDefault();
      break;
    case this.keys.down:
      var newItem = this.getNextItem();
      if(newItem[0]) {
        item.attr('tabindex', '-1');
        newItem.attr('tabindex', '0');
        newItem.focus();
        e.stopPropagation(); // We don’t want clicking on a child to fire on the parent
      }
      e.preventDefault();
      break;
    case this.keys.up:
      newItem = this.getPreviousItem();
      if(newItem[0]) {
        item.attr('tabindex', '-1');
        newItem.attr('tabindex', '0');
        newItem.focus();
        e.stopPropagation(); // We don’t want clicking on a child to fire on the parent
      }
      e.preventDefault();
      break;
  }
};


Tree.prototype.onTreeItemClick = function(e) {
  var current = this.container.find('[tabindex="0"]');
  var item = $(e.currentTarget);

  if(item.hasClass('jui-tree__item')) {
    if(item.hasClass('jui-tree__item--open')) {
      this.hide(item);
    } else {
      this.show(item);
    }
  } else {
    e.stopPropagation(); // We don’t want clicking on a child to fire on the parent
  }
  current.attr('tabindex', '-1');
  item.attr('tabindex', '0');
};


Tree.prototype.getNextItem = function() {
  var current = this.container.find('[tabindex="0"]');
  var next = null;
  if(current.hasClass('jui-tree__item')) {
    if(current.hasClass('jui-tree__item--open')) {

      // Grab first child
      next = current.find('[role=treeitem]').first();
    } else {

      // Grab next folder
      next = current.next('[role=treeitem]');
    }
  } else {
    next = current.parent('.jui-tree__doc').next('.jui-tree__doc').find('[role=treeitem]');
    if(!next[0]) {
      var parentTreeItem = current.parents('[role=treeitem]');
      next = parentTreeItem.next('[role=treeitem]');
    }
  }
  return next;
};


Tree.prototype.getPreviousItem = function() {
  var current = this.container.find('[tabindex="0"]');
  var prev = null;

  // Folder
  if(current.hasClass('jui-tree__item')) {
    // Previous folder
    var previousFolder = current.prev('[role=treeitem]');
    if(previousFolder) {
      if(previousFolder.hasClass('jui-tree__item--open')) {
        prev = previousFolder.find('[role=treeitem]').last();
      } else {
        prev = previousFolder;
      }
    }
  // Child
  } else {
    prev = current.parent('.jui-tree__doc').prev('.jui-tree__doc').find('[role=treeitem]');
    if(!prev[0]) {
      prev = current.parents('[role=treeitem]');
    }
  }
  return prev;
};


Tree.prototype.show = function(item) {
  item.addClass('jui-tree__item--open');
  item.attr('aria-expanded', 'true');
};


Tree.prototype.hide = function(item) {
  item.removeClass('jui-tree__item--open');
  item.attr('aria-expanded', 'false');
};