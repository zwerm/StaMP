declare namespace StaMP {
    namespace Engines {
        namespace DialogFlow {
            namespace Messages {
                type MessagePlatform =
                    string
                    | 'facebook'
                    | 'kik'
                    | 'line'
                    | 'skype'
                    | 'slack'
                    | 'telegram'
                    | 'viber'
                    ;

                interface DialogFlowMessage {
                    /**
                     * Specifies the platform.
                     */
                    platform: MessagePlatform;
                    type: number;
                }

                interface TextResponse extends DialogFlowMessage {
                    /**
                     * Agent's text reply.
                     */
                    speech: string;
                    /**
                     * 0 for the {@link https://dialogflow.com/docs/rich-messages#text Text response} message type.
                     */
                    type: 0;
                }

                interface ImageMessage extends DialogFlowMessage {
                    /**
                     * Public URL to the image file.
                     */
                    imageUrl: string;
                    /**
                     * 3 for the {@link https://dialogflow.com/docs/rich-messages#image Image} message type.
                     */
                    type: 3;
                }

                interface CardMessage extends DialogFlowMessage {
                    /**
                     * Array of objects corresponding to card buttons.
                     */
                    buttons: Array<CardButton>;
                    /**
                     * Public URL to the image file.
                     */
                    imageUrl: string;
                    /**
                     * Card subtitle.
                     */
                    subtitle: string;
                    /**
                     * Card title.
                     */
                    title: string;
                    /**
                     * 1 for the {@link https://dialogflow.com/docs/rich-messages#card Card} message type.
                     */
                    type: 1;
                }

                interface QuickReplyMessage extends DialogFlowMessage {
                    /**
                     * Array of strings corresponding to quick replies.
                     */
                    replies: Array<string>;
                    /**
                     * Quick replies title.
                     *
                     * Required for Facebook Messenger, Kik, and Telegram one-click integrations.
                     */
                    title: string;
                    /**
                     * 2 for the {@link https://dialogflow.com/docs/rich-messages#quick-replies Quick replies} message type.
                     */
                    type: 2;
                }

                interface CustomPayloadMessage extends DialogFlowMessage {
                    /**
                     * 4 for the {@link https://dialogflow.com/docs/rich-messages#custom-payload Custom payload} message type.
                     */
                    type: 4;
                    /**
                     * Developer defined JSON. It is sent without modifications.
                     */
                    payload: object;
                }
            }

            namespace API {
                interface Context {
                    /**
                     * Number of requests after which the context will expire.
                     */
                    lifespan: number;
                    /**
                     * Context name.
                     */
                    name: string;
                    /**
                     * Object consisting of "parameter_name":"parameter_value" and
                     * "parameter_name.original":"original_parameter_value" pairs.
                     */
                    parameters: { [key: string]: string; };
                }

                interface QueryResult {
                    /**
                     * An action to take.
                     */
                    action: string;
                    /**
                     * true if the triggered intent has required and not all
                     * the required parameter values have been collected.
                     *
                     * false if all required parameter values have been collected,
                     * or if the triggered intent doesn't contain any required parameters.
                     */
                    actionIncomplete: boolean;
                    /**
                     * Array of context objects
                     */
                    contexts: Array<Context>;
                    /**
                     * Data about text response(s), rich messages,
                     * response received from webhook.
                     */
                    fulfillment: {
                        /**
                         * Array of {@link https://dialogflow.com/docs/reference/agent/message-objects message objects}.
                         */
                        messages: Array<Messages.DialogFlowMessage>;
                        /**
                         * Text to be pronounced to the user / shown on the screen.
                         */
                        speech: string;
                    }
                    /**
                     * Contains data on intents and contexts.
                     */
                    metadata: {
                        /**
                         * ID of the intent that produced this result.
                         */
                        intentId: string;
                        /**
                         * Name of the intent that produced this result.
                         */
                        intentName: string;
                        /**
                         * Indicates whether in the triggered intent webhook
                         * functionality is enabled for required parameters.
                         */
                        webhookForSlotFillingUsed: string;
                        /**
                         * Webhook response time in milliseconds.
                         */
                        webhookResponseTime: number;
                        /**
                         * Indicates whether webhook functionality
                         * is enabled in the triggered intent.
                         */
                        webhookUsed: string;
                    }
                    /**
                     * Object consisting of "parameter_name":"parameter_value" pairs.
                     */
                    parameters: { [key: string]: string }
                    /**
                     * The query that was used to produce this result.
                     */
                    resolvedQuery: string;
                    /**
                     * Matching score for the intent.
                     *
                     * Number between 0 and 1.
                     */
                    score: number;
                    /**
                     * Source of the answer.
                     */
                    source: string;
                }

                interface QueryResponse {
                    id: string;
                    lang: string;
                    /**
                     * Contains the result of the natural language processing.
                     */
                    result: QueryResult;
                    /**
                     * Session ID
                     */
                    sessionId: string;
                    /**
                     * Contains data on how the request succeeded or failed.
                     */
                    status: StatusObject;
                    /**
                     * Date and time of the request in UTC timezone using ISO-8601 format.
                     */
                    timestamp: string;
                }

                /**
                 * @see {@link https://dialogflow.com/docs/reference/agent/#status_object}
                 */
                interface StatusObject {
                    /**
                     * HTTP status code.
                     *
                     * @see {@link https://dialogflow.com/docs/reference/agent/#status_and_error_codes}
                     */
                    code: number;
                    /**
                     * Text description of the error, or 'success' if no error
                     *
                     * @see {@link https://dialogflow.com/docs/reference/agent/#status_and_error_codes}
                     */
                    errorType: string | 'success';
                    /**
                     * ID of the error. Optionally returned if the request failed.
                     */
                    errorId?: string;
                    /**
                     * Text details of the error. Only returned if the request failed.
                     */
                    errorDetails?: string;
                }
            }

            interface CardButton {
                text: string;
                postback: string;
            }
        }
    }

    namespace API {
        interface HasLetter {
            letter: StaMP.Protocol.Letter
        }

        // region Channel
        interface ChannelHttpRequest {
            /**
             * Arbitrary id that maps the sending entity to a Zwerm user.
             *
             * This id is handled by the third-party service that is
             * submitting the request to the Zwerm StaMP channel.
             *
             * This id will be used as the recipientId for any outgoing channel
             * message requests that Zwerm aims at the given sender.
             */
            senderId: string;
        }

        interface ChannelPostRequest extends ChannelHttpRequest, HasLetter {
        }

        // endregion
        // region Webhook
        interface WebhookHttpRequest {
            /**
             * Arbitrary id that maps the receiving entity to a Zwerm user.
             *
             * This id is handled by the third-party service that is
             * receiving the request from the Zwerm StaMP channel.
             *
             * This id will be based off the senderId received from
             * incoming channel message requests that Zwerm receives
             */
            recipientId: string;
        }

        interface WebhookPostRequest extends WebhookHttpRequest, HasLetter {
        }

        // endregion
    }

    namespace Interfaces {
        interface Transaction {
            conversationId: string;
            channel: string;
            botUserId: string;
            message: StaMP.Protocol.Messages.StaMPMessage,
            type: 'StaMP',
            transactionId: string;
            timestamp: string;
        }

        interface UserConversationPair {
            botUserId: string;
            conversationId: string;
            creation: string;
            expiration: string;
            lifetime: number;

            data: {};

            firstTransaction: Transaction;
            firstTransactionTime: string;
            lastTransaction: Transaction;
            lastTransactionTime: string;
        }

        /**
         * Data object containing information about an adapter.
         */
        interface AdapterData {
            /**
             * The id of this adapter.
             * @type {string}
             */
            id: string;
            /**
             * The type of this adapter.
             * @type {string}
             */
            type: string;
            /**
             * The display label of this adapter.
             * @type {string}
             */
            label: string;
            /**
             * The service used by this adapter.
             * @type {string}
             */
            service: string;

            [key: string]: any;
        }

        /**
         * Data object containing information about an engine specific adapter.
         */
        interface EngineData extends AdapterData {
        }

        /**
         * Data object containing information about a channel specific adapter.
         */
        interface ChannelData extends AdapterData {
        }

        interface ThirdPartyMessenger<IdentifierType = string> {
            send(messages: Array<StaMP.Protocol.Messages.StaMPMessage>, identifier: IdentifierType): void
        }

        interface AbstractAdapter {
            service: string;
        }

        interface EngineAdapter extends AbstractAdapter {
            processQuery(queryMessage: StaMP.Protocol.Messages.StandardisedQueryMessage, channel: ChannelData, conversation: UserConversationPair): Promise<Array<StaMP.Protocol.Messages.StaMPMessage>>;
        }

        interface ChannelAdapter extends AbstractAdapter {
        }

        interface MLL {
        }

        interface ThirdPartyLocaliser<T> extends MLL {
            localise(messages: Array<StaMP.Protocol.Messages.StaMPMessage>): Array<T>;
        }

        interface StaMPardiser<T> {
            stampardise(messages: Array<T>): Array<StaMP.Protocol.Messages.StaMPMessage>;
        }

        interface HasSSMLText {
            ssmlText: StaMP.Protocol.Messages.SSMLText
        }
    }
    namespace Protocol {
        type Letter = Array<Messages.StaMPMessage>;

        type MetaMessage = Messages.StandardisedMetaMessage;
        type QueryMessage = Messages.StandardisedQueryMessage;
        type TypingMessage = Messages.StandardisedTypingMessage;
        type TextMessage = Messages.StandardisedTextMessage;
        type LocationMessage = Messages.StandardisedLocationMessage;
        type CardMessage = Messages.StandardisedCardMessage;
        type QuickReplyMessage = Messages.StandardisedQuickReplyMessage;
        type ImageMessage = Messages.StandardisedImageMessage;

        namespace Messages {
            import HasSSMLText = StaMP.Interfaces.HasSSMLText;

            type MessageType =
                'unknown'
                | 'meta'
                | 'query'
                | 'typing'
                | 'text'
                | 'location'
                | 'quick_reply'
                | 'card'
                | 'image'
                ;

            type QueryType =
                'payload'
                | 'text'
                | 'quick-reply'
                | 'location'
                | 'file'
                | 'image'
                | 'audio'
                | 'video'
                ;

            type TypingState = 'on' | 'off';

            type StandardisedCardButtonType =
                'postback'
                ;

            type SSMLText = string | false;

            abstract class StaMPMessage {
                from: string;
                type: MessageType;
                timezone?: string;
            }

            class LatLng {
                lat: string | number;
                lng: string | number;
            }

            class StandardisedMetaMessage extends StaMPMessage {
                type: 'meta';
                /**
                 * The name of the whatever that this StandardisedMetaMessage originated from
                 */
                originator: string;
                data: StandardisedMetaMessageData;
            }

            /**
             * Data stored in a StandardisedMetaMessage.
             *
             * Can have any dynamically defined properties.
             * Some properties are defined, but completely optional, to ensure consistency
             * for data expected to be provided by multiple sources.
             */
            class StandardisedMetaMessageData {
                [key: string]: any;
            }

            class StandardisedTypingMessage extends StaMPMessage {
                type: 'typing';
                state: TypingState;
            }

            class StandardisedQueryMessage extends StaMPMessage {
                type: 'query';
                query: string;
                text: string;
                data: StandardisedQueryMessageData;
            }

            /**
             * Data stored in a StandardisedQueryMessage.
             *
             * Can have any dynamically defined properties.
             * Some properties are defined, but completely optional; to ensure consistency
             * for data expected to be provided by multiple channels.
             */
            class StandardisedQueryMessageData {
                senderId?: string;
                queryType?: QueryType;
                rawPayload?: object;
                location?: LatLng;
                nlp?: object;
                url?: string;
                label?: string;

                [key: string]: any;
            }

            class StandardisedTextMessage extends StaMPMessage implements HasSSMLText {
                type: 'text';
                text: string;
                ssmlText: SSMLText;
            }

            class StandardisedLocationMessage extends StaMPMessage, LatLng {
                type: 'location';
                lat: string | number;
                lng: string | number;
                mapUrl?: string;
                label?: string;
            }

            class StandardisedQuickReplyMessage extends StaMPMessage implements HasSSMLText {
                type: 'quick_reply';
                text: string;
                ssmlText: SSMLText;
                quickReplies: Array<StandardisedQuickReply>;
            }

            class StandardisedQuickReply {
                title: string;
                payload: string;
                imageUrl?: string;
            }

            class StandardisedCardMessage extends StaMPMessage {
                type: 'card';
                title: string;
                subtitle?: string;
                imageUrl?: string;
                buttons?: Array<StandardisedCardButton>;
                clickUrl?: string;
            }

            class StandardisedCardButton {
                type: StandardisedCardButtonType;
                text: string;
                value: string;
            }

            class StandardisedImageMessage extends StaMPMessage implements HasSSMLText {
                type: 'image';
                url: string;
                ssmlText: SSMLText;
            }
        }
    }
}

