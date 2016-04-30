namespace Models {
    export class GameChannel extends Models.Channel {
        parentChannelId: number;
        gameType: Models.GameType;
        description: string;

        size: number;
        score: string;
        moveNumber: number;

        restrictedPrivate: boolean;     // Restricted by the Game Owner
        restrictedPlus: boolean;        // Restricted to KGS Plus users
        phase: GamePhase;
        proposal: KGS.DownstreamProposal;

        playerWhite: string;
        playerBlack: string;
        challengeCreator: string;

        constructor(channelId: number) {
            super(channelId, ChannelType.Game);
        }

        public mergeGameChannel(game: KGS.GameChannel | KGS.ChallengeChannel): boolean {
            let touch: boolean = false;
            if (this.parentChannelId != game.roomId) { this.parentChannelId = game.roomId; touch = true; }

            let gameType: Models.GameType = GameChannel.getGameType(game.gameType);
            if (this.gameType != gameType) { this.gameType = gameType; touch = true; }

            if (this.description != game.name) { this.description = game.name; touch = true; }

            if (gameType != Models.GameType.Challenge) {
                let g = (<KGS.GameChannel>game);
                if (this.size != g.size) { this.size = g.size; touch = true; }
                if (this.score != g.score) { this.score = g.score; touch = true; }
                if (this.moveNumber != g.moveNum) { this.moveNumber = g.moveNum; touch = true; }
                if (this.proposal != null) { this.proposal = null; touch = true; }
            }
            else {
                let c = (<KGS.ChallengeChannel>game);
                let sz = (c.initialProposal)? c.initialProposal.size : null;
                if (this.size != sz) { this.size = sz; touch = true; }
                if (this.score != null) { this.score = null; touch = true; }
                if (this.moveNumber != null) { this.moveNumber = null; touch = true; }

                if (this.mergeProposal(c.initialProposal)) touch = true;
            }

            let pvt: boolean = (game.private)? true : false;
            if (this.restrictedPrivate != pvt) { this.restrictedPrivate = pvt; touch = true; }

            let plus: boolean = (game.subscribers)? true : false;
            if (this.restrictedPlus != plus) { this.restrictedPlus = plus; touch = true; }

            let phase: GamePhase = GamePhase.Active;
            if (game.paused) phase = GamePhase.Paused;
            if (game.adjourned) phase = GamePhase.Adjourned;
            if (game.over) phase = GamePhase.Concluded;
            if (this.phase != phase) { this.phase = phase; touch = true; }

            let playerWhite: string = ((game.players) && (game.players.white))? game.players.white.name : null;
            if (this.playerWhite != playerWhite) { this.playerWhite = playerWhite; touch = true; }

            let playerBlack: string = ((game.players) && (game.players.black))? game.players.black.name : null;
            if (this.playerBlack != playerBlack) { this.playerBlack = playerBlack; touch = true; }

            let challengeCreator: string = ((game.players) && (game.players.challengeCreator))? game.players.challengeCreator.name : null;
            if (this.challengeCreator != challengeCreator) { this.challengeCreator = challengeCreator; touch = true; }

            let name: string;
            if ((playerWhite != null) && (playerBlack != null)) {
                name = playerWhite + " vs. " + playerBlack;
            }
            else if (this.challengeCreator != null) {
                name = "Challenge from " + this.challengeCreator;
            }
            else {
                name = "Game #" + this.channelId.toString();
            }

            if (this.name != name) { this.name = name; touch = true; }

            return touch;
        }

        public mergeProposal(proposal: KGS.DownstreamProposal): boolean {
            if (this.gameType != GameType.Challenge) throw "Game Type is not challenge";
            if ((null == this.proposal) || (!Utils.valueEquals(this.proposal, proposal, Utils.ComparisonFlags.ArraysAsSets))) {
                this.proposal = proposal;
                return true;
            }

            return false;
        }

        public static getGameType(s: string): Models.GameType {
            switch (s) {
                case "challenge": return Models.GameType.Challenge;
                case "demonstration": return Models.GameType.Demonstration;
                case "review": return Models.GameType.Review;
                case "rengo_review": return Models.GameType.ReviewRengo;
                case "teaching": return Models.GameType.Teaching;
                case "simul": return Models.GameType.Simultaneous;
                case "rengo": return Models.GameType.Rengo;
                case "free": return Models.GameType.Free;
                case "ranked": return Models.GameType.Ranked;
                case "tournament": return Models.GameType.Tournament;
            }
        }

        public get displayType(): string {
            switch (this.gameType) {
                case Models.GameType.Challenge:
                    return "Challenge";

                case Models.GameType.Demonstration:
                    return "Demo";

                case Models.GameType.Review:
                case Models.GameType.ReviewRengo:
                    return "Review";

                default:
                    return "Game";
            }
        }

        public get displaySubType(): string {
            switch (this.gameType) {
                case Models.GameType.ReviewRengo:
                case Models.GameType.Rengo:
                    return "rengo";

                case Models.GameType.Teaching: return "teaching";
                case Models.GameType.Simultaneous: return "simultaneous";
                case Models.GameType.Free: return "free";
                case Models.GameType.Tournament: return "tournament";
                default: return "";
            }
        }

        public get displaySize(): string {
            if (this.size == null) return "";
            let sz: string = this.size.toString();
            return sz + "×" + sz;
        }
    }
}