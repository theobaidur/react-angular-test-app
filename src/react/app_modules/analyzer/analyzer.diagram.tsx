import React, { useRef } from 'react';
import KDiagram from "../../components/KDiagram";
import { PrimaryButton, Row } from "../../components/common/styled";
import { DiagramBlock, DiagramHolder } from "./analyzer.styled";
import i18next from 'i18next';

interface AnalyzerDiagram_Props {
  t: i18next.TFunction;
  diagramData: any;
  wealthData: any;
  pensionPrivateData: any;
  openNeedEditor: () => void;
  openWealthEditor: () => void;
  openPensionPrivateEditor: () => void;
}

const AnalyzerDiagram : React.FC<AnalyzerDiagram_Props> = ({
    t,
    diagramData,
    wealthData,
    pensionPrivateData,
    openNeedEditor,
    openWealthEditor,
    openPensionPrivateEditor
}) => {
    const ref = useRef<any>();

    /* Currently not used
    const [diagramHeight, setDiagramHeight] = useState(500);

    const startDiagramTutorial = () => {};

    useLayoutEffect(()=>{
        const w = ref.current.getBoundingClientRect().width || 1000;
        setDiagramHeight( w * 1/2 );
    })*/

    return(
        <>
        <DiagramBlock ref={ref}>
            { diagramData ? (
            <DiagramHolder>
            <KDiagram 
                disableZoom={true}
                data={diagramData} 
            />
            </DiagramHolder>
            ) : '' }
            <Row style={{justifyContent:'space-between'}}>
               {/* <PrimaryButton onClick={ startDiagramTutorial } >{ t(`diagramTutorial`) }</PrimaryButton> */}
                <PrimaryButton onClick={ openNeedEditor } outlined>{ t(`editNeeds`) }</PrimaryButton>
                { wealthData.hasWealthPerson || wealthData.hasWealthCon ? (
                    <PrimaryButton onClick={ openWealthEditor } outlined>{ t(`editWealth`) }</PrimaryButton> 
                    ) : '' }
                { pensionPrivateData && pensionPrivateData.length ? (
                    <PrimaryButton onClick={ openPensionPrivateEditor } outlined>{ t(`editPensionPrivate`) }</PrimaryButton> 
                ) : '' }
            </Row>
        </DiagramBlock> 
        </>
    );
};


export default AnalyzerDiagram;
