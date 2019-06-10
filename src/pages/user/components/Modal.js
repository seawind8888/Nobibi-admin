import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader, Select } from 'antd'
import { Trans, withI18n } from '@lingui/react'
import city from 'utils/city'
import md5 from 'md5'

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
class UserModal extends PureComponent {
  handleOk = () => {
    const { item = {}, onOk, form } = this.props
    const { validateFields, getFieldsValue } = form

    validateFields(errors => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        password: md5(123456)
        // key: item.key,
      }
      onOk(data)
    })
  }

  render() {
    const { item = {}, onOk, form, i18n, ...modalProps } = this.props
    const { getFieldDecorator } = form

    return (
      <Modal {...modalProps} onOk={this.handleOk}>
        <Form layout="horizontal">
        <FormItem label={i18n.t`Name`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('userCode', {
              initialValue: item.userCode?item.userCode:'',
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label={i18n.t`NickName`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('userName', {
              initialValue: item.userName  || '',
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label={i18n.t`Email`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('email', {
              initialValue: item.email  || '',
              rules: [
                {
                  required: true
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label={i18n.t`Roles`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('refUserRoleCode', {
              initialValue: item.refUserRoleCode  || 'USER',
              rules: [
                {
                  required: true,
                },
              ],
            })(
              <Select>
                <Option value='USER'>
                  <Trans>USER</Trans>
                </Option>
                <Option value='ADMIN'>
                  <Trans>ADMIN</Trans>
                </Option>
              </Select>
            )}
          </FormItem>
          <FormItem label={i18n.t`Status`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('status', {
              initialValue: item.status  || 'ENABLE',
              rules: [
                {
                  required: true,
                },
              ],
            })(
              <Radio.Group style={{width: 150}}>
                <Radio value={'ENABLE'}>开启</Radio>
                <Radio value={'CLOSE'}>关闭</Radio>
              </Radio.Group>
            )}
           
          </FormItem>
          
         
        </Form>
      </Modal>
    )
  }
}

UserModal.propTypes = {
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default UserModal
