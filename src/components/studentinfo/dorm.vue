<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item> <i class="el-icon-house"></i> 宿舍申请审批 </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-select v-model="query.status" placeholder="请选择申请类型" class="handle-input mr10" @change="handleSearch">
          <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          ></el-option>
        </el-select>
        <el-button type="primary" v-if="query.status === 'pending'" @click="allAgree">批量同意</el-button>
        <el-button type="danger" v-if="query.status === 'pending'" @click="allDisagree">批量拒绝</el-button>
      </div>
      <el-table
          :data="tableData"
          border
          class="table"
          ref="multipleTable"
          header-cell-class-name="table-header"
          @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="80" align="center"></el-table-column>
        <el-table-column prop="studentid" label="学号" width="200" align="center"></el-table-column>
        <el-table-column prop="currentTime" label="时间" width="240" align="center"></el-table-column>
        <el-table-column prop="name" label="姓名" ></el-table-column>
        <el-table-column prop="olddormitory" label="旧宿舍" > </el-table-column>
        <!--                <el-table-column label="班级">-->
        <!--                    <template slot-scope="scope">{{ scope.row.class }}</template>-->
        <!--                </el-table-column>-->
        <el-table-column prop="newdormitory" label="新宿舍" ></el-table-column>
        <el-table-column prop="reason" label="申请原因" ></el-table-column>


          <el-table-column prop="status" label="操作" v-if="query.status === 'approved'"></el-table-column>
        <el-table-column prop="status" label="操作" v-if="query.status === 'rejected'"></el-table-column>
        <el-table-column label="操作" width="160" align="center" v-if="query.status === 'pending'">
          <template slot-scope="scope" v-if="query.status === 'pending'">
            <div style="display: flex; justify-content: space-between;" >
              <el-button type="primary" @click="handleAgree(scope.row)">同意</el-button>
              <el-button type="danger" @click="handleDisagree(scope.row)">不同意</el-button>
            </div>
          </template>
        </el-table-column>

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
    </div>

    <!-- 编辑弹出框 -->


    <!-- 添加学生框 -->

  </div>
</template>

<script>
import { fetch_student, update_student_info ,add_student} from '../../api/index';
import { get } from '@/utils/request';
import Axios from 'axios';
export default {
  name: 'basetable',
  data() {
    return {
      statusOptions: [
        { value: 'pending', label: '未处理' },
        { value: 'approved', label: '已同意' },
        { value: 'rejected', label: '不同意' },
      ],
      query: {
        status: 'pending', // 默认选择'未处理'
        major: '',
        name: '',
        pageIndex: 1,
        pageSize: 10
      },
      options_class: [
        {
          value: '1',
          label: '1'
        },
        {
          value: '2',
          label: '2'
        },
        {
          value: '3',
          label: '3'
        }
      ],
      options_major: [
        {
          value: '计算机科学与技术',
          label: '计算机科学与技术'
        },
        {
          value: '数字媒体',
          label: '数字媒体'
        }
      ],
      value_class: '',
      value_major: '',
      tableData: [],
      multipleSelection: [],
      delList: [],
      editVisible: false,
      addVisible: false,
      pageTotal: 0,
      form: {},
      form_add:{},
      origin: {},
      idx: -1,
      id: -1
    };
  },
  created() {
    this.getData();
  },
  methods: {
    allAgree() {
      this.multipleSelection.forEach(row => {
        console.log(row);
        this.handleAgree(row);
      });
    },
    allDisagree() {
      this.multipleSelection.forEach(row => {
        console.log(row);
        this.handleDisagree(row);
      });
    },
    handleAgree(res) {
      console.log(res);
      const url = '/web/approvalDor';
      const params = {
        ifapprove: 1,
        studentid: res.studentid
      };
      console.log(params);
      get(url, params)
          .then(response => {
            console.log('Response:', response.data);
            res.status = 'approved';
            this.getData();
            //this.removeRow(index);
            //this.tableData = this.tableData.filter(item => item.studentid !== row.studentid);
          })
          .catch(error => {
            console.error('Error:', error);

          });
    },
    //不同意请假
    handleDisagree(res) {
      console.log(res);
      const url = '/web/approvalDor';
      const params = {
        ifapprove: 0,
        studentid: res.studentid
      };

      get(url, params)
          .then(response => {
            console.log('Response:', response.data);
            res.status = 'rejected';
            this.getData();
            //this.tableData = this.tableData.filter(item => item.studentid !== row.studentid);
          })
          .catch(error => {
            console.error('Error:', error);

          });
    },
    getData() {
      let manager = localStorage.getItem('ms_username');
      get('/web/getmanager', { manager })
          .then(response => {
            console.log(response.data);
            this.major = response.data.major;
            // 假设 this.major 是类的属性或者在当前上下文中可用
            let major = this.major;
            // 调用 get 函数，并传递 URL 和参数
            get('/web/getApplyforExchangeDormitory', { major })
                .then(response => {
                  console.log(response.data);
                  this.tableData = response.data.filter(item => item.status === this.query.status);
                  //this.tableData = response.data;
                  //this.tableData = this.tableData.filter(item => item.studentid !== row.studentid);
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
      // get('/web/getAccountByName', data2)
      //     .then(response => {
      //       console.log('Login successful:', response.data);
      //       //this.pageTotal = response.data.pagetotal || 10;
      //       this.tableData = [response.data];
      //     })
      //     .catch(error => {
      //       console.error('Login failed:', error);
      //     });
      this.getData();
    },
    addStudent(){
      this.form_add={};
      this.addVisible = true;
    },saveAdd(){

      // this.$set(this.tableData, this.idx, this.form);
      // console.log(this.form_add);
      let data = this.form_add
      data['pageIndex']= this.query.pageIndex;
      data['pageSize'] = this.query.pageSize;
      add_student(data).then(res => {
        console.log(data);
        console.log("this.res:",res);
        this.tableData = res.data.data;
        this.pageTotal = res.data.pagetotal || 10;
      });
      // console.log(this.options_class);
      // console.log(this.options_major);
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
