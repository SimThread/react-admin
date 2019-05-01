
import React from 'react';
import { connectAlita } from '@/reducer';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import { Table, Button, Modal, Input, message } from 'antd';
import { Link } from 'react-router-dom';
import { updateTagCat, deleteTagCat } from '@/axios/index.js'

class TagsManage extends React.Component {
    state = {
        selectedRowKeys: [], // Check here to configure the default column
        visible: false,
        delConfirmVisible: false,
        currentTagIndex: 0,
    };
    componentDidMount() {
        const { setAlitaState } = this.props;
        // const res = await getArticleList();
        setAlitaState({ funcName: 'getTagCatList', stateName: 'tagCatList' });
    }
    handleTagEdit = (id, record, index) => {
        this.setState({
            currentTagIndex: index,
        });
        this.showModal();
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

    handleOk = async (e) => {
        const { tagCatList, setAlitaState } = this.props;
        const { currentTagIndex } = this.state;
        this.setState({
            visible: false,
        });
        const res = await updateTagCat(tagCatList.data[currentTagIndex]);
        if (res.success) {
            message.success('编辑标签分类成功');
        }
    }

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }
    handleChangeClass = (e) => {
        const { tagCatList, setAlitaState } = this.props;
        const { currentTagIndex } = this.state;
        const newTagCatList = { data: [...tagCatList.data] };
        newTagCatList.data[currentTagIndex].name = e.target.value
        setAlitaState({ stateName: 'tagCatList', data: newTagCatList });
    }
    handleChangeDesc = (e) => {
        const { tagCatList, setAlitaState } = this.props;
        const { currentTagIndex } = this.state;
        const newTagCatList = { data: [...tagCatList.data] };
        newTagCatList.data[currentTagIndex].desc = e.target.value
        setAlitaState({ stateName: 'tagCatList', data: newTagCatList });
    }
    handleTagDel = (id, record, index) => {
        this.setState({
            currentTagIndex: index,
        });
        this.showDelModal();
    }
    handleOkDelConfirm = async() => {
        const { tagCatList } = this.props;
        const { currentTagIndex } = this.state;
        let res = null;
        
        res = await deleteTagCat({ id: tagCatList.data[currentTagIndex]._id });
        this.setState({
            delConfirmVisible: false,
        });
    }
    className = () => {
        const { tagCatList = { data: [] } } = this.props;
        if ((tagCatList.data && tagCatList.data.length > 0) && this.state.currentTagId) {
            return tagCatList.data.find((ele) => ele._id === this.state.currentTagId).name;
        }
        return '';
    }
    classDesc = () => {
        const { tagCatList = { data: [] } } = this.props;
        if ((tagCatList.data && tagCatList.data.length > 0) && this.state.currentTagId) {
            return tagCatList.data.find((ele) => ele._id === this.state.currentTagId).desc;
        }
        return '';
    }
    render() {
        const { tagCatList = { data: [], isFetching: true } } = this.props;
        const columns = [{
            title: '分类名',
            dataIndex: 'name',
            width: 100,
            render: (text, record, index) => {
                return (
                    <Link to={{
                        pathname: `/app/tag/tags-list/${record._id}`
                    }}
                    >{text}
                    </Link>
                )
            }
        }, {
            title: '描述',
                dataIndex: 'desc',
            width: 100,
        }, {
            title: '管理',
            dataIndex: '_id',
            width: 100,
            render: (text, record, index) => {
                // const { history } = this.props;
                return (
                    <div>
                        <span className="nav-text" onClick={() => this.handleTagEdit(text, record, index)} style={{cursor: 'pointer'}}>Edit </span>
                        <span onClick={() => this.handleTagDel(text, record, index)} style={{ cursor: 'pointer' }}>Delete </span>
                    </div>
                )
            }
        }];
        return (
            <div>
                <BreadcrumbCustom first="标签管理" second="标签列表" />
                <Button type="primary">添加标签分类</Button>
                <div style={{marginTop: '20px'}}>
                    {
                        !tagCatList.isFetching && <Table
                            key={tagCatList.data._id}
                            columns={columns}
                            dataSource={tagCatList.data}
                            pagination={false}
                                                  />
                    }
                </div>

                <Modal
                    title="Basic Modal"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <p>分类名 *</p>
                    <p><Input placeholder="分类名" value={tagCatList.data.length > 0 && tagCatList.data[this.state.currentTagIndex].name} onChange={this.handleChangeClass} /></p>
                    <p>分类描述</p>
                    <p><Input placeholder="分类描述" value={tagCatList.data.length > 0 && tagCatList.data[this.state.currentTagIndex].desc} onChange={this.handleChangeDesc} /></p>
                </Modal>

                <Modal
                    title="Basic Modal"
                    visible={this.state.delConfirmVisible}
                    onOk={this.handleOkDelConfirm}
                    onCancel={this.handleCancelDelConfirm}
                >
                    <p>你确定要删除标签分类吗？</p>
                </Modal>
            </div>
        )
    }
}

export default connectAlita(['tagCatList'])(TagsManage);