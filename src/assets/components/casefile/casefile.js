var Casefile = function(container) {
  this.container = container;
  this.items = container.find('.jui-cf__files');
  this.comments = container.find('.jui-cf__document-comments');
  this.itemsButton = container.find('.jui-cf__toolbar-button--items');
  this.commentsButton = container.find('.jui-cf__toolbar-button--comments');
  this.itemsButton.on('click', $.proxy(this, 'onButtonItemsClick'));
  this.commentsButton.on('click', $.proxy(this, 'onButtonCommentsClick'));
  this.showItems();
  this.hideComments();
};


Casefile.prototype.hideComments = function() {
  this.container.removeClass('jui-cf--show-comments');
  this.comments.hide();
  this.commentsButton.attr('aria-pressed', 'false');
};


Casefile.prototype.hideItems = function() {
  this.items.hide();
  this.itemsButton.attr('aria-pressed', 'false');
};


Casefile.prototype.showComments = function() {
  this.container.addClass('jui-cf--show-comments');
  this.comments.show();
  this.commentsButton.attr('aria-pressed', 'true');
};


Casefile.prototype.showItems = function() {
  this.items.show();
  this.itemsButton.attr('aria-pressed', 'true');
};


Casefile.prototype.onButtonItemsClick = function(e) {
  this.showItems();
  this.hideComments();
};


Casefile.prototype.onButtonCommentsClick = function(e) {
  this.showComments();
  this.hideItems();
};