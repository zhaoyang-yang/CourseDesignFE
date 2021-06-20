<template>
  <el-select v-model="weekval" placeholder="请选择第几周">
    <el-option
      v-for="index in options"
      :key="index"
      :label="index"
      :value="index"
    >
    </el-option>
  </el-select>

  <div class="class-table">
    <div class="table-wrapper">
      <div class="tabel-container">
        <table>
          <thead>
            <tr>
              <th>时间</th>
              <th
                v-for="(weekNum, weekIndex) in classTableData.courses.length"
                :key="weekIndex"
              >
                {{ "周" + digital2Chinese(weekIndex, "week") }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(lesson, lessonIndex) in classTableData.lessons"
              :key="lessonIndex"
            >
              <td>
                <p>{{ "第" + digital2Chinese(lessonIndex + 1) + "节" }}</p>
                <p class="period">{{ lesson }}</p>
              </td>

              <td
                v-for="(course, courseIndex) in classTableData.courses"
                :key="courseIndex"
              >
                <el-scrollbar>
                  {{ classTableData.courses[courseIndex][lessonIndex] || "-" }}
                </el-scrollbar>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { State } from "@/store";
import axios from "axios";
import { defineComponent } from "vue";
import { Store, useStore } from "vuex";

export default defineComponent({
  data() {
    return {
      classTableData: {
        lessons: [
          "08:00-09:30",
          "10:00-11:30",
          "14:00-15:30",
          "15:50-17:10",
          "18:30-20:00",
        ],
        courses: [
          ["", "", "", "", ""],
          ["", "", "", "", ""],
          ["", "", "", "", ""],
          ["", "", "", "", ""],
          ["", "", "", "", ""],
          ["", "", "", "", ""],
          ["", "", "", "", ""],
        ],
      },
      options: [
        "全部",
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
      ],
      weekval: undefined,
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
  created() {
    // /* mock随机数据*/
    // Mock.mock({
    //     lessons: ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00'],
    //     'courses|7': [['生物', '物理', '化学', '政治', '历史', '英语', '', '语文']]
    // });
  },
  methods: {
    /**
     * 数字转中文
     * @param {Number} num 需要转换的数字
     * @param {String} identifier 标识符
     * @returns {String} 转换后的中文
     */
    digital2Chinese(num: any, identifier: any) {
      const character = [
        "零",
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "七",
        "八",
        "九",
        "十",
        "十一",
        "十二",
      ];
      return identifier === "week" && (num === 0 || num === 7)
        ? "日"
        : character[num];
    },

    weektonum(week: any) {
      switch (week) {
        case "星期一":
          return 1;
        case "星期二":
          return 2;
        case "星期三":
          return 3;
        case "星期四":
          return 4;
        case "星期五":
          return 5;
        case "星期六":
          return 6;
        case "星期日":
          return 0;
      }
      return -1;
    },
  },
  watch: {
    weekval: function (newval) {
      const courses = this.$data.classTableData.courses;
      for (let i = 0; i < 7; i++)
        for (let j = 0; j < 5; j++) courses[i][j] = "";
      const weektonum = this.weektonum;
      if (newval == "全部") {
        //获取所有课程信息
        axios
          .get("http://localhost:8081/user/getuserlabs", {
            headers: { authorization: this.store.state.token },
            params: { userid: this.user.id },
          })
          .then(function (res) {
            const data = res.data.data;
            for (let i = 0; i < data.length; i++) {
              data.sort(function (a: any, b: any) {
                return a.week - b.week;
              });
              courses[weektonum(data[i].day)][data[i].time - 1] =
                courses[weektonum(data[i].day)][data[i].time - 1] +
                "实验室" +
                data[i].labid +
                "  " +
                data[i].course +
                "  第" +
                data[i].week +
                "周" +
                "\n";
            }
          });
      } else {
        //根据周获取课程
        axios
          .get("http://localhost:8081/user/weeklab", {
            headers: { authorization: this.store.state.token },
            params: { week: this.weekval },
          })
          .then(function (res) {
            const data = res.data.data;
            for (let i = 0; i < data.length; i++) {
              data.sort(function (a: any, b: any) {
                return a.week - b.week;
              });
              courses[weektonum(data[i].day)][data[i].time - 1] =
                courses[weektonum(data[i].day)][data[i].time - 1] +
                "实验室" +
                data[i].labid +
                "  " +
                data[i].course +
                "\n";
            }
          });
      }
    },
  },
  mounted() {
    const courses = this.$data.classTableData.courses;
    const weektonum = this.weektonum;
    axios
      .get("http://localhost:8081/user/getuserlabs", {
        headers: { authorization: this.store.state.token },
        params: { userid: this.user.id },
      })
      .then(function (res) {
        const data = res.data.data;
        for (let i = 0; i < data.length; i++) {
          data.sort(function (a: any, b: any) {
            return a.week - b.week;
          });
          courses[weektonum(data[i].day)][data[i].time - 1] =
            courses[weektonum(data[i].day)][data[i].time - 1] +
            "实验室" +
            data[i].labid +
            " " +
            data[i].course +
            " 第" +
            data[i].week +
            "周" +
            "\n";
        }
      });
  },
});
</script>

<style lang="scss" scoped>
.class-table {
  .table-wrapper {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
  .tabel-container {
    margin: 7px;

    table {
      table-layout: fixed;
      width: 100%;

      thead {
        background-color: #67a1ff;
        th {
          color: #fff;
          line-height: 17px;
          font-weight: normal;
        }
      }
      tbody {
        background-color: #eaf2ff;
        td {
          color: #677998;
          line-height: 12px;
        }
      }
      th,
      td {
        width: 60px;
        padding: 12px 2px;
        font-size: 12px;
        text-align: center;
      }

      tr td:first-child {
        color: #333;
        .period {
          font-size: 8px;
        }
      }
    }
  }
}
</style>
