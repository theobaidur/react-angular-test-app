import React from "react";
import ModalWindow from "../../common/modalWindow";
import { shallowIndexOf } from "../../../utils/customMethods";
import { PrimaryButton } from "../../common/styled";
import { useTranslation } from "react-i18next";

interface KFormModal_Props {
    id: string;
    name: string;
    title: string;
    isOpen: boolean;

    data?:any;
    setData?: (data:any) => void;
    onClose: () => void;
    children?: any;
    allowApprove: boolean;
    onApprove: () => void;
    handleToggleHelp?: (x: string) => void;
    customParams?:KFormModal_CustomParams;
  }
interface KFormModal_CustomParams{
    acceptButtonText?: string;
    cancelButtonText?: string;
}

const KFormModal: React.FC<KFormModal_Props> = ({
    name,
    isOpen,
    onClose,
    title,
    children,
    id,
    onApprove,
    allowApprove,
    handleToggleHelp,
    data,
    setData,
    customParams,
    ...props
}) => {

    const {t} = useTranslation('kForms');

    const customControl: KFormModal_CustomParams = {
        acceptButtonText: t(`modal.accept`),
        cancelButtonText: t(`modal.cancel`),
        ...customParams
    }

    const createChildren = (block: any, id: string) => {
        return React.Children.map(children, child => {
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
                                    setFieldValue: (name:string, value:any) => setData && setData({...data, [name]: value}),
                                    fieldValue: block[ elementChild.props.name ],
                                    label: rowChild.props.conditionLabels && rowChild.props.conditionLabels[elementChild.props.name] ?
                                        t && t(`${name}.${elementChild.props.name}${block[rowChild.props.conditionLabels[elementChild.props.name]]}`)
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


    return (
        <ModalWindow
        isOpen={isOpen}
        toggle={onClose}
        title={title}
        width={500}
        buttons={[
            <PrimaryButton outlined onClick={onClose} key="cancel">
            {customControl.cancelButtonText}
            </PrimaryButton>,
            <PrimaryButton onClick={onApprove} disabled={!allowApprove} key='approve'>
            {customControl.acceptButtonText}
            </PrimaryButton>
        ]}
        >
        { data ? createChildren(data, id) : children }
        {/* <HelpBar id={id} valid={false} onClick={() => handleToggleHelp(id)} visible={true} /> */}
        </ModalWindow>
    );
};

export default KFormModal;
