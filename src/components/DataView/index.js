/**
 * DataView
 *
 * While Table view displays information in a way that’s easy to scan, so that users can look for patterns and insights.
 * Cards view adds more visualization to data available for rendering.
 *
 * @version 1.0.0
 * @author Skitsanos
 */
import DataViewModeSelector, {ViewMode} from './DataViewModeSelector';
import SortIndicator, {SortMode} from './SortIndicator';
import {
    IconButton,
    Popover,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Tooltip
} from '@material-ui/core';
import {useRequest} from '@umijs/hooks';
import React, {useState} from 'react';

const DataView = props =>
{
    const {
        viewAs = ViewMode.LIST,
        columns = [],
        dataSource,
        filter: Filter = null,
        card: Card = null,
        size = 'small',
        hover = false,
        onRowClick,
        actions = []
    } = props;

    const [mode, setMode] = useState(viewAs);
    const [query, setQuery] = useState('');
    const [filters, setFilters] = useState(null);
    const [sort, setSort] = useState(null);

    //filters
    const [anchorEl, setAnchorEl] = useState(null);

    const refTable = React.createRef();

    const {data: ds, loading, pagination, refresh} = useRequest(!Array.isArray(dataSource)
        ? (params) => dataSource({
            ...params,
            query: query,
            filters: filters,
            sort: sort
        })
        : ({current, pageSize}) =>
        {
            //if data source is array
            if (Array.isArray(dataSource))
            {
                //walk through columns that have search enabled
                const searchableData = query.length > 0 ? dataSource.filter(el =>
                {
                    const cond = Object.keys(el).map(k => columns.findIndex(col => (col.dataIndex === k && col.search)));
                    const searchableIndexes = cond.filter(ndx => ndx > -1);

                    return searchableIndexes.filter(ndx => el[columns[ndx].dataIndex].includes(query.trim())).length > 0;
                }) : dataSource;

                //apply filters if any
                const filteredData = filters !== null ? searchableData.filter(row =>
                {
                    const conditionMet = Object.keys(filters).filter(key => row[key] === filters[key]);
                    return conditionMet.length === Object.keys(filters).length;
                }) : searchableData;

                //check if we have sorting requested and if there is a sorting function available
                const sortableColumn = sort !== null ? columns.find(el => (typeof el.sort === 'function') && (el.dataIndex === sort?.field)) : null;

                const startFrom = current === 1 ? 0 : (current - 1) * pageSize;
                const dataPage = Boolean(sortableColumn)
                    ? [...filteredData].sort((...params) => sortableColumn.sort(sort, params)).slice(startFrom, startFrom + pageSize)
                    : filteredData.slice(startFrom, startFrom + pageSize);

                return new Promise(resolve => resolve({
                    data: dataPage,
                    total: filteredData.length
                }));
            }
        }, {
        paginated: true,
        refreshDeps: [sort, filters]
    });

    const resetSelectMarkers = (tbody) =>
    {
        for (const tr of tbody.children)
        {
            tr.classList.remove('DataView-Row-Selected');
        }
    };

    const doRefresh = () =>
    {
        const elTable = refTable.current;
        const tbody = elTable.getElementsByTagName('tbody')[0];

        resetSelectMarkers(tbody);

        //reset Sorting
        setSort(null);

        refresh();
    };

    const doSort = (field, order) =>
    {
        if (order === SortMode.NONE)
        {
            setSort(null);
            return;
        }

        setSort({
            field: field,
            order: order
        });
    };

    const applyFilter = (f) =>
    {
        setFilters(f);
    };

    const closeFilters = () =>
    {
        setAnchorEl(null);
    };

    const renderCell = (cell_key, content) => <TableCell key={`cell-${cell_key}`}>{content}</TableCell>;

    return <div className={'DataView'}>
        <div className={'Toolbar'}>
            <div style={{flex: 1}}>
                <TextField defaultValue={query}
                           placeholder={'Type and press Enter to search'}
                           fullWidth={true}
                           onKeyUp={(e) =>
                           {
                               if (e.keyCode === 13)
                               {
                                   doRefresh();
                               }
                           }}
                           onChange={(e) =>
                           {
                               setQuery(e.target.value);
                           }}/>
            </div>

            <DataViewModeSelector viewAsCards={setMode} viewAsList={setMode}/>
        </div>

        <div className={'ActionsBar'}>
            <Tooltip title={'Refresh'}>
                <IconButton onClick={doRefresh}>
                    <i className={'fas fa-sync'}/>
                </IconButton>
            </Tooltip>

            <Tooltip title={'Print'}>
                <IconButton>
                    <i className={'fas fa-print'}/>
                </IconButton>
            </Tooltip>

            <Tooltip title={'Export to CSV'}>
                <IconButton>
                    <i className={'fas fa-file-csv'}/>
                </IconButton>
            </Tooltip>

            {Filter && <React.Fragment>
                <Tooltip title="Filter">
                    <IconButton onClick={(e) => setAnchorEl(e.target)}>
                        <i className="fas fa-filter HeaderIcon"/>
                    </IconButton>
                </Tooltip>

                <Popover anchorEl={anchorEl}
                         open={Boolean(anchorEl)}
                         onClose={closeFilters}>
                    <Filter close={closeFilters} refresh={refresh} applyFilter={applyFilter}/>
                </Popover>
            </React.Fragment>}

            {actions.length > 0 && <>
                <div className={'Divider'}/>
            </>}
        </div>

        {mode === ViewMode.LIST && <TableContainer>
            <Table size={size} ref={refTable}>
                <TableHead>
                    <TableRow>
                        {columns?.map((el, el_key) => <TableCell key={`column-${el.dataIndex || el_key}`}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center'
                            }}>{el?.title}{Boolean(el.sort) && el.dataIndex &&
                            <>
                                {(!Boolean(sort) || el.dataIndex !== sort?.field) &&
                                <SortIndicator sort={SortMode.NONE}
                                               onChange={(order) => doSort(el.dataIndex, order)}/>}

                                {Boolean(sort) && el.dataIndex === sort?.field && <SortIndicator order={sort.order}
                                                                                        onChange={(order) => doSort(el.dataIndex, order)}/>}

                            </>
                            }</div>
                        </TableCell>)}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {ds?.data.map((row, row_key) => <TableRow key={`row-${row_key}`}
                                                              onClick={(e) =>
                                                              {
                                                                  const el = e.target.parentNode;
                                                                  const tbody = el.parentNode;

                                                                  if (el.tagName.toLowerCase() === 'button')
                                                                  {
                                                                      return;
                                                                  }

                                                                  resetSelectMarkers(tbody);

                                                                  el.classList.add('DataView-Row-Selected');

                                                                  onRowClick({
                                                                      event: e,
                                                                      row: row,
                                                                      key: row_key,
                                                                      htmlNode: el
                                                                  });
                                                              }}
                                                              hover={hover}>
                        {columns.map((column, cell_key) =>
                        {
                            if (!column.dataIndex)
                            {
                                /**
                                 * If there is no column dataIndex/key specified, assume that there is rendering required
                                 * and try to render cell via render method specified. Otherwise, return null to render empty cell.
                                 */
                                return renderCell(cell_key, Object.prototype.hasOwnProperty.call(column, 'render')
                                    ? column.render({
                                        column: column,
                                        row: row,
                                        value: row[column.dataIndex],
                                        refresh: doRefresh
                                    }) : null);
                            }
                            else
                            {
                                /**
                                 * If there is no data for given column, we just render blank
                                 */
                                if (!row[column.dataIndex])
                                {
                                    return renderCell(cell_key, null);
                                }

                                /**
                                 * If there is data available and rendering method exists, we render it,
                                 * otherwise check if data item is an object to give back an empty cell if it is,
                                 * or, return data item as is.
                                 */
                                return renderCell(cell_key, Object.prototype.hasOwnProperty.call(column, 'render')
                                    ? column.render({
                                        column: column,
                                        row: row,
                                        value: row[column.dataIndex],
                                        refresh: doRefresh
                                    }) : typeof row[column.dataIndex] === 'object' ? null : row[column.dataIndex]);
                            }
                        })}
                    </TableRow>)}
                </TableBody>
            </Table>
        </TableContainer>}

        {mode === ViewMode.CARDS && <div className={'DataView-Cards'}>
            {ds?.data.map((row, row_key) => <div key={`card-${row_key}`} className={'DataView-Card'}><Card {...row}/>
            </div>)}
        </div>}

        <TablePagination component={'div'}
                         count={pagination.total}
                         page={pagination.current - 1}
                         rowsPerPage={pagination.pageSize}
                         onChangeRowsPerPage={({target}) =>
                         {
                             pagination.changePageSize(target.value);
                         }}
                         onChangePage={(e, p) =>
                         {
                             pagination.changeCurrent(p + 1);
                         }}/>
    </div>;
};

export default DataView;