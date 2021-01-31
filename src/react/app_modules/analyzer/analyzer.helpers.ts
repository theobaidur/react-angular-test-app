import dateFromString from "../../utils/dateFromString";
import { getMonths, getAge, getPensionDate } from "../../utils/calculators";
import createGUID from "../../utils/guidGenerator";
import { constantNumbers } from "../../utils/calculators";
import { Child, Person } from "../../redux/types";
import { Dossier } from "../../redux/initialState";

export class analyzerBlock{
    constructor(
        type: number, sType: string, category: string, person: any,
        start: string | Date, 
        end?: string | Date, time?: number, month?: number, value?: number )
        {
            this.id = createGUID();
            this.type = type;
            this.sType = sType;
            this.category = category;
            this.shade = sType==='exwidow'?true:false;
            this.person = person;

            this.start = dateFromString( start );
            this.end = new Date( +this.start );
            this.time = 0; this.month = 0; this.value = 0;

            this.reCalc = function( e, t, m, v ){
                if(!e){ 
                    this.time = t ? t : Math.round( (v && m && v/m) || 0 );  
                    this.month = m ? m : Math.round( (v && t && v/t) || 0 );
                    this.value = v ? v : Math.round( (m && t && m*t) || 0 );
                    this.end.setMonth( this.end.getMonth() + this.time ); 
                }
                else if(e){ 
                    this.end = dateFromString( e );
                    this.time = getMonths( this.start, this.end );
                    this.month = m ? m : Math.round( (v && v/this.time) || 0 );
                    this.value = v ? v : Math.round( (m && m*this.time) || 0 );
                }
                this.month = Math.max( this.month, 0 );
                this.value = Math.max( this.value, 0 );
            }

            this.reGrade = function( mainStart, gradeStart, gradeDir, gradeType, grades){
                let gradeValue = 0;
                if(gradeType === 1){ 
                    const preTime = getMonths(dateFromString( gradeStart ), dateFromString(mainStart));
                    const gradeTime = Math.floor(preTime / 12);
                    if(grades.calc === 1){ gradeValue = gradeTime * grades.value; }
                    else if(grades.calc === 2){ gradeValue = gradeTime * this.month * grades.pct; }
                }
                else if(gradeType === 2){
                    for(var g=0;g<grades.dates.length;g++){ 
                        if(!grades.dates[g]) continue;
                        const gradeDate = dateFromString( grades.dates[g] );
                        if( gradeDate < dateFromString(mainStart) ) gradeValue += +grades.values[g]; 
                    }
                }
                if(gradeDir === 2){ gradeValue = -gradeValue; }
                if(this.sType === 'pension'){ 
                    this.reCalc( this.end, this.time, +this.month+ +gradeValue, undefined); 
                }
                else if(this.sType === 'cap' ){ 
                    this.reCalc( this.end, undefined, undefined, +this.value+ +gradeValue);	
                }
            }

            this.upGrade = function( mainStart, gradeStart, gradeCycle, gradeValue, gradeInterest){
                const gradeTime = getMonths( dateFromString( mainStart ), dateFromString( gradeStart ));	
                if(!gradeCycle) gradeCycle = 1; 
                let endValue = this.value ? +this.value : 0; 
                const grader = Math.floor( gradeTime / (12/gradeCycle) );
                for(var g=0;g<grader;g++){
                    endValue += (endValue * (gradeInterest/100)/gradeCycle);
                    endValue += +gradeValue;
                }
                this.reCalc( this.end, this.time, undefined, endValue );
            }
            
            this.useCalc = function( use, calc ){
                if(this.sType === 'pension'){ 
                    this.reCalc( this.end, this.time, use === 1 ? calc : this.month * calc, undefined); 
                }
                else if(this.sType === 'cap'){ 
                    this.reCalc( this.end, undefined, undefined, use === 1 ? calc : this.value * calc);	
                }
            }
            
            this.createLabelId = function(){
                this.labelId = 
                type === 42 || type === 23 ? 
                `type${this.type}` : 
                type > 42 ? `type${this.type}_${this.sType}` : 
                `type${this.type}_${this.category}_${this.sType}`;
            }

            this.createLabelExtra = function(){
                this.labelExtra = sType === 'child' ? ` (${person.firstName})` : '';
            }

            this.createLabelId();
            this.createLabelExtra();

            this.reCalc( end, time, month, value );
        }

