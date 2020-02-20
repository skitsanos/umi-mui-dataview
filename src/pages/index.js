import DataView from '@/components/DataView';
import {ViewMode} from '@/components/DataView/DataViewModeSelector';
import {SortMode} from '@/components/DataView/SortIndicator';
import Button from '@material-ui/core/Button';

import Chance from 'chance';
import React, {useState} from 'react';

const rnd = new Chance();

const cols = [
    {
        title: 'id',
        dataIndex: 'id',
        search: true,
        export: true,
        sort: ({field, order}, [prev, next]) =>
        {
            if (order === SortMode.ASC)
            {
                return prev[field].localeCompare(next[field]);
            }

            if (order === SortMode.DESC)
            {
                return next[field].localeCompare(prev[field]);
            }
        }
    },

    {
        title: 'Username',
        sort: true,
        search: true,
        export: true,
        render: ({row}) => row.login?.username
    },

    {
        title: 'Birthday',
        dataIndex: 'birthday',
        sort: true
    },

    {
        title: 'City',
        dataIndex: 'location',
        render: ({value}) => value.city
    },

    {
        title: 'Actions',
        sort: true,
        render: ({row, refresh}) =>
        {
            return <Button onClick={refresh}>refresh</Button>;
        }
    }
];

const colsUrl = [
    {
        title: 'Email',
        dataIndex: 'email',
        sort: true,
        export: true
    },

    {
        title: 'Registered',
        render: ({row}) => row.registered.date
    },

    {
        title: 'Name',
        dataIndex: 'name',
        export: true,
        render: ({value}) => <>{value.first} {value.last}</>
    },

    {
        title: 'Gender',
        dataIndex: 'gender'
    },

    {
        title: 'Age',
        dataIndex: 'dob',
        export: true,
        exportKey: 'Age',
        exportAs: (value) => value.age,
        render: ({value}) => value.age
    }
];

const data = Array(17).fill(0).map(() => ({
    id: rnd.cf(),
    username: rnd.email(),
    birthday: rnd.birthday({string: true}),
    image: 'https://picsum.photos/200/150?rnd' + Math.random()
}));

export default function ()
{
    const [view, setView] = useState('url');

    return (
        <div>
            <div className={'header'}> Data source:
                <Button onClick={() => setView('array')}><i className={'fas fa-database mr'}/>Array</Button>
                <Button onClick={() => setView('url')}><i className={'fas fa-cloud-download-alt mr'}/>URL</Button>
            </div>

            {view === 'array' &&
            <DataView viewAs={ViewMode.TABLE}
                      columns={cols}
                      dataSource={data}
                      hover={true}
                      onRowClick={console.log}
                      filter={({close, applyFilter}) => <div style={{padding: '2rem'}}>
                          filter goes here
                          <Button onClick={() =>
                          {
                              applyFilter({
                                  id: data[0].id,
                                  zip: '3404'
                              });
                              close();
                          }}>Apply Filter</Button>
                          <Button onClick={() =>
                          {
                              applyFilter(null);
                              close();
                          }}>Reset</Button>
                          <Button onClick={close}>Close</Button>
                      </div>}
                      card={item => <div style={{
                          width: '200px',
                          height: '200px'
                      }}>
                          <div style={{padding: '0.3rem'}}>{item.username}</div>
                          <div>
                              <img onClick={() => console.log(item)} src={item.image} alt={item.username}/>
                          </div>

                          <div>{item.birthday}</div>
                      </div>}/>
            }

            {view === 'url' &&
            <DataView viewAs={ViewMode.TABLE}
                      size={'medium'}

                      columns={colsUrl}

                      dataSource={params =>
                      {
                          console.log(params);

                          const {current, pageSize, sort, filters} = params;
                          const sorting = sort !== null ? `&sortBy=${sort.field}&sortOrder=${sort.order}` : '';

                          return fetch(`https://randomuser.me/api?seed=dataview&results=10&page=${current}&size=${pageSize}${sorting}`)
                              .then(res => res.json()
                                  .then(r => ({
                                      data: r.results,
                                      total: 55
                                  })));
                      }}

                      hover={true}

                      actions={[
                          (p)=><div key={'test'} onClick={()=>{
                              console.log(p)
                          }}>zzz</div>,
                          <div key={'test1'}>aaa</div>
                      ]}

                      onRowClick={console.log}

                      filter={({close, applyFilter}) => <div style={{padding: '2rem'}}>
                          <Button onClick={() =>
                          {
                              applyFilter({gender: 'female'});
                          }}>Only Females</Button>
                          <Button onClick={close}>Close</Button>
                      </div>}

                      printTemplate={({data:d}) => <div>
                          {d?.data && d?.data.map((el, el_key) => <div key={el_key}>
                              <div style={{marginBottom: '1ch'}}>
                                  {el.login.username}
                              </div>
                          </div>)}
                      </div>}

                      listItem={item => <div>{item.login.username}</div>}

                      card={item => <div style={{
                          width: '200px',
                          height: '200px'
                      }}>
                          <div style={{
                              display: 'flex',
                              alignItems: 'center'
                          }}>
                              <img onClick={() => console.log(item)}
                                   src={item.picture.thumbnail}
                                   alt={item.login.username}
                                   style={{borderRadius: '50%'}}/>
                              <div style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  padding: '0.3rem'
                              }}>
                                  <div>{item.name.first} {item.name.last}</div>
                                  <div style={{
                                      fontSize: '85%',
                                      color: 'gray'
                                  }}>@{item.login.username}</div>
                              </div>
                          </div>

                          <div>{item.birthday}</div>
                      </div>}/>
            }
        </div>
    );
}
