"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var originX = 10;
var originY = 10;
var titleHeight = 60;
var tabTextWidth = 40;
var staffBlockHeight = 110;
var wholeNoteWidth = 20;
var lineSpacing = 15;
var noOfLines = 6;
var createSvg = function (select, tabData) {
    var _a;
    drawTitle(select, tabData.tab.title);
    for (var staffIndex = 0; staffIndex < tabData.tab.staves.length; staffIndex++) {
        var staff = tabData.tab.staves[staffIndex].staff;
        drawStaff(select, staffIndex);
        var position = 0;
        //CHORDS
        if ((_a = staff.chords) === null || _a === void 0 ? void 0 : _a.chords) {
            for (var instructionIndex = 0; instructionIndex < staff.chords.chords.length; instructionIndex++) {
                var instruction = staff.chords.chords[instructionIndex];
                drawChordName(select, instructionIndex, staffIndex, position, instruction);
                position = position + 1;
            }
        }
        position = 0;
        //NOTES
        for (var instructionIndex = 0; instructionIndex < staff.notes.instructions.length; instructionIndex++) {
            var instruction = staff.notes.instructions[instructionIndex];
            if (instruction.timing) {
                drawTiming(select, instructionIndex, staffIndex, position, instruction.timing);
                position = position + 1;
            }
            if (instruction.note) {
                drawNote(select, instructionIndex, staffIndex, position, instruction.note);
                position = position + instruction.note.durationPercent;
            }
            if (instruction.bar) {
                drawBar(select, instructionIndex, staffIndex, position, instruction.bar);
            }
            if (instruction.chord) {
                drawChord(select, instructionIndex, staffIndex, position, instruction.chord);
                position = position + instruction.chord.durationPercent;
            }
            position = position + 1;
        }
    }
};
var drawTitle = function (select, data) {
    var startX = originX;
    var startY = originY;
    var textSizePt = "30";
    select
        .append('text')
        .attr('x', startX)
        .attr('y', startY)
        .attr('style', 'font-size: ' + textSizePt + 'pt; font-family: arial;')
        .attr('text-anchor', 'start')
        .attr('dominant-baseline', 'hanging')
        .text(data);
};
var drawStaff = function (select, staffIndex) {
    var startX = originX;
    var startY = originY + titleHeight;
    if (staffIndex > 0) {
        //Spacing for any previous staff blocks
        startY = startY + (staffBlockHeight * staffIndex);
    }
    for (var i = 1; i <= noOfLines; i++) {
        select
            .append('line')
            .attr('stroke-width', '1')
            .attr('fill', 'none')
            .attr('stroke', '#999999')
            .attr('x1', startX)
            .attr('y1', startY + (lineSpacing * i))
            .attr('x2', '1000')
            .attr('y2', startY + (lineSpacing * i));
    }
    //TAB Text - tabTextWidth
    select
        .append('text')
        .attr('x', 20)
        .attr('y', startY + 20)
        .attr('style', 'writing-mode:vertical-rl; text-orientation:upright; font-family: Consolas; font-weight: bold;  vertical-align: middle; font-size: 18pt; letter-spacing:-10px')
        .text('TAB');
};
var drawTiming = function (select, instructionIndex, staffIndex, position, data) {
    var startX = (originX + tabTextWidth) + (wholeNoteWidth * position);
    var startY = (originY + titleHeight) + (staffBlockHeight / 2);
    if (staffIndex > 0) {
        startY = startY + (staffBlockHeight * staffIndex);
    }
    var textSizePt = 20;
    startY = startY - lineSpacing + 3;
    select
        .append('text')
        .attr('x', startX)
        .attr('y', startY)
        .attr('style', 'font-size: ' + textSizePt + 'pt; font-family: arial;')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .text(data.top);
    select
        .append('text')
        .attr('x', startX)
        .attr('y', startY + (textSizePt * 1.3333) - 4)
        .attr('style', 'font-size: ' + textSizePt + 'pt; font-family: arial;')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .text(data.bottom);
};
var drawNote = function (select, instructionIndex, staffIndex, position, data) {
    var startX = (originX + tabTextWidth) + (wholeNoteWidth * position);
    var startY = originY + titleHeight;
    if (staffIndex > 0) {
        startY = startY + (staffBlockHeight * staffIndex);
    }
    select
        .append('text')
        .attr('x', startX)
        .attr('y', startY + (Number.parseInt(data.string) * lineSpacing))
        .attr('style', 'font-family: arial;')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .text(data.fret);
    select
        .append('text')
        .attr('x', startX + 12)
        .attr('y', startY + (Number.parseInt(data.string) * lineSpacing))
        .attr('style', 'font-size: 10px; font-family: arial;')
        .attr('fill', '#999999')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .text(data.pitch[2].note + data.pitch[2].accidental);
};
var drawBar = function (select, instructionIndex, staffIndex, position, data) {
    var startX = (originX + tabTextWidth) + (wholeNoteWidth * position);
    var startY = originY + titleHeight;
    if (staffIndex > 0) {
        startY = startY + (staffBlockHeight * staffIndex);
    }
    select
        .append('line')
        .attr('stroke-width', '2')
        .attr('fill', 'none')
        .attr('stroke', '#000')
        .attr('x1', startX)
        .attr('y1', startY + lineSpacing)
        .attr('x2', startX)
        .attr('y2', startY + (lineSpacing * noOfLines));
    if (data.repeat != 0) {
        select
            .append('text')
            .attr('x', startX)
            .attr('y', startY)
            .attr('style', 'font-family: arial;')
            .attr('font-style', 'italic')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'central')
            .text("x" + data.repeat);
    }
};
var drawChordName = function (select, instructionIndex, staffIndex, position, data) {
    var startX = (originX + tabTextWidth) + (wholeNoteWidth * position);
    var startY = originY + titleHeight - 5;
    if (staffIndex > 0) {
        startY = startY + (staffBlockHeight * staffIndex);
    }
    select
        .append('text')
        .attr('x', startX)
        .attr('y', startY)
        .attr('style', 'font-family: arial;')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .text(data.chordName);
};
var drawChord = function (select, instructionIndex, staffIndex, position, data) {
    for (var i = 0; i < data.notes.length; i++) {
        drawNote(select, instructionIndex, staffIndex, position, data.notes[i].note);
    }
};
// export const drawTransition = (select : any, instructionIndex: number, staffIndex: number, position: number, data: any) => {
//     const startX = 60;
//     const startY = 10;
//     select.append('g')
//         .append('text')
//         .attr('x', startX + (position * 20))
//         .attr('y', startY)
//         .attr('text-anchor', 'middle')
//         .attr('dominant-baseline', 'central')        
//         .text(data.type);
//     select.append('g')
//         .append('path')
//         .attr('x', startX + (position * 20))
//         .attr('y', startY)
//         .attr('d', 'M ' + startX + (position * 20) + ' 10 C 20 20, 40 20, 50 10')
//         .attr('stroke', 'black')
//         .attr('fill', 'transparent');
// }
// export const rest = (select: any, position: number, data: any) => {
//     const startX = 60;
//     const startY = 25;
//     const lineSpacing = 12.5;
//     const columnSpacing = 20;
//     select
//         .append('rect')
//         .attr('fill', '#000')
//         .attr('stroke', '#000')
//         .attr('x', startX + (columnSpacing * position) )
//         .attr('y', startY)
//         .attr('width', '15')
//         .attr('height', '5');
// }
// export const bend = (select: any, position: number, data: any) => {
//     const startX = 60;
//     const startY = 25;
//     const lineSpacing = 12.5;
//     const columnSpacing = 20;
//     select
//         .append('rect')
//         .attr('fill', '#000')
//         .attr('stroke', '#000')
//         .attr('x', startX + (columnSpacing * position) )
//         .attr('y', startY)
//         .attr('width', '2')
//         .attr('height', '10');
// }
exports.default = createSvg;
//# sourceMappingURL=svg.js.map