    id: string;
    type: number;
    category: string;
    sType: string;
    shade: boolean;
    person: any;

    start: Date;
    end: Date;
    time: number;
    month: number;
    value: number;

    labelId: string = '';
    labelExtra: string = '';
    roundValue: number = 0;

    reCalc: ( e?: string | Date, t?: number, m?: number, v?: number ) => void;

    reGrade: ( 
        mainStart: string | Date, gradeStart: string | Date, 
        gradeDir: number, gradeType: number, 
        grades: { [key:string]: any } 
    ) => void;
    upGrade: (
        mainStart: string | Date, gradeStart: string | Date,
        gradeCycle: number, gradeValue: number, gradeInterest: number 
    ) => void;
    useCalc: ( use: number, calc: number ) => void;
    createLabelId: () => void;
    createLabelExtra: () => void;
}

export function getAnalyzerChildren( 
    children: Child[], 
    type: number, sType: string, category: string,
    start: Date | string, month: number,
    endMax?: Date, check?: number )
{
    const childrenBlocks: analyzerBlock[] = [];

    for(let a = 0; a < children.length; a++){
        const child = children[a];

        let end = dateFromString(child.birthDate); 
        end.setFullYear(end.getFullYear() + 18);
        
        const endLim = new Date( +end ); 
        endLim.setFullYear(endLim.getFullYear() + 7);
        
        if(child.study && child.study[0] === 1){
            if( child.studyDate ){ 
                const studyDate = dateFromString( child.studyDate );
                end = studyDate > endLim ? endLim : studyDate;
            }
            else{
                end = endLim; 
            }
        }
        if(endMax && end > endMax){ end = new Date(+endMax); }

        const childBlock = new analyzerBlock( type, sType, category, child, start, end, undefined, month, undefined );
        if(childBlock.time > 0){
            if(check){
                const addr = child.addr;
                if( (check && addr && addr[0] !== check) && addr[0] !== 1){ 
                    childBlock.shade = true;  
                }
            }
            childrenBlocks.push(childBlock);
        }
    }
    return childrenBlocks;
} 

export class analyzerPos{
    constructor( ref: analyzerBlock, month?: number, value?: number, time?: number){
	    this.origin = {  ref: ref, month: month, value: value, time: time };
        this.ref = ref;
        this.birth = ref.person && ref.person.birthDate && dateFromString( ref.person.birthDate );
        this.labelId = ref.labelId;
        this.labelExtra = ref.labelExtra;
        this.element = 
            ref.type === 1 ? 'stone' : 
            ref.type === 2 ? 'water' : 
            ref.type === 3 || ref.type === 4 ? 'wind' : 
            ref.type === 5 || ref.type === 51 ? 'smoke' : 
            'fire';
        
        this.cut = false; 
        this.uCut = false;
        this.uMax = 0;

        this.time = 0; this.month = 0; this.value = 0;

        this.resetCalc = function(){
            this.reCalc( this.origin.month, this.origin.value, this.origin.time );
            this.cut = false; this.uCut = false;
        }
        
        this.reCalc = function( m, v, t ){	
            this.month = m ? m : Math.round( (v && t && v/t) || 0 );
            this.value = v ? v : Math.round( (m && t && m*t) || 0 );
            this.time = t ? t : Math.round( (v && m && v/m) || 0 );
        }
        
        this.reMul = function( mul ){
            this.month = Math.round( this.month * mul );
            this.value = Math.round( this.value * mul );
        }

        this.resetCalc();
    }

    origin: { ref: analyzerBlock, month: number | undefined, value: number | undefined, time: number | undefined }
    ref: analyzerBlock;
    birth: Date | undefined;
    labelId: string;
    labelExtra: string;
    element: string;

    cut: boolean;
    uCut: boolean;
    uMax: number;

    time: number;
    month: number;
    value: number;

    resetCalc: () => void;
    reCalc: ( m?: number, v?: number, t?: number ) => void;
    reMul: ( mul: number ) => void;
}

