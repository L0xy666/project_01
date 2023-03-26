class Process{
    constructor(name,aTime,rTime,Priority,timeSlice) {
        this.name=name
        this.aTime=aTime
        this.rTime=rTime
        this.Priority=Priority
        this.timeSlice=timeSlice
        this.leaveTime=0
        this.turnaroundTime=0
        this.runningTime=[]
        this.state="未到"
        this.listName="#"
    }
}


export default Process