import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader, Select } from 'antd'
import { Trans, withI18n } from '@lingui/react'
import { getRandomColor } from 'utils'
import { userInfo } from 'os';

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
class CategoryModal extends PureComponent {
  handleOk = () => {
    const { item = {}, onOk, form, modalType, userInfo} = this.props
    const { validateFields, getFieldsValue } = form
    

    validateFields(errors => {
      if (errors) {
        return
      }
      
      const data = {
        ...getFieldsValue(),
        _id: item._id,
        userName: userInfo.userName
        // key: item.key,
      }
      if(modalType === 'create') {
        data.categoryColor = getRandomColor()
      }
      onOk(data)
    })
  }

  render() {
    const { item = {}, onOk, form, i18n, userSelectList, ...modalProps } = this.props
    const { getFieldDecorator } = form

    return (
      <Modal {...modalProps} onOk={this.handleOk}>
        <Form layout="horizontal">
        <FormItem label={i18n.t`CategoryName`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('categoryName', {
              initialValue: item.categoryName,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

CategoryModal.propTypes = {
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default CategoryModal
