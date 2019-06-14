import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { router } from 'utils'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import { withI18n } from '@lingui/react'
import { Page } from 'components'
import { stringify } from 'qs'
import List from './components/List'
import Filter from './components/Filter'
import Modal from './components/Modal'

@withI18n()
@connect(({ app, post, loading }) => ({ app, post, loading }))
class Post extends PureComponent {
    
    render() {
        const { location, dispatch, post, loading, i18n, app } = this.props
        const { query, pathname } = location
        
        const {
            list,
            pagination,
            currentItem,
            modalVisible,
            modalType,
            selectedRowKeys,
            
          } = post
        const {
          userSelectList,
          categoryList
        } = app

        const listProps = {
            dataSource: list,
            loading: loading.effects['post/query'],
            pagination,
            onChange(page) {
                handleRefresh({
                    page: page.current,
                    pageSize: page.pageSize,
                })
            },
            onDeleteItem(id) {
                dispatch({
                type: 'post/delete',
                payload: id,
                }).then(() => {
                handleRefresh({
                    page:
                    list.length === 1 && pagination.current > 1
                        ? pagination.current - 1
                        : pagination.current,
                })
                })
            },
            onEditItem(item) {
                dispatch({
                type: 'post/showModal',
                payload: {
                    modalType: 'update',
                    currentItem: item,
                },
                })
            },
            rowSelection: {
                selectedRowKeys,
                onChange: keys => {
                dispatch({
                    type: 'post/updateState',
                    payload: {
                    selectedRowKeys: keys,
                    },
                })
                },
            },
        }
        const handleRefresh = newQuery => {
            router.push({
              pathname,
              search: stringify(
                {
                  ...query,
                  ...newQuery,
                },
                { arrayFormat: 'repeat' }
              ),
            })
          }
          const filterProps = {
            userSelectList,
            filter: {
              ...query,
            },
            onFilterChange(value) {
              handleRefresh({
                ...value,
                page: 1,
              })
            },
            onAdd() {
              dispatch({
                type: 'post/showModal',
                payload: {
                  modalType: 'create',
                },
              })
            },
          }
        const modalProps = {
            userSelectList,
            categoryList,
            width: 1000,
            item: modalType === 'create' ? {} : currentItem,
            visible: modalVisible,
            maskClosable: false,
            confirmLoading: loading.effects[`post/${modalType}`],
            title: `${
              modalType === 'create' ? i18n.t`Create Post` : i18n.t`Update Post`
            }`,
            centered: true,
            onOk(data) {
              dispatch({
                type: `post/${modalType}`,
                payload: data,
              }).then(() => {
                handleRefresh()
              })
            },
            onCancel() {
              dispatch({
                type: 'post/hideModal',
              })
            },
            onSelectUser(userCode) {
              dispatch({
                type: 'post/queryCategorySelect',
                payload: {
                  userCode,
                }
              })
            }
          }
        const handleDeleteItems = () => {
            dispatch({
                type: 'post/multiDelete',
                payload: {
                    _id: selectedRowKeys,
                },
            }).then(() => {
              handleRefresh({
                page:
                  list.length === selectedRowKeys.length && pagination.current > 1
                    ? pagination.current - 1
                    : pagination.current,
              })
            })
        }
        return (
            <Page inner>
                <Filter {...filterProps} />
                {selectedRowKeys.length > 0 && (
                    <Row style={{ marginBottom: 24, textAlign: 'right', fontSize: 13 }}>
                        <Col>
                        {`Selected ${selectedRowKeys.length} items `}
                        <Popconfirm
                            title="Are you sure delete these items?"
                            placement="left"
                            onConfirm={handleDeleteItems}
                        >
                            <Button type="primary" style={{ marginLeft: 8 }}>
                            Remove
                            </Button>
                        </Popconfirm>
                        </Col>
                    </Row>
                    )}
                    <List {...listProps} />
                {modalVisible && <Modal {...modalProps} />}
            </Page>
        )
    }
}

Post.propTypes = {
    post: PropTypes.object,
    location: PropTypes.object,
    dispatch: PropTypes.func,
    loading: PropTypes.object,
}

export default Post