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

* Array
* URL

