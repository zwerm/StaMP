/**
 *
 */
class MessageBuilder {
    /**
     * Processes an SSML text string; this includes removing all emotes, expanding ampersands, and finally expanding it.
     * If 'false' is passed, nothing is done.
     *
     * @param {StaMP.Protocol.Messages.SSMLText} ssmlText
     * @param {?string} text
     *
     * @return {StaMP.Protocol.Messages.SSMLText}
     */
    static processSSMLText(ssmlText, text) {
        return MessageBuilder.expandAmpersand(
            MessageBuilder.removeEmotes(
                MessageBuilder.expandSSMLText(ssmlText, text)
            )
        );
    }

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
            const eyes = [':', ';', '&'];
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
     * Replaces the character '&' with the word 'and'
     *
     * @param {StaMP.Protocol.Messages.SSMLText} ssmlText
     *
     * @return {StaMP.Protocol.Messages.SSMLText}
     */
    static expandAmpersand(ssmlText) {
        if (typeof ssmlText === 'string') {
            return ssmlText.replace(/&/g, 'and');
        }

        return ssmlText;
    }

    /**
     * Creates a new query-type message
     *
     * @param {string} originator The name of the whatever that this StandardisedMetaMessage originated from
     * @param {StaMP.Protocol.Messages.StandardisedMetaMessageData} data
     * @param {string} [from='server']
     *
     * @return {StaMP.Protocol.Messages.StandardisedMetaMessage}
     */
    static createMetaMessage(originator, data, from = 'server') {
        return {
            $StaMP: true,
            from,
            type: 'meta',
            originator,
            data
        };
    }

    /**
     * Creates a new query-type message
     *
     * @param {string} query
     * @param {string} [text=query] the text that gets displayed for this message, in the case that the query is a payload or postback value
     * @param {StaMP.Protocol.Messages.StandardisedQueryMessageData} [data={}]
     * @param {string} [from='user']
     *
     * @return {StaMP.Protocol.Messages.StandardisedQueryMessage}
     */
    static createQueryMessage(query, text = query, data = {}, from = 'user') {
        return {
            $StaMP: true,
            from,
            type: 'query',
            query,
            text,
            data
        };
    }

    /**
     * Creates a new typing-type message
     *
     * @param {StaMP.Protocol.Messages.TypingState} state
     * @param {string} [from='server']
     *
     * @return {StaMP.Protocol.Messages.StandardisedTypingMessage}
     */
    static createTypingMessage(state, from = 'server') {
        return {
            $StaMP: true,
            from,
            type: 'typing',
            state
        };
    }

    /**
     * Creates a new text-type message
     *
     * @param {string} text
     * @param {StaMP.Protocol.Messages.SSMLText} [ssmlText='<p>{text}</p>'] ssml text for speaking. '{text}' can be used to represent the original text,
     *                                                  being replaced with `ssml.replace('{text}', text)`. 'false' means no speech
     * @param {string} [from='server']
     *
     * @return {StaMP.Protocol.Messages.StandardisedTextMessage}
     */
    static createTextMessage(text, ssmlText = '<p>{text}</p>', from = 'server') {
        return {
            $StaMP: true,
            from,
            type: 'text',
            text,
            ssmlText: MessageBuilder.processSSMLText(ssmlText, text)
        };
    }

    /**
     * Creates a new location-type message
     *
     * @param {string|number} lat
     * @param {string|number} lng
     * @param {?string} [mapUrl=null]
     * @param {?string} [label=null]
     * @param {string} [from='user']
     *
     * @return {StaMP.Protocol.Messages.StandardisedLocationMessage}
     */
    static createLocationMessage(lat, lng, mapUrl = null, label = null, from = 'user') {
        return {
            $StaMP: true,
            from,
            type: 'location',
            lat,
            lng,
            mapUrl,
            label
        };
    }

    /**
     * Creates a new image-type message
     *
     * @param {string} url
     * @param {StaMP.Protocol.Messages.SSMLText} [ssmlText='<p>{text}</p>'] ssml text for speaking. '{text}' can be used to represent the original text,
     *                                                  being replaced with `ssml.replace('{text}', text)`. 'false' means no speech
     * @param {string} [from='server']
     *
     * @return {StaMP.Protocol.Messages.StandardisedImageMessage}
     */
    static createImageMessage(url, ssmlText = false, from = 'server') {
        return {
            $StaMP: true,
            from,
            type: 'image',
            url,
            ssmlText: MessageBuilder.processSSMLText(ssmlText, null)
        };
    }

    /**
     * Creates a new text-type message
     *
     * @param {string} text
     * @param {Array.<StaMP.Protocol.Messages.StandardisedQuickReply>} replies
     * @param {StaMP.Protocol.Messages.SSMLText} [ssmlText='<p>{text}</p>'] ssml text for speaking. '{text}' can be used to represent the original text,
     *                                                  being replaced with `ssml.replace('{text}', text)`. 'false' means no speech
     * @param {string} [from='server']
     *
     * @return {StaMP.Protocol.Messages.StandardisedQuickReplyMessage}
     */
    static createQuickReplyMessage(text, replies, ssmlText = '<p>{text}</p>', from = 'server') {
        return {
            $StaMP: true,
            from,
            type: 'quick_reply',
            text,
            ssmlText: MessageBuilder.processSSMLText(ssmlText, text),
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
