/* eslint-disable no-undef */

// Check for contenteditable support
const isContentEditableSupported = 'contentEditable' in document.documentElement;

if (isContentEditableSupported === true) {
  const Editor = function (textarea) {
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

  Editor.prototype.onToolbarKeydown = function (e) {
    let moveNext;

    switch (e.keyCode) {
      case this.keys.right:
      case this.keys.down:
        moveNext = true;
        break;

      case this.keys.left:
      case this.keys.up:
        moveNext = false;
        break;

      default:
        return;
    }

    const focusableButton = this.toolbar.find('button[tabindex=0]');
    const targetButton = moveNext
      ? focusableButton.next('button')
      : focusableButton.prev('button');

    if (targetButton[0]) {
      targetButton.focus();
      focusableButton.attr('tabindex', '-1');
      targetButton.attr('tabindex', '0');
    }
  };

  Editor.prototype.getEnhancedHtml = function () {
    return `<div class="jui-editor__toolbar" role="toolbar">
              <button class="jui-editor__toolbar-button jui-editor__toolbar-button--bold" type="button" data-command="bold"><span class="govuk-visually-hidden">Bold</span></button>
              <button class="jui-editor__toolbar-button jui-editor__toolbar-button--italic" type="button" data-command="italic"><span class="govuk-visually-hidden">Italic</span></button>
              <button class="jui-editor__toolbar-button jui-editor__toolbar-button--underline" type="button" data-command="underline"><span class="govuk-visually-hidden">Underline</span></button>
              <button class="jui-editor__toolbar-button jui-editor__toolbar-button--unordered-list" type="button" data-command="insertUnorderedList"><span class="govuk-visually-hidden">Unordered list</span></button>
              <button class="jui-editor__toolbar-button jui-editor__toolbar-button--ordered-list" type="button" data-command="insertOrderedList"><span class="govuk-visually-hidden">Ordered list</span></button>
            </div>

            <div class="jui-editor__content" contenteditable="true" spellcheck="false"></div>`;
  };

  Editor.prototype.hideDefault = function () {
    this.label = this.container.find('label')[0];
    this.label.classList.add('govuk-visually-hidden');
    this.label.setAttribute('aria-hidden', true);
    this.textarea = this.container.find('textarea')[0];
    this.textarea.classList.add('govuk-visually-hidden');
    this.textarea.setAttribute('aria-hidden', true);
    this.textarea.setAttribute('tabindex', '-1');
  };

  Editor.prototype.createToolbar = function () {
    this.toolbar = document.createElement('div');
    this.toolbar.className = 'jui-editor';
    this.toolbar.innerHTML = this.getEnhancedHtml();
    this.container.append(this.toolbar);
    this.toolbar = this.container.find('.jui-editor__toolbar');
    this.container.find('.jui-editor__content').html(this.textarea.val());
  };

  Editor.prototype.configureToolbar = function () {
    this.buttons = this.container.find('.jui-editor__toolbar-button');
    this.buttons.prop('tabindex', '-1');
    const firstTab = this.buttons.first();
    firstTab.prop('tabindex', '0');
  };

  Editor.prototype.onButtonClick = function (e) {
    e.preventDefault();
    this.applyCommand($(e.currentTarget).data('command'));
    this.updateTextarea();
  };

  Editor.prototype.applyCommand = function (command) {
    switch (command) {
      case 'bold':
        this.wrapSelection('strong');
        break;
      case 'italic':
        this.wrapSelection('em');
        break;
      case 'underline':
        this.wrapSelection('u');
        break;
      case 'insertUnorderedList':
        this.wrapSelectionInList('ul');
        break;
      case 'insertOrderedList':
        this.wrapSelectionInList('ol');
        break;
    }
  };

  Editor.prototype.getContentElement = function () {
    return this.container.find('.jui-editor__content')[0];
  };

  Editor.prototype.getSelectionRange = function () {
    const selection = globalThis.getSelection();
    const content = this.getContentElement();

    if (!selection || selection.rangeCount === 0) {
      return null;
    }

    const range = selection.getRangeAt(0);
    const selectedNode = range.commonAncestorContainer.nodeType === 1
      ? range.commonAncestorContainer
      : range.commonAncestorContainer.parentNode;

    return selectedNode && content.contains(selectedNode) ? range : null;
  };

  Editor.prototype.getEditableRange = function () {
    const selectedRange = this.getSelectionRange();

    if (selectedRange) {
      return selectedRange;
    }

    const content = this.getContentElement();
    const range = document.createRange();
    const selection = globalThis.getSelection();
    content.focus();
    range.selectNodeContents(content);
    range.collapse(false);

    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }

    return range;
  };

  Editor.prototype.setCaretAfter = function (node) {
    const selection = globalThis.getSelection();

    if (!selection) {
      return;
    }

    const range = document.createRange();
    range.setStartAfter(node);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  Editor.prototype.setCaretInside = function (node) {
    const selection = globalThis.getSelection();

    if (!selection) {
      return;
    }

    const range = document.createRange();
    range.selectNodeContents(node);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  Editor.prototype.wrapSelection = function (tagName) {
    const range = this.getEditableRange();

    if (range.collapsed) {
      return;
    }

    const wrapper = document.createElement(tagName);
    wrapper.appendChild(range.extractContents());
    range.insertNode(wrapper);
    this.setCaretAfter(wrapper);
  };

  Editor.prototype.wrapSelectionInList = function (tagName) {
    const range = this.getEditableRange();
    const list = document.createElement(tagName);
    const listItem = document.createElement('li');

    if (range.collapsed) {
      listItem.appendChild(document.createElement('br'));
      list.appendChild(listItem);
      range.insertNode(list);
      this.setCaretInside(listItem);
      return;
    }

    listItem.appendChild(range.extractContents());
    list.appendChild(listItem);
    range.insertNode(list);
    this.setCaretAfter(list);
  };

  Editor.prototype.getContent = function () {
    return this.getContentElement().innerHTML;
  };

  Editor.prototype.updateTextarea = function () {
    const content = this.getContent();
    const textarea = this.container.find('.js-editor');
    textarea.val(content);
  };
}
