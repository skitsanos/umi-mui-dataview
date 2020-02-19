import {
    IconButton,
    Tooltip
} from '@material-ui/core';
import React, {useState} from 'react';

export const ViewMode = {
    CARDS: 'cards',
    LIST: 'list'
};

const DataViewModeSelector = props =>
{
    const {
        style,
        className,
        defaultMode,
        modeChanged,
        tooltipViewAsCard = 'View as cards',
        tooltipViewAsTable = 'View as table'} = props;

    const [viewMode, setViewMode] = useState(defaultMode);

    return <>
        <Tooltip title={tooltipViewAsTable}>
            <IconButton disableRipple style={style} className={viewMode === 'list'
                ? `ViewModeSelector-selected ${className}`
                : className}
                        onClick={() =>
                        {
                            setViewMode(ViewMode.LIST);

                            if (Object.prototype.hasOwnProperty.call(props, 'modeChanged'))
                            {
                                modeChanged(ViewMode.LIST);
                            }
                        }}
                        aria-label={tooltipViewAsTable}>
                <i className="fas fa-th-list"/>
            </IconButton>
        </Tooltip>

        <Tooltip title={tooltipViewAsCard}>
            <IconButton disableRipple style={style} className={viewMode === ViewMode.CARDS
                ? `ViewModeSelector-selected ${className}`
                : className}
                        onClick={() =>
                        {
                            setViewMode(ViewMode.CARDS);

                            if (Object.prototype.hasOwnProperty.call(props, 'modeChanged'))
                            {
                                modeChanged(ViewMode.CARDS);
                            }
                        }}
                        aria-label={tooltipViewAsCard}>
                <i className="far fa-window-maximize"/>
            </IconButton>
        </Tooltip>
    </>;
};

DataViewModeSelector.defaultProps = {
    className: 'ViewModeSelector',
    defaultMode: ViewMode.LIST
};


export default DataViewModeSelector;