export interface Step_Props{
    start: Date,
    end: Date,
    time: number,
    month: number,
    monthTotal: number,
    sub: number, 
    shadow: number, 
    cut: number, 
    plan: number, 
    total: number,
    all: number,
    need: number,
    hole: number,
    day: boolean,
    pos: analyzerPos[]
}

export function getAnalyzerSteps( 
    base: analyzerBlock[], 
    needMonth: number, mode: number, alternate: number,  income: number)
{	
    const stepper: { s: Date, e: Date, ref: analyzerBlock }[] = [];
    for(let a = 0; a < base.length; a++){
        const 
        u = base[a],
		e = new Date( +u.end ),
		s = new Date( +u.start );
		s.setDate(1); s.setHours(0,0,0,0);
		e.setDate(1); e.setHours(0,0,0,0);
		stepper.push( { s: s, e: e, ref: u } );
	}
	const breaks: Date[] = [];
	for(let a = 0; a < stepper.length; a++){ 
		breaks.push( stepper[a].s ); 
		breaks.push( stepper[a].e ); 
	}
	breaks.sort(function(a,b){ return +a - +b; } );
	for(let a = 0; a < breaks.length; a++){
		if( +breaks[a] === +breaks[a+1] ){
			breaks.splice(a,1);
			a--;
		}
	}
	
	// creating steps
	const steps = [];
	for(let a = 0; a < breaks.length; a++){
        const 
        start = breaks[a],
		end = breaks[a+1];
		if( !end ){ continue; }
        
        const time = getMonths( start, end );
        
        let stone = 0, water = 0, wind = 0, fire = 0;
        const stones = [], waters = [], winds = [], smokes = [], fires = [];		
        
        const step: Step_Props = {
			start: start,
			end: end,
            time: time,
            month: 0,
            monthTotal: 0,
            day: false,
			pos: [],
            sub: 0, shadow: 0, cut: 0, plan: 0, total: 0, all: 0,
            need: 0, hole: 0
		}
		
		for(let b = 0; b < stepper.length; b++){
            const helper = stepper[b];
			if( (+start === +helper.s || helper.s < start) && (+end === +helper.e || helper.e > end) ){
                const pos = new analyzerPos( helper.ref, helper.ref.month, undefined, time );

				if(pos.element !== 'fire' && pos.element !== 'smoke' ){ step.shadow += pos.value; }	
				
				if(pos.element === 'stone'){ stone += pos.value; stones.push( pos ); }
				else if(pos.element === 'water'){ water += pos.value; waters.push( pos ); }
				else if(pos.element === 'wind' ){ wind += pos.value; winds.push( pos ); }
				else if(pos.element === 'smoke' ){ fire += pos.value; smokes.push( pos ); }
				else{ fire += pos.value; fires.push( pos ); }
			}
        }
		
		let newWind = 0, newWater = 0;
	
        if( wind > 0 ){
            if( mode === 2 ){
                const windLim = 
                    income * 0.8 > constantNumbers.UVG_max ?
                    Math.round( constantNumbers.UVG_max / 12 * time ) :
                    Math.round( (income * 0.8) / 12 * time );

                if( stone + wind > windLim ){
                    var windMul = (windLim - stone) / wind;
                    for(let b = 0; b < winds.length; b++){
                        if(windMul < 1){
                            winds[b].reMul(windMul); 
                            winds[b].uCut = true;
                        }
                        newWind += winds[b].value;
                    }
                }
            }
            else if( mode === 3 ){
                let wSum = 0, eSum = 0, oSum =0;
                for(let b = 0; b < winds.length; b++){
                    const sType = winds[b].ref.sType;
                    if( sType === 'widow' ){ wSum++; }
                    else if(sType === 'exwidow'){ eSum++; }
                    else if(sType === 'orphan' || sType === 'exorphan'){ oSum++; }
                }
                
                const 
                uDiv = 
                    (wSum * constantNumbers.UVG_widow) + 
                    (eSum * constantNumbers.UVG_exwidow) + 
                    (oSum * constantNumbers.UVG_orphan),
                uMax = eSum > 0 ? 90 : 70,
                uMul = uMax / uDiv;
                
                for(let b = 0; b < winds.length; b++){
                    if(uMul < 1){
                        winds[b].reMul(uMul);
                        winds[b].uCut = true; 
                        winds[b].uMax = uMax;
                    }
                    newWind += winds[b].value;
                }
            }
            
            step.cut += newWind > 0 ? wind - newWind : 0;
            water += newWind;
            waters.push( ...winds);
        }
        if( income ){
            const lim = (income * 0.9) / 12 * time;
            if(stone + water > lim){ 
                const cutMul = (lim - stone ) / water;
                for(let b = 0; b < waters.length; b++){
                    waters[b].reMul(cutMul);
                    waters[b].cut = true;
                    newWater += waters[b].value;
                }
                step.cut += newWater > 0 ? water-newWater : 0;
            }
        }
		
		step.pos.push( ...stones );
        step.pos.push( ...waters );
        step.pos.push( ...smokes );
        
		for(let b = 0; b < step.pos.length; b++){
            step.month += step.pos[b].month;
            step.sub += step.pos[b].value;
			if( step.pos[b].ref.sType === 'day' ){ step.day = true; }
			if( !step.pos[b].ref.shade ){ step.plan += step.pos[b].value; }
		}
		
        step.pos.push( ...fires );
		
		for(var b = 0; b < step.pos.length; b++){
            step.monthTotal += step.pos[b].month;
        }
		step.total = step.plan + fire; 
		step.all = step.total;
		
		steps.push( step );	
	}	
	
	for(let a = 0;a < steps.length; a++){
		var s = steps[a];
		s.need = needMonth * s.time; 
		s.hole = Math.max( s.need - s.total, 0 );
	}
	
	return steps;
}



