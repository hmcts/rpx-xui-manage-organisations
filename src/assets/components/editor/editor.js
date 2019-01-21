// Check for contenteditable support
var isContentEditableSupported = 'contentEditable' in document.documentElement;


if(isContentEditableSupported == true) {

  var Editor = function(textarea) {
    this.textarea = textarea;
    this.container = $(textarea).parent();
    this.createToolbar();
    this.hideDefault();
    this.configureToolbar();
    this.keys = {
      left: 37,
      right: 39,
      up: 38,
      down: 40
    };
    this.container.on('click', '.jui-editor__toolbar-button', $.proxy(this, 'onButtonClick'));
    this.container.on('input', '.jui-editor__content', $.proxy(this, 'updateTextarea'));
    this.toolbar.on('keydown', $.proxy(this, 'onToolbarKeydown'));
  };


  Editor.prototype.onToolbarKeydown = function(e) {
    var focusableButton;
    switch(e.keyCode) {
      case this.keys.right:
      case this.keys.down:
        focusableButton = this.toolbar.find('button[tabindex=0]');
        var nextButton = focusableButton.next('button');
        if(nextButton[0]) {
          nextButton.focus();
          focusableButton.attr('tabindex', '-1');
          nextButton.attr('tabindex', '0');
        }
        break;
      case this.keys.left:
      case this.keys.up:
        focusableButton = this.toolbar.find('button[tabindex=0]');
        var previousButton = focusableButton.prev('button');
        if(previousButton[0]) {
          previousButton.focus();
          focusableButton.attr('tabindex', '-1');
          previousButton.attr('tabindex', '0');
        }
        break;
    }
  };


  Editor.prototype.getEnhancedHtml = function(val) {

    return `<div class="jui-editor__toolbar" role="toolbar">
              <button class="jui-editor__toolbar-button jui-editor__toolbar-button--bold" type="button" data-command="bold"><span class="govuk-visually-hidden">Bold</span></button>
              <button class="jui-editor__toolbar-button jui-editor__toolbar-button--italic" type="button" data-command="italic"><span class="govuk-visually-hidden">Italic</span></button>
              <button class="jui-editor__toolbar-button jui-editor__toolbar-button--underline" type="button" data-command="underline"><span class="govuk-visually-hidden">Underline</span></button>
              <button class="jui-editor__toolbar-button jui-editor__toolbar-button--unordered-list" type="button" data-command="insertUnorderedList"><span class="govuk-visually-hidden">Unordered list</span></button>
              <button class="jui-editor__toolbar-button jui-editor__toolbar-button--ordered-list" type="button" data-command="insertOrderedList"><span class="govuk-visually-hidden">Ordered list</span></button>
            </div>

            <div class="jui-editor__content" contenteditable="true" spellcheck="false"></div>`;
  };


  Editor.prototype.hideDefault = function() {
    this.label = this.container.find('label')[0];
    this.label.classList.add('govuk-visually-hidden');
    this.label.setAttribute('aria-hidden', true);
    this.textarea = this.container.find('textarea')[0];
    this.textarea.classList.add('govuk-visually-hidden');
    this.textarea.setAttribute('aria-hidden', true);
    this.textarea.setAttribute('tabindex', '-1');
  };


  Editor.prototype.createToolbar = function() {
    this.toolbar = document.createElement('div');
    this.toolbar.className = 'jui-editor';
    this.toolbar.innerHTML = this.getEnhancedHtml();
    this.container.append(this.toolbar);
    this.toolbar = this.container.find('.jui-editor__toolbar');
    this.container.find('.jui-editor__content').html(this.textarea.val());
  };


  Editor.prototype.configureToolbar = function() {
    this.buttons = this.container.find('.jui-editor__toolbar-button');
    this.buttons.prop('tabindex', '-1');
    var firstTab = this.buttons.first();
    firstTab.prop('tabindex', '0');
  };


  Editor.prototype.onButtonClick = function(e) {
    document.execCommand($(e.currentTarget).data('command'), false, null);
  };


  Editor.prototype.getContent = function() {
    return this.container.find('.jui-editor__content')[0].innerHTML;
  };


  Editor.prototype.updateTextarea = function(e) {
    var content = this.getContent();
    var textarea = this.container.find('.js-editor');
    document.execCommand('defaultParagraphSeparator', false, 'p');
    textarea.val(content);
  };


}