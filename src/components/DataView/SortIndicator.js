import {
    IconButton,
    Tooltip
} from '@material-ui/core';
import React, {useState} from 'react';

export const SortMode = {
    NONE: 'none',
    ASC: 'asc',
    DESC: 'desc'
};

const SortIndicator = props =>
{
    const {
        style,
        className,
        defaultMode = SortMode.NONE
    } = props;

    const [viewMode, setViewMode] = useState(defaultMode);

    return <>
        <Tooltip title={'Sorting'}>
            <IconButton className={`SortIndicator ${className}`}
                        onClick={() =>
                        {
                            switch (viewMode)
                            {
                                case SortMode.NONE:
                                    setViewMode(SortMode.ASC);
                                    break;

                                case SortMode.ASC:
                                    setViewMode(SortMode.DESC);
                                    break;

                                case SortMode.DESC:
                                    setViewMode(SortMode.NONE);
                                    break;

                                default:
                                    break;
                            }
                        }}
                        style={{
                            ...style,
                            height: '32px'
                        }}>
                {viewMode === SortMode.NONE && <i className={'fas fa-sort'}/>}
                {viewMode === SortMode.ASC && <i className={'fas fa-sort-up'}/>}
                {viewMode === SortMode.DESC && <i className={'fas fa-sort-down'}/>}
            </IconButton>
        </Tooltip>
    </>;
};

export default SortIndicator;