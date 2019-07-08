import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select } from 'antd'
import { Trans, withI18n } from '@lingui/react'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import { find } from 'lodash'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 20,
  },
}
@withI18n()
@Form.create()
class PostModal extends PureComponent {
  state = {
    userAvatar: ''
  }
  handleOk = () => {
    const { item = {}, onOk,form, userInfo } = this.props
    const { validateFields, getFieldsValue } = form
    validateFields(errors => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
        // key: item.key,
      }
      data.content = data.content.toHTML()
      data._id = item._id
      data.userAvatar = this.state.userAvatar
      data.userName = userInfo.userName
      onOk(data)
    })
  }

  render() {
    const { item = {}, onOk, form, i18n,  categoryList, ...modalProps } = this.props
    const { getFieldDecorator } = form
    const editorState = BraftEditor.createEditorState(item.content)

    return (
      <Modal {...modalProps} onOk={this.handleOk}>
        <Form layout="horizontal">
          <FormItem label={i18n.t`PostTitle`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('topicTitle', {
              initialValue: item.topicTitle?item.topicTitle:'',
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input/>)}
          </FormItem>
          <FormItem label={i18n.t`PostCategory`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('category', {
              initialValue: item.category,
              rules: [
                {
                  required: true,
                },
              ],
            })(
            <Select >
              {categoryList.map((item, index) => (
                <Select.Option value={item.categoryName} key={index}>
                  {item.categoryName}
                </Select.Option>
              ))}
            </Select>
            )}
          </FormItem>
          <FormItem label={i18n.t`PostStatus`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('status', {
              initialValue: item.status,
              rules: [
                {
                  required: true,
                },
              ],
            })(
            <Select>
              <Select.Option value={'PUBLISH'}>
                <Trans>Publish</Trans>
              </Select.Option>
              <Select.Option value={'DRAFT'}>
                <Trans>Draft</Trans>
              </Select.Option>
            </Select>
            )}
          </FormItem>
          <FormItem label={i18n.t`PostContent`} hasFeedback {...formItemLayout} >
            {getFieldDecorator('content', {
                initialValue: editorState
              })(
                <BraftEditor
                  value={item.content}
                  style={{border: '1px #dddddd solid', borderRadius: '2px'}}
                />
              )}
           
          </FormItem>
          
         
        </Form>
      </Modal>
    )
  }
}

PostModal.propTypes = {
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default PostModal
