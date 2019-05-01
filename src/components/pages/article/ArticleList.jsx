import React from 'react';
import { Table, Row, Col, Card, Input, Button, Icon, Modal } from 'antd';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import { connectAlita } from '@/reducer';
import { Link } from 'react-router-dom';
import { getArticleList, deleteArticle } from '@/axios/index.js'
import Highlighter from 'react-highlight-words';

const Search = Input.Search;
const confirm = Modal.confirm;

// eslint-disable-next-line no-extend-native
Date.prototype.Format = function (fmt) { //author: meizz   
    let o = {
        "M+": this.getMonth() + 1, //月份   
        "d+": this.getDate(), //日   
        "h+": this.getHours(), //小时   
        "m+": this.getMinutes(), //分   
        "s+": this.getSeconds(), //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds() //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
} 

class ArticleList extends React.Component {
    state = {
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
        data: [],
        currentPage: 1,
    };
    componentDidMount() {
        const { setAlitaState } = this.props;
        setAlitaState({ funcName: 'getArticleList', stateName: 'articleList', params: { itemsPerPage: 5, currentPage: this.state.currentPage } });
    }
    getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys, selectedKeys, confirm, clearFilters,
        }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        ref={node => { this.searchInput = node; }}
                        placeholder={`Search ${dataIndex}`}
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Button
                        type="primary"
                        onClick={() => this.handleSearch(selectedKeys, confirm)}
                        icon="search"
                        size="small"
                        style={{ width: 90, marginRight: 8 }}
                    >
                        Search
        </Button>
                    <Button
                        onClick={() => this.handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
        </Button>
                </div>
            ),
        filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: (text) => (
            <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[this.state.searchText]}
                autoEscape
                textToHighlight={text.toString()}
            />
        ),
    })
    onChange = async (page) => {
        console.log('currentPage:', page);
        this.setState({
            currentPage: page
        });
        const { setAlitaState } = this.props;

        setAlitaState({ funcName: 'getArticleList', stateName: 'articleList', params: { itemsPerPage: 5, currentPage: page } });
    }
    deleteArticle(articleId) {
        const { setAlitaState, articleList } = this.props;
        const { currentPage } = this.state;
        let { count } = articleList;
        confirm({
            title: '确定删除该文章？',
            content: '删除之后将无法恢复',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            async onOk() {
                const res = await deleteArticle({ id: articleId });
                if (res.success) {
                    count = count - 1;
                    const totalPage = (parseInt((count - 1) / 5)) + 1;
                    const page = currentPage < totalPage ? currentPage : totalPage;
                    setAlitaState({ funcName: 'getArticleList', stateName: 'articleList', params: { itemsPerPage: 5, currentPage: page} });
                }
            },
            onCancel() {
            },
        });
    }
    render() {
        const columns = [{
            title: '标题',
            dataIndex: 'title',
            width: 500,
            render: (text, record) => <a href=":;" target="_blank" rel="noopener noreferrer">{text}</a>,
            ...this.getColumnSearchProps('标题')
        }, {
            title: '标签数',
            dataIndex: 'tags',
            width: 100,
            render: (text) => text.length
        }, {
            title: '访问数',
            dataIndex: 'visit_count',
            width: 100
        }, {
            title: '评论数',
            dataIndex: 'comment_count',
            width: 100
        }, {
            title: '喜欢数',
            dataIndex: 'like_count',
            width: 100
        }, {
            title: '是否置顶',
            dataIndex: 'top',
            width: 130,
            render: (text) => {
                if (text) {
                    return "是";
                } else {
                    return "否";
                }
            }
        }, {
            title: '状态',
            dataIndex: 'status',
            width: 100,
            render: (text) => {
                if (text === 1) {
                    return '已发布';
                }
                return '未发布';
            }
        },
        {
            title: '创建时间',
            dataIndex: 'created',
            width: 200,
            render: (dateStr) => new Date(dateStr).Format('yyyy-MM-dd hh:mm:ss')
        },
        {
            title: '最后更新时间',
            dataIndex: 'updated',
            width: 200,
            render: (dateStr) => new Date(dateStr).Format('yyyy-MM-dd hh:mm:ss')
        },
        {
            title: '发布时间',
            dataIndex: 'publish_time',
            width: 200,
            render: (dateStr) => new Date(dateStr).Format('yyyy-MM-dd hh:mm:ss')
        },
        {
            title: '管理',
            dataIndex: '_id',
            width: 200,
            render: (text) => {
                // const { history } = this.props;
                return (
                    <div>
                        <Link to={{
                            pathname: '/app/article/article-edit' + (text ? `/${text}` : ''),
                            state: {
                                id: text
                            }
                        }}
                        >
                            <span className="nav-text">Edit </span>
                        </Link>
                        <a href="javascript:;" target="_blank" rel="noopener noreferrer" onClick={() => this.deleteArticle(text)}>Delete </a>
                        <a href="javascript:;" target="_blank" rel="noopener noreferrer">查看文章</a>
                    </div>
                )
            }
        },
        ];
        const { selectedRowKeys } = this.state;
        const { articleList = { data: [], count: 0 } } = this.props;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };

        const hasSelected = selectedRowKeys.length > 0;
        return (
            <div>
                <BreadcrumbCustom first="文章管理" second="文章列表" />
                
                <Row gutter={16}>
                    <Col className="gutter-row" md={24}>
                        <div className="gutter-box">
                            <Card title="文章列表" bordered={false}>
                                <div>
                                    <Search
                                        placeholder="input search text"
                                        onSearch={value => console.log(value)}
                                        style={{ width: 200 }}
                                    />
                                </div>
                                <div style={{ marginBottom: 16 }}>
                                    <span style={{ marginLeft: 8 }}>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}</span>
                                </div>
                                {
                                    !articleList.isFetching && 
                                    (<Table
                                        rowSelection={rowSelection}
                                        rowKey="_id"
                                        columns={columns}
                                        dataSource={articleList.data}
                                        pagination={{
                                            current: this.state.currentPage,
                                            total: articleList.count,
                                            pageSize: 5,
                                            onChange: this.onChange,
                                        }}
                                        scroll={{ x: 1800 }}
                                    />)
                                }
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default connectAlita(['articleList'])(ArticleList);