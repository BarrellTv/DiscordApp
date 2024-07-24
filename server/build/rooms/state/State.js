"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyState = void 0;
const schema_1 = require("@colyseus/schema");
const Player_1 = require("./Player");
const Cell_1 = require("./Cell");
class MyState extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.players = new schema_1.MapSchema();
        this.cells = new schema_1.ArraySchema();
    }
    populateGrid() {
        console.log('populateGrid');
        for (let y = 0; y < 8; ++y) {
            for (let x = 0; x < 8; ++x) {
                let cell = new Cell_1.Cell;
                cell.x = x;
                cell.y = y;
                cell.occupiedBy = -1;
                this.cells.push(cell);
            }
        }
        this.selectedCellIndex = -1;
        this.moveToCellIndex = -1;
        this.attackPieceCellIndex = -1;
        this.winner = -1;
    }
    addPlayer(playerId) {
        let player = new Player_1.Player;
        player.playerId = this.players.size;
        this.players.set(playerId, player);
        var cellOffset = 0;
        if (this.players.size == 2) {
            cellOffset = 6 * 8;
        }
        for (let i = 0; i < 16; i++) {
            this.cells.toArray()[cellOffset + i].occupiedBy = player.playerId;
        }
    }
    setSelectedCellIndex(cellIndex) {
        this.selectedCellIndex = cellIndex;
    }
    setMoveToCellIndex(cellIndex) {
        this.moveToCellIndex = cellIndex;
    }
    setAttackPieceCellIndex(cellIndex) {
        this.attackPieceCellIndex = cellIndex;
    }
    getWinner() {
        let firstPlayerCnt = 0;
        let secondPlayerCnt = 0;
        for (let i = 0; i < 64; ++i) {
            firstPlayerCnt += (this.cells.toArray()[i].occupiedBy == 0) ? 1 : 0;
            secondPlayerCnt += (this.cells.toArray()[i].occupiedBy == 1) ? 1 : 0;
        }
        console.log('First player cnt: ' + firstPlayerCnt);
        console.log('Second player cnt: ' + secondPlayerCnt);
        if (firstPlayerCnt == 0) {
            return 1;
        }
        else if (secondPlayerCnt == 0) {
            return 0;
        }
        // no winner
        return -1;
    }
}
exports.MyState = MyState;
__decorate([
    (0, schema_1.type)({ map: Player_1.Player })
], MyState.prototype, "players", void 0);
__decorate([
    (0, schema_1.type)([Cell_1.Cell])
], MyState.prototype, "cells", void 0);
__decorate([
    (0, schema_1.type)("number")
], MyState.prototype, "currentTurn", void 0);
__decorate([
    (0, schema_1.type)("number")
], MyState.prototype, "selectedCellIndex", void 0);
__decorate([
    (0, schema_1.type)("number")
], MyState.prototype, "moveToCellIndex", void 0);
__decorate([
    (0, schema_1.type)("number")
], MyState.prototype, "attackPieceCellIndex", void 0);
__decorate([
    (0, schema_1.type)("number")
], MyState.prototype, "winner", void 0);
