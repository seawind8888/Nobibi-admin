import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select } from 'antd'
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
class UserModal extends PureComponent {
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
    const { item = {}, onOk, form, i18n, ...modalProps } = this.props
    const { getFieldDecorator } = form

    return (
      <Modal {...modalProps} onOk={this.handleOk}>
        <Form layout="horizontal">
          <FormItem label={i18n.t`PostTitle`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('articleTitle', {
              initialValue: item.articleTitle?item.articleTitle:'',
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label={i18n.t`PostAuther`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('userCode', {
              initialValue: item.articleTitle?item.articleTitle:'',
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label={i18n.t`PostCategory`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('category', {
              initialValue: item.category?item.category[0]:'',
              rules: [
                {
                  required: true,
                },
              ],
            })(
              <Select>
                {categoryList.map(item => {
                  <Option value={item.categoryName} key={item._id}>
                    
                  </Option>
                })}
              </Select>
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
