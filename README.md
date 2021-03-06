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

  

---



### Properties

Below is the list of properties and configuration options 

| Property      | Default        | Description                                                 |
| ------------- | -------------- | ----------------------------------------------------------- |
| viewAs        | ViewMode.TABLE | Sets view mode (list, table or cards)                       |
| size          | small          | Sets row spacing for `TABLE` view mode                      |
| columns       | []             | Data columns definition                                     |
| dataSource    | null           | Data source for the component                               |
| options       |                | Set of options that control action bar and actions          |
| actions       | []             | User defined actions, - array of components.                |
| hover         | false          | If `true`, the table row will shade on hover                |
| onRowClick    |                | Handler for row `click` event. `TABLE` view mode only.      |
| filter        | null           | Data filter component                                       |
| printTemplate | null           | Printing template                                           |
| listItem      | null           | Component template to render data when in `LIST` view mode. |
| card          | null           | Component template to render data when in `CARD` view mode. |



---



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



---



#### Size

For `TABLE` view mode only. Allows table cells to inherit size of the Table, same way as defined in MUI [Table](https://material-ui.com/api/table/)

| Value  | Description                                      |
| ------ | ------------------------------------------------ |
| small  | Compact view. Rows rendered with minimal spacing |
| medium | Regular view. Rows rendered with wide spacing    |

```jsx
<DataView size={'small'}/>
```



---



#### Data source

There are two kinds of data sources supported by default

* Array - JavaScript array of items
* URL - JSON data fed from URL

##### Example on setting `dataSource` with array of random data generated via [ChanceJs](https://chancejs.com/)

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

##### Example on setting `dataSource` with JSON URL

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



---



#### Columns

`TABLE` view mode requires you to have columns defined in order to display your data. Column definition has the following properties:

| Property  | Type     | Description                                                  |
| --------- | -------- | ------------------------------------------------------------ |
| dataIndex | String   | column data index                                            |
| title     | String   | Column title                                                 |
| render    | Function | Table cell rendering handler                                 |
| sort      | Boolean  | Column sorting handler                                       |
| export    | Boolean  | Signals that this column is to export                        |
| exportKey | string   | CSV column/header name. If not defined `dataIndex` will be used |
| exportAs  | Function | Cell rendering handler that used during the export           |

##### Few notes on how data is rendered

Imagine you have a data set with rows like this: 

```json
{
  "gender": "male",
  "name": {
    "title": "Mr",
    "first": "Emrullah",
    "last": "Euverman"
  },
  "location": {
    "street": {
      "number": 1645,
      "name": "Kasteel Malborghstraat"
    },
    "city": "Kadoelen",
    "state": "Noord-Brabant",
    "country": "Netherlands",
    "postcode": 88327,
    "coordinates": {
      "latitude": "42.6605",
      "longitude": "-84.4122"
    }
  },
  "email": "emrullah.euverman@example.com",
  "login": {
    "uuid": "4342e68d-ca61-4861-ab58-a9e2c255595d",
    "username": "goldenlion689",
    "password": "pingpong",
    "salt": "XMAeGzfO",
    "md5": "3b256c0b8097fb1135d6a4ce71f911a8",
    "sha1": "9206782dda45b932cb6623d4b41bb4d38a482bef",
    "sha256": "8624c34bd71606860993364bb12f45b00bab49ce4ce01247c4ccd7fe5faec530"
  },
  "dob": {
    "date": "1977-02-24T13:39:09.862Z",
    "age": 43
  },
  "nat": "NL"
}
```

in order to represent this data in a flat view, you would need a data source with simple `key`/`value` pairs where `value` would be of some simple type like `Boolean`, `Number` or `String`, but in our particular case, some of the values are actually objects.

So while for `gender` and `email` fields we could use simple column definition like:

```js
const cols = [
    {
        dataIndex: 'gender',
        title: 'Gender'
    },
    {
        dataIndex: 'email',
        title: 'Email'
    }
]
```

For the fields like `login` or `dob` we have to have render function handler which passes us an object with the following properties:

| Property | Description                                           |
| -------- | ----------------------------------------------------- |
| column   | Column definition                                     |
| row      | Entire data row                                       |
| value    | Value taken from field defined in column `dataIndex.` |

Now, in order to display data from `dob` field of our data row, we can define column in the following way:

```js
const cols = [
    {
        dataIndex: 'gender',
        title: 'Gender'
    },
    {
        dataIndex: 'email',
        title: 'Email'
    },
    
    {
        dataIndex: 'dob',
        title: 'Birthday',
        render: ({value})=>value.age
    }
]
```

##### Exporting data

DataView component allows data snapshot exporting into CSV file. When _Export to CSV_ action clicked, DataView component will look into all columns that have `export` field on it. 

The same as with `render` column property described earlier, for complex fields like arrays and objects, we have rendering handler `exportAs` that passes you sole argument.

```js
const cols = [
     {
        title: 'Age',
        dataIndex: 'dob',
        export: true,
        exportKey: 'Age',
        exportAs: (value) => value.age,
        render: ({value}) => value.age
    }
]
```

Example above allows rendering of `age` data from the `dob` field in table view and in CSV both.

Why not to have one render method for all?

It would work pretty fine with one method in situations when you render your cells as simple textual content, but once you start putting there React components, - for the app it works just fine, but in CSV it all goes nuclear and instead having your data you will have `[object] ` rendered into your cells. Especially when you have cells rendered via `<Trans/>` components from [react-i18next](https://react.i18next.com/).

So to save the situation, you can use `render` to render your cell data on screen and `exportAs` to render data in CSV.

##### Sorting

When it comes to sorting, it depends on what is your data source, if it is an `Array`, column sorting will be applied directly to your data source, while on `URL` data sorting criteria will passed to you to handle on server.

Making column sortable

```jsx
const cols = [
     {
        title: 'Email',
        dataIndex: 'email',
        sort: true,
        export: true
    },
]
```



---



#### Rows hover and click feedback

> DataView component allows to have visual feedback on `mouse over` and `mouse click` events.

##### Hover Event

Hover is used to select elements when you *mouse over* them. Most sites make their links a different color from their text. But that’s not enough contrast for colorblind users. The difference in color is hard for them to see. Colorblind users have to rely on their cursor change (arrow to hand), or row color inversion like in our case, as a feedback. A hover effect can give them a clear signal to see what’s clickable. When users move their cursor over a link, they’ll notice a change in color or shape that tells them to click. 

| Value | Description                                  |
| ----- | -------------------------------------------- |
| true  | If `true`, the table row will shade on hover |
| false | Disabling row hover effect                   |

```jsx
<DataView hover={true}/>
```

##### onRowClick event

Occurs in `TABLE` view mode only. If handler enabled it will receive an object with the following:

| Property | Description                                    |
| -------- | ---------------------------------------------- |
| event    | `MouseEvent` object                            |
| row      | Current row                                    |
| key      | Current data page row index                    |
| htmlNode | HTML element that represents table row pressed |

The following example will print `onRowClick` arguments into console:

```jsx
<DataView onRowClick={console.log}/>
```



---



#### Data filtering

In order to implement data filtering you need to provide a component that implements your filter UI into `filter` property. 

```jsx
<DataView filter={({close, applyFilter}) => <div style={{padding: '2rem'}}>
                          filter goes here
                          <Button onClick={() =>
                          {
                              applyFilter({
                                  id: 'x2342302-aff',
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
                      </div>}/>
```

Handler is the function and it passes two arguments `close` and `applyFilter`:

| Argument    | Description                                                  |
| ----------- | ------------------------------------------------------------ |
| close       | Allows to close filter pop-up component.                     |
| applyFilter | Applies filter by passing an object with key/value pars as filtering criteria |

Now, depends on your data source type (`Array` or `URL`) it will handle filtering differently. While on `Array` kind of data source it filters data by applying filter directly to entire data set, on `URL` kind of data set, DataView will pass filters to you so you can handle it on server side.



---



#### Printing

Printing support implemented via [PrintJs](https://printjs.crabbly.com/) library. Once print button clicked in action bar, data page will be passed to PrintJs and your operating system's print dialog will appear.

##### Example below defines template to be used for printing

```jsx
<DataView printTemplate={({data:d}) => <div>
                          {d?.data && d?.data.map((el, el_key) => <div key={el_key}>
                              <div style={{marginBottom: '1ch'}}>
                                  {el.login.username}
                              </div>
                          </div>)}
                      </div>}
```

_printTemplate_ passes a data property to a component you provide, this data represents current page data snapshot.

