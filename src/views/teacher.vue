<template>
  <headbar />
  <sidebar
    v-on:changetab="changetabs"
    name1="实验室预约系统"
    name2="课程信息查看"
  />

  <div v-show="CHOSE" class="view" style="width: 80%">
    <el-button type="primary csbt" @click="dialogVisible = true"
      >预约实验室</el-button
    >

    <el-table
      :data="
        tableData
          .filter(
            (data) =>
              !search ||
              data.course.toLowerCase().includes(search.toLowerCase())
          )
          .slice((currentPage1 - 1) * 8, currentPage1 * 8)
      "
      style="width: 100%"
    >
      <el-table-column prop="username" label="用户名" width="180">
      </el-table-column>
      <el-table-column prop="labid" label="实验室" width="180">
      </el-table-column>
      <el-table-column prop="course" label="课程"> </el-table-column>
      <el-table-column prop="week" label="周" width="180"> </el-table-column>
      <el-table-column prop="day" label="星期"> </el-table-column>
      <el-table-column prop="time" label="课时"> </el-table-column>
      <el-table-column>
        <template #header>
          <el-input v-model="search" size="mini" placeholder="输入课程名搜索" />
        </template>
        <button type="danger" class="button" @click="dellab">删除</button>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next, jumper"
      :total="currentTotal1"
      page-size="8"
      @current-change="handleCurrentChange"
    >
    </el-pagination>

    <el-dialog
      title="提示"
      v-model="dialogVisible"
      width="45%"
      :before-close="handleClose"
    >
      <p>请选择实验室</p>
      <el-select v-model="choselabid" placeholder="实验室">
        <el-option
          v-for="index in labs"
          :key="index"
          :label="index"
          :value="index"
        >
        </el-option>
      </el-select>

      <el-select v-model="chosecourse" placeholder="课程">
        <el-option
          v-for="index in courses"
          :key="index"
          :label="index"
          :value="index"
        >
        </el-option>
      </el-select>

      <p>请选择日期</p>
      <el-select v-model="Data.week" placeholder="周">
        <el-option
          v-for="index in Week"
          :key="index"
          :label="index"
          :value="index"
        >
        </el-option>
      </el-select>

      <el-select v-model="Data.day" placeholder="星期">
        <el-option
          v-for="index in Day"
          :key="index"
          :label="index"
          :value="index"
        >
        </el-option>
      </el-select>

      <el-select v-model="Data.time" placeholder="课时">
        <el-option
          v-for="index in time"
          :key="index"
          :label="index"
          :value="index"
        >
        </el-option>
      </el-select>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="choselab(), (dialogVisible = false)"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
  <div v-show="SELECT" class="view"><weektable /></div>
</template>

<script lang="ts">
import "@/static/css/header-bar.css";
import { State } from "@/store";
import { defineComponent, ref } from "vue";
import { Store, useStore } from "vuex";
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
import headbar from "./head_side/header-bar.vue";
import sidebar from "./head_side/side-bar.vue";
import weektable from "./compents/weektable.vue";

