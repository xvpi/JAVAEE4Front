<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-s-management"></i> 报道管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.name" placeholder="学生姓名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-refresh-left" @click="Refresh">刷新</el-button>
                <el-button type="warning" icon="el-icon-message-solid" @click="showModal">一键提醒</el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="studentid" label="学号" width="110" align="center"></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column prop="education" label="专业"></el-table-column>
                <el-table-column prop="phone" label="电话"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="registerStatus" label="注册状态"></el-table-column>

            </el-table>
            <div class="pagination">
                <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :current-page="query.pageIndex"
                        :page-size="query.pageSize"
                        :total="pageTotal"
                        @current-change="handlePageChange"
                ></el-pagination>
            </div>
            <!--            弹窗提醒-->
            <!-- 弹窗 -->
            <div v-if="isModalVisible" class="modal-overlay">
                <div class="modal">
                    <div class="modal-header">
                        <span class="close" @click="closeModal">&times;</span>
                    </div>
                    <div class="modal-body">
                        <p>一键提醒将发送邮件给每一个尚未完成注册的同学。是否确认提醒？</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-cancel" @click="closeModal">取消</button>
                        <button class="btn btn-confirm" @click="confirmReminder">确认</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { fetch_student, update_student_info, add_student } from '../../api/index';
    import { get } from '@/utils/request';
    import Axios from 'axios';

    export default {
        name: 'basetable',
        data() {
            return {
                query: {
                    major: '',
                    name: '',
                    pageIndex: 1,
                    pageSize: 10
                },
                value_class: '',
                value_major: '',
                tableData: [],
                multipleSelection: [],
                delList: [],
                editVisible: false,
                addVisible: false,
                pageTotal: 0,
                form: {},
                form_add: {},
                origin: {},
                idx: -1,
                id: -1,
                isModalVisible: false // 控制弹窗显示
            }
                ;
        },
        created() {
            this.getData();
        },
        methods: {

            // 获取 easy-mock 的模拟数据
            getData() {
                let manager = localStorage.getItem('ms_username');
                const data = {
                    manager: manager,
                    page: this.query.pageIndex,
                    size: this.query.pageSize
                };
                get('/web/getStuAccount', data)
                    .then(response => {
                        console.log('Login successful:', response.data);
                        //this.pageTotal = response.data.pagetotal || 10;
                        this.tableData = response.data;

                        get('/web/getmanager', { manager })
                            .then(response => {
                                console.log(response.data);

                                console.log(response.data.major);
                                const data = {
                                    manager: response.data.manager,
                                    page: this.query.pageIndex,
                                    size: this.query.pageSize
                                };
                                //this.query.pageIndex++;
                                console.log(data);
                                const data1 = {
                                    major: response.data.major
                                };
                                get('/web/getStuNum', data1)
                                    .then(res => {
                                        console.log('Login successful:', res.data);
                                        //this.pageTotal = res.data.length; // 假设后端返回总条数
                                        this.pageTotal = res.data.result; // 假设后端返回当前页的数据

                                    })
                                    .catch(error => {
                                        console.error('Login failed:', error);
                                    });

                            })
                            .catch(error => {
                                console.error(error);
                            });

                    })
                    .catch(error => {
                        console.error('Login failed:', error);
                    });

            },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageIndex', 1);
                const data2 = {
                    name: this.query.name
                };
                get('/web/getAccountByName', data2)
                    .then(response => {
                        console.log('Login successful:', response.data);
                        //this.pageTotal = response.data.pagetotal || 10;
                        this.tableData = [response.data];
                    })
                    .catch(error => {
                        console.error('Login failed:', error);
                    });
                //this.getData();
            },
            Refresh() {
                this.query.name = '';
                this.getData();
            },
            confirmReminder() {
                // 调用后端接口
                get('/personalRegister/waitEmail')
                    .then(response => {
                        console.log('Send successful:', response.data.result);
                        alert('提醒已发送！');
                        this.closeModal();
                    })
                    .catch(error => {
                        console.error('Send failed:', response.data.result);
                        alert('发送提醒时发生错误，请稍后再试！');
                    });
            },
            showModal() {
                this.isModalVisible = true;
            },
            closeModal() {
                this.isModalVisible = false;
            },
            addStudent() {
                this.form_add = {};
                this.addVisible = true;
            }, saveAdd() {

                // this.$set(this.tableData, this.idx, this.form);
                // console.log(this.form_add);
                let data = this.form_add;
                data['pageIndex'] = this.query.pageIndex;
                data['pageSize'] = this.query.pageSize;
                add_student(data).then(res => {
                    console.log(data);
                    console.log('this.res:', res);
                    this.tableData = res.data.data;
                    this.pageTotal = res.data.pagetotal || 10;
                });

                this.addVisible = false;
            },

            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageIndex', val);
                this.getData();
            }
        }
    };
</script>

<style scoped>
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .modal {
        background-color: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        width: 300px; /* 控制弹窗宽度 */
        text-align: center;
    }

    .modal-header {
        margin-bottom: 20px;
    }

    .close {
        float: right;
        font-size: 24px;
        font-weight: bold;
        cursor: pointer;
        color: #aaa;
        transition: color 0.3s;
    }

    .close:hover,
    .close:focus {
        color: black;
        text-decoration: none;
        outline: none;
    }

    .modal-body p {
        margin: 0;
    }

    .modal-footer {
        margin-top: 20px;
        display: flex;
        justify-content: space-between; /* 增加按钮间的距离 */
    }

    .btn {
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        transition: background-color 0.3s;
    }

    .btn-cancel {
        background-color: #f44336;
        color: white;
    }

    .btn-cancel:hover {
        background-color: #da190b;
    }

    .btn-confirm {
        background-color: #4CAF50;
        color: white;
    }

    .btn-confirm:hover {
        background-color: #45a049;
    }

    .handle-box {
        margin-bottom: 20px;
        margin-left: 10px;
        text-align: center;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }

    .table {
        width: 100%;
        font-size: 14px;
    }

    .red {
        color: #ff0000;
    }

    .mr10 {
        margin-right: 10px;
    }

    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }
</style>
