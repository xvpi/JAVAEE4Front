<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-s-claim"></i> 历史公告</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="history-container">
            <h2 class="history-title">历史公告</h2>
            <p class="total-notices">共 {{ notices.length }} 条历史公告</p>
            <div class="notices-list">
                <div v-for="(notice, index) in notices" :key="notice.id" class="notice-card">
                    <div class="notice-content">
                        {{ notice.notice }}
                    </div>
                    <div class="notice-number">
                        第 {{ notices.length - index }} 条公告
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
        data() {
            return {
                notices: []
            };
        },
        created() {
            this.fetchNotices();
        },
        methods: {
            fetchNotices() {
                get('/web/getallnotice')
                    .then(response => {
                        console.info('Success fetching notices:', response.data);
                        // Reverse the notices array to display in reverse chronological order
                        this.notices = response.data.reverse();
                    })
                    .catch(error => {
                        console.error('Error fetching notices:', error);
                    });
            }
        }
    };
</script>

<style scoped>
    .history-container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    .history-title {
        font-size: 24px;
        text-align: center;
        margin-bottom: 20px;
    }

    .total-notices {
        font-size: 16px;
        margin-bottom: 10px;
    }

    .notices-list {
        display: grid;
        grid-gap: 20px;
    }

    .notice-card {
        background-color: #f9f9f9;
        padding: 15px;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .notice-content {
        font-size: 16px;
        margin-bottom: 10px;
    }

    .notice-number {
        font-size: 14px;
        text-align: right;
        color: #666;
    }
</style>
