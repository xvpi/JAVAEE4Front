<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-s-claim"></i> 公告管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <h2 class="announcement-title">公告管理</h2>
            <p class="announcement-description">
                此处公告将会在用户端APP的首页以滚动通知的方式呈现，您可以在下方对公告进行编辑，也可以查看历史公告。
            </p>

            <div class="announcement-container">
                <h3>公告内容</h3>
                <el-form :model="form">
                    <!-- 其他公告编辑表单项 -->

                <div class="announcement-box" :contenteditable="isEditing" ref="announcementBox"  v-model="form.announcement">
                    {{ form.announcement }}
                </div>

                    <el-form-item label="撤回时间" >
                        <el-date-picker
                                v-model="form.expiretime"
                                type="datetime"
                                :disabled="!isEditing"
                                placeholder="选择撤回时间"
                        >
                        </el-date-picker>
                    </el-form-item>
<!--                    <el-form-item>-->
<!--                        <el-button type="primary" @click="submitAnnouncement">发布公告</el-button>-->
<!--                    </el-form-item>-->
                </el-form>



                <div class="buttons">
                    <button @click="enableEditing" :disabled="isEditing">编辑</button>
                    <button @click="confirmEdit" :disabled="!isEditing">确认</button>
                    <button @click="cancelEdit" :disabled="!isEditing">取消</button>
                </div>
                <div class="h-buttons">
                <router-link to="/HistoryNotice" class="history-button">查看历史公告</router-link>
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
                form: {
                    announcement: '',
                    expiretime:''
                },
                announcement: '',
                originalAnnouncement: '',
                isEditing: false
            };
        },
        created() {
            this.fetchAnnouncement()
        },
        methods: {
            // handleInput(event) {
            //     // 处理div内容编辑时的输入事件
            //     this.form.announcement = event.target.textContent;
            // },
            fetchAnnouncement() {
                get('/web/hannouncement')
                    .then(response => {
                        console.info('当前公告内容', response.data.result);
                        this.form.announcement = response.data.result;
                        this.announcement = response.data.result;
                        this.originalAnnouncement = response.data.result;
                    })
                    .catch(error => {
                        console.error('Error fetching announcement:', error);
                    });

            },
            enableEditing() {
                this.isEditing = true;
            },
            // submitAnnouncement() {
            //     this.announcement = this.form.announcement;
            //     if (!this.form.announcement || !this.form.expiretime) {
            //         this.$message.error('请填写公告内容和选择撤回时间');
            //         return;
            //     }
            //     if (this.form.expiretime) {
            //         const now = new Date();
            //         const expiretime = new Date(this.form.expiretime);
            //         const timeDifference = expiretime - now;
            //         if (timeDifference > 0) {
            //             setTimeout(() => {
            //                 this.announcement = '';
            //             }, timeDifference);
            //         } else {
            //             this.$message.error('撤回时间必须晚于当前时间');
            //         }
            //     }
            // },

            confirmEdit() {
                this.announcement = this.form.announcement;
                console.info('公告内容',this.announcement);
                console.info('公告内容',this.form.announcement);
                console.info('撤回时间',this.form.expiretime);

                if (!this.form.expiretime) {
                    this.$message.error('请填写选择撤回时间');
                    return;
                }
                if (this.form.expiretime) {
                    const now = new Date();
                    const expiretime = new Date(this.form.expiretime);
                    const timeDifference = expiretime - now;
                    if (timeDifference > 0) {
                        setTimeout(() => {
                            this.announcement = '';
                        }, timeDifference);
                    } else {
                        this.$message.error('撤回时间必须晚于当前时间');
                    }
                }
                const newAnnouncement = this.$refs.announcementBox.innerText;
                this.announcement = this.form.announcement;
                console.info('新修改信息', newAnnouncement);

                get('/web/sannouncement', { announcement: newAnnouncement ,expiretime: this.form.expiretime})
                    .then(response => {
                        console.log('Edit successful:', response.data);
                        this.form.announcement = newAnnouncement;
                        this.announcement = newAnnouncement;
                        this.originalAnnouncement = newAnnouncement;
                        this.isEditing = false;
                    })
                    .catch(error => {
                        console.error('Error updating announcement:', error);
                    });
            },
            cancelEdit() {
                this.announcement = this.originalAnnouncement;
                this.$refs.announcementBox.innerText = this.originalAnnouncement;
                this.isEditing = false;
            }
        },
        mounted() {
            this.fetchAnnouncement();
        }
    };
</script>

<style scoped>
    .container {
        margin-top: 20px;
    }

    .announcement-container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    .announcement-title {
        font-size: 24px;
        text-align: center;
        margin: 15px;
    }

    .announcement-description {
        font-size: 16px;
        margin-bottom: 20px;
        text-align: center;
    }

    .announcement-box {
        width: 96%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        margin-top: 20px;
        margin-bottom: 20px;
        min-height: 100px;
        background-color: #f9f9f9;
        cursor: text;
        overflow: auto;
    }

    .buttons {
        text-align: right;
    }

    button {
        margin-left: 10px;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        background-color: #007bff;
        color: white;
        font-size: 16px;
    }

    button[disabled] {
        background-color: #ccc;
        cursor: not-allowed;
    }

    .history-button {
        display: inline-block;
        margin-top: 10px;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        background-color: #28a745;
        color: white;
        text-align: center;
        text-decoration: none;
        font-size: 16px;
    }
    .h-buttons {
        text-align: center;
    }

    .history-button:hover {
        background-color: #218838;
    }
</style>
