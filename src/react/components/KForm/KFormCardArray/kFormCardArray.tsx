
import React, { useState, useEffect } from "react";
import { Card_Props, ValidCard_Props } from "../../../app_modules/module.interfaces";
import createGUID from "../../../utils/guidGenerator";
import { KFormCard, KCheck, KFormModal } from "..";
import { KFormRow, KFormCol, KFormCardAdd } from "../KForm_styles";
import { GeneralText } from "../../common/styled";
import { useMemoizedCallback } from "../../../utils/customCallbackHook";

interface KFormCardArray_Props extends Card_Props{
    CardSample: React.FunctionComponent<Card_Props>;
    validCards: ValidCard_Props;
    legalData: any;
    cardName: string;
    refObj?:any;
}

const KFormCardArray: React.FC<KFormCardArray_Props> = ({
    CardSample,
    validCards,
    refObj,
    id,
    cardName,
    legalData,
    setFieldValue,
    t,
    validateCard,

    ...props
}) => {
    
    const { array, hasNoElements } = legalData;

    const [activeCard, setActiveCard] = useState<string>('');
    const [openModal,setOpenModal] = useState<boolean>(false);

    const validateInitializer = useMemoizedCallback(() => {
        if( (array && array.length > 0) || 
            ( (!array || array.length < 1) && (hasNoElements && hasNoElements[0] === 1) )
        ) return true
        return false
    },[array,hasNoElements]);

    const addCard = () => {
        const newCard = refObj ? {} as typeof refObj : {}; 
        newCard.id = createGUID();
        const newArray = array ? [...array] : [];
        newCard.initIndex = newArray.length + 1;
        newArray.push( newCard );
        setFieldValue && setFieldValue( 'array', newArray );
        validateCard && validateCard( `${id}_init`, true );
        return newCard.id;
    }

    const removeCard = () => {
        const newArray = array.filter((x:any)=>x.id !== activeCard );
        setFieldValue && setFieldValue( 'array', newArray );
        validateCard && validateCard( id + activeCard, true ); // Quickfix to validate deleted items, should be removed from validCards array
        validateCard && validateCard( `${id}_init`, true );
    }

    const updateCard = 
        ( cardId:string, propName: string, value: any ) => {
        if(value === undefined || value === null ) return;
        const newArray: any[] = array.map((card:any) => {
            if(card.id === cardId){ 
                card[propName] = value;
                const arrayCardId : any = (id && id + card.id) || 'default';
                const validation = props.validate && props.validate(card, props.mode);
                const valid = (validation && validation.done) || false;
                validateCard && validateCard(arrayCardId,valid);
            } 
            return card;
        });
        setFieldValue && setFieldValue( 'array', newArray );
        validateCard && validateCard( `${id}_init`, true );
    }


    const removeModal = () => {
        removeCard();
        closeModal();
    }

    const closeModal = () => { 
        setActiveCard('');
    }

    useEffect(()=>{
        setOpenModal( activeCard !== '' );
    },[activeCard]);

    useEffect(()=>{
        validateCard && validateCard( `${id}_init`, true );
    },[id,validateCard,validateInitializer]);

    return(
        <>
        { array && array.map( (cardData:any,i:number) => {
            const arrayCardId : any = (id && id + cardData.id) || 'default';
            i > 0 && props.cardNumber++;
            
            return( <CardSample
              key={i}
              id={ arrayCardId }
              cardName={cardName}
              legalData={cardData}
              t={t}
              isCardValid={validCards[arrayCardId]}
              setFieldValue={(name:string,value:any)=>updateCard(cardData.id,name,value)}
              customParams={{
                removeButton: 'show',
                removeButtonText: t(`${cardName}.removeElement`) || '',
                removeFunction: () => setActiveCard(cardData.id)
              }}
              validateCard={validateCard}
              {...props}
            /> )
        })}

        <CardArrayInitiator
            id={`${id}_init`}
            cardName={cardName}
            legalData={legalData}
            t={t}

            addCard={addCard}
            isCardValid={validCards[`${id}_init`]}
            setFieldValue={setFieldValue}
            validateCard={validateCard}
            {...props}
        />

        <KFormModal
            id={'removeModal'}
            name={'removeModal'}
            title={t(`removeModalTitle`)}
            isOpen={openModal}

            allowApprove={true}
            onApprove={removeModal}
            onClose={closeModal}
        >
            <GeneralText>
                {t(`removeModalContent`)}
            </GeneralText>
        </KFormModal>
        </>
    );
}

export default KFormCardArray;


interface CardArrayInitiator_Props extends Card_Props{
    id:string,
    addCard:()=>void;
    legalData: any;
}

const CardArrayInitiator: React.FC<CardArrayInitiator_Props> = ({
    id,
    cardName,
    legalData,
    t,
    addCard,
    ...props
}) => {

    const primaryButton : 'show' | 'hide' = 
        legalData && ( 
            (legalData.array && legalData.array.length > 0) || ( legalData.hasNoElements && legalData.hasNoElements[0] === 1 ) 
        ) ? 'show' : 'hide';

    const primaryButtonText : string = 
        legalData && (legalData.hasNoElements && legalData.hasNoElements[0] === 1) ?
        t(`${cardName}.init.accept`) : t(`${cardName}.init.noMore`);

    const closedText = 
        legalData && (legalData.hasNoElements && legalData.hasNoElements[0] === 1) ?
        t(`${cardName}.init.hasNoElements`) : t(`${cardName}.init.noMore`);

    return(
        <KFormCard
            id={id}
            cardName={cardName + '_init'}
            state={true}
            handleApprove={props.handleApprove}
            toggleHelp={props.toggleHelp}
            position={props.position}
            closedText={ closedText }
            customParams={{
                primaryButton: primaryButton,
                primaryButtonText: primaryButtonText
            }}
            >
            { legalData && 
            ( !legalData.hasNoElements || legalData.hasNoElements[0] !== 1 ) ? (
            <KFormRow>
                <KFormCol width={1}>
                    <KFormCardAdd>
                        <div 
                            className='button'
                            onClick={addCard}
                        >
                        </div>
                        <div
                            onClick={addCard} 
                            className='text'
                        >
                            {t(`${cardName}.init.add`)}
                        </div>
                    </KFormCardAdd>
                </KFormCol>
            </KFormRow>
            ) : '' }
            { legalData &&
            ( !legalData.array || (legalData.array && legalData.array.length < 1) ) ? (
            <KFormRow>
                <KFormCol width={1}>
                    <KCheck
                        fieldValue={legalData.hasNoElements}
                        name={`hasNoElements`}
                        itemsValue={[1]}
                        itemsName={[t(`${cardName}.init.hasNoElements`)]}
                        setFieldValue={props.setFieldValue}
                    />
                </KFormCol>
            </KFormRow>
            ) : '' }
        </KFormCard>
    );
}