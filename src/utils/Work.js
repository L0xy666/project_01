class Work{
    constructor(name,aTime,rTime) {
        this.name=name
        this.aTime=aTime
        this.rTime=rTime
        this.lastTime=rTime
        this.runningTime=[]
        this.startime=0
        this.leaveTime=0
        this.aroundTime=0
        this.responseRatio="#"
        this.state="未到"
    }
}


export default Work