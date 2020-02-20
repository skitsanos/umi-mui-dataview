# umi-mui-dataview
> This component is based on UmiJs hooks and Material-UI functionality and built on top of [umi-app-template](https://github.com/skitsanos/umi-app-template) 



The idea behind this component is to allow user maximum flexibility in rendering very same data in three different ways: as Table, as List and as Cards with minimal effort.

### Features supported

* Feeding data from array or URL
* Data Pagination
* Data Filtering
* Column sorting
* Column rendering
* CSV file export
* Printing

### Properties

Below is the list of properties and configuration options 

| Property      | Default        | Description                           |
| ------------- | -------------- | ------------------------------------- |
| viewAs        | ViewMode.TABLE | Sets view mode (list, table or cards) |
| size          | small          |                                       |
| columns       | []             | Data columns definition               |
| dataSource    | null           |                                       |
| options       |                |                                       |
| actions       | []             |                                       |
| hover         | false          |                                       |
| onRowClick    |                |                                       |
| filter        | null           |                                       |
| printTemplate | null           |                                       |
| listItem      | null           |                                       |
| card          | null           |                                       |

#### View Mode

Allows to set initial view mode from one of the following

| Value          | Description                                                  |
| -------------- | ------------------------------------------------------------ |
| ViewMode.TABLE | Displays data in table mode                                  |
| ViewMode.LIST  | Displays data in list mode. Requires setting listItem property. |
| ViewMode.CARDS | Displays data in cards mode. Requires setting card property. |

##### Table view example

```jsx
<DataView viewAs={ViewMode.TABLE}/>
```

When working with CARDS and LIST modes and setting templates for rendering data, there will an item argument sent to your component that will contain very same data that data row has in TABLE mode.

##### List view example

```jsx
<DataView viewAs={ViewMode.LIST} listItem={item => <div>{item.login.username}</div>}/>
```

##### Cards view example

```jsx
<DataView viewAs={ViewMode.CARDS} card={item => <div>{item.login.username}</div>}/>
```

#### Size

Allows table cells to inherit size of the Table, same way as defined in MUI [Table](https://material-ui.com/api/table/)

* small
* medium

#### Data source

There are two kinds of data sources supported by default

* Array - JavaScript array of items
* URL - JSON data fed from URL

##### Example on setting dataSource with array of random data generated via [ChanceJs](https://chancejs.com/)

```jsx
import Chance from 'chance';
const rnd = new Chance();

const data = Array(17).fill(0).map(() => ({
    id: rnd.cf(),
    username: rnd.email(),
    birthday: rnd.birthday({string: true}),
    image: 'https://picsum.photos/200/150?rnd' + Math.random()
}));

<DataView dataSource={data}/>
```

##### Example on setting dataSource with JSON URL

```jsx
<DataView dataSource={params =>
                      {
                          const {current, pageSize, sort, filters} = params;
                          const sorting = sort !== null ? `&sortBy=${sort.field}&sortOrder=${sort.order}` : '';

                          return fetch(`https://randomuser.me/api?seed=dataview&results=10&page=${current}&size=${pageSize}${sorting}`)
                              .then(res => res.json()
                                  .then(r => ({
                                      data: r.results,
                                      total: 55
                                  })));
                      }}/>
```



#### Printing

Printing support implemented via [PrintJs](https://printjs.crabbly.com/) library. Once print button clicked in action bar, data page will be passed to PrintJs and your operating system's print dialog will appear.

##### Example below defines print template t 

```jsx
<DataView printTemplate={({d}) => <div>
                          {d?.data && d?.data.map((el, el_key) => <div key={el_key}>
                              <div style={{marginBottom: '1ch'}}>
                                  {el.login.username}
                              </div>
                          </div>)}
                      </div>}
```

