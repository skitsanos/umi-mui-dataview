import DataView from '@/components/DataView';
import {ViewMode} from '@/components/DataView/DataViewModeSelector';
import Button from '@material-ui/core/Button';

import Chance from 'chance';
import React, {useState} from 'react';

const rnd = new Chance();

const cols = [
    {
        title: 'id',
        dataIndex: 'id',
        search: true,
        sort: true
    },

    {
        title: 'Username',
        search: true,
        render: ({row}) => row.login?.username
    },

    {
        title: 'Birthday',
        dataIndex: 'birthday'
    },

    {
        title: 'City',
        dataIndex: 'location',
        render: ({value}) => value.city
    },

    {
        title: 'Actions',
        render: ({row, refresh}) =>
        {
            return <Button onClick={refresh}>refresh</Button>;
        }
    }
];

const data = Array(17).fill({}).map(() => ({
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
            <DataView viewAs={ViewMode.LIST}
                      columns={cols}
                      dataSource={data}
                      hover={true}
                      onRowClick={console.log}
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
            <DataView viewAs={ViewMode.LIST}
                      columns={cols}
                      dataSource={params =>
                      {
                          console.log(params);

                          const {current, pageSize} = params;
                          return fetch(`https://randomuser.me/api?seed=dataview&results=10&page=${current}&size=${pageSize}`)
                              .then(res => res.json()
                                  .then(r => ({
                                      data: r.results,
                                      total: 55
                                  })));
                      }}
                      hover={true}
                      onRowClick={console.log}
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
        </div>
    );
}
