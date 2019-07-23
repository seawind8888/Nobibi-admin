import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Avatar } from 'antd'
import { DropOption } from 'components'
import { Trans, withI18n } from '@lingui/react'
import styles from './List.less'

const { confirm } = Modal

@withI18n()
class List extends PureComponent {
  handleMenuClick = (record, e) => {
    const { onDeleteItem, onEditItem, i18n } = this.props

    if (e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
      confirm({
        title: i18n.t`Are you sure delete this record?`,
        onOk() {
          onDeleteItem({
            _id: record._id,
            controlCode: window.localStorage.getItem('controlCode'),
          })
        },
      })
    }
  }
  initAvatar = row => {
    if (!row.avatar) {
      return <Avatar icon="user" />
    } else {
      if (row.avatar.length > 7) {
        return <Avatar icon="user" />
      } else {
        return (
          <Avatar
            style={{
              backgroundColor: row.avatar,
              verticalAlign: 'middle',
              textTransform: 'capitalize',
            }}
          >
            {row.userName.slice(0, 1)}
          </Avatar>
        )
      }
    }
  }

  render() {
    const { onDeleteItem, onEditItem, i18n, ...tableProps } = this.props

    const columns = [
      {
        title: <Trans>Avatar</Trans>,
        dataIndex: 'avatar',
        key: 'avatar',
        render: (text, record) => <span>{this.initAvatar(record)}</span>,
      },
      {
        title: <Trans>Name</Trans>,
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: <Trans>Email</Trans>,
        dataIndex: 'email',
      },
      {
        title: <Trans>CreateTime</Trans>,
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: <Trans>Status</Trans>,
        dataIndex: 'status',
        key: 'status',
        render: text => <span>{text === 'ENABLE' ? '开启' : '关闭'}</span>,
      },
      {
        title: <Trans>Roles</Trans>,
        dataIndex: 'refUserRoleCode',
        key: 'refUserRoleCode',
        render: text => <span>{text}</span>,
      },
      {
        title: <Trans>Operation</Trans>,
        key: 'operation',
        render: (text, record) => {
          return (
            <DropOption
              onMenuClick={e => this.handleMenuClick(record, e)}
              menuOptions={[
                { key: '1', name: i18n.t`Update` },
                { key: '2', name: i18n.t`Delete` },
              ]}
            />
          )
        },
      },
    ]

    return (
      <Table
        {...tableProps}
        pagination={{
          ...tableProps.pagination,
          showTotal: total => i18n.t`Total ${total} Items`,
        }}
        style={{ width: '100%' }}
        className={styles.table}
        bordered
        scroll={{ x: true }}
        columns={columns}
        simple
        rowKey={record => record._id}
      />
    )
  }
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  location: PropTypes.object,
}

export default List
