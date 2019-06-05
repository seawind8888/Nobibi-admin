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
@connect(({ menu, loading }) => ({ menu, loading }))
class Menu extends PureComponent {
    
    render() {
        const { location, dispatch, menu, loading, i18n } = this.props
        const { query, pathname } = location
        const {
            list,
            pagination,
            currentItem,
            modalVisible,
            modalType,
            selectedRowKeys,
          } = menu

        const listProps = {
            dataSource: list,
            loading: loading.effects['menu/query'],
            pagination,
            onChange(page) {
                handleRefresh({
                    page: page.current,
                    pageSize: page.pageSize,
                })
            },
            onDeleteItem(id) {
                dispatch({
                type: 'menu/delete',
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
                type: 'menu/showModal',
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
                    type: 'menu/updateState',
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
                type: 'user/showModal',
                payload: {
                  modalType: 'create',
                },
              })
            },
          }
        const modalProps = {
            item: modalType === 'create' ? {} : currentItem,
            visible: modalVisible,
            maskClosable: false,
            confirmLoading: loading.effects[`menu/${modalType}`],
            title: `${
              modalType === 'create' ? i18n.t`Create Menu` : i18n.t`Update Menu`
            }`,
            centered: true,
            onOk(data) {
              dispatch({
                type: `menu/${modalType}`,
                payload: data,
              }).then(() => {
                handleRefresh()
              })
            },
            onCancel() {
              dispatch({
                type: 'menu/hideModal',
              })
            },
          }
        const handleDeleteItems = () => {
            dispatch({
                type: 'menu/multiDelete',
                payload: {
                    ids: selectedRowKeys,
                },
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

Menu.propTypes = {
    menu: PropTypes.object,
    location: PropTypes.object,
    dispatch: PropTypes.func,
    loading: PropTypes.object,
}

export default Menu