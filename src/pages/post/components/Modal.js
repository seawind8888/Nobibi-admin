import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select } from 'antd'
import { Trans, withI18n } from '@lingui/react'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'

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
  handleOk = () => {
    const { item = {}, onOk,form } = this.props
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
      onOk(data)
    })
  }
  handleSelectUser = (user) => {
    const { onSelectUser } = this.props
    onSelectUser(user)
  }

  render() {
    const { item = {}, onOk, form, i18n, userSelectList, categoryList, ...modalProps } = this.props
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
          <FormItem label={i18n.t`PostAuther`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('userCode', {
              initialValue: item.userCode?item.userCode:'',
              rules: [
                {
                  required: true,
                },
              ],
            })(
            <Select 
              onChange={this.handleSelectUser}>
              {userSelectList.map(item => (
                <Option value={item.userCode} key={item._id}>
                  {item.userCode}
                </Option>
              ))}
            </Select>
            )}
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
              {categoryList.map(item => (
                <Option value={item.categoryName} key={item._id}>
                  {item.categoryName}
                </Option>
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
              <Option value={'PUBLISH'}>
                <Trans>Publish</Trans>
              </Option>
              <Option value={'DRAFT'}>
                <Trans>Draft</Trans>
              </Option>
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
