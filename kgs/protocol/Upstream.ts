namespace KGS {
    export namespace Upstream {
        export function validateMessage(message: KGS.Message): string {
            if (message == null) return "No message was provided";
            if (message.type == null) return "Message type was not set";
            if (message.type.length == 0) return "Message type was empty";

            switch (message.type) {
                case _CHAT:
                case _ANNOUNCE:
                case _ANNOUNCE_TO_PLAYERS:
                    let text = (<CHAT>message).text;
                    if ((!text) || (text.length == 0) || (text.length > _CHAT_MaxLength)) {
                        return "Message text not provided or too long";
                    }
                    break;
            }

            return null;
        }

        export const _LOGIN: string = "LOGIN";
        export interface LOGIN extends KGS.Message {
            name: string,
            password: string,
            locale: string
        }

        export const _LOGOUT: string = "LOGOUT";
        export interface LOGOUT extends KGS.Message {
        }

        export const _JOIN_REQUEST: string = "JOIN_REQUEST";
        export interface JOIN_REQUEST extends KGS.ChannelMessage {
        }

        export const _UNJOIN_REQUEST: string = "UNJOIN_REQUEST";
        export interface UNJOIN_REQUEST extends KGS.ChannelMessage {
        }

        export const _CHAT: string = "CHAT";
        export const _CHAT_MaxLength: number = 1000;
        export interface CHAT extends KGS.ChannelMessage {
            text: string
        }
        export const _ANNOUNCE: string = "ANNOUNCE";
        export interface ANNOUNCE extends CHAT {
        }
        export const _ANNOUNCE_TO_PLAYERS: string = "ANNOUNCE_TO_PLAYERS";
        export interface ANNOUNCE_TO_PLAYERS extends CHAT {
        }

        export const _GLOBAL_LIST_JOIN_REQUEST: string = "GLOBAL_LIST_JOIN_REQUEST";
        export interface GLOBAL_LIST_JOIN_REQUEST {
            list: "CHALLENGES" | "ACTIVES" | "FANS";
        }

        export interface ChallengeResponse extends KGS.ChannelMessage, KGS.UpstreamProposal {
        }
        export const _CHALLENGE_SUBMIT: string = "CHALLENGE_SUBMIT";
        export interface CHALLENGE_SUBMIT extends ChallengeResponse {
        }
        export const _CHALLENGE_ACCEPT: string = "CHALLENGE_ACCEPT";
        export interface CHALLENGE_ACCEPT extends ChallengeResponse {
        }

        export const _AUTOMATCH_CREATE: string = "AUTOMATCH_CREATE";
        export interface AUTOMATCH_CREATE extends KGS.Message, KGS.AutomatchPreferences {
        }
        export const _AUTOMATCH_SET_PREFS: string = "AUTOMATCH_SET_PREFS";
        export interface AUTOMATCH_SET_PREFS extends KGS.Message, KGS.AutomatchPreferences {
        }
        export const _AUTOMATCH_CANCEL: string = "AUTOMATCH_CANCEL";
        export interface AUTOMATCH_CANCEL extends KGS.Message {
        }

        export const _GAME_MOVE: string = "GAME_MOVE";
        export interface GAME_MOVE extends ChannelMessage, KGS.Location {
        }
        export const _GAME_MARK_LIFE: string = "GAME_MARK_LIFE";
        export interface GAME_MARK_LIFE extends ChannelMessage, KGS.Coordinates {
            alive: boolean;
        }
        export const _GAME_SCORING_DONE: string = "GAME_SCORING_DONE";
        export interface GAME_SCORING_DONE extends ChannelMessage {
            doneId: number;
        }
        export const _GAME_RESIGN: string = "GAME_RESIGN";
        export interface GAME_RESIGN extends ChannelMessage {
        }
    }
}
