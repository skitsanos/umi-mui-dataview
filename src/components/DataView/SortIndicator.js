import {Tooltip} from '@material-ui/core';
import React, {useState} from 'react';

export const SortMode = {
    NONE: 'none',
    ASC: 'asc',
    DESC: 'desc'
};

const SortIndicator = props =>
{
    const {
        order = SortMode.NONE,
        style,
        className,
        onChange
    } = props;

    const [viewMode, setViewMode] = useState(order);

    return <>
        <Tooltip title={'Sorting'}>
            <div className={`SortIndicator MuiButtonBase-root ${className || ''}`}
                 onClick={() =>
                 {
                     setViewMode(prev =>
                     {
                         switch (prev)
                         {
                             case SortMode.NONE:
                                 onChange(SortMode.ASC);
                                 return SortMode.ASC;

                             case SortMode.ASC:
                                 onChange(SortMode.DESC);
                                 return SortMode.DESC;

                             case SortMode.DESC:
                                 onChange(SortMode.NONE);
                                 return SortMode.NONE;

                             default:
                                 return SortMode.NONE;
                         }
                     });
                 }}
                 style={{
                     ...style
                 }}>
                {viewMode === SortMode.NONE && <i className={'fas fa-sort'}/>}
                {viewMode === SortMode.ASC && <i className={'fas fa-sort-up SortIndicator-selected'}/>}
                {viewMode === SortMode.DESC && <i className={'fas fa-sort-down SortIndicator-selected'}/>}
            </div>
        </Tooltip>
    </>;
};

export default SortIndicator;