export function analyzerDistributor(
    base: analyzerBlock[],
    liquid: analyzerBlock[],
    need: number, mode: number, alternate: number, income:number)
{
    const liquidMode : number = 3;

	// Sort liquids
    const sorted = [...liquid]; 
    sorted.sort((a,b) => { return a.type - b.type; });
	
	// Initial steps
	let steps = getAnalyzerSteps( base, need, mode, alternate, income );
	
	// Start growing base
	let newBase = [...base];
	
	// From left to right
	if(liquidMode === 1)
	{
		// Go through possible liquids
		for(let a = 0; a < sorted.length; a++){
            let 
            f = sorted[a],
			dist = f.value;
			
			// Collect new steps
			const newSteps = [];
			
			// Loop & magic
			for(let k = 0; k < steps.length; k++){
				const s = steps[k];
				
				if( (s.end <= f.start) || s.hole <= 100 ) continue;
				const start = !f.start || f.start <= s.start ? s.start : f.start;
				const preTime = start !== s.start ? getMonths( s.start, start ) : 0;
				let time = s.time - preTime;
				
				const month = s.hole / s.time;
				const possibleTime = dist / month;
				
				let rValue = 0, rTime = 0;
				if(possibleTime + 0.01 < time){
					time = Math.floor( possibleTime );
					rTime = possibleTime - time;			
					rValue = month * rTime;
				}
				
				const total = month * time;
				if(total <= 100) continue;
				
				let newBlock = new analyzerBlock( f.type, f.sType, f.category, f.person, start, undefined, time, month, undefined );
				newBlock.labelId = f.labelId;
				newBlock.roundValue = rValue;
				newSteps.push( newBlock );
				
                dist -= total + rValue; 
                if(dist <= 100) break;
			}
			newBase = [ ...newBase, ...newSteps];
			
			// Generate new step for next loop
			steps = getAnalyzerSteps( newBase, need, mode, alternate, income );
		}	
	}
	// From bottom to top
	else if(liquidMode === 2)
	{	
		// Go through possible liquids
		for(let a = 0; a < sorted.length; a++){
            let 
            f = sorted[a],
			dist = f.value,
			distTime = f.time;
			
			// Collect new steps
			let newSteps = [];
			
			// Sort steps according to holes (small to big) 
			let sortSteps = [...steps];
			sortSteps.sort(function(a,b){ return (a.hole/a.time)-(b.hole/b.time); });
			
			// Loop & magic
			for(let k = 0; k < sortSteps.length; k++){
				const s = sortSteps[k];
				
				if( s.end <= f.start || s.hole <= 100 ) continue;
				const start = !f.start || f.start <= s.start ? s.start : f.start;
				const preTime = start !== s.start ? getMonths( s.start, f.start ) : 0;
				let time = s.time - preTime;
				let month = Math.min( s.hole / s.time, dist / distTime );
				
				const total = month * time;
				
				const newBlock = new analyzerBlock( f.type, f.sType, f.category, f.person, start, undefined, time, month, undefined);
				newBlock.labelId = f.labelId;
				newSteps.push( newBlock );
				
				distTime -= time; 
                dist -= total; 
                if(dist <= 100) break;
			}
			newBase = [...newBase, ...newSteps];
			
			// Generate new step for next loop
			steps = getAnalyzerSteps( newBase, need, mode, alternate, income );
		}
	}
	// Bathtub
	else if(liquidMode === 3)
	{	
		// Go through possible liquids
		for(let a = 0; a < sorted.length; a++){
            let 
            f = sorted[a], 
			dist = f.value;
			
			// Collect new steps
			let newSteps = [];
			
			// Sort steps according to holes (big to small) 
			let sortSteps = [...steps];
			sortSteps.sort(function(a,b){ return (b.hole/b.time)-(a.hole/a.time); });

			// Collect relevant data
			let months = [], times = [], starts = [];
			for(let k = 0; k < sortSteps.length; k++){
				const s = sortSteps[k];
				if( (f.type !== 99 && s.end <= f.start) || s.hole <= 100 ){ continue; }
				
				const start = !f.start || f.start <= s.start || f.type === 99 ? s.start : f.start;
				starts.push( start );
				
				const preTime = start !== s.start ? getMonths( s.start, f.start ) : 0;
				const time = s.time - preTime; 
				times.push( time );
				
				const month= s.hole / s.time;
				months.push( month );
			}
			
			// Merge same next to eachother
			const newStarts = [...starts];
			newStarts.sort(function(a,b){ return +b - +a; });
			for(let k = 0; k < newStarts.length; k++){
				const i1: number = starts.indexOf(newStarts[k]);	
				const i2: number | undefined = newStarts[k+1] ? starts.indexOf(newStarts[k+1]) : undefined;	
				if(i2){
					if( months[i2] && ( Math.floor(months[i1]) === Math.floor(months[i2]) ) ){
						months.splice(i1,1);
						times[i2] += times[i1];
						times.splice(i1,1);
						starts[i2] = starts[i2] && starts[i2] < starts[i1] ? starts[i2] : starts[i1];
						starts.splice(i1,1);
					}
				}
			}
			
			// Get differences
			let diffs=[];
			for(let k = 0; k < months.length; k++){
				diffs.push( months[k+1] ? months[k]-months[k+1] : months[k] );
			}
			
			// Create position data with magic 
            let diffDist = dist, diffTime = 0, diffHeight = 0;
            const diffPos = [];
			for(let k = 0; k < months.length; k++){ 
                if(!starts[k]) continue;

                let dPos: 
                { month: number, time: number, start: Date | undefined } 
                = { month: 0, time: 0, start: undefined };
                dPos.start = starts[k]; 
                dPos.time = times[k];
				if(k === 0){
					for(var j = 0; j < diffs.length; j++){ 
                        if(!starts[j]) continue;
						if(diffs[j] * (diffTime + times[j]) < diffDist){
							dPos.month += diffs[j]; 
							diffDist -= diffs[j] * (diffTime + times[j]);
							diffTime += times[j];
						}else{
							dPos.month += diffDist / (diffTime + times[j]);
							diffDist -= diffs[j] * dPos.time; break;
						}
					}
					diffHeight = dPos.month - diffs[k];
				}
				else{
					dPos.month = diffHeight;
					diffHeight -= diffs[k];
				}
				diffPos.push( dPos );
				if(diffHeight < 0) break;
			}
			
			// Loop through and create blocks
			for(let k = 0; k < diffPos.length; k++){
                const d = diffPos[k]; 
                if(!d || !d.start) continue;
				const newBlock = new analyzerBlock( f.type, f.sType, f.category, f.person, d.start, undefined, d.time, Math.round(d.month), undefined);
				newBlock.labelExtra = f.labelExtra;
				newSteps.push( newBlock );
			}
			newBase = [...newBase, ...newSteps];
			
			// Generate new step for next loop
			steps = getAnalyzerSteps( newBase, need, mode, alternate, income );
		}
	}
	return steps;
}


