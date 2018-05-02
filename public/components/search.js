import React, {
  Component,
} from 'react';
//import { formatDate } from '../../../../../src/services/format';
//import { createDataStore } from '../data_store';
import {
  EuiInMemoryTable,
  EuiLink,
  EuiHealth,
} from '@elastic/eui';

/*
Example user object:

{
  id: '1',
  firstName: 'john',
  lastName: 'doe',
  github: 'johndoe',
  dateOfBirth: Date.now(),
  nationality: 'NL',
  online: true
}

Example country object:

{
  code: 'NL',
  name: 'Netherlands',
  flag: '🇳🇱'
}
*/

let debounceTimeoutId;
let requestTimeoutId;
const users = [{
  id: '1',
  firstName: 'john',
  lastName: 'doe',
  github: 'johndoe',
  //dateOfBirth: Date.now(),
  //nationality: 'NL',
  online: true
},
{
  id: '2',
  firstName: 'john',
  lastName: 'doe',
  github: 'johndoe',
  //dateOfBirth: Date.now(),
  //nationality: 'NL',
  online: true
}];

const country = [{
  code: 'NL',
  name: 'Netherlands'
},
{
  code: 'FR',
  name: 'Netherlands'
}];

export class Table extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      items: users,
      isLoading: false,
    };
  }

  onQueryChange = query => {
    clearTimeout(debounceTimeoutId);
    clearTimeout(requestTimeoutId);

    debounceTimeoutId = setTimeout(() => {
      this.setState({
        isLoading: true,
      });

      requestTimeoutId = setTimeout(() => {
        const items = users.filter(user => {
          const normalizedName = `${user.firstName} ${user.lastName}`.toLowerCase();
          const normalizedQuery = query.text.toLowerCase();
          return normalizedName.indexOf(normalizedQuery) !== -1;
        });

        this.setState({
          isLoading: false,
          items,
        });
      }, 1000);
    }, 300);
  };

  render() {
    const search = {
      onChange: this.onQueryChange,
      box: {
        incremental: true,
      },
    };

    return (
      <EuiInMemoryTable
        items={this.state.items}
        loading={this.state.isLoading}
        columns={[
          {
            field: 'firstName',
            name: 'First Name',
            sortable: true,
            truncateText: true,
          },
          {
            field: 'lastName',
            name: 'Last Name',
            truncateText: true,
          },
          {
            field: 'github',
            name: 'Github',
            
          },
          {
            field: 'online',
            name: 'Online',
            dataType: 'boolean',
            render: (online) => {
              const color = online ? 'success' : 'danger';
              const label = online ? 'Online' : 'Offline';
              return <EuiHealth color={color}>{label}</EuiHealth>;
            },
            sortable: true
          }
        ]}
        search={search}
        pagination={true}
        sorting={true}
      />
    );
  }
}