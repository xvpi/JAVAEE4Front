<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 学生基本信息表 </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="query.name" placeholder="学生姓名" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh-left" @click="Refresh">刷新</el-button>
      </div>
      <el-table
          :data="tableData "
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
        <el-table-column prop="province" label="地址"></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
        <el-table-column prop="dormitory" label="宿舍"></el-table-column>

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
                    get('/web/getStuAccount', data)
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
    Refresh() {
      this.query.name = '';
      this.getData();
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
