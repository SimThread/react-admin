import React from 'react';
import { Table, Button, Modal, Input, message, Select, InputNumber, Radio } from 'antd';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import { connectAlita } from '@/reducer';
import { addTag, updateTag, deleteTag } from '@/axios/index.js'
const Option = Select.Option;
const RadioGroup = Radio.Group;

class TagsList extends React.Component {
    state = {
        selectedRowKeys: [], // Check here to configure the default column
        visible: false,
        delConfirmVisible: false,
        addTagVisible: false,
        currentTagIndex: 0,
        currentTagCatId: 0,
        tag: {
            cid: '',
            is_index: false,
            is_show: false,
            name: '',
            sort: 1,
        }
    }
    async componentDidMount() {
        const { setAlitaState } = this.props;
        const { id } = this.props.match.params;

        setAlitaState({ funcName: 'getTagList', stateName: 'tags', params: { _id: id } });
        await setAlitaState({ funcName: 'getTagCatList', stateName: 'tagCatList' });

        this.setState({
            currentTagCatId: id,
        });
    }
    async componentDidUpdate(prevProps) { // React 16.3+弃用componentWillReceiveProps
        const { id: prevId } = prevProps.match.params;
        const { id } = this.props.match.params;
        if (prevId !== id) {
            const { setAlitaState } = this.props;

            setAlitaState({ funcName: 'getTagList', stateName: 'tags', params: { _id: id } });
            this.setState({
                currentTagCatId: id,
            });
        }
        
    }
    getDefaulttagCat() {
        const { tagCatList = { data: [], isFetching: true } } = this.props;
        const { id } = this.props.match.params;
        return tagCatList.data.find((ele) => ele._id === id).name;
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    showDelModal = () => {
        this.setState({
            delConfirmVisible: true,
        });
    }
    showAddTagModel = () => {
        this.setState({
            addTagVisible: true,
        });
    }
    handleTagEdit = (text, record, index) => {
        this.setState({
            currentTagIndex: index,
        });
        this.showModal();
    }
    handleOkTag = async () => {
        const { id } = this.props.match.params;
        const { tags, setAlitaState } = this.props;
        this.setState({
            visible: false,
        });

        const { currentTagIndex } = this.state;

        const newTag = tags.data[currentTagIndex];
        newTag.cid = newTag.cid._id;
        const res = await updateTag(newTag);

        if (res.success) {
            setAlitaState({ funcName: 'getTagList', stateName: 'tags', params: { _id: id } });
            this.setState({
                currentTagCatId: id,
            });
            message.success('编辑标签成功');
        }
    }
    handleCancelTag = () => {
        this.setState({
            visible: false
        });
    }

    handleChangeTag = (e) => {
        const { tags, setAlitaState } = this.props;
        const { currentTagIndex } = this.state;
        const newTags = { data: [...tags.data] };
        newTags.data[currentTagIndex].name = e.target.value
        setAlitaState({ stateName: 'tags', data: newTags });
    }
    handleChangeSort = (num) => {
        const { tags, setAlitaState } = this.props;
        const { currentTagIndex } = this.state;
        const newTags = { data: [...tags.data] };
        newTags.data[currentTagIndex].sort = num;
        setAlitaState({ stateName: 'tags', data: newTags });
    }
    handleChangeIsShow = (e) => {
        const { tags, setAlitaState } = this.props;
        const { currentTagIndex } = this.state;
        const newTags = { data: [...tags.data] };
        newTags.data[currentTagIndex].is_show = e.target.value;
        setAlitaState({ stateName: 'tags', data: newTags });
    }
    handleChangeIsIndex = (e) => {
        const { tags, setAlitaState } = this.props;
        const { currentTagIndex } = this.state;
        const newTags = { data: [...tags.data] };
        newTags.data[currentTagIndex].is_index = e.target.value;
        setAlitaState({ stateName: 'tags', data: newTags });
    }
    handleChangeSelectClass = async (cid) => {
        const { tags, tagCatList, setAlitaState } = this.props;
        const { currentTagIndex } = this.state;
        const newTags = { data: [...tags.data] };

        newTags.data[currentTagIndex].cid = tagCatList.data.find((ele) => ele._id === cid);
        
        setAlitaState({ stateName: 'tags', data: newTags });
    }
    handleChangeCurrentClass = (id) => {
        const { history } = this.props;
        this.setState({
            currentTagCatId: id,
        });
        // const { id } = this.props.match.params;
        history.push(`/app/tag/tags-list/${id}`);
    }

    handleTagDel = (text, record, index) => {
        this.setState({
            delConfirmVisible: true,
        });
    }

    handleOkDelConfirm = async () => {
        const { tags, setAlitaState } = this.props;
        const { currentTagIndex } = this.state;
        const { id } = this.props.match.params;
        let res = null;

        try {
            res = await deleteTag({ _id: tags.data[currentTagIndex]._id });

            this.setState({
                delConfirmVisible: false,
            });
            
            setAlitaState({ funcName: 'getTagList', stateName: 'tags', params: { _id: id } });
            if (res.success) {
                message.success('删除标签成功');
            }
        } catch(err) {
            console.log('err:', err);
        }
    }

    handleChangeAddTagName = (e) => {
        const { tag } = this.state;
        tag.name = e.target.value;
        this.setState({
            tag,
        });
    }
    handleChangeAddTagSelectClass = (cid) => {
        const { tag } = this.state;
        tag.cid = cid;
        this.setState({
            tag,
        });
    }
    handleChangeAddTagSort = (num) => {
        const { tag } = this.state;
        tag.sort = num;
        this.setState({
            tag,
        });
    }
    handleChangeAddTagIsShow = (e) => {
        const { tag } = this.state;
        tag.is_show = e.target.value;
        this.setState({
            tag,
        });
    }
    handleChangeAddTagIsIndex = (e) => {
        const { tag } = this.state;
        tag.is_index = e.target.value;
        this.setState({
            tag,
        });
    }
    handleOkAddTag = async (e) => {
        const { tag } = this.state;
        const { id } = this.props.match.params;
        const { setAlitaState } = this.props;

        try {
            const res = await addTag(tag);

            this.setState({
                addTagVisible: false,
            });

            if (res.success) {
                setAlitaState({ funcName: 'getTagList', stateName: 'tags', params: { _id: id } });
                this.setState({
                    tag: {
                        cid: '',
                        is_index: false,
                        is_show: false,
                        name: '',
                        sort: 1,
                    },
                });
                message.success('添加标签成功');
            }
        } catch(err) {
            console.log('err:', err);
        }
    }
    handleCancelAddTag = () => {
        this.setState({
            addTagVisible: false,
        });
    }
    render() {
        const { tagCatList = { data: [], isFetching: true }, tags = { data: [], isFetching: true }, setAlitaState } = this.props;
        const { tag } = this.state;
        const { id } = this.props.match.params;
        const columns = [{
            title: '标签名',
            dataIndex: 'name',
            width: 100,
        }, {
            title: '所属分类',
            dataIndex: 'cid',
            width: 100,
            render: (val, record, index) => {
                return (
                    <div>
                        { val.name }
                    </div>
                );
            }
        }, {
            title: '排序',
            dataIndex: 'sort',
            width: 100,
                render: (val, record, index) => {
                // const { history } = this.props;
                return (
                    <div>
                        { val }
                    </div>
                )
            }
            }, {
                title: '是否显示',
                dataIndex: 'is_show',
                width: 100,
                render: (val, record, index) => {
                    // const { history } = this.props;

                    return (
                        <div>
                            {val ? '是' : '否'}
                        </div>
                    )
                }
            }, {
                title: '是否首页',
                dataIndex: 'is_index',
                width: 100,
                render: (val, record, index) => {
                    // const { history } = this.props;
                    return (
                        <div>
                            {val ? '是' : '否'}
                        </div>
                    )
                }
            }, {
                title: '管理',
                dataIndex: 'cid',
                width: 100,
                render: (text, record, index) => {
                    // const { history } = this.props;
                    return (
                        <div>
                            <span className="nav-text" onClick={() => this.handleTagEdit(text, record, index)} style={{ cursor: 'pointer' }}>Edit </span>
                            <span onClick={() => this.handleTagDel(text, record, index)} style={{ cursor: 'pointer' }}>Delete </span>
                        </div>
                    )
                }
            }];

        let handleChangeCurrentClass = this.handleChangeCurrentClass;

        return (
            <div>
                <BreadcrumbCustom first="标签管理" second="标签列表" />
                <Button type="primary" onClick={this.showAddTagModel}>添加标签</Button>

                {
                    !tagCatList.isFetching && 
                    <Select
                    // showSearch
                    style={{ width: 200, marginLeft: '20px' }}
                    placeholder="Select a person"
                    // defaultValue={this.getDefaulttagCat()}
                    value={this.state.currentTagCatId}
                    onSelect={handleChangeCurrentClass}
                    >
                        {
                            tagCatList.data.map((item, index) => {
                                return <Option value={item._id} key={item._id}>{item.name}</Option>
                            })
                        }
                    </Select>
                }

                <div style={{ marginTop: '20px' }}>
                    {
                        !tags.isFetching && <Table
                            key={tags.data._id}
                            columns={columns}
                            dataSource={tags.data}
                            pagination={false}
                                            />
                    }
                </div>

                <Modal
                    title="编辑标签"
                    visible={this.state.visible}
                    onOk={this.handleOkTag}
                    onCancel={this.handleCancelTag}
                >
                    {
                        tags.data.length > 0 && (
                            <div>
                                <p>标签名 *</p>
                                <p><Input placeholder="标签名" value={tags.data[this.state.currentTagIndex].name} onChange={this.handleChangeTag} /></p>
                                <p>选择分类 *</p>
                                <p>
                                    <Select
                                        showSearch
                                        style={{ width: 200 }}
                                        placeholder="Select a person"
                                        value={tags.data[this.state.currentTagIndex].cid._id}
                                        onChange={this.handleChangeSelectClass}
                                    >
                                        {
                                            tagCatList.data.map((item) => {
                                                return <Option value={item._id} key={item._id}>{item.name}</Option>
                                            })
                                        }
                                    </Select>
                                </p>
                                <p>排序</p>
                                <p><InputNumber min={1} max={10} value={tags.data[this.state.currentTagIndex].sort} onChange={this.handleChangeSort} /></p>
                                <p>是否显示</p>
                                <p>
                                    <RadioGroup onChange={this.handleChangeIsShow} value={tags.data[this.state.currentTagIndex].is_show}>
                                        <Radio value>是</Radio>
                                        <Radio value={false}>否</Radio>
                                    </RadioGroup>
                                </p>
                                <p>是否显示在首页</p>
                                <p>
                                    <RadioGroup onChange={this.handleChangeIsIndex} value={tags.data[this.state.currentTagIndex].is_index}>
                                        <Radio value>是</Radio>
                                        <Radio value={false}>否</Radio>
                                    </RadioGroup>
                                </p>
                            </div>
                        )
                    }
                </Modal>

                <Modal
                    title="添加标签"
                    visible={this.state.addTagVisible}
                    onOk={this.handleOkAddTag}
                    onCancel={this.handleCancelAddTag}
                >
                    {
                        tags.data.length > 0 && (
                            <div>
                                <p>标签名 *</p>
                                <p><Input placeholder="标签名" value={tag.name} onChange={this.handleChangeAddTagName} /></p>
                                <p>选择分类 *</p>
                                <p>
                                    <Select
                                        showSearch
                                        style={{ width: 200 }}
                                        placeholder="Select a person"
                                        value={tag.cid}
                                        onChange={this.handleChangeAddTagSelectClass}
                                    >
                                        {
                                            tagCatList.data.map((item) => {
                                                return <Option value={item._id} key={item._id}>{item.name}</Option>
                                            })
                                        }
                                    </Select>
                                </p>
                                <p>排序</p>
                                <p><InputNumber min={1} max={10} value={tag.sort} onChange={this.handleChangeAddTagSort} /></p>
                                <p>是否显示</p>
                                <p>
                                    <RadioGroup onChange={this.handleChangeAddTagIsShow} value={tag.is_show}>
                                        <Radio value>是</Radio>
                                        <Radio value={false}>否</Radio>
                                    </RadioGroup>
                                </p>
                                <p>是否显示在首页</p>
                                <p>
                                    <RadioGroup onChange={this.handleChangeAddTagIsIndex} value={tag.is_index}>
                                        <Radio value>是</Radio>
                                        <Radio value={false}>否</Radio>
                                    </RadioGroup>
                                </p>
                            </div>
                        )
                    }
                </Modal>

                <Modal
                    title="删除标签"
                    visible={this.state.delConfirmVisible}
                    onOk={this.handleOkDelConfirm}
                    onCancel={this.handleCancelDelConfirm}
                >
                    <p>你确定要删除标签吗？</p>
                </Modal>
            </div>
        );
    }
}

export default connectAlita(['tagCatList', 'tags'])(TagsList);