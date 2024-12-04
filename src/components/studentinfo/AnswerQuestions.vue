<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-s-promotion"></i> 问题解答</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <h2>学生消息列表</h2>
            <el-row>
                <el-col :span="24">
                    <div class="message-cards">
                        <el-card v-for="message in uniqueMessages" :key="message.studentid"
                                 @click="openChat(message.studentid)">
                            <p>学生ID: {{ message.studentid }}</p>
                            <p v-if="message.answer==='1'">最近消息: {{ message.question }}</p>
                            <p v-if="message.question==='1'">最近消息: {{ message.answer }}</p>
                            <el-button type="primary" @click="openChat(message.studentid)">打开对话</el-button>
                        </el-card>
                    </div>
                </el-col>
            </el-row>
            <el-dialog title="消息对话框" :visible.sync="dialogVisible" width="80%">
                <chat-window :student-id="currentStudentId"/>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import ChatWindow from './ChatWindow.vue';
    import { fetch_student, update_student_info, add_student } from '../../api/index';
    import { get } from '@/utils/request';
    import Axios from 'axios';

    export default {
        name: 'MessageList',
        components: {
            ChatWindow
        },
        data() {
            return {
                messages: [], // 存放所有学生的最新消息数据
                dialogVisible: false,
                currentStudentId: '',
                currentStudentName: ''
            };
        },
        computed: {
            uniqueMessages() {
                const map = new Map();
                this.messages.forEach(message => {
                    if (!map.has(message.studentid) || map.get(message.studentid).id < message.id) {
                        map.set(message.studentid, message);
                    }
                });
                return Array.from(map.values());
            }
        },
        created() {
            this.fetchMessages(); // 获取初始消息列表
        },
        methods: {
            fetchMessages() {
                get('/web/getquestions')
                    .then(response => {
                        console.info('获取消息列表', response.data);
                        this.messages = response.data; // 假设后端返回学生消息数据数组
                    })
                    .catch(error => {
                        console.error('Error fetching messages:', error);
                    });
            },
            openChat(studentId) {
                this.currentStudentId = studentId;
                this.dialogVisible = true;
                // 可以在这里触发获取更多聊天记录的接口
            }
        }
    };
</script>

<style>
    /* 样式可以根据实际需求进一步定义 */
    .container {
        margin-top: 20px;
    }

    .message-list {
        padding: 20px;
    }

    .message-cards {
        margin-top: 20px;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 20px;
    }

    .message-cards .el-card {
        cursor: pointer;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: box-shadow 0.3s ease;
        position: relative;
    }

    .message-cards .open-chat-button {
        position: absolute;
        top: 10px;
        right: 10px;
    }

    .message-cards .el-card:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
</style>
