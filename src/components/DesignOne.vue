<template>
    <div class="box1">
        <div class="box2">
            <div class="box3">
                <div class="face front"></div>
                <div class="face back"></div>
                <div class="face left"></div>
                <div class="face right"></div>
                <div class="face top"></div>
                <div class="face bottom"></div>
            </div>
        </div>
    </div>
</template>
  
<script>
export default {
    name: 'DesignOne',
    props: {
    }
}
</script>
  
<style scoped lang="less">
@color1: #ffffff;
@color2: #ffffff;
@color3: #ffffff;
@color4: #ffffff;
@color5: #ffffff;
@color6: #ffffff;
@size : 30px;
@halfSize : (@size / 2);
@image : "../assets/cpu(2).jpg";


.box1 {
    position: relative;
    width:  @size;
    height: @size;
    margin: @size auto;

    // background-color: aqua;
    // overflow: hidden;
    // padding: ;
    .box2 {
        position: absolute;
        background-color: black;
        transition: all 3s;
        transform-origin: right bottom;
        // animation: boxRotate 6s linear infinite;
        border-radius: @size;
        overflow: hidden;
    }

    .box3 {
        // position: absolute; 
        position: relative;
        // transform: translate(-50% , -50%);
        // margin:  @size  auto;
        width: @size;
        height: @size;
        margin: 0;
        // background-color: aqua;
        // perspective: 1000px;
        // transform-style: preserve-3d;
        transform-style: preserve-3d;
        // opacity: 50%;
        // transform: rotateX(45deg) rotateY(45deg) ;
        transition: all 5s;
        animation: rotate 6s linear infinite;

        .face {
            position: absolute;
            top: 0%;
            left: 0%;
            width: @size;
            height: @size;
            // background-color: aquamarine;
            // opacity: 50%;
            text-align: center;
            line-height: @size;
            background-size: contain;
            // opacity: 90%;
            border-radius:  0;
        }

        .front {
            background-color: @color1;
            transform: translateZ(@halfSize);
            //  opacity: 50%;
            // background-image: url(@image);
            background-image: linear-gradient(transparent,
                    rgba(1, 20, 24, 0.3)), url(@image);
        }

        .back {
            background-color: @color2;
            transform: translateZ(-@halfSize);
            background-image: linear-gradient(transparent,
                    rgba(1, 20, 24, 0.3)), url(@image);
        }

        .top {
            background-color: @color3;
            background-image: linear-gradient(transparent,
                    rgba(1, 20, 24, 0.3)), url(@image);
            transform: translateY(-@halfSize) rotateX(90deg);
        }

        .bottom {
            background-color: @color4;
            transform: translateY(@halfSize) rotateX(-90deg);
            background-image: linear-gradient(transparent,
                    rgba(1, 20, 24, 0.3)), url(@image);
        }

        .left {
            background-color: @color5;
            transform: translateX(-@halfSize) rotateY(90deg);
            background-image: linear-gradient(transparent,
                    rgba(1, 20, 24, 0.3)), url(@image);
        }

        .right {
            background-color: @color6;
            transform: translateX(@halfSize) rotateY(-90deg);
            background-image: linear-gradient(transparent,
                    rgba(1, 20, 24, 0.3)), url(@image);
        }

        &:hover {
            animation-play-state: paused;
        }
    }

}

@keyframes boxRotate {
    to {
        transform: translate(-50%, -50%) rotateZ(360deg);
    }
}

@keyframes rotate {
    to {
        transform: rotateY(360deg) rotateX(360deg) rotateZ(360deg);
    }
}
</style>
  