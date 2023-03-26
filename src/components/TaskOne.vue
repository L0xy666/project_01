<template>
  <div class="common-layout">
    <el-container class="box">
      <el-header style="margin-top: 20px;">
        <div class="title" style="font-size:25px;">时间片轮转调度算法模拟</div>
      </el-header>
      <el-container style=" width: 960px; margin-top: 0px; ">
        <!-- <el-aside width="200px" style="border: solid 1px red"></el-aside> -->
        <el-container>
          <el-main width="950px">
            <div class="choose">
              <el-form-item label="时间片" label-width="75px">
                <el-input-number v-model="size" />
              </el-form-item>
            </div>
            <div class="content">
              <el-table :data="tableData"
                style="font-size: 16px; border: solid 1px black ;width:500px ;min-height: 240px;">
                <el-table-column prop="name" label="进程号" width="80" />
                <el-table-column prop="aTime" label="到达时间" width="90" />
                <el-table-column prop="rTime" label="运行时间" width="90" />
                <el-table-column prop="Priority" label="优先级" width="90" />
                <el-table-column label="Operations" width="150">
                  <template #default="scope">
                    <el-button link type="success" size="small" @click.prevent="editRow(scope.$index)">
                      编辑
                    </el-button>
                    <el-button link type="danger" size="small" @click.prevent="deleteRow(scope.$index)">
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div id="main" style="width: 440px; height: 240px; display:block; "> </div>
            </div>
          </el-main>
          <el-footer style="height: 10px;"></el-footer>
          <div class="bottom">
            <el-button class="mt-4" type="primary" style="margin: 20px 20px 20px 20px;  width: 150px"
              @click="dialogFormVisible = true">添加一个进程</el-button>
            <el-button class="mt-4" type="success" style="margin: 20px 20px 20px 20px;  width: 150px"
              @click="startSimulation">开始模拟</el-button>
            <el-button class="mt-4" type="warning" style="margin: 20px 20px 20px 20px;   width: 150px"
              @click="getResult">查看结果</el-button>
          </div>
        </el-container>

      </el-container>
      <el-dialog v-model="dialogFormVisible" title="添加进程">
        <el-form :model="form">
          <el-form-item label="进程号" label-width="120px">
            <el-input v-model="form.name" autocomplete="off" />
          </el-form-item>
          <el-form-item label="到达时间" label-width="120px">
            <el-input-number v-model="form.aTime" />
          </el-form-item>
          <el-form-item label="运行时间" label-width="120px">
            <el-input-number v-model="form.rTime" />
          </el-form-item>
          <el-form-item label="优先级" label-width="120px">
            <el-input-number v-model="form.Priority" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="AddItem()">
              添加
            </el-button>
          </span>
        </template>
      </el-dialog>
      <el-dialog v-model="dialogEditDataVisible" title="编辑进程">
        <el-form :model="editData">
          <el-form-item label="进程号" label-width="120px">
            <el-input v-model="editData.name" autocomplete="off" />
          </el-form-item>
          <el-form-item label="到达时间" label-width="120px">
            <el-input-number v-model="editData.aTime" />
          </el-form-item>
          <el-form-item label="运行时间" label-width="120px">
            <el-input-number v-model="editData.rTime" />
          </el-form-item>
          <el-form-item label="优先级" label-width="120px">
            <el-input-number v-model="editData.Priority" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogEditDataVisible = false">取消</el-button>
            <el-button type="primary" @click="editSuccess()">
              完成
            </el-button>
          </span>
        </template>
      </el-dialog>
    </el-container>
    <el-dialog v-model="dialogResultVisible" title="模拟结果" style="width: 650px; ">
      <div>
        <span>各进程的开始执行时间和结束时间</span>
        <el-table :data="resultData" style="left:25%; border: solid 1px black ;width:300px;">
          <el-table-column prop="name" label="进程号" width="80" />
          <el-table-column prop="aTime" label="到达时间" width="100" />
          <el-table-column prop="leaveTime" label="结束时间" width="100" />
        </el-table>
      </div>
      <div style="margin-top: 50px;" v-for="(item, index) in waitList" :key="index">
        <div style="float: left;"><span style=" font-size: 18px; color: #5cb87a;">时刻{{
          item.time
        }}:</span><span>{{ item.info }}</span></div>
        <el-table :data="item.q" style=" border: solid 1px blueviolet ;width:600px" max-height="900">
          <el-table-column prop="name" label="进程号" width="80" />
          <el-table-column prop="aTime" label="到达时间" width="100" />
          <el-table-column prop="turnaroundTime" label="已运行时间" width="100" />
          <el-table-column prop="rTime" label="还需运行时间" width="120" />
          <el-table-column prop="Priority" label="当前优先级" width="120" />
          <el-table-column prop="state" label="状态" width="80" />
        </el-table>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogResultVisible = false">退出</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import PriorityQueue from "../utils/PriorityQueue"
