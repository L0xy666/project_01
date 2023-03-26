import Work from "../utils/Work"
class WorkQueue {
    constructor(type) {
        this.type = type
        this.queue = []
        this.time = 0
    }
    init() {
        // 从倒数第一个非叶子节点（从下往上，从右往左数）依次重新排列节点顺序
        let lastParentNodeIndex = Math.floor(this.queue.length / 2) - 1
        for (let i = lastParentNodeIndex; i >= 0; i--) {
            this.buildChildNodes(i)
        }
    }


    buildChildNodes(index) {
        // 在数组中某个节点的左右子节点分别为 2*i+1 和 2*i+2
        let arr = this.queue
        let left = index * 2 + 1
        let right = index * 2 + 2
        let maxIndex = index
        let length = arr.length
        // 找出值最大的节点下标
        // console.log(arr[left])
        // console.log(arr[right])
        // console.log(arr[maxIndex])
        if (left < length) {
            if (this.type == 1 && arr[left].responseRatio > arr[maxIndex].responseRatio) {
                maxIndex = left
            } else if (this.type == 2 && (arr[left].rTime < arr[maxIndex].rTime || (arr[left].rTime == arr[maxIndex].rTime && arr[left].aTime < arr[maxIndex].aTime))) {
                maxIndex = left
            } else if (this.type == 3 && arr[left].aTime < arr[maxIndex].aTime) {
                maxIndex = left
            }
        }


        if (right < length) {
            if (this.type == 1 && arr[right].responseRatio > arr[maxIndex].responseRatio) {
                maxIndex = right
            } else if (this.type == 2 && (arr[right].rTime < arr[maxIndex].rTime || (arr[right].rTime == arr[maxIndex].rTime && arr[right].aTime < arr[maxIndex].aTime))) {
                maxIndex = right
            } else if (this.type == 3 && arr[right].aTime < arr[maxIndex].aTime) {
                maxIndex = right
            }
        }

        if (maxIndex != index) {
            // 如果最大值不是父节点的话，需要交换父子节点位置
            // 并且对父节点交换后的子树递归地进行重新排列
            this.swap(index, maxIndex)
            this.buildChildNodes(maxIndex)
        }
    }
    peak() {
        return this.queue[0]
    }
    updateTime(time) {
        this.time = time
        for (var i = 0; i < this.queue.length; i++) {
            this.queue[i].responseRatio =( (this.time - this.queue[i].aTime) / this.queue[i].rTime + 1).toFixed(2)
        }
        // this.init()
    }
    push(val) {
        if(this.type==1){
            val.responseRatio = ((this.time - val.aTime) / val.rTime + 1).toFixed(2)
        }
        this.queue.push(val)
        this.init()
    }
    pop() {
        // pop操作，就是将根节点拿出后，用最后一个节点填充根节点然后重新构建
        // 这样重新构建前的操作就是O(1)
        // 如果直接把根节点shift出去再重构建则，重新构建前的操作就是O(n)
        if (this.queue.length > 1) {
            let val = this.queue[0]
            this.queue[0] = this.queue.pop()
            this.init()
            return val
        } else {
            let val = this.queue[0]
            this.queue.pop()
            return val
        }

    }
    sort() {
        // 排序的话就是把队列一个个pop出来
        var res = []
        var result = []
        var p
        var length = this.queue.length
        for (var i = 0; i < length; i++) {
            p = this.pop()
            var work = new Work(p.name,
                p.aTime,
                p.rTime
            )
            work.runningTime = p.runningTime
            work.startime = p.startime
            work.leaveTime = p.leaveTime                      
            work.aroundTime = p.aroundTime
            work.responseRatio = p.responseRatio
            work.state = p.state
            res.push(p)
            result.push(work)
        }
        this.queue = res
        return result
    }
    getSize() {
        return this.queue.length
    }
    swap(index1, index2) {
        var arr = this.queue;
        [arr[index1], arr[index2]] = [arr[index2], arr[index1]]
    }
}




export default WorkQueue