export function analyzerHoles( steps: Step_Props[], person: any, need: number ){
    const holes: analyzerBlock[] = [];
    steps.forEach( (step: Step_Props)=>{
        const hole = new analyzerBlock( 42, 'main', 'hole', person, step.start, step.end, step.time, Math.max( Math.round(need - step.monthTotal), 0 ), undefined );
        holes.push( hole );
    } );
    return holes;
}


export function leftBehindRights( person: Person, state: Dossier ){ 
    
    const result : { [key:string] : any }  = { 
		type1:{ orphans:[], exwidows:[], exorphans:[], widow:{ hasRight:false, rightTill:'' } },
		type2:{ orphans:[], exwidows:[], exorphans:[], widow:{ hasRight:false, rightTill:'' } },
		type3:{ orphans:[], exwidows:[], exorphans:[], widow:{ hasRight:false, rightTill:'' } }
    };

    if(!person) return result;
    // exwidow and orphans
    const exes = [...person.exes];
    const now = new Date();
	if( exes.length > 0 ){
        exes.forEach((ex,i) => {
            if(!ex.birthDate || !ex.gender ) return false;
            const 
            exChildren = [...ex.children],
            exBirth = dateFromString( ex.birthDate ),
            exAge = getAge( exBirth, now ),
            exPensionDate = getPensionDate( exBirth, ex.gender ); 

            let max = new Date();
			if( exChildren.length > 0 ){ 
                exChildren.sort((a,b) => { return getAge(a.birthDate) - getAge(b.birthDate) });
                max = dateFromString(exChildren[0].birthDate); max.setFullYear(max.getFullYear()+18); 
            }

            const exDateGate = new Date( +exBirth ); exDateGate.setFullYear(exDateGate.getFullYear()+45);
                
            let 
            exHasRight = true,
            exRightTill = new Date( +exPensionDate );
            const exWidowGender = ex.gender[0] === person.gender[0] || ex.gender[0] === 1 || ex.gender[0] === 3 ? 1 : 2;
        
            if( exWidowGender === 1 ){ 
                if( exChildren.length > 0 ){ exRightTill = max; }else{ exHasRight = false; } 
            }
        
            if( ex.mode[0] === 1 || ex.mode[0] === 2 ){   
                if( exWidowGender === 2 ){ 
                    if( getAge( ex.modeStart, ex.modeEnd ) > 10 ){
                        if( exChildren.length > 0 || exAge > 45){ 
                            result.type1.exwidows.push( 
                                { hasRight: exHasRight, rightTill: exRightTill, ref: ex, widowGender: exWidowGender } 
                            );
                        }
                        if( exAge > 45 ){ 
                            result.type2.exwidows.push( 
                                { hasRight: exHasRight, rightTill: exPensionDate, ref: ex, widowGender: exWidowGender } 
                            ); 
                        }
                    }
                    else if( exChildren.length > 0 ){ 
                        result.type1.exwidows.push( 
                            { hasRight: exHasRight, rightTill: +max - +exDateGate > 0 ? exRightTill : max, ref: ex, widowGender: exWidowGender } 
                        ); 
                    }
                }
                if( ex.alimony && ex.alimony[0] === 1 ){ 
                    result.type3.exwidows.push(
                        { hasRight: true, rightTill: 'lifelong', ref: ex, widowGender: exWidowGender } 
                    ); 
                }
            }
            
            exChildren.forEach((exChild) => {
                const exChildAge = getAge( exChild.birthDate );
                if( exChildAge > 25 || ( exChildAge > 17 && !exChild.study ) ) return true;
                const baseRight : { [key:string]: any } = { hasRight: true, ref: exChild };
                if( exChild.study && exChild.studyDate !== '' ){ 
                    baseRight.rightTill = new Date( dateFromString( exChild.studyDate ) ); 
                }
                else{ 
                    baseRight.rightTill = new Date( dateFromString( exChild.birthDate ) ); 
                    baseRight.rightTill.setFullYear( baseRight.rightTill.getFullYear() + (exChild.study ? 25 : 18) );
                }
                result.type1.exorphans.push( exChild );
                result.type2.exorphans.push( exChild );
                result.type3.exorphans.push( exChild );
            });
		});
    }
    
	// widow and orphans
    const 
    partner = person === state.myPerson ? state.myPartner : state.myPerson, 
    connection = state.myConnection;
    
    if( partner && connection ){ 
        const conChildren = [...connection.children]; 
        conChildren.forEach((child,i) => {
            const childAge = getAge( child.birthDate );
            if( childAge > 25 || (childAge > 17 && !child.study) ) return true;
            const baseRight : { [key:string]: any } = { hasRight: true, ref: child };
            if( child.study && child.studyDate !== '' ){ 
                baseRight.rightTill = new Date( dateFromString( child.studyDate ) ); 
            }
            else{ 
                baseRight.rightTill = new Date( dateFromString( child.birthDate ) ); 
                baseRight.rightTill.setFullYear( baseRight.rightTill.getFullYear() + (child.study ? 25 : 18) );
            }
            result.type1.exorphans.push( child );
            result.type2.exorphans.push( child );
            result.type3.exorphans.push( child );
        });

		// children of partner
        const 
        partnerChildren = partner.getChildren( state.myConnection, false, false, false, false ),
        //original children requirement for elite mode
        // supportedChildren = partner.getChildren( state.myConnection, false, 3, true, true ),
        // under25Children = person.getChildren( state.myConnection, false, 3, false, true );
        supportedChildren = partner.getChildren( state.myConnection, false, 1, false, false ),
        under25Children = person.getChildren( state.myConnection, false, 1, false, false );

		// gates
		const gates = {
			gender: person.gender[0] === partner.gender[0] || partner.gender[0] === 3 ? 1 : partner.gender[0],
			age: partner.age() > 45,
			modeLength: getAge( connection.modeStart, now ) > 5
        };

        const partnerPensionDate = getPensionDate( partner.birthDate, partner.gender );
        
		// male or same gender partner - set to youngest child
        let type1Till = new Date( +partnerPensionDate );
		if( gates.gender === 1 ){
            const youngestChild = conChildren[0]; 
            if( youngestChild ){
			    type1Till = dateFromString( youngestChild.birthDate );
                if( youngestChild.study && youngestChild.study.length && youngestChild.studyDate !== '' ){ 
                    type1Till = dateFromString( youngestChild.studyDate ); 
                }
			    else{ 
                    type1Till.setFullYear( type1Till.getFullYear() + 18 );
                }
			}
        }
        if( type1Till < now ){ type1Till = new Date(); }
		// separate married-like and others
		if( connection.mode[0] === 1 ){
			if( conChildren.length > 0 ){
				result.type1.widow.hasRight = true; result.type1.widow.rightTill = type1Till;
                result.type3.widow.hasRight = true; result.type3.widow.rightTill = 'lifelong';
			}
			else{
				if( gates.age && gates.modeLength ){ 
                    result.type1.widow.hasRight = true; result.type1.widow.rightTill = type1Till; 
                }
                if( under25Children.length > 0 || partnerChildren.length > 0 || 
                    ( gates.gender === 2 && gates.age ) ){
					result.type3.widow.hasRight = true; result.type3.widow.till = 'lifelong';
				}
			}
			if( supportedChildren.length > 0 || ( gates.age && gates.modeLength ) ){
				result.type2.widow.hasRight = true; result.type2.widow.rightTill = partnerPensionDate;
			}
		}
		else if( connection.mode[0] === 2 && gates.modeLength ){
            if( person.legal && person.legal.pensionWork &&
                person.legal.pensionWork.pkAuszug && person.legal.pensionWork.pkAuszug.lifePartner && person.legal.pensionWork.pkAuszug.lifePartner[0] === 1 ){ 
				result.type2.widow.hasRight = true; result.type2.widow.rightTill = partnerPensionDate;
			}
		}
    }
    console.log( 'rights', result );
	return result;
}