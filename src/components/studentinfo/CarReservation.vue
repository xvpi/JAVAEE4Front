<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-truck"></i> 车辆预约审批</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="selectedStatus" placeholder="请选择申请状态" class="handle-input mr10"
                           @change="filterStatus">
                    <el-option label="全部状态" value=""></el-option>
                    <el-option label="未处理" value="pending"></el-option>
                    <el-option label="已同意" value="approved"></el-option>
                    <el-option label="已驳回" value="rejected"></el-option>
                </el-select>
            </div>
            <el-table
                    :data="filteredTableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="80" align="center"></el-table-column>
                <el-table-column prop="id" label="申请编号" width="100" align="center"></el-table-column>
                <el-table-column prop="name" label="申请人" width="100" align="center"></el-table-column>
                <el-table-column prop="studentid" label="学号" width="100" align="center"></el-table-column>
                <el-table-column prop="time" label="通行日期" width="150" align="center"></el-table-column>
                <el-table-column prop="reason" label="申请事由" align="center"></el-table-column>
                <el-table-column prop="status" label="流程状态" width="200" align="center"></el-table-column>
                <el-table-column label="操作" width="160" align="center" >
                    <template slot-scope="scope">
                        <div style="display: flex; justify-content: space-between;" >
                            <el-button type="primary" @click="handleAgree(scope.row)" :disabled="scope.row.status === 'approved'||scope.row.status === 'rejected'">同意</el-button>
                            <el-button type="danger" @click="handleDisagree(scope.row)" :disabled="scope.row.status === 'approved'||scope.row.status === 'rejected'">驳回</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="operation-panel">
                <el-button type="success" @click="batchApprove" :disabled="selectedRows.length === 0 || !isActionable">
                    批量同意
                </el-button>
                <el-button type="danger" @click="batchReject" :disabled="selectedRows.length === 0 || !isActionable">
                    批量驳回
                </el-button>
            </div>
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
        </div>

        <!-- 编辑弹出框 -->


        <!-- 添加学生框 -->

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
                statusOptions: [
                    { value: '', label: '全部状态' },
                    { value: 'pending', label: '未处理' },
                    { value: 'approved', label: '已同意' },
                    { value: 'rejected', label: '已驳回' }
                ],
                selectedRows: [], // 选中的行数据
                selectedStatus: '' ,// 选中的状态，用于筛选
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
                id: -1
            };
        },
        created() {
            this.getData();

        },
        computed: {
            filteredTableData() {
                // 根据选中的状态筛选数据
                if (this.selectedStatus) {
                    return this.tableData.filter(row => row.status === this.selectedStatus);
                }
                return this.tableData;
            },
            isActionable() {
                // 判断是否所有选中的行都是pending状态，用于控制按钮是否可用
                return this.selectedRows.length > 0 && this.selectedRows.every(row => row.status === 'pending');
            }
        },
        methods: {
            filterStatus() {
                this.selectedRows = [];
            },
            getRowClassName({ row }) {
                return row.status === 'approved' ? 'row-approved' : row.status === 'rejected' ? 'row-rejected' : '';
            },
            //审批通过
            handleAgree(res) {

                console.log(res);
                const url = '/web/approvalvehicle';
                const params = {
                    id: res.id,
                    ifapprove: 1
                };

                get(url, params)
                    .then(response => {
                        console.log('Response:', response.data);

                    })
                    .catch(error => {
                        console.error('Error:', error);

                    });
                this.getData();
            },
            // 批量同意操作
            batchApprove() {
                this.selectedRows.forEach(row => {
                    this.handleAgree(row);
                });
                this.selectedRows = [];
            },
            //驳回申请
            handleDisagree(res) {
                console.log(res);
                const url = '/web/approvalvehicle';
                const params = {
                    id: res.id,
                    ifapprove: 0
                };

                get(url, params)
                    .then(response => {
                        console.log('Response:', response.data);
                    })
                    .catch(error => {
                        console.error('Error:', error);

                    });
                this.getData();
            },
            batchReject() {
                this.selectedRows.forEach(row => {
                    this.handleDisagree(row);
                });
                this.selectedRows = [];
            },

            getData() {
                let manager = localStorage.getItem('ms_username');
                get('/web/getmanager', { manager })
                    .then(response => {
                        console.log(response.data);
                        this.major = response.data.major;
                        // 假设 this.major 是类的属性或者在当前上下文中可用
                        let major = this.major;
                        console.log(major);
                        // 调用 get 函数，并传递 URL 和参数
                        get('/web/getApplyforvehicle', { major })
                            .then(response => {
                                console.log(response.data);
                                this.tableData = response.data;
                            })
                            .catch(error => {
                                console.error(error);
                            });
                    })
                    .catch(error => {
                        console.error(error);
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
                this.getData();
                this.selectedRows = [];

            },

            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
                this.selectedRows = val;
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
    .row-approved {
        background-color: #f0fff0; /* 绿色背景示意已同意 */
    }

    .row-rejected {
        background-color: #fff0f0; /* 红色背景示意已驳回 */
    }
    .operation-panel {
        margin-top: 10px;
        text-align: right;
    }
    .handle-box {
        margin-bottom: 20px;
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
