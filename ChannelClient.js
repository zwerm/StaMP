const axios = require('axios').default;

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

    /**
     * @param {string} senderId
     * @param {StaMP.Protocol.Letter} letter
     *
     * @return {AxiosPromise}
     */
    sendLetter(senderId, letter) {
        return axios.post(this.fullZwermUrl, { senderId, letter });
    }
}

module.exports = ChannelClient;
