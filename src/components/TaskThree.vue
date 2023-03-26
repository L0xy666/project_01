<template>
  <div class="common-layout">
    <el-container class="box">
      <el-header style="margin-top: 20px;">
        <div class="title" style="font-size: 25px;"> 作业调度算法模拟</div>
      </el-header>
      <el-container style=" width: 960px; margin-top: 0px;">
        <!-- <el-aside width="200px" style="border: solid 1px red"></el-aside> -->
        <el-container>
          <el-main width="950px">
            <div class="choose"> 
              <el-select style="" @change="currentSel" v-model="selectValue"
                placeholder="请选择">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="content" style="padding-right: 20px; width: 880PX;">
                <el-table :data="tableData"
                  style=" font-size: 16px;  border: solid 1px black ;width:420px; min-height:240px;">
                  <el-table-column prop="name" label="作业号" width="80" />
                  <el-table-column prop="aTime" label="到达时间" width="90" />
                  <el-table-column prop="rTime" label="运行时间" width="90" />
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
              <div id="main" style="width: 480px ; height: 240px; display:block;"> </div>
            </div>
          </el-main>
          <el-footer style="height: 10px;">
            <!-- <div id="main" > </div> -->
          </el-footer>
          <div class="bottom">
            <el-button class="mt-4" type="primary" style="margin: 20px 20px 20px 20px;  width: 150px"
              @click="dialogFormVisible = true">添加一个作业</el-button>
            <el-button class="mt-4" type="success" style="margin: 20px 20px 20px 20px;   width: 150px"
              @click="startSimulation">开始模拟</el-button>
            <el-button class="mt-4" type="warning" style="margin: 20px 20px 20px 20px;  width: 150px"
              @click="getResult">查看结果</el-button>
          </div>
        </el-container>

      </el-container>
      <el-dialog v-model="dialogFormVisible" title="添加作业">
        <el-form :model="form">
          <el-form-item label="作业号" label-width="120px">
            <el-input v-model="form.name" autocomplete="off" />
          </el-form-item>
          <el-form-item label="到达时间" label-width="120px">
            <el-input-number v-model="form.aTime" />
          </el-form-item>
          <el-form-item label="运行时间" label-width="120px">
            <el-input-number v-model="form.rTime" />
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
      <el-dialog v-model="dialogEditDataVisible" title="编辑作业">
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
        <span>各作业的开始执行时间和结束时间</span>
        <el-table :data="resultData" style="left:0%; border: solid 1px black ;width:480px;">
          <el-table-column header-align="center" align="center" prop="name" label="作业号" width="80" />
          <el-table-column header-align="center" align="center" prop="aTime" label="到达时间" width="100" />
          <el-table-column header-align="center" align="center" prop="startime" label="开始时间" width="100" />
          <el-table-column header-align="center" align="center" prop="leaveTime" label="结束时间" width="100" />
          <el-table-column header-align="center" align="center" prop="aroundTime" label="周转时间" width="100" />
        </el-table>
      </div>
      <div style="margin-top: 50px;" v-for="(item, index) in waitList" :key="index">
        <div style="float: left;"><span style=" font-size: 18px; color: #5cb87a;">时刻{{
          item.time
        }}:</span><span>{{ item.info }}</span></div>
        <el-table v-if="selectValue != 'C'" :data="item.q" style="border: solid 1px blueviolet ; width:440px;">
          <el-table-column header-align="center" align="center" prop="name" label="作业号" width="100" />
          <el-table-column header-align="center" align="center" prop="aTime" label="到达时间" width="120" />
          <el-table-column header-align="center" align="center" prop="startime" label="开始时间" width="120" />
          <!-- <el-table-column header-align="center" align="left" v-if="selectValue=='C'" prop="responseRatio" label="响应比" width="80" /> -->
          <el-table-column header-align="center" align="center" prop="state" label="状态" width="100" />
        </el-table>
        <el-table v-if="selectValue == 'C'" :data="item.q" style="border: solid 1px blueviolet ; width:540px;">
          <el-table-column header-align="center" align="center" prop="name" label="作业号" width="100" />
          <el-table-column header-align="center" align="center" prop="aTime" label="到达时间" width="120" />
          <el-table-column header-align="center" align="center" prop="startime" label="开始时间" width="120" />
          <el-table-column header-align="center" align="center" prop="responseRatio" label="响应比" width="100" />
          <el-table-column header-align="center" align="center" prop="state" label="状态" width="100" />
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
import WorkQueue from "../utils/WorkQueue"
import Work from "../utils/Work"
import * as echarts from 'echarts/core';
import { GridComponent, LegendComponent } from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
echarts.use([GridComponent, LegendComponent, BarChart, CanvasRenderer]);
export default {

  name: 'TaskOne',
  methods: {
    draw() {
      var chartDom = document.getElementById('main');
      var myChart = echarts.init(chartDom);
      var option;

      const data = this.data;
      option = {
        title: {
          text: '平均周转时间',
        },
        xAxis: {
          max: 'dataMax'
          
        },
        yAxis: {
          type: 'category',
          data: ['FCFS', 'SJF', 'HRRN'],
          inverse: true,
          animationDuration: 300,
          animationDurationUpdate: 300,
          max: 2 // only the largest 3 bars will be displayed
        },
        series: [
          {
            realtimeSort: true,
            
            type: 'bar',
            data: data,
            label: {
              show: true,
              position: 'right',
              valueAnimation: true
            },
            colorBy: ['#ee6666', '#73c0de', '#3ba272']
          }
        ],
        legend: {
          show: true
        },

        animationDuration: 0,
        animationDurationUpdate: 3000,
        animationEasing: 'linear',
        animationEasingUpdate: 'linear'
      };
      option && myChart.setOption(option);
    }, editRow(index) {
      this.editData = this.tableData[index]
      this.dialogEditDataVisible = true
    },
    editSuccess() {
      this.dialogEditDataVisible = false
      // this.tableData[this.editIndex]=this.editData
    },
    currentSel() {
      if (this.selectValue == 'A') {
        this.resultData = this.allResultData[0]
        this.waitList = this.allWaitList[0]
      }
      else if (this.selectValue == 'B') {
        this.resultData = this.allResultData[1]
        this.waitList = this.allWaitList[1]
      }
      else {
        this.resultData = this.allResultData[2]
        this.waitList = this.allWaitList[2]
      }
    },
    deleteRow(index) {
      this.tableData.splice(index, 1)
    },
    AddItem() {
      this.tableData.push({
        name: this.form.name,
        aTime: this.form.aTime,
        rTime: this.form.rTime,
      })
      this.dialogFormVisible = false;
    },
    startSimulation() {
      this.allResultData = []
      this.allWaitList = []
      this.simulationA()
      this.simulationB()
      this.simulationC()
      this.currentSel(this.selectValue)
      this.analysicResult()
      this.draw()
    },
    analysicResult() {
      var aroundTimeArray = []
      var s = 0
      for (var i = 0; i < 3; i++) {
        s = 0
        for (var j = 0; j < this.allResultData[i].length; j++) {
          s += this.allResultData[i][j].aroundTime
        }
        aroundTimeArray.push((s / this.allResultData[i].length).toFixed(2))
      }
      this.data = aroundTimeArray
    },
    simulationC() {
      var p2 = new WorkQueue(3)
      for (var i = 0; i < this.tableData.length; i++) {
        var work = new Work(this.tableData[i].name, this.tableData[i].aTime, this.tableData[i].rTime)
        p2.push(work)
      }
      // p.print()
      var t = 0;
      var p1 = new WorkQueue(1)
      var s = 0;
      var infomation = []
      var pro
      var processList = []
      var waitList = []
      // var waitPro=[] 
      var infoSum
      while (s < this.tableData.length) {
        var diff
        if (p1.getSize() + s < this.tableData.length) {
          diff = p2.peak().aTime - t
        }
        else {
          diff = p1.peak().rTime
        }
        if (p1.getSize() == 0) {
          t += diff
          p1.updateTime(t)
          pro = p2.pop()
          pro.runningTime.push(t)
          pro.state = "执行"
          p1.push(pro)
          p1.peak().startime = t

          infomation.push({ t: "作业" + pro.name + "到来，并调入内存开始执行" })
          waitList.push({ time: t, info: infomation[infomation.length - 1].t, q: (processList.concat(p1.sort())).concat(p2.sort()) })
          continue
        }
        if (diff > p1.peak().rTime) {
          infoSum = 0
          t += p1.peak().rTime
          p1.updateTime(t)
          p1.peak().runningTime.push(t)
          p1.peak().leaveTime = t
          p1.peak().aroundTime = p1.peak().leaveTime - p1.peak().aTime
          infomation.push({ t: "作业" + p1.peak().name + "执行完毕。" })
          p1.peak().state = "完成"
          pro = p1.pop()
          pro.responseRatio = "#"
          processList.push(pro)
          if (p1.getSize() > 0) {
            infoSum = 1
            p1.peak().startime = t
            p1.peak().runningTime.push(t)
            p1.peak().state = "执行"
            infomation.push({ t: "作业" + p1.peak().name + "调入内存开始执行。" })
            // console.log(p1)
          }
          if (infoSum == 1) {
            waitList.push({ time: t, info: infomation[infomation.length - 2].t + infomation[infomation.length - 1].t, q: (processList.concat(p1.sort())).concat(p2.sort()) })
          }
          else {
            waitList.push({ time: t, info: infomation[infomation.length - 1].t, q: (processList.concat(p1.sort())).concat(p2.sort()) })
          }
          s++
        }
        else if (diff == p1.peak().rTime) {
          infoSum = 0
          t += p1.peak().rTime
          p1.updateTime(t)
          p1.peak().runningTime.push(t)
          p1.peak().leaveTime = t
          p1.peak().aroundTime = p1.peak().leaveTime - p1.peak().aTime
          infomation.push({ t: "作业" + p1.peak().name + "执行完毕。" })
          p1.peak().state = "完成"
          pro = p1.pop()
          pro.responseRatio = "#"
          processList.push(pro)
          if (p2.getSize() != 0) {
            pro = p2.pop()
            p1.push(pro)
            p1.peak().runningTime.push(t)
            p1.peak().state = "执行"
            p1.peak().startime = t
            if (p1.peak() == pro) {
              // for(i=0;i<p1.getSize();i++){
              //   console.log(p1.getItem(i))
              // }
              infomation.push({ t: "作业" + pro.name + "到来, 并调入内存开始执行。" })
              waitList.push({ time: t, info: infomation[infomation.length - 2].t + infomation[infomation.length - 1].t, q: (processList.concat(p1.sort())).concat(p2.sort()) })
            }
            else {
              pro.state = "等待"
              infomation.push({ t: "作业" + pro.name + "到来。 " })
              infomation.push({ t: "作业" + p1.peak().name + "调入内存开始执行。" })
              waitList.push({ time: t, info: infomation[infomation.length - 3].t + infomation[infomation.length - 2].t + infomation[infomation.length - 1].t, q: (processList.concat(p1.sort())).concat(p2.sort()) })
            }
          }
          else {
            if (p1.getSize() > 0) {
              infoSum = 1
              p1.peak().runningTime.push(t)
              p1.peak().startime = t
              p1.peak().state = "执行"
              infomation.push({ t: "作业" + p1.peak().name + "调入内存开始执行。" })
              // console.log(p1)
            }
            if (infoSum == 1) {
              waitList.push({ time: t, info: infomation[infomation.length - 2].t + infomation[infomation.length - 1].t, q: (processList.concat(p1.sort())).concat(p2.sort()) })
            }
            else {
              waitList.push({ time: t, info: infomation[infomation.length - 1].t, q: (processList.concat(p1.sort())).concat(p2.sort()) })
            }
          }
          s++

        }
        else {
          infoSum = 0
          t += p1.peak().rTime
          p1.updateTime(t)
          p1.peak().runningTime.push(t)
          p1.peak().leaveTime = t
          p1.peak().aroundTime = p1.peak().leaveTime - p1.peak().aTime
          infomation.push({ t: "作业" + p1.peak().name + "执行完毕。" })
          p1.peak().state = "完成"
          pro = p1.pop()
          pro.responseRatio = "#"
          processList.push(pro)
          while (p2.getSize() > 0 && p2.peak().aTime <= t) {
            p2.peak().state = "等待"
            p1.push(p2.pop())
          }
          if (p1.getSize() > 0) {
            infoSum = 1
            p1.peak().startime = t
            p1.peak().runningTime.push(t)
            p1.peak().state = "执行"
            infomation.push({ t: "作业" + p1.peak().name + "调入内存开始执行。" })
            // console.log(p1)
          }
          if (infoSum == 1) {
            waitList.push({ time: t, info: infomation[infomation.length - 2].t + infomation[infomation.length - 1].t, q: (processList.concat(p1.sort())).concat(p2.sort()) })
          }
          else {
            waitList.push({ time: t, info: infomation[infomation.length - 1].t, q: (processList.concat(p1.sort())).concat(p2.sort()) })
          }
          s++
        }
      }
      this.allResultData.push(processList)
      this.allWaitList.push(waitList)
      // console.log(this.tableData)
    },
    simulationB() {
      var p2 = new WorkQueue(3)
      for (var i = 0; i < this.tableData.length; i++) {
        var work = new Work(this.tableData[i].name, this.tableData[i].aTime, this.tableData[i].rTime)
        p2.push(work)
      }
      // p.print()
      var t = 0;
      var p1 = new WorkQueue(2)
      var s = 0;
      var infomation = []
      var pro
      var processList = []
      var waitList = []
      // var waitPro=[] 
      var infoSum
      while (s < this.tableData.length) {
        var diff
        if (p1.getSize() + s < this.tableData.length) {
          diff = p2.peak().aTime - t
        }
        else {
          diff = p1.peak().rTime
        }
        if (p1.getSize() == 0) {
          t += diff
          p1.updateTime(t)
          pro = p2.pop()
          pro.runningTime.push(t)
          pro.state = "执行"
          p1.push(pro)
          p1.peak().startime = t
          infomation.push({ t: "作业" + pro.name + "到来，并调入内存开始执行" })
          waitList.push({ time: t, info: infomation[infomation.length - 1].t, q: (processList.concat(p1.sort())).concat(p2.sort()) })
          continue
        }
        if (diff > p1.peak().rTime) {
          infoSum = 0
          t += p1.peak().rTime
          p1.updateTime(t)
          p1.peak().runningTime.push(t)
          p1.peak().leaveTime = t
          p1.peak().aroundTime = p1.peak().leaveTime - p1.peak().aTime
          infomation.push({ t: "作业" + p1.peak().name + "执行完毕。" })
          p1.peak().state = "完成"
          pro = p1.pop()
          pro.responseRatio = "#"
          processList.push(pro)
          if (p1.getSize() > 0) {
            infoSum = 1
            p1.peak().startime = t
            p1.peak().runningTime.push(t)
            p1.peak().state = "执行"
            infomation.push({ t: "作业" + p1.peak().name + "调入内存开始执行。" })
            // console.log(p1)
          }
          if (infoSum == 1) {
            waitList.push({ time: t, info: infomation[infomation.length - 2].t + infomation[infomation.length - 1].t, q: (processList.concat(p1.sort())).concat(p2.sort()) })
          }
          else {
            waitList.push({ time: t, info: infomation[infomation.length - 1].t, q: (processList.concat(p1.sort())).concat(p2.sort()) })
          }
          s++
        }
        else if (diff == p1.peak().rTime) {
          infoSum = 0
          t += p1.peak().rTime
          p1.updateTime(t)
          p1.peak().runningTime.push(t)
          p1.peak().leaveTime = t
          p1.peak().aroundTime = p1.peak().leaveTime - p1.peak().aTime
          infomation.push({ t: "作业" + p1.peak().name + "执行完毕。" })
          p1.peak().state = "完成"
          pro = p1.pop()
          pro.responseRatio = "#"
          processList.push(pro)
          if (p2.getSize() != 0) {
            pro = p2.pop()
            p1.push(pro)
            p1.peak().runningTime.push(t)
            p1.peak().state = "执行"
            p1.peak().startime = t
            if (p1.peak() == pro) {
              // for(i=0;i<p1.getSize();i++){
              //   console.log(p1.getItem(i))
              // }
              infomation.push({ t: "作业" + pro.name + "到来, 并调入内存开始执行。" })
              waitList.push({ time: t, info: infomation[infomation.length - 2].t + infomation[infomation.length - 1].t, q: (processList.concat(p1.sort())).concat(p2.sort()) })
            }
            else {
              pro.state = "等待"
              infomation.push({ t: "作业" + pro.name + "到来。 " })
              infomation.push({ t: "作业" + p1.peak().name + "调入内存开始执行。" })
              waitList.push({ time: t, info: infomation[infomation.length - 3].t + infomation[infomation.length - 2].t + infomation[infomation.length - 1].t, q: (processList.concat(p1.sort())).concat(p2.sort()) })
            }
          }
          else {
            if (p1.getSize() > 0) {
              infoSum = 1
              p1.peak().runningTime.push(t)
              p1.peak().startime = t
              p1.peak().state = "执行"
              infomation.push({ t: "作业" + p1.peak().name + "调入内存开始执行。" })
              // console.log(p1)
            }
            if (infoSum == 1) {
              waitList.push({ time: t, info: infomation[infomation.length - 2].t + infomation[infomation.length - 1].t, q: (processList.concat(p1.sort())).concat(p2.sort()) })
            }
            else {
              waitList.push({ time: t, info: infomation[infomation.length - 1].t, q: (processList.concat(p1.sort())).concat(p2.sort()) })
            }
          }
          s++

        }
        else {
          infoSum = 0
          t += p1.peak().rTime
          p1.updateTime(t)
          p1.peak().runningTime.push(t)
          p1.peak().leaveTime = t
          p1.peak().aroundTime = p1.peak().leaveTime - p1.peak().aTime
          infomation.push({ t: "作业" + p1.peak().name + "执行完毕。" })
          p1.peak().state = "完成"
          pro = p1.pop()
          pro.responseRatio = "#"
          processList.push(pro)
          while (p2.getSize() > 0 && p2.peak().aTime <= t) {
            p2.peak().state = "等待"
            console.log(infomation)
            // pro =p2.pop()
            console.log(pro)
            p1.push(p2.pop())
          }
          if (p1.getSize() > 0) {
            infoSum = 1
            p1.peak().startime = t
            p1.peak().runningTime.push(t)
            p1.peak().state = "执行"
            infomation.push({ t: "作业" + p1.peak().name + "调入内存开始执行。" })
            // console.log(p1)
          }
          if (infoSum == 1) {
            waitList.push({ time: t, info: infomation[infomation.length - 2].t + infomation[infomation.length - 1].t, q: (processList.concat(p1.sort())).concat(p2.sort()) })
          }
          else {
            waitList.push({ time: t, info: infomation[infomation.length - 1].t, q: (processList.concat(p1.sort())).concat(p2.sort()) })
          }
          s++
        }
      }
      this.allResultData.push(processList)
      this.allWaitList.push(waitList)
    },
    simulationA() {
      var p2 = new WorkQueue(3)
      for (var i = 0; i < this.tableData.length; i++) {
        var work = new Work(this.tableData[i].name, this.tableData[i].aTime, this.tableData[i].rTime)
        p2.push(work)
      }
      // p.print()
      var t = 0;
      var p1 = new WorkQueue(3)
      var s = 0;
      var infomation = []
      var pro
      var processList = []
      var waitList = []
      // var waitPro=[] 
      var infoSum
      while (s < this.tableData.length) {
        var diff
        if (p1.getSize() + s < this.tableData.length) {
          diff = p2.peak().aTime - t
        }
        else {
          diff = p1.peak().rTime
        }
        if (p1.getSize() == 0) {
          t += diff
          p1.updateTime(t)
          pro = p2.pop()
          pro.runningTime.push(t)
          pro.state = "执行"
          p1.push(pro)
          p1.peak().startime = t
          infomation.push({ t: "作业" + pro.name + "到来，并调入内存开始执行" })
          waitList.push({ time: t, info: infomation[infomation.length - 1].t, q: (processList.concat(p1.sort())).concat(p2.sort()) })
          continue
        }
        if (diff > p1.peak().rTime) {
          infoSum = 0
          t += p1.peak().rTime
          p1.updateTime(t)
          p1.peak().runningTime.push(t)
          p1.peak().leaveTime = t
          p1.peak().aroundTime = p1.peak().leaveTime - p1.peak().aTime
          infomation.push({ t: "作业" + p1.peak().name + "执行完毕。" })
          p1.peak().state = "完成"
          pro = p1.pop()
          pro.responseRatio = "#"
          processList.push(pro)
          if (p1.getSize() > 0) {
            infoSum = 1
            p1.peak().startime = t
            p1.peak().runningTime.push(t)
            p1.peak().state = "执行"
            infomation.push({ t: "作业" + p1.peak().name + "调入内存开始执行。" })
            // console.log(p1)
          }
          if (infoSum == 1) {
            waitList.push({ time: t, info: infomation[infomation.length - 2].t + infomation[infomation.length - 1].t, q: (processList.concat(p1.sort())).concat(p2.sort()) })
          }
          else {
            waitList.push({ time: t, info: infomation[infomation.length - 1].t, q: (processList.concat(p1.sort())).concat(p2.sort()) })
          }
          s++
        }
        else if (diff == p1.peak().rTime) {
          infoSum = 0
          t += p1.peak().rTime
          p1.updateTime(t)
          p1.peak().runningTime.push(t)
          p1.peak().leaveTime = t
          p1.peak().aroundTime = p1.peak().leaveTime - p1.peak().aTime
          infomation.push({ t: "作业" + p1.peak().name + "执行完毕。" })
          p1.peak().state = "完成"
          pro = p1.pop()
          pro.responseRatio = "#"
          processList.push(pro)
          if (p2.getSize() != 0) {
            pro = p2.pop()
            p1.push(pro)
            p1.peak().runningTime.push(t)
            p1.peak().state = "执行"
            p1.peak().startime = t
            if (p1.peak() == pro) {
              // for(i=0;i<p1.getSize();i++){
              //   console.log(p1.getItem(i))
              // }
              infomation.push({ t: "作业" + pro.name + "到来, 并调入内存开始执行。" })
              waitList.push({ time: t, info: infomation[infomation.length - 2].t + infomation[infomation.length - 1].t, q: (processList.concat(p1.sort())).concat(p2.sort()) })
            }
            else {
              pro.state = "等待"
              infomation.push({ t: "作业" + pro.name + "到来。 " })
              infomation.push({ t: "作业" + p1.peak().name + "调入内存开始执行。" })
              waitList.push({ time: t, info: infomation[infomation.length - 3].t + infomation[infomation.length - 2].t + infomation[infomation.length - 1].t, q: (processList.concat(p1.sort())).concat(p2.sort()) })
            }
          }
          else {
            if (p1.getSize() > 0) {
              infoSum = 1
              p1.peak().runningTime.push(t)
              p1.peak().startime = t
              p1.peak().state = "执行"
              infomation.push({ t: "作业" + p1.peak().name + "调入内存开始执行。" })
              // console.log(p1)
            }
            if (infoSum == 1) {
              waitList.push({ time: t, info: infomation[infomation.length - 2].t + infomation[infomation.length - 1].t, q: (processList.concat(p1.sort())).concat(p2.sort()) })
            }
            else {
              waitList.push({ time: t, info: infomation[infomation.length - 1].t, q: (processList.concat(p1.sort())).concat(p2.sort()) })
            }
          }
          s++

        }
        else {
          infoSum = 0
          t += p1.peak().rTime
          p1.updateTime(t)
          p1.peak().runningTime.push(t)
          p1.peak().leaveTime = t
          p1.peak().aroundTime = p1.peak().leaveTime - p1.peak().aTime
          infomation.push({ t: "作业" + p1.peak().name + "执行完毕。" })
          p1.peak().state = "完成"
          pro = p1.pop()
          pro.responseRatio = "#"
          processList.push(pro)
          while (p2.getSize() > 0 && p2.peak().aTime <= t) {
            p2.peak().state = "等待"
            p1.push(p2.pop())
          }
          if (p1.getSize() > 0) {
            infoSum = 1
            p1.peak().startime = t
            p1.peak().runningTime.push(t)
            p1.peak().state = "执行"
            infomation.push({ t: "作业" + p1.peak().name + "调入内存开始执行。" })
            // console.log(p1)
          }
          if (infoSum == 1) {
            waitList.push({ time: t, info: infomation[infomation.length - 2].t + infomation[infomation.length - 1].t, q: (processList.concat(p1.sort())).concat(p2.sort()) })
          }
          else {
            waitList.push({ time: t, info: infomation[infomation.length - 1].t, q: (processList.concat(p1.sort())).concat(p2.sort()) })
          }
          s++
        }
      }
      this.allResultData.push(processList)
      this.allWaitList.push(waitList)
    },
    getResult() {
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
          name: "J1",
          aTime: 0,
          rTime: 4,
        },
        {
          name: "J2",
          aTime: 1,
          rTime: 10,
        },
        {
          name: "J3",
          aTime: 2,
          rTime: 5,

        },
        {
          name: "J4",
          aTime: 2,
          rTime: 12,
        },
        {
          name: "J5",
          aTime: 18,
          rTime: 2,
        },
      ],
      allResultData: [],
      allWaitList: [],
      waitList: [],
      resultData: [],
      form: {
        name: "A1",
        aTime: 0,
        rTime: 20,
      },
      size: 5,
      value: "作业调度",
      options: [{
        value: 'A',
        label: '先来先服务(FCFS)'
      }, {
        value: 'B',
        label: '短作业优先(SJF)'
      }, {
        value: 'C',
        label: '最高响应比调度算法(HRRN)'
      }],
      selectValue: 'A',
      data: [],
    }
  },
  props: {

  }
}
</script>

<style ></style>