declare namespace BotSocket {
    namespace Server {
        namespace Event {
            class SocketConnection {
                sessionId: string;
            }

            class SocketClosed {
                sessionId: string;
            }
        }
    }

    namespace Client {

    }
    // region Performing
    namespace Performing {
        type PerformanceState =
            'created'
            | 'outstanding'
            | 'in-progress'
            | 'finished'
            | 'cancelled'
            | 'failed'
            ;

        type PerformanceRole =
            'director'
            | 'possible-performer'
            | 'performer'
            ;

        class PossiblePerformer {
            performerId: string;
            timestamp: string | number;
        }

        class ServerPerformanceObject {
            id: string;
            state: PerformanceState;
            loops: number;
            piece: Protocol.Messages.PerformancePiece;
            directorId?: string | null;
            performerId?: string | null;
            possiblePerformers: Array<PossiblePerformer>;
            outstandingPossiblePerformers: number;
        }

        class ClientPerformanceObject {
            performanceId: string;
            state: PerformanceState;
            piece: Protocol.Messages.PerformancePiece;
            role: PerformanceRole;
        }
    }
    // endregion
    // region Protocol
    namespace Protocol {
        namespace Messages {
            type Capabilities = Array<Capability>;

            type Capability =
                'handshaking'

                | 'rendering-text'
                | 'rendering-images'
                | 'rendering-cards'
                | 'rendering-quick-replies'
                | 'rendering-audio'
                | 'rendering-video'

