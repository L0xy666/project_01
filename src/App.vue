<template>
  <div>
    <div style="position: relative; top: 20px; width: 100%; ">
      <!-- <el-tag  style="font-size: 24px;"></el-tag>
      <el-tag  type="success" style="font-size: 24px; "></el-tag> -->
      <div class="menu">
        <div class="item active">
          <DesignOne id="A"></DesignOne>
          <el-button  style=" width: 130px; color: black;"  @click="handleClick('TaskOne')"  :disabled="buttonA">
            优先级算法</el-button>
        </div>
        <div class="item">
          <DesignOne  id="B" style="display: none;" ></DesignOne>
          <el-button style="width: 130px;  color: black;"  @click="handleClick('TaskTwo')"
            :disabled="buttonB">多级队列反馈算法</el-button>
        </div>
        <div class="item">
          <DesignOne id="C" style="display: none;"></DesignOne>
          <el-button style=" width: 130px;  color: black;"  @click="handleClick('TaskThree')" :disabled="buttonC"> 作业调度算法
          </el-button>
        </div>
      </div>
    </div>
    <keep-alive>
      <component :is="currentTab"></component>
    </keep-alive>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import TaskOne from './components/TaskOne.vue'
import TaskTwo from './components/TaskTwo.vue'
import TaskThree from './components/TaskThree.vue'
import DesignOne from './components/DesignOne.vue'
export default {
  name: 'App',
  components: {
    // HelloWorld,
    TaskOne,
    TaskTwo,
    TaskThree,
    DesignOne,
  },
  methods: {
    handleClick(tab) {
      const A = document.querySelector("#A")
      const B = document.querySelector("#B")
      const C = document.querySelector("#C")
      this.currentTab = tab;
      document.querySelector(".active").classList.remove("active")
      // console.log(document.querySelector(".active"))
      if (tab == 'TaskOne') {
        B.style.display = "none"
        C.style.display = "none"
        this.buttonB = false;
        this.buttonC = false;
        A.style.display = 'block'
        A.parentElement.classList.add("active")
      }
      else if (tab == 'TaskTwo') {
        A.style.display = "none"
        C.style.display = "none"
        this.buttonA = false;
        this.buttonC = false;
        B.style.display = 'block'
        // B.nextElementSibling.classList.add("active")
        B.parentElement.classList.add("active")
      }
      else {
        B.style.display = "none"
        A.style.display = "none"
        this.buttonA = false;
        this.buttonB = false;
        C.style.display = 'block'
       C.parentElement.classList.add("active")
      }
    }
  },
  data() {
    return {
      activeName: 'first',
      currentTab: 'TaskOne',
      buttonA: true,
      buttonB: false,
      buttonC: false,
    };
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.menubutton{
  width: 130px; background-color: #42b9835e; color: black;

}
.choose {
  display: flex;
  height: 40px;
  font-size: 20px !important;
  line-height: 50px !important;
}

.item {
  display: flex;
  align-items: center;
  padding-right: 8px;
  height: 40px;
  /* background-color: #42b983; */
  /* border-radius: 20px; */
  
}
.content{
  display: flex;
  width: 920px;
  justify-content: space-between;
}
.box {
  position: absolute;
  left: 50%;
  top: 40px;
  width: 970px;
  padding-top: 65px;
  transform: translate(-50%);
  border: solid 3px black;
  border-radius: 8px;
  background-color: #ffffff5e;
}
.title{
  width: 100%;
  background-image: -webkit-linear-gradient(0deg,#42b983,red );
  -webkit-background-clip: text;
  color: transparent   ;
}
.box .bottom {
  display: flex;
  width: 865px;
  padding: 0px 50px;
  border-top: 1px solid black;
  justify-content: space-between;
}
.active {
  border-bottom:2px solid #42b983; 
}
.menu {
  position: absolute;
  width: 600px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  height: 80px;
  padding: 0 150px;
  font-size: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
  border-bottom: 1px solid black;
}
</style>
