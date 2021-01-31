import React, { useState, useEffect } from 'react';
import { KFieldArrayHolder, KFieldArrayAdd, KFieldArrayRemove, KFieldArrayRow } from './kFieldArray_styles.js'; 
import createGUID from '../../../utils/guidGenerator';
import { CardHeading } from '../../common/styled.js';
import { shallowIndexOf } from '../../../utils/customMethods';
import { KFormRow, KFormCol } from '../KForm_styles.js';
import i18next from 'i18next';

interface KFieldArray_Props {
    name: string;
    label: string;
    startEmpty?: boolean;
    addText?: string;
    fieldValue?: {[key:string]:any}[];
    placeHolder?: string;
    setFieldValue?: (name: string, value: any) => void;
    t?: i18next.TFunction,
    cardName?: string
  }


const KFieldArray: React.FC<KFieldArray_Props> = ({
    name,
    label,
    startEmpty,
    addText,
    fieldValue,
    setFieldValue,
    t,
    cardName,
    ...props
}) => {

    const [ arrayValue, setArrayValue ] = useState< {[key:string]:any}[] >( 
        fieldValue && fieldValue.length ? fieldValue : 
        [] );

    const [ conditionChange, setConditionChange ] = useState<boolean>( false );

    const addBlock = () => {
        const newArray = [...arrayValue];
        newArray.push( {id: createGUID()} );
        setArrayValue([ ...newArray ]);
        setFieldValue && setFieldValue( name, newArray );
    }

    const removeBlock = (id: string) => {
        const newArray = arrayValue.filter(x=>x.id !== id );
        setArrayValue([ ...newArray ]);
        setFieldValue && setFieldValue( name, newArray );
    }

    const collectFieldValues = ( id: string, fieldName: string, value: any ) => {
        const block = arrayValue.find(x=>x.id===id);
        if( block ){ block[fieldName] = value; }
        setConditionChange( !conditionChange );
        setFieldValue && setFieldValue( name, arrayValue );
    }

    const createChildren = (block: any, id: string) => {
        return React.Children.map(props.children, child => {
            let rowChild: React.ReactElement<any> = child as React.ReactElement<any>; 
            if ( !rowChild.props.conditionName || 
                ( rowChild.props.conditionName && block[ rowChild.props.conditionName ] &&
                (
                    (!rowChild.props.conditionReverse && shallowIndexOf(rowChild.props.conditionValues, block[rowChild.props.conditionName]) > -1) ||
                    (rowChild.props.conditionReverse && shallowIndexOf( rowChild.props.conditionValues, block[ rowChild.props.conditionName ] ) === -1) 
                ))
            ){
            const rowChildren = rowChild.props && React.Children.map(rowChild.props.children, colChild => {
                    const colChildren = colChild.props && React.Children.map(colChild.props.children, elementChild => {
                        if( elementChild.props ){
                            return React.cloneElement(elementChild as React.ReactElement, 
                                {
                                    setFieldValue: (name:string, value:any) => collectFieldValues(id, name, value),
                                    fieldValue: block[ elementChild.props.name ],
                                    label: rowChild.props.conditionLabels && rowChild.props.conditionLabels[elementChild.props.name] ?
                                        t && t(`${cardName}.${elementChild.props.name}${block[rowChild.props.conditionLabels[elementChild.props.name]]}`)
                                        : elementChild.props.label
                                });
                        }else{
                            return elementChild;
                        }
                        })
                    if( colChildren ){
                        return React.cloneElement(colChild, { children: colChildren } );
                    }else{
                        return colChild;
                    }
                    });
            if( rowChildren ){
                return React.cloneElement(rowChild, { children: rowChildren } );
            }else{
                return rowChild;
            }
            }

        })
    }

    useEffect(()=>{
        if( arrayValue.length < 1 && !startEmpty) addBlock();
    });

    return(
        <KFieldArrayHolder>
            <KFormRow>
                <KFormCol>
                    <CardHeading>
                    {label}
                    </CardHeading>
                </KFormCol>
            </KFormRow>
            { arrayValue.map( (elem: any, i: number) => {
                    return( <KFieldArrayBlock key={i} index={i} removeBlock={ (id: string)=> removeBlock(elem.id) }>
                         { createChildren( elem, elem.id ) }
                    </KFieldArrayBlock> )
                })
            }
            <KFieldArrayAdd onClick={ () => addBlock() }>{addText}</KFieldArrayAdd>
        </KFieldArrayHolder>
 
    )
} 

export default KFieldArray;

interface KFieldArrayBlock_Props{
    index: number;
    removeBlock: any;
}

const KFieldArrayBlock : React.FC<KFieldArrayBlock_Props> = ({
    index,
    removeBlock,
    ...props
}) => {

    return(
        <KFieldArrayRow>
            {props.children}
            <KFieldArrayRemove onClick={ () => removeBlock() }></KFieldArrayRemove>
        </KFieldArrayRow>
    );
}
