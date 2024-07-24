"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameMode = void 0;
class GameMode {
    constructor() {
        this.MOVE_DISTANCE = 3;
        this.ATTACK_DISTANCE = 4;
    }
    canMovePiece(fromCell, toCell) {
        return (Math.abs(fromCell.x - toCell.x) + Math.abs(fromCell.y - toCell.y)) <= this.MOVE_DISTANCE;
    }
    canAttackPiece(fromCell, toCell) {
        return (Math.abs(fromCell.x - toCell.x) + Math.abs(fromCell.y - toCell.y)) <= this.ATTACK_DISTANCE;
    }
}
exports.GameMode = GameMode;
