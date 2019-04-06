/**
 * Helper Class
 * Used for dynamic templates manipulation
 * */

export class HtmlTemplatesHelper {
  /*
  * Sets described by string depending if
  * there is an error, error and hit or nothing
  * */
  static setDescribedBy(errorMessage, config) {
    if (!errorMessage) {
      return config.hint ? `${config.id}-hint` : null;
    } else if (errorMessage && errorMessage.isInvalid) {
      return  config.hint ? `${config.id}-hint ${config.id}-error` : `${config.id}-error`;
    } else {
      return config.hint ? `${config.id}-hint` : null;
    }
    return null;
  }
}
