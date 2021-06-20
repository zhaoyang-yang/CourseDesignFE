<template>
  <headbar />
  <sidebar v-on:changetab="changetabs" name1="实验室管理" name2="教师管理" />

  <div v-show="CHOSE" class="view" style="width: 70%">
    <p>实验室管理</p>
    <el-button type="primary csbt" @click="dialogVisible = true"
      >添加实验室</el-button
    >
    <el-table
      :data="
        tablelab
          .filter((data) => !search || data.labid == search)
          .slice((currentPage - 1) * 8, currentPage * 8)
      "
      style="width: 80%"
      :default-sort="{ prop: 'labid', order: 'ascending' }"
    >
      <el-table-column prop="labid" label="实验室编号" width="180" sortable>
      </el-table-column>
      <el-table-column prop="macnumber" label="机器数量" width="180" sortable>
      </el-table-column>
      <el-table-column width="240" align="right">
        <template #header>
          <el-input v-model="search" size="mini" placeholder="搜索实验室" />
        </template>
        <button class="button" @click="dellab($event)">删除</button>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="prev, pager, next, jumper"
      :total="currentTotal"
      page-size="8"
      @current-change="handleCurrentChange"
    >
    </el-pagination>

    <el-dialog title="提示" v-model="dialogVisible" width="45%">
      <p>创建实验室</p>
      <el-input
        style="width: 60%"
        v-model="lab.labid"
        placeholder="请输入实验室编号"
      ></el-input>

      <el-input
        style="width: 60%"
        v-model="lab.macnumber"
        placeholder="请输入机器数量"
      ></el-input>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addlab(), (dialogVisible = false)"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>

  <div v-show="SELECT" class="view">
    <p>教师管理</p>
    <el-button
      type="primary csbt"
      @click="dialogVisible2 = true"
      style="margin-left: 80%"
      >添加教师</el-button
    >
    <el-table
      :data="
        tableteacher
          .filter(
            (data) =>
              !search || data.name.toLowerCase().includes(search.toLowerCase())
          )
          .slice((currentPage2 - 1) * 8, currentPage2 * 8)
      "
      style="width: 100%"
    >
      <el-table-column prop="id" label="教师id" width="180"> </el-table-column>
      <el-table-column prop="name" label="教师姓名" width="180">
      </el-table-column>
      <el-table-column prop="type" label="教师状态" width="180">
      </el-table-column>
      <el-table-column align="right" width="240">
        <template #header>
          <el-input v-model="search" size="mini" placeholder="输入姓名搜索" />
        </template>
        <button class="button" @click="delteacher">删除</button>
        <button
          class="button button2"
          @click="getelement($event), (dialogVisible3 = true)"
        >
          冻结/解冻
        </button>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="prev, pager, next, jumper"
      :total="currentTotal2"
      page-size="8"
      @current-change="handleCurrentChange2"
    >
    </el-pagination>

    <el-dialog title="提示" width="45%" v-model="dialogVisible2">
      <p>添加教师</p>
      <el-input
        style="width: 60%"
        v-model="teacher.id"
        placeholder="请输入账号"
      ></el-input>
      <el-input
        style="width: 60%"
        v-model="teacher.name"
        placeholder="请输入教师名字"
      ></el-input>
      <el-input
        style="width: 60%"
        v-model="teacher.password"
        placeholder="请输入密码"
      ></el-input>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible2 = false">取 消</el-button>
          <el-button
            type="primary"
            @click="addteacher(), (dialogVisible2 = false)"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
    <el-dialog title="提示" width="45%" v-model="dialogVisible3">
      <p>{{ msg }}</p>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible3 = false">取 消</el-button>
          <el-button type="primary" @click="frozen(), (dialogVisible3 = false)"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import "@/static/css/header-bar.css";
import { State } from "@/store";
import { defineComponent } from "vue";
import { Store, useStore } from "vuex";
import axios from "axios";
import { ElMessageBox, ElMessage } from "element-plus";
import headbar from "./head_side/header-bar.vue";
import sidebar from "./head_side/side-bar.vue";

