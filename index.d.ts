declare namespace StaMP {
    namespace NLPs {
        namespace DialogFlow {
            interface CardButton {
                text: string;
                postback: string;
            }
        }
    }

    namespace Interfaces {
        interface ThirdPartyMessenger<IdentifierType = string> {
            send(messages: Array<StaMP.Protocol.Messages.StaMPMessage>, identifier: IdentifierType): void
        }

        interface NLP {
            FROM: string;
            SERVICE: string;

            processQuery(query: StaMP.Protocol.Messages.StandardisedQueryMessage, source: string, sessionId: string): Promise<Array<StaMP.Protocol.Messages.StaMPMessage>>;
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
        namespace Messages {
            import HasSSMLText = StaMP.Interfaces.HasSSMLText;

            type MessageType =
                'unknown'
                | 'query'
                | 'typing'
                | 'text'
                | 'location'
                | 'quick_reply'
                | 'card'
                | 'image'
                ;

            type TypingState = 'on' | 'off';

            type StandardisedCardButtonType =
                'postback'
                ;

            type SSMLText = string | false;

            abstract class StaMPMessage {
                from: string;
                type: MessageType;
            }

            class StandardisedTypingMessage extends StaMPMessage {
                type: 'typing';
                state: TypingState;
            }

            class StandardisedQueryMessage extends StaMPMessage {
                type: 'query';
                query: string;
                text: string;
                data?: object;
            }

            class StandardisedTextMessage extends StaMPMessage implements HasSSMLText {
                type: 'text';
                text: string;
                ssmlText: SSMLText;
            }

            class StandardisedLocationMessage extends StaMPMessage {
                type: 'location';
                lat: number;
                lng: number;
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
                data: SubmitQueryData;
            }

            class SubmitQueryData {
                query: string;
                display?: string;
                voice?: string;
            }

            // endregion
            // region render messages
            class Render extends Standard {
                request: RenderRequest;
                what: 'messages';
                data: RenderData;
            }

            class RenderData {
                messages: Array<StaMP.Protocol.Messages.StaMPMessage>;
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