import Process from "../utils/Process"
import * as echarts from 'echarts';  

export default {

  name: 'TaskOne',
  methods: {
    draw() {
     let chartDom = document.getElementById('main');
     let myChart = echarts.init(chartDom);
     let option;
      const name = []
      for (let i = 0; i < this.resultData.length; i++) {
        name.push(this.resultData[i].name)
      }
      const data = {}
      for (let i = 0; i < this.resultData.length; i++) {
        for (let j = 1; j < this.resultData[i].runningTime.length; j += 2) {
          data[this.resultData[i].runningTime[j]] = i
        }
      }
      const result = []
      for (let j = 0; j < this.resultData.length; j++) {
        const temp = []
        for (let i = 0; i < this.waitList.length; i++) {
          temp.push('-')
        }
        result.push(temp)
      }
      for (let i = 1; i < this.waitList.length; i++) {
        const index = data[this.waitList[i].time]
        result[index][i - 1] = this.waitList[i].time - this.waitList[i - 1].time
      }
      const y = []
      for (let i = 0; i < this.waitList.length - 1; i++) {
        y.push(this.waitList[i].time)
      }
      // const waitList = this.waitList
      const td = result.map(function (item, index) {
        return {
          name: name[index],
          type: 'bar',
          stack: 'Total',
          label: {
            show: true,
            position: 'top'
          },
          data: item
        }
      })
      const yAxis = {
        name: 'Placeholder',
        type: 'bar',
        stack: 'Total',
        silent: true,
        itemStyle: {
          borderColor: 'transparent',
          color: 'transparent'
        },
        emphasis: {
          itemStyle: {
            borderColor: 'transparent',
            color: 'transparent'
          }
        },
        data: y
      }
      td.unshift(yAxis)
      console.log(td)
      const waitList = this.waitList
      option = {
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function (params) {
            let tar;
            if (params[1] && params[1].value !== '-') {
              tar = params[1];
            } else {
              tar = params[2];
            }
            return tar && tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
          }
        },
        legend: {
          data: name
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: (function () {
            let list = [];
            for (let i = 1; i <= y.length; i++) {
              list.push(i+`:${waitList[i - 1].time}`)
            }
            return list;
          })()
        },
        yAxis: {
          type: 'value'
        },
        series: td
      };
      option && myChart.setOption(option);
    },
    deleteRow(index) {
      this.tableData.splice(index, 1)

    },
    AddItem() {
      this.tableData.push({
        name: this.form.name,
        aTime: this.form.aTime,
        rTime: this.form.rTime,
        Priority: this.form.Priority,
      })
      this.dialogFormVisible = false;
    },
    editRow(index) {
      this.editData = this.tableData[index]
      this.dialogEditDataVisible = true
    },
    editSuccess() {
      this.dialogEditDataVisible = false
      // this.tableData[this.editIndex]=this.editData
    },
    startSimulation() {
     let timeSlice = this.size;
     let arr1 = []
     let arr2 = []
    for (var i = 0; i < this.tableData.length; i++) {
       let process = new Process(this.tableData[i].name, this.tableData[i].aTime, this.tableData[i].rTime, this.tableData[i].Priority, timeSlice)
        arr2.push(process)
      }
     let p2 = new PriorityQueue(2, arr2)
     let t = 0;
     let p1 = new PriorityQueue(1, arr1)
     let s = 0;
     let infomation = []
     let pro
     let processList = []
     let waitList = []
     let infoSum
      while (s < this.tableData.length) {
       let diff
        if (p1.getSize() + s < this.tableData.length) {
          diff = p2.peak().aTime - t
        }
        else {
          diff = p1.peak().timeSlice
        }
        if (p1.getSize() == 0) {
          t += diff
          pro = p2.pop()
          pro.runningTime.push(t)
          pro.state = "执行"
          p1.push(pro)
          infomation.push({ t: "进程" + pro.name + "到来，并开始执行" })
          waitList.push({ time: t, info: infomation[infomation.length - 1].t, 
            q: (processList.concat(p1.sort())).concat(p2.sort()) })
          continue
        }
        if (diff > p1.peak().timeSlice) {
          if (p1.peak().timeSlice < p1.peak().rTime) {
            p1.peak().rTime = p1.peak().rTime - p1.peak().timeSlice
            p1.peak().turnaroundTime += p1.peak().timeSlice
            t += p1.peak().timeSlice
            p1.peak().runningTime.push(t)
            infomation.push({ t: "进程" + p1.peak().name + "执行完一个时间片，优先级加3，回到队列中。" })
            pro = p1.pop()
            pro.state = "就绪"
            pro.timeSlice = timeSlice
            pro.Priority += 3
            p1.push(pro)
            p1.peak().state = "执行"
            infomation.push({ t: "进程" + p1.peak().name + "开始执行。" })
            p1.peak().runningTime.push(t)
            waitList.push({ time: t, info: infomation[infomation.length - 2].t +
              infomation[infomation.length - 1].t, q: (processList.concat(p1.sort())).concat(p2.sort()) })
          }
          else {
            infoSum = 0
            t += p1.peak().rTime
            p1.peak().turnaroundTime += p1.peak().rTime
            p1.peak().rTime = 0
            p1.peak().runningTime.push(t)
            infomation.push({ t: "进程" + p1.peak().name + "执行完毕。" })
            p1.peak().leaveTime = t
            p1.peak().state = "完成"
            processList.push(p1.pop())
            if (p1.getSize() > 0) {
              infoSum = 1
              p1.peak().runningTime.push(t)
              p1.peak().state = "执行"
              infomation.push({ t: "进程" + p1.peak().name + "开始执行。" })
            }
            if (infoSum == 1) {
              waitList.push({ time: t, info: infomation[infomation.length - 2].t 
                + infomation[infomation.length - 1].t, q: (processList.concat(p1.sort())).concat(p2.sort()) })
            }
            else {
              waitList.push({ time: t, info: infomation[infomation.length - 1].t, 
                q: (processList.concat(p1.sort())).concat(p2.sort()) })
            }
            s++
          }
        }
        else if (diff == p1.peak().timeSlice) {
          if (p1.peak().timeSlice < p1.peak().rTime) {
            p1.peak().rTime = p1.peak().rTime - p1.peak().timeSlice
            p1.peak().turnaroundTime += p1.peak().timeSlice
            t += p1.peak().timeSlice
            p1.peak().runningTime.push(t)
            infomation.push({ t: "进程" + p1.peak().name + "执行完一个时间片，优先级加3，回到队列中。" })
            pro = p1.pop()
            pro.state = "就绪"
            pro.timeSlice = timeSlice
            pro.Priority += 3
            p1.push(pro)
            if (p2.getSize() != 0) {
              pro = p2.pop()
              p1.push(pro)
              p1.peak().runningTime.push(t)
              p1.peak().state = "执行"
              if (p1.peak() == pro) {
                infomation.push({ t: "进程" + pro.name + "到来, 并开始执行。" })
                waitList.push({ time: t, info: infomation[infomation.length - 2].t +
                  infomation[infomation.length - 1].t, q: (processList.concat(p1.sort())).concat(p2.sort()) })
              }
              else {
                pro.state = "就绪"
                infomation.push({ t: "进程" + pro.name + "到来。 " })
                infomation.push({ t: "进程" + p1.peak().name + "开始执行。" })
                waitList.push({ time: t, info: infomation[infomation.length - 2].t +
                  infomation[infomation.length - 1].t + infomation[infomation.length - 3], 
                  q: (processList.concat(p1.sort())).concat(p2.sort()) })
              }
            }
            else {
              p1.peak().runningTime.push(t)
              p1.peak().state = "执行"
              infomation.push({ t: "进程" + p1.peak().name + "开始执行。" })
              waitList.push({ time: t, info: infomation[infomation.length - 2].t +
                infomation[infomation.length - 1].t, q: (processList.concat(p1.sort())).concat(p2.sort()) })
            }
          }
          else {
            infoSum = 0
            t += p1.peak().rTime
            p1.peak().turnaroundTime += p1.peak().rTime
            p1.peak().rTime = 0
            p1.peak().runningTime.push(t)
            infomation.push({ t: "进程" + p1.peak().name + "执行完毕。" })
            p1.peak().leaveTime = t
            p1.peak().state = "完成"
            processList.push(p1.pop())
            if (p2.getSize() != 0) {
              pro = p2.pop()
              p1.push(pro)
              p1.peak().runningTime.push(t)
              p1.peak().state = "执行"
              if (p1.peak() == pro) {
                infomation.push({ t: "进程" + pro.name + "到来, 并开始执行。" })
                waitList.push({ time: t, info: infomation[infomation.length - 2].t + 
                  infomation[infomation.length - 1].t, q: (processList.concat(p1.sort())).concat(p2.sort()) })
              }
              else {
                pro.state = "就绪"
                infomation.push({ t: "进程" + pro.name + "到来。 " })
                infomation.push({ t: "进程" + p1.peak().name + "开始执行。" })
                waitList.push({ time: t, info: infomation[infomation.length - 3].t + 
                  infomation[infomation.length - 2].t + infomation[infomation.length - 1].t, q: (processList.concat(p1.sort())).concat(p2.sort()) })
              }
            }
            else {
              if (p1.getSize() > 0) {
                infoSum = 1
                p1.peak().runningTime.push(t)
                p1.peak().state = "执行"
                infomation.push({ t: "进程" + p1.peak().name + "开始执行。" })
                // console.log(p1)
              }
              if (infoSum == 1) {
                waitList.push({ time: t, info: infomation[infomation.length - 2].t + 
                  infomation[infomation.length - 1].t, q: (processList.concat(p1.sort())).concat(p2.sort()) })
              }
              else {
                waitList.push({ time: t, info: infomation[infomation.length - 1].t, 
                  q: (processList.concat(p1.sort())).concat(p2.sort()) })
              }
            }
            s++
          }
        }
        else {
          if (diff > p1.peak().rTime) {
            infoSum = 1
            t += p1.peak().rTime
            p1.peak().rTime = 0
            p1.peak().turnaroundTime += p1.peak().rTime
            p1.peak().leaveTime = t
            p1.peak().runningTime.push(t)
            p1.peak().state = "完成"
            infomation.push({ t: "进程" + p1.peak().name + "执行完毕。" })
            processList.push(p1.pop())
            if (p1.getSize() > 0) {
              p1.peak().runningTime.push(t)
              infomation.push({ t: "进程" + p1.peak().name + "开始执行。" })
              p1.peak().state = "执行"
            }
            if (infoSum == 1) {
              waitList.push({ time: t, info: infomation[infomation.length - 2].t + 
                infomation[infomation.length - 1].t, q: (processList.concat(p1.sort())).concat(p2.sort()) })
            }
            else {
              waitList.push({ time: t, info: infomation[infomation.length - 1].t, 
                q: (processList.concat(p1.sort())).concat(p2.sort()) })
            }
            s++
          }
          else if (diff == p1.peak().rTime) {
            t += p1.peak().rTime
            p1.peak().rTime = 0
            p1.peak().turnaroundTime += p1.peak().rTime
            p1.peak().leaveTime = t
            p1.peak().runningTime.push(t)
            p1.peak().state = "完成"
            infomation.push({ t: "进程" + p1.peak().name + "执行完毕。" })
            processList.push(p1.pop())
            pro = p2.pop()
            pro.state = "就绪"
            p1.push(pro)
            if (p1.peak() == pro) {
              p1.peak().state = "执行"
              p1.peak().runningTime.push(t)
              infomation.push({ t: "进程" + pro.name + "到来,并开始执行。" })
            }
            else {
              p1.peak().runningTime.push(t)
              p1.peak().state = "执行"
              infomation.push({ t: "进程" + pro.name + "到来,进程" + p1.peak().name + "开始执行。" })
            }
            waitList.push({ time: t, info: infomation[infomation.length - 1].t + 
              infomation[infomation.length - 2].t, q: (processList.concat(p1.sort())).concat(p2.sort()) })
            s++
          }
          else {
            t += diff
            p1.peak().timeSlice -= diff
            p1.peak().rTime -= diff
            p1.peak().turnaroundTime += diff
            let temp = p1.peak()
            pro = p2.pop()
            p1.push(pro)
            if (p1.peak() == pro) {
              p1.peak().runningTime.push(t)
              temp.state = "就绪"
              temp.runningTime.push(t)
              p1.peak().state = "执行"
              infomation.push({ t: "进程" + pro.name + "到来,抢占" + temp.name + "并开始执行。" })
              waitList.push({ time: t, info: infomation[infomation.length - 1].t, 
                q: (processList.concat(p1.sort())).concat(p2.sort()) })
            }
            else {
              pro.state = "就绪"
              infomation.push({ t: "进程" + pro.name + "到来。 " })
            }
          }
        }
      }
      this.resultData = processList
      this.waitList = waitList
    },
    getResult() {
      this.draw()
      this.dialogResultVisible = true
    }
  },
  data() {
    return {
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogEditDataVisible: false,
      editData: {},
      dialogResultVisible: false,
      formLabelWidth: '140px',
      tableData: [
        {
          name: "A1",
          aTime: 0,
          rTime: 10,
          Priority: 1,
        },
        {
          name: "A3",
          aTime: 15,
          rTime: 15,
          Priority: 3,
        },
        {
          name: "A2",
          aTime: 2,
          rTime: 5,
          Priority: 5,
        },
        {
          name: "A4",
          aTime: 5,
          rTime: 2,
          Priority: 2,
        },
      ],
      waitList: [],
      resultData: [],
      form: {
        name: "A1",
        aTime: 0,
        rTime: 20,
        Priority: 1,
      },
      size: 5,
      value: "时间片轮转调度算法",
    }
  },
  props: {

  }
}
</script>

<style ></style>