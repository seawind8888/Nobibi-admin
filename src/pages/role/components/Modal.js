import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader, Select } from 'antd'
import { Trans, withI18n } from '@lingui/react'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}
@withI18n()
@Form.create()
class RoleModal extends PureComponent {
  handleOk = () => {
    const { item = {}, onOk, form } = this.props
    const { validateFields, getFieldsValue } = form
    

    validateFields(errors => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
        // key: item.key,
      }
      onOk(data)
    })
  }

  render() {
    const { item = {}, onOk, form, i18n, menuList, ...modalProps } = this.props
    const { getFieldDecorator } = form

    return (
      <Modal {...modalProps} onOk={this.handleOk}>
        <Form layout="horizontal">
        <FormItem label={i18n.t`RoleName`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('roleName', {
              initialValue: item.roleName,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label={i18n.t`RolePermission`} hasFeedback {...formItemLayout}>
          {getFieldDecorator('permission', {
              initialValue: item.permission?item.permission:[],
              rules: [
                {
                  required: true,
                },
              ],
            })(
            <Select
              mode="multiple"
              placeholder="Please select"
              style={{ width: '100%' }}
            >
              {
                menuList.map((e, i) => (
                 <Option key={i}>{e}</Option>
                ))
              }
            </Select>
            )}
          </FormItem>         
        </Form>
      </Modal>
    )
  }
}

RoleModal.propTypes = {
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default RoleModal
