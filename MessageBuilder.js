/**
 *
 */
class MessageBuilder {
    /**
     * Expands an ssml text string, replacing '{text}' with the given text value. If 'false' is passed, then nothing is done
     *
     * @param {StaMP.Protocol.Messages.SSMLText} ssmlText
     * @param {?string} text
     *
     * @return {StaMP.Protocol.Messages.SSMLText}
     */
    static expandSSMLText(ssmlText, text) {
        return typeof ssmlText === 'string' ? ssmlText.replace('{text}', text) : ssmlText;
    }

    /**
     * Removes any emotes from ssmlText, as polly will try and speak them as words
     *
     * @param {StaMP.Protocol.Messages.SSMLText} ssmlText
     *
     * @return {StaMP.Protocol.Messages.SSMLText}
     */
    static removeEmotes(ssmlText) {
        if (typeof ssmlText === 'string') {
            const eyes = [':', ';'];
            const faces = [
                ')',
                ']',
                '}',
                '(',
                '[',
                '{',
                'P',
                'p',
                '<',
                '>',
                '|',
                '/',
                '\\',
                '@',
                '*'
            ];

            const emotes = eyes.map(eye => faces.map(face => `${eye}${face}`))
                               .reduce((acc, result) => acc.concat(result), []);

            return emotes.reduce((acc, emote) => acc.replace(` ${emote}`, ''), ssmlText).trim();
        }

        return ssmlText;
    }

    /**
     * Creates a new text-type message
     *
     * @param {string} text
     * @param {StaMP.Protocol.Messages.SSMLText} [ssmlText='<p>{text}</p>'] ssml text for speaking. '{text}' can be used to represent the original text,
     *                                                  being replaced with `ssml.replace('{text}', text)`. 'false' means no speech
     * @param {string} [from='sever']
     *
     * @return {StaMP.Protocol.Messages.StandardisedTextMessage}
     */
    static createTextMessage(text, ssmlText = '<p>{text}</p>', from = this.FROM) {
        return {
            from,
            type: 'text',
            text,
            ssmlText: MessageBuilder.expandSSMLText(MessageBuilder.removeEmotes(ssmlText), text)
        };
    }

    /**
     * Creates a new text-type message
     *
     * @param {StaMP.Protocol.Messages.TypingState} state
     * @param {string} [from='sever']
     *
     * @return {StaMP.Protocol.Messages.StandardisedTypingMessage}
     */
    static createTypingMessage(state, from = this.FROM) {
        return {
            from,
            type: 'typing',
            state
        };
    }

    /**
     * Creates a new image-type message
     *
     * @param {string} url
     * @param {StaMP.Protocol.Messages.SSMLText} [ssmlText='<p>{text}</p>'] ssml text for speaking. '{text}' can be used to represent the original text,
     *                                                  being replaced with `ssml.replace('{text}', text)`. 'false' means no speech
     * @param {string} [from='sever']
     *
     * @return {StaMP.Protocol.Messages.StandardisedImageMessage}
     */
    static createImageMessage(url, ssmlText = false, from = this.FROM) {
        return {
            from,
            type: 'image',
            url,
            ssmlText: MessageBuilder.expandSSMLText(MessageBuilder.removeEmotes(ssmlText), null)
        };
    }

    /**
     * Creates a new text-type message
     *
     * @param {string} text
     * @param {Array.<StaMP.Protocol.Messages.StandardisedQuickReply>} replies
     * @param {StaMP.Protocol.Messages.SSMLText} [ssmlText='<p>{text}</p>'] ssml text for speaking. '{text}' can be used to represent the original text,
     *                                                  being replaced with `ssml.replace('{text}', text)`. 'false' means no speech
     * @param {string} [from='sever']
     *
     * @return {StaMP.Protocol.Messages.StandardisedQuickReplyMessage}
     */
    static createQuickReplyMessage(text, replies, ssmlText = '<p>{text}</p>', from = this.FROM) {
        return {
            from,
            type: 'quick_reply',
            text,
            ssmlText: MessageBuilder.expandSSMLText(MessageBuilder.removeEmotes(ssmlText), text),
            quickReplies: replies
        };
    }

    /**
     *
     * @param {string} title
     * @param {string} [payload=text]
     * @param {?string} [imageUrl=null]
     *
     * @return {StaMP.Protocol.Messages.StandardisedQuickReply}
     */
    static createQuickReply(title, payload = title, imageUrl = null) {
        return { title, payload, imageUrl };
    }

    constructor() {

    }
}

module.exports = MessageBuilder;
