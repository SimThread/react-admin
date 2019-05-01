import React from 'react';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import { Input, Select, Typography, Button, Tag, Radio } from 'antd';
import { connectAlita } from '@/reducer';
import { Upload, Icon, Modal, message } from 'antd';
import { getCookie } from '@/utils/authService'
import { addAricle } from '@/axios/index.js'
const { TextArea } = Input;
const { Title } = Typography;
const { Option, OptGroup } = Select;
const RadioGroup = Radio.Group;
// deps for editor
require('codemirror/lib/codemirror.css'); // codemirror
require('tui-editor/dist/tui-editor.css'); // editor ui
require('tui-editor/dist/tui-editor-contents.css'); // editor content
require('highlight.js/styles/github.css'); // code block highlight

class ArticleEdit extends React.Component {
    state = {
        title: '',
        status: 1, // 状态
        content: '',
        top: false,
        images: [],
        value: 1,
        selectedTag: '',
        selectedTags: [],
        isTop: 2,

        // 图片上传
        previewVisible: false,
        previewImage: '',
        fileList: [],
        currentUrl: '',
        editor: null,
    }

    async componentDidMount() {
        const { setAlitaState } = this.props;
        setAlitaState({ funcName: 'getTagList', stateName: 'tags', params: { _id: 0 } });
        await setAlitaState({ stateName: 'article', data: { data: { content: '', status: 0, tags: [], title: '', top: false } } });

        const { article } = this.props
        var Editor = require('tui-editor');
        this.setState({
            selectedTags: article.data.tags.map((item) => {
                return item._id;
            }),
            editor: new Editor({
                el: document.querySelector('#editSection'),
                initialEditType: 'markdown',
                previewStyle: 'vertical',
                height: '500px',
                initialValue: article.data.content
            })
        });
    }

    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
            currentUrl: decodeURIComponent(file.response.img_url),
        });
    }

    handleChange = ({ fileList }) => {
        this.setState({ fileList })
    }
    handleChangeTop = (e) => {
        const { setAlitaState, article } = this.props;
        article.data.top = e.target.value;
        setAlitaState({ stateName: 'article', data: article.data });
    }
    handleChangeStatus = (e) => {
        const { setAlitaState, article } = this.props;
        article.data.status = e.target.value;
        setAlitaState({ stateName: 'article', data: article.data });
    }
    handleChangeLabel = (value) => {
        this.setState({
            selectedTag: value,
        });
    }
    handleAddTag = () => {
        const { setAlitaState, article, tags } = this.props;
        const tempArr = [...this.state.selectedTags, this.state.selectedTag]
        // this.state.selectedTags.push();
        this.setState({
            selectedTags: Array.from(new Set(tempArr))
        });
        article.data.tags = Array.from(new Set(tempArr));
        setAlitaState({ stateName: 'article', data: article.data });
    }
    handleChangeContent = (e) => {
        const { setAlitaState, article } = this.props;
        article.data.content = e.target.value;
        setAlitaState({ stateName: 'article', data: article.data });
    }
    handleChangeTitle = (e) => {
        const { setAlitaState, article } = this.props;
        article.data.title = e.target.value;
        setAlitaState({ stateName: 'article', data: article.data });
    }
    handleSave = async () => {
        const { article, history } = this.props;
        const { editor } = this.state;
        const val = editor.getValue();
        article.data.content = val;
        article.data.status = 0;

        const res = await addAricle(article.data);

        if (res.success) {
            message.success('保存成功');
            history.push(`/app/article/article-edit/${res.article_id}`);
        } else {
            message.error('保存失败')
        }

    }
    handleSaveAndPub = async () => {
        const { article, history } = this.props;
        const { editor } = this.state;
        const val = editor.getValue();
        article.data.content = val;
        article.data.status = 1;

        const res = await addAricle({
            ...article.data,
        });

        if (res.success) {
            message.success('保存并重新发布成功');
            history.push(`/app/article/article-edit/${res.article_id}`);
        } else {
            message.error('保存并重新发布失败')
        }
    }
    render() {
        const { article = { data: {} }, tags = { data: {}, isFetching: true } } = this.props;
        let tagsFormat = {}

        if (!tags.isFetching) {
            for (let i = 0; i < tags.data.length; i++) {
                if (!tagsFormat[tags.data[i].cid.name]) {
                    tagsFormat[tags.data[i].cid.name] = [];
                }
                tagsFormat[tags.data[i].cid.name].push(tags.data[i]);
            }
        }

        let handleChangeLabel = this.handleChangeLabel;
        let handleAddTag = this.handleAddTag;
        let handleSave = this.handleSave;
        let handleSaveAndPub = this.handleSaveAndPub;
        let handleChangeContent = this.handleChangeContent;
        let handleChangeTitle = this.handleChangeTitle;
        let headers = {
            Authorization: 'Bearer ' + getCookie('token')
        }

        // 图片上传
        const { previewVisible, previewImage, fileList, currentUrl } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );

        return (
            <div>
                <BreadcrumbCustom first="文章管理" second="文章编辑" />

                <Title level={4}>标题</Title>
                <Input placeholder="Basic usage" value={article.data.title} onChange={handleChangeTitle} />

                {/* 标签 */}
                <div style={{ marginTop: '20px' }}>
                    <Title level={4}>添加标签</Title>
                    <Select
                        // defaultValue="lucy"
                        style={{ width: 200 }}
                        onChange={handleChangeLabel}
                        placeholder="请选择标签"
                    >
                        {
                            Object.keys(tagsFormat).map((key) => {
                                return (
                                    <OptGroup label={key} key={key}>
                                        {
                                            tagsFormat[key].map((item) => {
                                                return (
                                                    <Option value={item._id} key={key}>{item.name}</Option>
                                                )
                                            })
                                        }
                                    </OptGroup>
                                )
                            })
                        }
                    </Select>
                    <Button type="primary" onClick={handleAddTag} style={{ marginLeft: '20px' }}>添加</Button>
                </div>

                <div style={{ marginTop: '10px' }}>
                    {
                        this.state.selectedTags.map((item) => {
                            let tag = tags.data.find((currentVal) => {
                                if (item === currentVal._id) {
                                    return currentVal;
                                }
                                return false;
                            }, item);
                            return (
                                <Tag key={tag._id}>{tag.name}</Tag>
                            )
                        })
                    }
                </div>

                <div style={{ marginTop: '20px' }}>
                    <Title level={4}>图片上传</Title>
                    <div className="clearfix">
                        <Upload
                            action="http://localhost:9000/article/uploadImage"
                            listType="picture-card"
                            withCredentials
                            headers={headers}
                            fileList={fileList}
                            onPreview={this.handlePreview}
                            onChange={this.handleChange}
                        >
                            {fileList.length >= 3 ? null : uploadButton}
                        </Upload>
                        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                            <p>{currentUrl}</p>
                        </Modal>
                    </div>
                </div>

                <Title level={4}>内容</Title>
                <div id="editSection" />

                <div style={{ marginTop: '20px' }}>
                    <Title level={4}>是否置顶</Title>
                    <RadioGroup onChange={this.handleChangeTop} value={article.data.top}>
                        <Radio value>是</Radio>
                        <Radio value={false}>否</Radio>
                    </RadioGroup>
                </div>

                <div style={{ marginTop: '20px' }}>
                    <Button type="primary" onClick={handleSave}>保存为草稿</Button>
                    <Button type="primary" onClick={handleSaveAndPub}>保存并发布</Button>
                </div>
            </div>
        )
    }
}

export default connectAlita(['article', 'tags'])(ArticleEdit);