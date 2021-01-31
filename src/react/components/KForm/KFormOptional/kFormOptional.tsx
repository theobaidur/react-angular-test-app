import React, { useState } from "react";
import { KFormOptionalHeader, KFormOptionalBody } from "./kFormOptional_styles";
import { Collapse } from "@material-ui/core";

interface KFormOptional_Props{
    title:string
}
const KFormOptional: React.FC<KFormOptional_Props> = ({
    title,
    ...props
}) => {
    const [expand,setExpand] = useState(false);
    return(
        <>
        <KFormOptionalHeader
            className={expand ? 'open' : ''}
            onClick={() => {setExpand(!expand)} }
        >
            <span>
            {title}
            </span>
        </KFormOptionalHeader>
        <KFormOptionalBody>
            <Collapse in={expand}>
            {props.children}
            </Collapse>
        </KFormOptionalBody>
        </>
    );
};

export default KFormOptional;