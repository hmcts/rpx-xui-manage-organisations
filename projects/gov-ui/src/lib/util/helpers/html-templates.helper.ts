/**
 * Helper Class
 * Used for dynamic templates manipulation
 * */

export class HtmlTemplatesHelper {

  static setDescribedBy(errorMessage, config) {
    if (!(errorMessage && errorMessage.messages.length)) {
      return config.hint ? `${config.id}-hint` : null;
    }
    if (errorMessage && errorMessage.messages.length) {
      return  config.hint ? `${config.id}-hint ${config.id}-error` : `${config.id}-error`;
    }
    return null;
  }
}
