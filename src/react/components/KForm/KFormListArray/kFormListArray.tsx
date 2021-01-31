import React, { useState, useEffect } from "react";
import createGUID from "../../../utils/guidGenerator";
import KFormModal from "../KFormModal/kFormModal";
import { GeneralText } from "../../common/styled";
import { KFormListAdd, KFormListElement } from "../KForm_styles";
import { useTranslation } from "react-i18next";
import showNum from "../../../utils/showNum";

interface KFormListArray_Props{
    name: string;
    array: any[];
    layout: 'numbered' | string;
    modalTitle: string;
    setFieldValue: (name:string,value:any) => void;
    showParams: KFormListArray_ShowParams[];
    customParams?: KFormListArray_CustomParams;
    toggleHelp: (x: string) => void;
}

interface KFormListArray_ShowParams{
    name: string;
    type: 'item' | 'value';
    items?: string[];
}
interface KFormListArray_CustomParams{
    addButtonText?: string;
    modalAcceptButtonText?: string;
    modalAcceptButtonTextNew?: string;
    modalCancelButtonText?: string;
    modalRemoveButtonText?: string;
    modalWarningTitle?: string;
    modalWarningContent?: string;
    modalWarningElement?: string;
    validateElements?: boolean;
    validateElementFunc?: (block:any) => boolean;
}

const KFormListArray: React.FC<KFormListArray_Props> = ({
    name,
    array,
    layout,
    modalTitle,
    setFieldValue,
    showParams,
    customParams,
    ...props
}) => {

    const [ arrayValue, setArrayValue ] = useState< {[key:string]:any}[] >( 
        array && array.length ? array : 
        [] );

    const [ activeModal, setActiveModal ] = useState<'none'|'remove'|'new'|'edit'>('none');
    const [ activeBlock, setActiveBlock ] = useState<string>('');
    const [ openModal, setOpenModal ] = useState<boolean>(false);

    const [ modalData, setModalData ] = useState<any>({}); 

    const {t} = useTranslation('kForms');

    const customControl: KFormListArray_CustomParams = {
        addButtonText: t(`listarray.add`),
        modalAcceptButtonText: t(`listarray.accept`),
        modalAcceptButtonTextNew: t(`listarray.acceptNew`),
        modalCancelButtonText: t(`listarray.cancel`),
        modalRemoveButtonText: t(`listarray.remove`),
        modalWarningTitle: t(`listarray.warningTitle`),
        validateElements: false,
        ...customParams
    }
    customControl.modalWarningContent = customControl.modalWarningElement ?
    t(`listarray.warningContentWithElement`,{ element: customControl.modalWarningElement } ) :
    t(`listarray.warningContent`);

    const changeBlock = () => {
        let isNew = true;
        const newArray: any[] = arrayValue.map((block:any) => {
            if(block.id === activeBlock){ 
                isNew = false; return modalData;
            } 
            return block;
        });
        if(isNew){
            newArray.push( {...modalData} );
        }
        setArrayValue([ ...newArray]);
        setFieldValue && setFieldValue( name, newArray );
    }

    const removeBlock = () => {
        const newArray = arrayValue.filter(x=>x.id !== activeBlock );
        setArrayValue([ ...newArray ]);
        setFieldValue && setFieldValue( name, newArray );
    }

    const setModal = (blockId:string, modalToCall:'remove'|'new'|'edit' = 'edit') => {
        const modalDataSet = arrayValue.find(x=>x.id === blockId);
        setModalData({...modalDataSet});
        setActiveBlock(blockId);
        setActiveModal(modalToCall);
    }

    const addModal = () => {
        const newBlockId = createGUID();
        setModalData({id: newBlockId});
        setActiveBlock(newBlockId);
        setActiveModal('new');
    }

    const saveModal = () => {
        changeBlock();
        closeModal();
    }

    const removeModal = () => {
        removeBlock();
        closeModal();
    }

    const closeModal = () => {
        setModalData({});
        setActiveModal('none');
        setActiveBlock('');
    }

    useEffect(()=>{
        setOpenModal( activeBlock !== '' && activeModal !== 'none' );
    },[activeBlock,activeModal,modalData]);


    return(<>
            <KFormModal
                id={'removeModal'}
                name={'removeModal'}
                title={customControl.modalWarningTitle || ''}
                isOpen={openModal && activeModal === 'remove'}

                allowApprove={true}
                onApprove={removeModal}
                onClose={closeModal}
                customParams={{
                    acceptButtonText: customControl.modalRemoveButtonText,
                    cancelButtonText: customControl.modalCancelButtonText 
                }}
            >
                <GeneralText>
                    {customControl.modalWarningContent}
                </GeneralText>
            </KFormModal>

            <KFormModal
                id={activeBlock}
                name={name}
                title={modalTitle}
                isOpen={openModal && (activeModal === 'edit' || activeModal === 'new')}

                data={modalData}
                setData={setModalData}

                allowApprove={true}
                onApprove={saveModal}
                onClose={closeModal}
                handleToggleHelp={props.toggleHelp}
                customParams={{
                    acceptButtonText: activeModal === 'new' ? customControl.modalAcceptButtonTextNew : customControl.modalAcceptButtonText,
                    cancelButtonText: customControl.modalCancelButtonText 
                }}
            >
                {props.children}
            </KFormModal>

            { arrayValue.map( (element:any,i:number) => {
                let valid = false;
                if( customControl.validateElements && customControl.validateElementFunc ){
                    valid = customControl.validateElementFunc(element);
                }
                return(
                <KFormListArrayElement
                    key={i}
                    index={i}
                    layout={layout}
                    element={element}
                    valid={valid}
                    showParams={showParams}
                    edit={() => setModal(element.id)}
                    remove={() => setModal(element.id, 'remove')}
                >
                </KFormListArrayElement>
            ) } )
            }

            <KFormListAdd
                onClick={() => addModal()}
            >
                {customControl.addButtonText}
            </KFormListAdd>
        </>);
};

export default KFormListArray;

interface KFormListArrayElement_Props{
    element:any;
    valid: boolean;
    edit: () => void;
    remove: () => void;
    showParams: any;
    index:number;
    layout:'numbered'|string;
}

const KFormListArrayElement : React.FC<KFormListArrayElement_Props> = ({
    element,
    valid,
    remove,
    edit,
    showParams,
    index,
    layout
}) => (
    <>
    <KFormListElement className={`${layout} ${valid ? 'valid' : 'invalid'}`}>
        {layout === 'numbered' ? (<div className='listElementIndex'>{(index+1) + '.'}</div>) : '' }
        <div className='listElementBody' onClick={()=>edit()}>
            {showParams.map((param:any,i:number)=>{
                const val = param.name && element[param.name];
                if( !val ) return false;
                const elemText =
                    param.type === 'item' ?
                    param.items[val-1] : showNum(val);
                if( !elemText ) return false;
                return(
                <div className={param.type} key={i}>
                    {elemText}
                </div>);
            })}
        </div>
        <div className='remove' onClick={remove}></div>
    </KFormListElement>
    </>
);