export default defineComponent({
  components: {
    headbar,
    sidebar,
  },

  data() {
    return {
      currentTotal: 0,
      currentPage: 1,
      currentTotal2: 0,
      currentPage2: 1,
      CHOSE: true,
      SELECT: false,
      dialogVisible: false,
      dialogVisible2: false,
      dialogVisible3: false,
      tablelab: [{ labid: -1, macnumber: -1 }],
      lab: { labid: undefined, macnumber: undefined },
      tableteacher: [{ id: undefined, name: "", type: undefined }],
      teacher: { id: undefined, name: "", password: "", type: 1 },
      element: "",
      msg: "",
      search: "",
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
    getlabs() {
      const tabledata = this.$data.tablelab;
      const data = this.$data;
      tabledata.pop();
      axios
        .get("http://localhost:8081/admin/getlabs")
        .then(function (res) {
          const resdata = res.data.data;
          console.log(res);
          for (let i = 0; i < resdata.length; i++) tabledata.push(resdata[i]);
          data.currentTotal = resdata.length;
        })
        .catch(function () {
          ElMessage("加载实验室失败");
        });
    },

    addlab() {
      const laboratory = this.$data.lab;
      const tabledata = this.$data.tablelab;
      const data = this.$data;
      console.log(laboratory);
      axios
        .post(
          "http://localhost:8081/admin/addlab",
          { labid: laboratory.labid, macnumber: laboratory.macnumber },
          {
            headers: { authorization: this.store.state.token },
          }
        )
        .then(function (res) {
          const resdata = res.data.data;
          // console.log(res);
          tabledata.splice(0);
          for (let i = 0; i < resdata.length; i++) tabledata.push(resdata[i]);
          data.currentTotal = resdata.length;
        })
        .catch(function () {
          ElMessage("添加实验室失败");
        });
    },

    dellab: function (el: any) {
      const elemt = el.path[3].innerText;
      console.log(el.path);
      // console.log(elemt.split("\n"));
      const data = this.$data;
      const tabledata = this.$data.tablelab;
      axios
        .get("http://localhost:8081/admin/dellab", {
          params: { labid: Number(elemt.split("\n")[0]) },
          headers: { authorization: this.store.state.token },
        })
        .then(function (res) {
          const resdata = res.data.data;
          tabledata.splice(0);
          for (let i = 0; i < resdata.length; i++) tabledata.push(resdata[i]);
          data.currentTotal = resdata.length;
        })
        .catch(function () {
          ElMessage("删除实验室出错");
        });
    },

    getteachers: function () {
      const data = this.$data;
      const teachers = data.tableteacher;
      teachers.pop();
      axios
        .get("http://localhost:8081/admin/getteachers")
        .then(function (res) {
          const resdata = res.data.data;
          console.log(res);
          for (let i = 0; i < resdata.length; i++) teachers.push(resdata[i]);
        })
        .catch(function () {
          ElMessage("获取教师信息出错");
        });
    },

    addteacher: function () {
      const data = this.$data;
      const tabledata = data.tableteacher;
      const teacher = data.teacher;
      axios
        .post("http://localhost:8081/admin/addteacher", teacher, {
          headers: { authorization: this.store.state.token },
        })
        .then(function (res) {
          const resdata = res.data.data;
          console.log(res);
          tabledata.splice(0);
          for (let i = 0; i < resdata.length; i++) tabledata.push(resdata[i]);
          // data.currentTotal = resdata.length;
        })
        .catch(function () {
          ElMessage("添加教师失败,请检查教师信息是否重复");
        });
    },

    delteacher: function (el: any) {
      const elemt = el.path[3].innerText;
      // console.log(el.path);
      console.log(elemt.split("\n"));
      const data = this.$data;
      const tabledata = data.tableteacher;
      axios
        .get("http://localhost:8081/admin/delteacher", {
          params: { id: elemt.split("\n")[0] },
          headers: { authorization: this.store.state.token },
        })
        .then(function (res) {
          const resdata = res.data.data;
          // console.log(res);
          tabledata.splice(0);
          for (let i = 0; i < resdata.length; i++) tabledata.push(resdata[i]);
        })
        .catch(function () {
          ElMessage("删除失败");
        });
    },

    frozen: function () {
      const elemt = this.$data.element.split("\n");
      console.log(elemt);
      const data = this.$data;
      const tabledata = data.tableteacher;
      if (elemt[4] == "1") elemt[4] = "-1";
      else elemt[4] = "1";
      axios
        .post(
          "http://localhost:8081/admin/updatateacher",
          { id: Number(elemt[0]), type: Number(elemt[4]) },
          { headers: { authorization: this.store.state.token } }
        )
        .then(function (res) {
          const resdata = res.data.data;
          // console.log(res);
          tabledata.splice(0);
          for (let i = 0; i < resdata.length; i++) tabledata.push(resdata[i]);
        })
        .catch(function () {
          ElMessage("冻结失败");
        });
    },

    getelement: function (el: any) {
      this.$data.element = el.path[3].innerText;
      console.log(el.path[3].innerText.split("\n"));

      if (el.path[3].innerText.split("\n")[4] == "1")
        this.$data.msg = "确定要冻结教师吗啊？";
      else this.$data.msg = "是否要解冻结教师？";
    },

    changetabs: function (val: any) {
      if (val == "chosetab") {
        this.$data.CHOSE = true;
        this.$data.SELECT = false;
      } else {
        this.$data.CHOSE = false;
        this.$data.SELECT = true;
      }
    },
    handleCurrentChange(val: any) {
      this.currentPage = val;
    },
    handleCurrentChange2(val: any) {
      this.currentPage2 = val;
    },
  },
  watch: {
    // tablelab: function (newval) {
    //   this.currentTotal = newval.length;
    // },
    "tableteacher.length": {
      handler: function (newval) {
        this.currentTotal2 = newval;
      },
    },
  },
  mounted() {
    this.getlabs();
    this.getteachers();
  },
});
</script>

<style scoped>
.csbt {
  position: relative;
  margin: 5vh 0 5vh 50%;
}
.view {
  display: inline-block;
  vertical-align: top;
  margin-left: 5vw;
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
.button2 {
  background-color: white;
  color: black;
  border: 2px solid #008cba;
  margin: 0 10px;
}

.button:hover {
  background-color: #f44336;
  color: white;
}
.button2:hover {
  background-color: #008cba;
  color: white;
}
</style>
