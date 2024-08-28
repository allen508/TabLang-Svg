
const originX = 10;
const originY = 10;
const titleHeight = 60;
const tabTextWidth = 40;
const staffBlockHeight = 110;
const wholeNoteWidth = 20;
const lineSpacing = 15;
const noOfLines = 6;

const createSvg = (select: any, tabData: any) => {

    drawTitle(select, tabData.tab.title);

    for(let staffIndex = 0; staffIndex < tabData.tab.staves.length; staffIndex++) {

        const staff = tabData.tab.staves[staffIndex].staff;

        drawStaff(select, staffIndex);

        let position = 0;

        //CHORDS
        if(staff.chords?.chords) {
            for(let instructionIndex = 0; instructionIndex < staff.chords.chords.length; instructionIndex++) {
                const instruction = staff.chords.chords[instructionIndex];

                drawChordName(select, instructionIndex, staffIndex, position, instruction);
                position = position + 1;
            }
        }

        position = 0;

        //NOTES
        for(let instructionIndex = 0; instructionIndex < staff.notes.instructions.length; instructionIndex++) {
            const instruction = staff.notes.instructions[instructionIndex];
    
            if(instruction.timing) {
                drawTiming(select, instructionIndex, staffIndex, position, instruction.timing);
                position = position + 1;
            }

            if(instruction.note) {
                drawNote(select, instructionIndex, staffIndex, position, instruction.note);
                position = position + instruction.note.durationPercent;
            }

            
            if(instruction.bar) {
                drawBar(select, instructionIndex, staffIndex, position, instruction.bar);
            }

            if(instruction.chord) {
                drawChord(select, instructionIndex, staffIndex, position, instruction.chord);
                position = position + instruction.chord.durationPercent;
            }

            position = position + 1;

        }


    }


}


const drawTitle = (select: any, data: any) => {

    const startX = originX;
    let startY = originY;

    const textSizePt = "30";

    select
        .append('text')
        .attr('x', startX)
        .attr('y', startY)
        .attr('style', 'font-size: ' + textSizePt + 'pt; font-family: arial;' )
        .attr('text-anchor', 'start')
        .attr('dominant-baseline', 'hanging')
        .text(data);
}    


const drawStaff = (select: any, staffIndex: number) => {

    const startX = originX;
    let startY = originY + titleHeight;

    if(staffIndex > 0) {
        //Spacing for any previous staff blocks
        startY = startY + (staffBlockHeight * staffIndex);
    }

    for (let i = 1; i <= noOfLines; i++) {
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

}



const drawTiming = (select: any, instructionIndex: number, staffIndex: number, position: number, data: any) => {

    const startX = (originX + tabTextWidth) + (wholeNoteWidth * position); 
    let startY = (originY + titleHeight) + (staffBlockHeight/2);

    if(staffIndex > 0) {
        startY = startY + (staffBlockHeight * staffIndex);
    }

    const textSizePt = 20;
    startY = startY - lineSpacing + 3;


    select
        .append('text')
        .attr('x', startX)
        .attr('y', startY)
        .attr('style', 'font-size: ' + textSizePt + 'pt; font-family: arial;' )
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
}


const drawNote = (select : any, instructionIndex: number, staffIndex: number, position: number, data: any) => {

    const startX = (originX + tabTextWidth) + (wholeNoteWidth * position); 
    let startY = originY + titleHeight;

    if(staffIndex > 0) {
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


    }

const drawBar = (select : any, instructionIndex: number, staffIndex: number, position: number, data: any) => {

    const startX = (originX + tabTextWidth) + (wholeNoteWidth * position); 
    let startY = originY + titleHeight;

    if(staffIndex > 0) {
        startY = startY + (staffBlockHeight * staffIndex);
    }

    select
        .append('line')
        .attr('stroke-width', '2')
        .attr('fill', 'none')
        .attr('stroke', '#000')
        .attr('x1', startX )
        .attr('y1', startY + lineSpacing)
        .attr('x2', startX )
        .attr('y2', startY + (lineSpacing * noOfLines));

    if(data.repeat != 0){

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

}


const drawChordName = (select : any, instructionIndex: number, staffIndex: number, position: number, data: any) => {

    const startX = (originX + tabTextWidth) + (wholeNoteWidth * position); 
    let startY = originY + titleHeight- 5;

    if(staffIndex > 0) {
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


}

const drawChord = (select : any, instructionIndex: number, staffIndex: number, position: number, data: any) => {

    for (let i = 0; i < data.notes.length; i++) {
        drawNote(select, instructionIndex, staffIndex, position, data.notes[i].note);
    }
    
}

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

export default createSvg;