                | 'triggering-asr'

                | 'performing-asr'

                | 'gathering-text'
                | 'gathering-audio'
                | 'gathering-video'
                | 'gathering-location'
                ;

            export type Request =
                'handshake'
                | 'submit-query'
                | 'rendering'
                | 'render'
                | 'render-messages'
                | 'trigger-start'
                | 'trigger-stop'
                | 'trigger-cancel'
                | 'cando-performance'
                | 'start-performance'
                | 'stop-performance'
                | 'update-performance'
                ;

            export type RenderRequest =
                'render'
                | 'render-messages'
                | 'rendering'
                ;

            export type TriggerRequest =
                'trigger-start'
                | 'trigger-stop'
                | 'trigger-cancel'
                ;

            export type PerformanceRequest =
                'cando-performance'
                | 'start-performance'
                | 'stop-performance'
                | 'update-performance'
                ;

            // todo: move to Performing namespace
            export type PerformancePiece =
                'asr'
                | 'audio-recording'
                | 'audio-streaming'
                | 'audio-playback'
                ;

            abstract class Standard {
                request: Request;
                data: StandardData;
            }

            abstract class StandardData {
            }

            // region unique messages
            class ClientHandshake extends Standard {
                request: 'handshake';
                data: ClientHandshakeData;
            }

