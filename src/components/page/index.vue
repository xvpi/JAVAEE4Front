<template>
    <div class="home">
        <div class="container">
            <h2>欢迎进入新生管理系统！</h2>
            <p>您可以操作左侧选项卡，选择相应的功能进行使用。</p>
        </div>
    </div>
</template>

<script>
    import { fetch_student, update_student_info ,add_student} from '../../api/index';
    import { get } from '@/utils/request';
    import Axios from 'axios';
    export default {
        data() {
            return {

            };
        },
        methods: {
        }
    };
</script>

<style scoped>
    .container {
        margin-top: 50px;
        text-align: center;
    }
    .container h1 {
        font-size: 24px;
        margin-bottom: 20px;
    }
    .container p {
        font-size: 18px;
        margin-top: 50px;
    }
</style>
