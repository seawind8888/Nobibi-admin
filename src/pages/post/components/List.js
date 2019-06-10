import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Tag } from 'antd'
import { DropOption } from 'components'
import { Trans, withI18n } from '@lingui/react'
import Link from 'umi/link'
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
          onDeleteItem(record._id)
        },
      })
    }
  }

  topicStatus = (str = "") => {
      switch (str) {
          case "PUBLISH":
              return '已发布'
          case "DRAFT":
              return '草稿'
          default:
              return ' '
      }
  }


  render() {
    const { onDeleteItem, onEditItem, i18n, ...tableProps } = this.props

    const columns = [
      {
        title: <Trans>ID</Trans>,
        render: (text, record, index) => <span>{index+1}</span>
      },
      {
        title: <Trans>PostTitle</Trans>,
        dataIndex: 'topicTitle',
        key: 'topicTitle'
      },
      {
        title: <Trans>PostAuther</Trans>,
        dataIndex: 'userCode',
        key: 'userCode'
      },
      {
        title: <Trans>PostStatus</Trans>,
        dataIndex: 'status',
        key: 'status',
        render: text => 
          <span>
            <Tag color={text === 'PUBLISH'?'green':'red'}>
              {this.topicStatus(text)}
            </Tag>
          </span>
      },
      {
        title: <Trans>PostCategory</Trans>,
        dataIndex: 'category',
        key: 'category',
        render: category => 
          <span>
            {category.map(tag => {
              let color = tag.length > 5 ? 'geekblue' : 'green';
              if (tag === 'loser') {
                color = 'volcano';
              }
              return (
                <Tag color={color} key={tag}>
                  {tag}
                </Tag>
              );
            })}
          </span>
        
      },
      {
        title: <Trans>CreateTime</Trans>,
        dataIndex: 'createTime',
        key: 'createTime',
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
        style={{width:'100%'}}
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