export default defineComponent({
  components: {
    headbar,
    sidebar,
    weektable,
  },

  data() {
    return {
      search: "",
      currentTotal1: 0,
      currentPage1: 1,
      CHOSE: true,
      SELECT: false,
      dialogVisible: false,
      tableData: [{ labid: -1, week: -1, day: "", time: -1, course: "" }],
      Datas: [{}],
      Data: { day: "", week: undefined, time: undefined },
      Week: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
      Day: [
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
        "星期日",
      ],
      time: [1, 2, 3, 4, 5],
      labs: [1],
      courses: [""],
      choselabid: undefined,
      chosecourse: "",
    };
  },

  setup() {
    const store: Store<State> = useStore();
    const user = store.state.user;
    return {
      store,
      user,
    };
  },

  methods: {
    getlab() {
      const tabledata = this.$data.tableData;
      const data = this.$data;
      tabledata.pop();
      axios
        .get("http://localhost:8081/user/getuserlabs", {
          headers: { Authorization: this.store.state.token },
          params: { userid: this.user.id },
        })
        .then(function (res) {
          for (let i = 0; i < res.data.data.length; i++)
            tabledata.push(res.data.data[i]);
          tabledata.sort(function (a, b) {
            return a.week - b.week;
          });
          data.currentTotal1 = tabledata.length;
        })
        .catch(function () {
          ElMessage("获取实验室失败");
        });
    },
    getcourses() {
      const courses = this.$data.courses;
      courses.pop();
      axios
        .get("http://localhost:8081/user/getcourse")
        .then(function (res) {
          const data = res.data.data;
          for (let i = 0; i < data.length; i++) courses.push(data[i]);
        })
        .catch(function () {
          ElMessage("获取课程信息失败");
        });
    },
    getlabs() {
      const labs = this.$data.labs;
      labs.pop();
      axios
        .get("http://localhost:8081/user/getlabs")
        .then(function (res) {
          const _data = res.data.data;
          console.log(_data);
          for (let i = 0; i < _data.length; i++) labs.push(_data[i]);
        })
        .catch(function () {
          ElMessage("获取实验室失败");
        });
    },

    choselab() {
      const data = this.$data.Data;
      const labid = this.$data.choselabid;
      const coursename = this.$data.chosecourse;
      const tabledata = this.$data.tableData;
      console.log({ labid: labid, data });

      axios
        .post(
          "http://localhost:8081/user/choselab",
          {
            labid: labid,
            dates: data,
            course: coursename,
          },
          { headers: { authorization: this.store.state.token } }
        )
        .then(function (res) {
          tabledata.push(res.data.data[res.data.data.length - 1]);
          tabledata.sort(function (a, b) {
            return a.week - b.week;
          });
        })
        .catch(function (res) {
          ElMessage("选课失败");
          console.log(res);
        });
      this.$data.Data = { day: "", week: undefined, time: undefined };
    },

    dellab(el: any) {
      const tabledata = this.$data.tableData;
      const obj = el.path[3].childNodes;
      console.log(obj);
      axios
        .post(
          "http://localhost:8081/user/cancelpre",
          {
            labid: obj[1].innerText,
            course: obj[2].innerText,
            week: obj[3].innerText,
            day: obj[4].innerText,
            time: obj[5].innerText,
          },
          { headers: { authorization: this.store.state.token } }
        )
        .then(function (res) {
          if (res.data.code != 200) return;
          console.log(res);
          tabledata.splice(0);
          for (let i = 0; i < res.data.data.length; i++)
            tabledata.push(res.data.data[i]);
        })
        .catch(function () {
          ElMessage("删除失败");
        });
    },

    handleCurrentChange(val: any) {
      this.currentPage1 = val;
    },

    // handleClose(done: any) {
    //   ElMessageBox.confirm("确认关闭？")
    //     .then((_) => {
    //       done();
    //     })
    //     .catch((_) => {
    //       // catch
    //     });
    // },

    changetabs: function (val: any) {
      if (val == "chosetab") {
        this.$data.CHOSE = true;
        this.$data.SELECT = false;
      } else {
        this.$data.CHOSE = false;
        this.$data.SELECT = true;
      }
    },
  },
  mounted() {
    this.getlab();
    this.getlabs();
    this.getcourses();
  },

  watch: {
    tableData: function (newval) {
      this.currentTotal1 = newval.length;
      console.log(this.currentTotal1);
    },
  },
});
</script>

<style scoped>
.csbt {
  position: relative;
  left: 25vw;
  margin: 5vh 25%;
}
.view {
  display: inline-block;
  vertical-align: top;
  width: 80%;
}
.button {
  border: none;
  padding: 7px 16px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 8px;
  transition-duration: 0.4s;
  cursor: pointer;
  background-color: white;
  color: black;
  border: 2px solid #f44336;
}

.button:hover {
  background-color: #f44336;
  color: white;
}
</style>
