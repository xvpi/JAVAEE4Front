<template>
    <div>
        <el-row class="chat-header">
            <el-col :span="24">
                <h2>与 {{ studentId }} 的聊天记录</h2>
            </el-col>
        </el-row>
        <el-row class="chat-messages">
            <el-col :span="24">
                <el-card v-for="message in chatMessages" :key="message.id">
                    <i :class="message.status === 'student' ? 'el-icon-user' : 'el-icon-s-custom'" class="avatar"></i>
                    <p v-if="message.status === 'student'" class='student-message'>{{ message.question }}</p>
                    <p v-if="message.status === 'teacher'" class='teacher-message'>{{ message.answer}}</p>
                </el-card>
            </el-col>
        </el-row>
        <el-row class="chat-input">
            <el-col :span="24">
                <el-form ref="answerForm" :model="answerForm" label-width="80px">
                    <el-form-item label="回复消息">
                        <el-input v-model="answerForm.answerContent"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="sendAnswer">发送</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import axios from 'axios';
    import { fetch_student, update_student_info, add_student } from '../../api/index';
    import { get } from '@/utils/request';
    import Axios from 'axios';

    export default {
        name: 'ChatWindow',
        props: {
            studentId: String
        },
        data() {
            return {
                chatMessages: [], // 存放与当前学生的聊天记录
                answerForm: {
                    answerContent: ''
                },
                studentAvatar: '../../assets/img/student.png', // 学生头像路径
                teacherAvatar: '../../assets/img/teacher.png' // 管理员头像路径
            };
        },
        watch: {
            // 监听学生ID变化，重新获取聊天记录
            studentId(newStudentId) {
                this.fetchChatMessages();
            }
        },
        created() {
            this.fetchChatMessages(); // 获取初始聊天记录
        },
        methods: {

            fetchChatMessages() {
                // 假设后端接口根据学生ID获取聊天记录
                get(`/auth/getqa?studentid=${this.studentId}`)
                    .then(response => {
                        console.info('当前历史聊天记录', response.data);
                        this.chatMessages = response.data; // 假设后端返回聊天记录数组
                    })
                    .catch(error => {
                        console.error('Error fetching chat messages:', error);
                    });
            },
            sendAnswer() {
                get('/web/answer', {
                    studentid: this.studentId,
                    answer: this.answerForm.answerContent
                })
                    .then(response => {
                        // 发送成功后更新聊天记录,用重新获取代替更新，因为数据库与ChatMessages属性不完全一致

                        this.fetchChatMessages();
                        // this.chatMessages.push({
                        //     id: response.data.id,
                        //     answer: this.answerForm.answerContent,
                        //     status: 'teacher' // 假设后端返回的状态
                        // });
                        // 清空编辑框
                        this.answerForm.answerContent = '';
                    })
                    .catch(error => {
                        console.error('Error sending answer:', error);
                    });
            }

        }
    };
</script>

<style scoped>
    .chat-header {
        padding: 10px;
        background-color: #f0f0f0;
        border-bottom: 1px solid #ccc;
    }

    .chat-messages {
        max-height: 400px;
        overflow-y: auto;
        padding: 10px;
    }

    .student-message {
        text-align: left;
        display: flex;
        background-color: #f0f0f0;
        color: #000000;
        padding: 8px;
        border-radius: 10px;
        margin-bottom: 10px;
    }

    .teacher-message {
        text-align: right;
        display: flex;
        background-color: #3399ff;
        color: #ffffff;
        padding: 8px;
        border-radius: 10px;
        margin-bottom: 10px;
    }

    .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin: 0 10px;
    }

    .chat-input {
        padding: 10px;
    }
</style>
