# MongoDB

### Contents
- [Overview](#overview) 
  - [Database](#database)
  - [Collection](#collection)
- [Advantages of Mongodb](#advantages) 
- [Environment](#Environment) 
- [Data Modeling](#DataModeling) 
- [Create Database](#CreateDataBase) 
- [Drop Database](#DropDatabase) 
- [Create Collection](#CreateCollection) 
- [Drop Collection](#DropCollection) 

<a name="Overview"></a>
## Overview 
MongoDb is a cross-platform, document oriented database that provides high performance, high availability, and easy scalability. MongoDB works on concept of collection and document.

<a name="database"></a>
### Database 
- Database is a physical container for collections. 
- Each database gets its own set of files on file system.
- A single MongoDB server can have multiple databases.

<a name="collection"></a>
### Collection
- A collection is group of MongoDB Documents. It is similar to a table in RDBMS.
- Each collection may not have same set of fields or structure.

The following table shows the similar terminologies of RDBMS with MongoDB.
| RDBMS | MongoDB |
|-------|---------|
|Database|Database|
|Table |Collection|
|Tuple/Row/Record|Document|
|coulumn|Field|
|Table Join| Embedded Documents|
|Primary key| Primary Key (Default Key_id Provided by MongoDB itself)|


### Document 
- A document is a set of Key-value pairs.
- Documents have dynamic Schema.
- Dynamic schema means that documents in same collection do neet to have the same set of fields.

### Sample Document

```object
{
  _id:ObjectId(7df78ad8902c)
  title : 'MongoDB Overview',
  description : 'MongoDb is no sql database',
  by : 'sai prakash',
  url: '',
  tags : ['mongodb', 'database', 'NoSQL'],
  likes : 250,
  comments : [
    {
      user : 'user1',
      message : 'My first comment',
      dateCreated: new Date(2011,1,20,2,15),
      like: 0 
    },
    {
      user : 'user2',
      message : 'My Second comments',
      dateCreated: new Date(2011,1,25,7,45),
      like: 5
    }
  ]
}
```

<a name="advantages"></a>
## Advantages


<a name="Environment"></a>
## Environment


<a name="DataModeling"></a>
## Data Modeling

<a name="CreateDataBase"></a>
## Create Database

<a name="DropDatabase"></a>
## Drop Database

<a name="CreateCollection"></a>
## Create Collection

<a name="DropCollection"></a>
## Drop Collection

