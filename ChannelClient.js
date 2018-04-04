const axios = require('axios').default;
const crypto = require('crypto');

class ChannelClient {
    /**
     *
     * @param {string} zwermBaseUrl
     * @param {string} botTeam
     * @param {string} botId
     * @param {string} channelId
     * @param {string} authToken
     */
    constructor(zwermBaseUrl, botTeam, botId, channelId, authToken) {
        /**
         *
         * @type {string}
         * @private
         */
        this._zwermBaseUrl = zwermBaseUrl;
        /**
         *
         * @type {string}
         * @private
         */
        this._botTeam = botTeam;
        /**
         *
         * @type {string}
         * @private
         */
        this._botId = botId;
        /**
         *
         * @type {string}
         * @private
         */
        this._channelId = channelId;
        /**
         *
         * @type {string}
         * @private
         */
        this._authToken = authToken;
    }

    // region getters & setters
    /**
     *
     * @return {'sha256'}
     * @static
     * @constant
     */
    static get HMAC_HEADER_SIGNATURE_ALGORITHM() {
        return 'sha256';
    }

    // region authToken (get & set)
    /**
     *
     * @return {string}
     */
    get authToken() {
        return this._authToken;
    };

    /**
     *
     * @param {string} authToken
     */
    set authToken(authToken) {
        this._authToken = authToken;
    };

    // endregion
    /**
     *
     * @return {string}
     */
    get fullZwermUrl() {
        return `${this._zwermBaseUrl}/bots/${this._botTeam}/${this._botId}/channels/${this._channelId}`;
    }

    // endregion

    // noinspection JSMethodCanBeStatic
    /**
     * Computes the HMAC-X signature for the given raw request body, using the given string.
     *
     * 'X' in this case is the algorithm, usually sha1 or sha256.
     *
     * The signature should be stored on the request as 'x-stamp-signature'
     *
     * @param {'sha1'|'sha256'|string} algorithm
     * @param {string|Buffer} key
     * @param {string} rawRequestBody
     *
     * @return {string} the computed signature of the raw request body, in uppercase.
     * @protected
     * @instance
     */
    _computeRequestSignature(algorithm, key, rawRequestBody) {
        return crypto.createHmac(algorithm, key)
                     .update(new Buffer(rawRequestBody))
                     .digest('hex')
                     .toUpperCase();
    }

    /**
     * Builds the value for the x-stamp-signature header.
     *
     * @param {Object} requestBody
     *
     * @return {string}
     * @private
     */
    _buildSignatureHeaderForRequest(requestBody) {
        return this._computeRequestSignature(this.constructor.HMAC_HEADER_SIGNATURE_ALGORITHM, this._authToken, JSON.stringify(requestBody));
    }

    /**
     *
     * @param {Object} requestBody
     *
     * @return {{'X-StaMP-Signature': string, 'X-Clacks-Overhead': 'GNU Terry Pratchett'}}
     * @private
     */
    _buildHeadersForRequest(requestBody) {
        return {
            'X-StaMP-Signature': this._buildSignatureHeaderForRequest(requestBody),
            'X-Clacks-Overhead': 'GNU Terry Pratchett'
        };
    }

    /**
     * @param {string} senderId
     * @param {StaMP.Protocol.Letter} letter
     *
     * @return {AxiosPromise}
     */
    sendLetter(senderId, letter) {
        const body = {
            token: this._authToken,
            senderId,
            letter
        };

        const headers = this._buildHeadersForRequest(body);

        return axios.post(this.fullZwermUrl, body, { headers });
    }
}

module.exports = ChannelClient;
