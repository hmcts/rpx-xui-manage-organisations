const ERROR_MESSAGE_S2S_TOKEN_GENERATION = 'Error finding image at path, please add it.';

class S2sTokenError extends Error {
    constructor(message) {
        super(message);

        /**
         * The parent constructor sets the name property to 'Error' therefore let's
         * set it to FulfillmentError
         */
        this.name = 'S2STokenError';
    }
}

/**
 * We extend the javascript Error class, so that we can pass back an error code, the path at which there
 * is no image, and a human readable message.
 *
 * The parent constructor sets the name property to 'Error' therefore let's
 * set it to ImageNotFoundError.
 */
class S2sTokenGenerationError extends S2sTokenError {

    constructor(path) {

        const message = ERROR_MESSAGE_S2S_TOKEN_GENERATION;

        super(message);

        this.name = 'S2sTokenGenerationError';
        this.errorCode = ERROR_MESSAGE_S2S_TOKEN_GENERATION;
        this.humanMessage = message;
        this.path = path;
    }
}

module.exports = {
  S2sTokenGenerationError,
};
