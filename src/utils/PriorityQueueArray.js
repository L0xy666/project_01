import Process from "./Process"
class PriorityQueueArray {
    constructor() {
        this.q1 = []
        this.q2 = []
        this.q3 = []
    }

    init() {
        // 从倒数第一个非叶子节点（从下往上，从右往左数）依次重新排列节点顺序
        // let lastParentNodeIndex = Math.floor(this.queue.length / 2) - 1
        // for (let i = lastParentNodeIndex; i >= 0; i--) {
        //     this.buildChildNodes(i)
        // }
        // let arr = this.queue
        // for(var i=0;i<arr.length)
    }
    peak() {
        if (this.q1.length != 0) {
            return this.q1[0]
        } else if (this.q2.length != 0) {
            return this.q2[0]
        } else {
            return this.q3[0]
        }
    }
    push(val) {
        if (val.Priority == 1) {
            this.q1.push(val)
        } else if (val.Priority == 2) {
            this.q2.push(val)
        } else {
            this.q3.push(val)
        }
    }
    pop() {
        // pop操作，就是将根节点拿出后，用最后一个节点填充根节点然后重新构建
        // 这样重新构建前的操作就是O(1)
        // 如果直接把根节点shift出去再重构建则，重新构建前的操作就是O(n)
        if (this.q1.length > 0) {
            this.q1[0].listName="一级队列"
            return this.q1.shift()
        } else if (this.q2.length > 0) {
            this.q2[0].listName="二级队列"
            return this.q2.shift()
        } else if (this.q3.length > 0) {
            this.q3[0].listName="三级队列"
            return this.q3.shift()
        }
    }
    sort() {
        // 排序的话就是把队列一个个pop出来
        var result = []
        var p
        for (var i = 0; i < this.q1.length; i++) {
            p = this.q1[i]
            var process = new Process(p.name,
                p.aTime,
                p.rTime,
                p.Priority,
                p.timeSlice,
                p.leaveTime
            )
            process.turnaroundTime = p.turnaroundTime
            process.runningTime = p.runningTime
            process.state = p.state
            process.listName="一级队列"
            result.push(process)
        }
        for (i = 0; i < this.q2.length; i++) {
            p = this.q2[i]
            process = new Process(p.name,
                p.aTime,
                p.rTime,
                p.Priority,
                p.timeSlice,
                p.leaveTime
            )
            process.turnaroundTime = p.turnaroundTime
            process.runningTime = p.runningTime
            process.state = p.state
            process.listName="二级队列"
            result.push(process)
        }
        for ( i = 0; i < this.q3.length; i++) {
            p = this.q3[i]
            process = new Process(p.name,
                p.aTime,
                p.rTime,
                p.Priority,
                p.timeSlice,
                p.leaveTime
            )
            process.turnaroundTime = p.turnaroundTime
            process.runningTime = p.runningTime
            process.state = p.state
            process.listName="三级队列"
            result.push(process)
        }
        return result
    }
    getSize() {
        return this.q1.length + this.q2.length + this.q3.length
    }
}




export default PriorityQueueArray