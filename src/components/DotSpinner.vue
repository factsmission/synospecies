<template>
  <div
    class="rot"
    aria-hidden="true"
  />
</template>

<style scoped lang="scss">
.rot {
  display: inline-block;
  // margin: .4rem;
  position: relative;
  // border-radius: 50%;
  // animation-name: rot;
  // animation-timing-function: cubic-bezier(0, 0.2, 0.8, 1);
  // animation-iteration-count: infinite;
  // animation-duration: 4.8s;
  width: 1rem;
  height: 1rem;
  // background-color: #81951d;
  // transform-style: preserve-3d;
  // overflow-x: hidden;
  vertical-align: middle;
  flex: 0 0 1rem;
}

.rot::before {
  content: '';
  box-sizing: border-box;
  position: absolute;
  top: .1rem;
  right: .1rem;
  bottom: .1rem;
  left: .1rem;
  border-radius: 50%;
  border: 3px solid rgba(0, 0, 0, 0.0588235294);
  border-top-color: #9bc134;
  animation: spinner .6s linear infinite;
}

@keyframes rot {
  0%,
  100% {
    animation-timing-function: cubic-bezier(0.5, 0, 1, 0.5);
  }
  0% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(1800deg);
    animation-timing-function: cubic-bezier(0, 0.5, 0.5, 1);
  }
  100% {
    transform: rotateY(3600deg);
  }
}

// .rot::after {
//   position: absolute;
//   top: 0;
//   right: 0;
//   bottom: 0;
//   left: 0;
//   transform: translateX(-100%);
//   background: linear-gradient( 90deg, rgba(255, 255, 255, 0) 0, rgba(255, 255, 255, 0.2) 20%, rgba(255,255,255,0.8) 60%, rgba(255,255,255,0) );
//   animation: shimmer 2s infinite;
//   content: '';
// }
// @keyframes shimmer {
//   to { transform: translateX(100%); }
// }

@keyframes spinner {
  to { transform: rotate(360deg); }
}
</style>
