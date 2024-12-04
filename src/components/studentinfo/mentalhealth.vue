<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item> <i class="el-icon-star-off"></i> 学生心理健康 </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-select v-model="filterType" placeholder="选择过滤条件" @change="filterData" class="handle-select mr10">
        <el-option label="全部" value="all"></el-option>
        <el-option  :class="{ 'red-text': true }" label="60分以下" value="below60"></el-option>
      </el-select>
      <el-table
          :data="tableData "
          border
          class="table"
          ref="multipleTable"
          header-cell-class-name="table-header"
          @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="studentID" label="学号" width="110" align="center"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="score" label="心理状况得分"></el-table-column>
        <el-table-column label="操作"  width="160" align="center" >
          <template slot-scope="scope" >
            <div style="display: flex; justify-content: space-between;" >
              <el-button type="primary" @click="handleAgree(scope.row)">发邮件</el-button>
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

    <!-- 发送邮件对话框 -->
    <el-dialog :visible.sync="emailDialogVisible" title="发送邮件">
      <el-form :model="emailForm">
        <el-form-item label="收件人">
          <el-input v-model="emailForm.to" disabled></el-input>
        </el-form-item>
        <el-form-item label="主题">
          <el-input v-model="emailForm.subject"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="emailForm.body"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="emailDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="sendEmail">发送</el-button>
      </span>
    </el-dialog>

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
      emailDialogVisible: false,
      emailForm: {
        to: '',
        subject: '',
        body: ''
      },
      filterType: 'all',
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
    // 获取 easy-mock 的模拟数据
    handleAgree(row) {
      console.log(row);
      this.emailForm.to = row.email;
      this.emailDialogVisible = true;
    },
    sendEmail() {
      const emailData = {
        email: this.emailForm.to,
        message: this.emailForm.body
      };
      console.log(emailData);
      get('/web/sendEmail', emailData)
          .then(res1 => {
            console.log('Send successful:', res1);
            this.$message.success('邮件发送成功');
            this.emailDialogVisible = false;
          })
          .catch(error => {
            console.error('Send failed:', error);
            this.$message.error('邮件发送失败');
          });
    },

    getData() {
      let manager = localStorage.getItem('ms_username');


      get('/web/getmanager', { manager })
          .then(response => {
            console.log(response.data);
            // this.major = response.data.major;
            // // 假设 this.major 是类的属性或者在当前上下文中可用
            // let major = this.major;
            console.log(response.data.major);
            const data = {
              major: response.data.major,
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
                  get('/web/getAllStuScore', data)
                      .then(res1 => {
                        console.log('Login successful:', res1.data);
                        //this.pageTotal = res.data.length; // 假设后端返回总条数
                        this.tableData = res1.data; // 假设后端返回当前页的数据
                      })
                      .catch(error => {
                        console.error('Login failed:', error);
                      });
                })
                .catch(error => {
                  console.error('Login failed:', error);
                });

          })
          .catch(error => {
            console.error(error);
          });



    },
    filterData() {
      if (this.filterType === 'below60') {
        //this.filteredData = this.tableData.filter(item => item.score < 60);
        let manager = localStorage.getItem('ms_username');


        get('/web/getmanager', { manager })
            .then(response => {
              console.log(response.data);
              // this.major = response.data.major;
              // // 假设 this.major 是类的属性或者在当前上下文中可用
              // let major = this.major;
              console.log(response.data.major);
              const data = {
                major: response.data.major,
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
                    get('/web/getSomeStuScore', data)
                        .then(res1 => {
                          console.log('Login successful:', res1.data);
                          //this.pageTotal = res.data.length; // 假设后端返回总条数
                          this.tableData = res1.data; // 假设后端返回当前页的数据
                        })
                        .catch(error => {
                          console.error('Login failed:', error);
                        });
                  })
                  .catch(error => {
                    console.error('Login failed:', error);
                  });

            })
            .catch(error => {
              console.error(error);
            });

      } else {
        this.getData();
        //this.filteredData = this.tableData;
      }
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
.red-text {
  color: red;
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