            class ClientHandshakeData {
                sessionId: string;
                supports: Array<string>;
                timezone?: string;
            }

            class ServerHandshake extends Standard {
                request: 'handshake';
                data: ServerHandshakeData;
            }

            class ServerHandshakeData {
                sessionId: string;
                retryWaitTime: number;
            }

            class SubmitQuery extends Standard {
                request: 'submit-query';
                data: StaMP.Protocol.Messages.StandardisedQueryMessage;
            }

            // endregion
            // region render messages
            class Render extends Standard {
                request: RenderRequest;
                what: 'messages';
                data: RenderData;
            }

            class RenderData {
                messages: StaMP.Protocol.Letter;
            }

            class RenderMessages extends Render {
                request: 'render-messages';
            }

            // endregion
            // region trigger messages
            abstract class Trigger extends Standard {
                request: TriggerRequest;
                data: TriggerData;
            }

            class TriggerData {
                piece: PerformancePiece;
            }

            class TriggerStart extends Trigger {
                request: 'trigger-start';
            }

            class TriggerStop extends Trigger {
                request: 'trigger-stop';
                data: TriggerStopData;
            }

            class TriggerStopData extends TriggerData {
                performanceId: string;
            }

            // endregion
            // region performance messages
            abstract class Performance extends Standard {
                request: PerformanceRequest;
                data: PerformanceData;
            }

            class PerformanceData {
                /**
                 * Id of the performance that's being done
                 */
                performanceId: string;
                piece: PerformancePiece;
                role: Performing.PerformanceRole;
            }

            class CanDoPerformance extends Performance {
                request: 'cando-performance';
                data: CanDoPerformanceData;
            }

            class CanDoPerformanceData extends PerformanceData {
                canDo: boolean;
            }

            class StartPerformance extends Performance {
                request: 'start-performance';
            }

            class StopPerformance extends Performance {
                request: 'stop-performance';
                data: StopPerformanceData;
            }

            class StopPerformanceData extends PerformanceData {
                result: BotSocket.Performing.PerformanceState;
                reason: string;
            }

            class UpdatePerformance extends Performance {
                request: 'update-performance';
                data: UpdatePerformanceData;
            }

            class UpdatePerformanceData extends PerformanceData {
                /**
                 * The event that caused the performance update
                 */
                event: string;
                /**
                 * Event update data
                 */
                update: object;
            }

            // endregion
        }
    }
    // endregion
}
